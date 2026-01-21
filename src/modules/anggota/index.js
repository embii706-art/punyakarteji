// Members Management Module
import { authService, ROLES } from '../../auth/auth.service.js';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../config/firebase.js';

export function MembersPage() {
  if (!authService.isAdmin()) {
    return `
      <div class="flex items-center justify-center h-screen p-4">
        <div class="text-center">
          <h2 class="text-xl font-bold text-red-600">Akses Ditolak</h2>
          <p class="text-gray-600 mt-2">Anda tidak memiliki akses ke halaman ini</p>
        </div>
      </div>
    `;
  }

  const html = `
    <div class="bg-gray-50 min-h-screen pb-20">
      <!-- Header -->
      <div class="bg-primary-600 text-white p-4">
        <h1 class="text-xl font-bold">Kelola Anggota</h1>
        <p class="text-sm text-primary-100">Manajemen anggota organisasi</p>
      </div>

      <!-- Add Member Button -->
      <div class="p-4">
        <button 
          onclick="showAddMemberModal()"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Anggota</span>
        </button>
      </div>

      <!-- Members List -->
      <div class="px-4">
        <div id="membersList" class="space-y-3">
          <div class="text-center py-8 text-gray-500">
            Memuat data anggota...
          </div>
        </div>
      </div>
    </div>

    <!-- Add Member Modal -->
    <div id="addMemberModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
          <h3 class="text-lg font-bold">Tambah Anggota Baru</h3>
          <button onclick="closeAddMemberModal()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form id="addMemberForm" class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap *</label>
            <input 
              type="text" 
              id="memberName" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input 
              type="email" 
              id="memberEmail" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <input 
              type="password" 
              id="memberPassword" 
              required
              minlength="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Min. 6 karakter"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Role *</label>
            <select 
              id="memberRole" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Pilih Role</option>
              <option value="ketua">Ketua</option>
              <option value="wakil_ketua">Wakil Ketua</option>
              <option value="bendahara">Bendahara</option>
              <option value="sekretaris">Sekretaris</option>
              <option value="humas">Humas</option>
              <option value="anggota">Anggota</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nomor HP</label>
            <input 
              type="tel" 
              id="memberPhone"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
            <textarea 
              id="memberAddress"
              rows="2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Alamat lengkap"
            ></textarea>
          </div>

          <div id="errorMsg" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"></div>

          <button 
            type="submit"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Simpan Anggota
          </button>
        </form>
      </div>
    </div>
  `;

  setTimeout(() => {
    loadMembers();
    setupMemberHandlers();
  }, 0);

  return html;
}

let lastMemberDoc = null;
let isLoadingMembers = false;
const PAGE_SIZE = 20;

async function loadMembers(isLoadMore = false) {
  if (isLoadingMembers) return;
  isLoadingMembers = true;
  const membersList = document.getElementById('membersList');
  if (!isLoadMore) {
    membersList.innerHTML = `<div class="text-center py-8 text-gray-500">Memuat data anggota...</div>`;
    lastMemberDoc = null;
  }
  try {
    console.time('loadMembers');
    let membersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE));
    if (isLoadMore && lastMemberDoc) {
      membersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'), startAfter(lastMemberDoc), limit(PAGE_SIZE));
    }
    const snapshot = await getDocs(membersQuery);
    console.timeEnd('loadMembers');

    if (!isLoadMore) membersList.innerHTML = '';

    if (snapshot.empty && !isLoadMore) {
      membersList.innerHTML = `
        <div class="text-center py-8 text-gray-500">
          Belum ada anggota
        </div>
      `;
      isLoadingMembers = false;
      return;
    }

    let html = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      html += createMemberCard(doc.id, data);
    });
    membersList.insertAdjacentHTML('beforeend', html);

    // Pagination: show/hide Load More
    if (snapshot.size === PAGE_SIZE) {
      lastMemberDoc = snapshot.docs[snapshot.docs.length - 1];
      if (!document.getElementById('loadMoreMembersBtn')) {
        const btn = document.createElement('button');
        btn.id = 'loadMoreMembersBtn';
        btn.className = 'w-full mt-4 bg-primary-100 text-primary-700 font-semibold py-2 rounded-lg';
        btn.textContent = 'Muat Lebih Banyak';
        btn.onclick = () => loadMembers(true);
        membersList.parentElement.appendChild(btn);
      }
    } else {
      lastMemberDoc = null;
      const btn = document.getElementById('loadMoreMembersBtn');
      if (btn) btn.remove();
    }
  } catch (error) {
    // Error loading members:
    membersList.innerHTML = `
      <div class="text-center py-8 text-red-500">
        Gagal memuat data anggota
      </div>
    `;
  }
  isLoadingMembers = false;
}

function createMemberCard(id, data) {
  const roleLabels = {
    super_admin: 'Super Admin',
    ketua: 'Ketua',
    wakil_ketua: 'Wakil Ketua',
    bendahara: 'Bendahara',
    sekretaris: 'Sekretaris',
    humas: 'Humas',
    anggota: 'Anggota'
  };

  const roleColors = {
    super_admin: 'bg-red-100 text-red-800',
    ketua: 'bg-purple-100 text-purple-800',
    wakil_ketua: 'bg-blue-100 text-blue-800',
    bendahara: 'bg-yellow-100 text-yellow-800',
    sekretaris: 'bg-green-100 text-green-800',
    humas: 'bg-pink-100 text-pink-800',
    anggota: 'bg-gray-100 text-gray-800'
  };

  return `
    <div class="bg-white rounded-xl shadow-md p-4">
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-3 flex-1">
          <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-lg font-bold text-primary-600">${data.name?.charAt(0).toUpperCase() || 'U'}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-gray-800 truncate">${data.name || 'Unknown'}</h4>
            <p class="text-sm text-gray-600 truncate">${data.email || ''}</p>
            <p class="text-sm text-gray-600">${data.phone || '-'}</p>
            <span class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${roleColors[data.role] || roleColors.anggota}">
              ${roleLabels[data.role] || data.role}
            </span>
          </div>
        </div>
        ${data.role !== 'super_admin' ? `
        <button 
          onclick="toggleMemberStatus('${id}', ${data.isActive})"
          class="ml-2 ${data.isActive ? 'text-green-600' : 'text-red-600'} hover:opacity-75"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${data.isActive ? 
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' :
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />'
            }
          </svg>
        </button>
        ` : ''}
      </div>
    </div>
  `;
}

function setupMemberHandlers() {
  window.showAddMemberModal = () => {
    document.getElementById('addMemberModal').classList.remove('hidden');
  };

  window.closeAddMemberModal = () => {
    document.getElementById('addMemberModal').classList.add('hidden');
    document.getElementById('addMemberForm').reset();
    document.getElementById('errorMsg').classList.add('hidden');
  };

  window.toggleMemberStatus = async (memberId, currentStatus) => {
    if (confirm(`Apakah Anda yakin ingin ${currentStatus ? 'menonaktifkan' : 'mengaktifkan'} anggota ini?`)) {
      try {
        await updateDoc(doc(db, 'users', memberId), {
          isActive: !currentStatus,
          updatedAt: serverTimestamp()
        });
        loadMembers();
      } catch (error) {
        // Error updating member status:
        alert('Gagal mengubah status anggota');
      }
    }
  };

  const form = document.getElementById('addMemberForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const errorMsg = document.getElementById('errorMsg');
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Menyimpan...';
      errorMsg.classList.add('hidden');

      try {
        const name = document.getElementById('memberName').value;
        const email = document.getElementById('memberEmail').value;
        const password = document.getElementById('memberPassword').value;
        const role = document.getElementById('memberRole').value;
        const phone = document.getElementById('memberPhone').value;
        const address = document.getElementById('memberAddress').value;

        // Create user in Firebase Auth (temporarily - will need separate admin SDK)
        // For now, just create in Firestore
        await addDoc(collection(db, 'users'), {
          name,
          email,
          role,
          phone,
          address,
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        alert('Anggota berhasil ditambahkan!');
        window.closeAddMemberModal();
        loadMembers();
      } catch (error) {
        // Error adding member:
        errorMsg.textContent = error.message || 'Gagal menambahkan anggota';
        errorMsg.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Simpan Anggota';
      }
    });
  }
}

export default function init() {
  // Anggota Module Ready
}
