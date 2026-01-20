// Kotak Aspirasi (Aspiration Box) Module
import { authService } from '../../auth/auth.service.js';
import { PERMISSIONS } from '../../auth/roles.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  doc,
  return `
    <div class="bg-gray-50 min-h-screen pb-20">
      <div class="bg-blue-600 text-white p-4">
        <h1 class="text-xl font-bold">Kotak Aspirasi</h1>
        <p class="text-sm text-blue-100">Sampaikan aspirasi, kritik, dan saran Anda</p>
      </div>

      <div class="p-4">
        <button 
          id="addAspirationBtn"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mb-4"
        >
          + Tambah Aspirasi
        </button>

        <div id="aspirationList" class="space-y-3">
          <div class="text-center py-8 text-gray-500">
            Memuat data aspirasi...
          </div>
        </div>
      </div>
    </div>
  `;
}

setTimeout(() => {
  loadAspirations();
  document.getElementById('addAspirationBtn').onclick = showAddAspirationModal;
}, 0);

// Load aspirations from Firebase
async function loadAspirations() {
  const listEl = document.getElementById('aspirationList');
  if (!listEl) return;
  const snap = await getDocs(collection(db, 'aspiration'));
  if (snap.empty) {
    listEl.innerHTML = '<div class="text-center py-8 text-gray-500">Belum ada aspirasi.</div>';
    return;
  }
  listEl.innerHTML = Array.from(snap.docs).map(doc => {
    const data = doc.data();
    return `<div class="bg-white rounded-xl shadow p-3 flex flex-col sm:flex-row sm:items-center justify-between mb-2">
      <div>
        <div class="font-bold text-blue-700 text-base">${data.title}</div>
        <div class="text-xs text-gray-500">${data.content}</div>
        <div class="text-xs text-gray-400">${data.sender || '-'} | ${data.date?.substr(0,10) || ''}</div>
      </div>
      <div class="flex gap-2 mt-2 sm:mt-0">
        <button class="edit-btn px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold" data-id="${doc.id}">Edit</button>
        <button class="delete-btn px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold" data-id="${doc.id}">Hapus</button>
      </div>
    </div>`;
  }).join('');
  // Add event listeners
  listEl.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => showEditAspirationModal(btn.dataset.id);
  });
  listEl.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => deleteAspiration(btn.dataset.id);
  });
}

// Show add aspiration modal
function showAddAspirationModal() {
  const title = prompt('Judul aspirasi:');
  if (!title) return;
  const content = prompt('Isi aspirasi:');
  if (!content) return;
  const sender = prompt('Pengirim/anggota:');
  const date = prompt('Tanggal (YYYY-MM-DD):', new Date().toISOString().substr(0,10));
  addAspiration({ title, content, sender, date });
}

// Add aspiration to Firebase
async function addAspiration(data) {
  await addDoc(collection(db, 'aspiration'), {
    ...data,
    createdAt: new Date().toISOString()
  });
  loadAspirations();
}

// Show edit aspiration modal
async function showEditAspirationModal(id) {
  const docRef = doc(db, 'aspiration', id);
  const snap = await getDocs(query(collection(db, 'aspiration'), where('__name__', '==', id)));
  if (snap.empty) return;
  const data = snap.docs[0].data();
  const title = prompt('Edit judul:', data.title);
  if (!title) return;
  const content = prompt('Edit isi:', data.content);
  const sender = prompt('Edit pengirim:', data.sender);
  const date = prompt('Edit tanggal (YYYY-MM-DD):', data.date);
  await updateDoc(docRef, { title, content, sender, date });
  loadAspirations();
}

// Delete aspiration from Firebase
async function deleteAspiration(id) {
  if (!confirm('Yakin ingin menghapus aspirasi ini?')) return;
  await updateDoc(doc(db, 'aspiration', id), { deleted: true });
  loadAspirations();
}
  [ASPIRATION_CATEGORIES.KEGIATAN]: 'Kegiatan',
  [ASPIRATION_CATEGORIES.LINGKUNGAN]: 'Lingkungan',
  [ASPIRATION_CATEGORIES.UMKM]: 'UMKM',
  [ASPIRATION_CATEGORIES.LAIN]: 'Lain-lain'
};

const STATUS_LABELS = {
  [ASPIRATION_STATUS.BARU]: 'Baru',
  [ASPIRATION_STATUS.DIPROSES]: 'Diproses',
  [ASPIRATION_STATUS.SELESAI]: 'Selesai'
};

const STATUS_COLORS = {
  [ASPIRATION_STATUS.BARU]: 'bg-blue-100 text-blue-800',
  [ASPIRATION_STATUS.DIPROSES]: 'bg-yellow-100 text-yellow-800',
  [ASPIRATION_STATUS.SELESAI]: 'bg-green-100 text-green-800'
};

export function AspirationPage() {
  const profile = authService.getUserProfile();
  const canManage = authService.hasPermission(PERMISSIONS.MANAGE_ASPIRATIONS);

  const html = `
    <div class="bg-gray-50 min-h-screen pb-20">
      <!-- Header -->
      <div class="bg-indigo-600 text-white p-4">
        <h1 class="text-xl font-bold">📮 Kotak Aspirasi</h1>
        <p class="text-sm text-indigo-100">Sampaikan ide dan saran Anda</p>
      </div>

      <!-- New Count Badge -->
      ${canManage ? `
      <div class="p-4">
        <div class="bg-white rounded-xl shadow-md p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Aspirasi Baru</p>
              <p class="text-2xl font-bold text-indigo-600" id="newCount">0</p>
            </div>
            <div class="bg-indigo-100 p-3 rounded-full">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Submit Button -->
      <div class="px-4 ${canManage ? '' : 'pt-4'}">
        <button 
          onclick="showSubmitModal()"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg mb-4 flex items-center justify-center space-x-2 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Kirim Aspirasi</span>
        </button>
      </div>

      <!-- Filters (for managers) -->
      ${canManage ? `
      <div class="px-4 mb-4">
        <div class="flex space-x-2 overflow-x-auto pb-2">
          <button onclick="filterStatus('all')" class="filter-btn active px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm whitespace-nowrap">
            Semua
          </button>
          <button onclick="filterStatus('baru')" class="filter-btn px-4 py-2 rounded-lg bg-white text-gray-700 text-sm whitespace-nowrap">
            Baru
          </button>
          <button onclick="filterStatus('diproses')" class="filter-btn px-4 py-2 rounded-lg bg-white text-gray-700 text-sm whitespace-nowrap">
            Diproses
          </button>
          <button onclick="filterStatus('selesai')" class="filter-btn px-4 py-2 rounded-lg bg-white text-gray-700 text-sm whitespace-nowrap">
            Selesai
          </button>
        </div>
      </div>
      ` : ''}

      <!-- Aspirations List -->
      <div class="px-4">
        <div id="aspirationsList" class="space-y-3">
          <div class="text-center py-8 text-gray-500">
            Memuat aspirasi...
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Modal -->
    <div id="submitModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
          <h3 class="text-lg font-bold">Kirim Aspirasi</h3>
          <button onclick="closeSubmitModal()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form id="submitForm" class="p-4 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
            <select 
              id="category" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Pilih Kategori</option>
              <option value="kegiatan">Kegiatan</option>
              <option value="lingkungan">Lingkungan</option>
              <option value="umkm">UMKM</option>
              <option value="lain-lain">Lain-lain</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Aspirasi Anda *</label>
            <textarea 
              id="content"
              required
              rows="5"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Tuliskan ide, saran, atau masukan Anda..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Minimal 10 karakter</p>
          </div>

          <div class="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="anonymous"
              class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label for="anonymous" class="text-sm text-gray-700">Kirim sebagai anonim</label>
          </div>

          <div id="errorMsg" class="hidden bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"></div>

          <button 
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Kirim Aspirasi
          </button>
        </form>
      </div>
    </div>

    <!-- Detail Modal (for managers) -->
    ${canManage ? `
    <div id="detailModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
          <h3 class="text-lg font-bold">Detail Aspirasi</h3>
          <button onclick="closeDetailModal()" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div id="detailContent" class="p-4">
          <!-- Content will be loaded here -->
        </div>
      </div>
    </div>
    ` : ''}
  `;

  setTimeout(() => {
    loadAspirations();
    setupHandlers();
  }, 0);

  return html;
}

let currentFilter = 'all';
let currentAspirations = [];

async function loadAspirations() {
  try {
    const canManage = authService.hasPermission(PERMISSIONS.MANAGE_ASPIRATIONS);
    const userId = authService.getCurrentUser()?.uid;

    let q;
    if (canManage) {
      // Managers see all aspirations
      q = query(
        collection(db, 'aspirations'),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Regular users see only their own
      q = query(
        collection(db, 'aspirations'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    }

    const snapshot = await getDocs(q);
    currentAspirations = [];
    
    snapshot.forEach(doc => {
      currentAspirations.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Update new count
    if (canManage) {
      const newCount = currentAspirations.filter(a => a.status === 'baru').length;
      const countEl = document.getElementById('newCount');
      if (countEl) countEl.textContent = newCount;
    }

    renderAspirations();
  } catch (error) {
    console.error('Error loading aspirations:', error);
    document.getElementById('aspirationsList').innerHTML = `
      <div class="text-center py-8 text-red-500">
        Gagal memuat aspirasi
      </div>
    `;
  }
}

function renderAspirations() {
  const canManage = authService.hasPermission(PERMISSIONS.MANAGE_ASPIRATIONS);
  const list = document.getElementById('aspirationsList');

  let filtered = currentAspirations;
  if (currentFilter !== 'all') {
    filtered = currentAspirations.filter(a => a.status === currentFilter);
  }

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p>Belum ada aspirasi</p>
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(aspiration => {
    html += createAspirationCard(aspiration, canManage);
  });

  list.innerHTML = html;
}

function createAspirationCard(aspiration, canManage) {
  const date = aspiration.createdAt?.toDate?.() || new Date();
  const dateStr = date.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  const author = aspiration.anonymous ? 'Anonim' : (aspiration.userName || 'User');
  
  return `
    <div class="bg-white rounded-xl shadow-md p-4 ${canManage ? 'cursor-pointer hover:shadow-lg transition' : ''}"
         ${canManage ? `onclick="showDetail('${aspiration.id}')"` : ''}>
      <div class="flex items-start justify-between mb-2">
        <div class="flex-1">
          <div class="flex items-center space-x-2 mb-1">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[aspiration.status] || STATUS_COLORS.baru}">
              ${STATUS_LABELS[aspiration.status] || 'Baru'}
            </span>
            <span class="text-xs text-gray-500">${CATEGORY_LABELS[aspiration.category] || aspiration.category}</span>
          </div>
          <p class="text-sm font-medium text-gray-800">${author}</p>
        </div>
        <span class="text-xs text-gray-400">${dateStr}</span>
      </div>
      
      <p class="text-gray-700 text-sm mb-3 line-clamp-3">${aspiration.content}</p>
      
      ${canManage && aspiration.notes ? `
        <div class="bg-gray-50 rounded-lg p-2 mt-2">
          <p class="text-xs text-gray-600"><strong>Catatan:</strong> ${aspiration.notes}</p>
        </div>
      ` : ''}
    </div>
  `;
}

function setupHandlers() {
  const canManage = authService.hasPermission(PERMISSIONS.MANAGE_ASPIRATIONS);

  // Submit modal
  window.showSubmitModal = () => {
    document.getElementById('submitModal').classList.remove('hidden');
  };

  window.closeSubmitModal = () => {
    document.getElementById('submitModal').classList.add('hidden');
    document.getElementById('submitForm').reset();
    document.getElementById('errorMsg').classList.add('hidden');
  };

  // Filter (for managers)
  if (canManage) {
    window.filterStatus = (status) => {
      currentFilter = status;
      
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white');
        btn.classList.add('bg-white', 'text-gray-700');
      });
      event.target.classList.add('bg-indigo-600', 'text-white');
      event.target.classList.remove('bg-white', 'text-gray-700');
      
      renderAspirations();
    };

    window.showDetail = (id) => {
      const aspiration = currentAspirations.find(a => a.id === id);
      if (!aspiration) return;

      const date = aspiration.createdAt?.toDate?.() || new Date();
      const dateStr = date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const author = aspiration.anonymous ? 'Anonim' : (aspiration.userName || 'User');

      document.getElementById('detailContent').innerHTML = `
        <div class="space-y-4">
          <div>
            <label class="text-xs text-gray-600">Dari</label>
            <p class="font-medium">${author}</p>
          </div>

          <div>
            <label class="text-xs text-gray-600">Tanggal</label>
            <p class="text-sm">${dateStr}</p>
          </div>

          <div>
            <label class="text-xs text-gray-600">Kategori</label>
            <p class="text-sm">${CATEGORY_LABELS[aspiration.category] || aspiration.category}</p>
          </div>

          <div>
            <label class="text-xs text-gray-600">Aspirasi</label>
            <p class="text-sm">${aspiration.content}</p>
          </div>

          <div>
            <label class="text-xs text-gray-600 block mb-2">Status</label>
            <select id="statusSelect" class="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="baru" ${aspiration.status === 'baru' ? 'selected' : ''}>Baru</option>
              <option value="diproses" ${aspiration.status === 'diproses' ? 'selected' : ''}>Diproses</option>
              <option value="selesai" ${aspiration.status === 'selesai' ? 'selected' : ''}>Selesai</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-gray-600 block mb-2">Catatan Internal</label>
            <textarea 
              id="notesInput"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Tambahkan catatan..."
            >${aspiration.notes || ''}</textarea>
          </div>

          <button 
            onclick="updateAspiration('${id}')"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg"
          >
            Simpan Perubahan
          </button>
        </div>
      `;

      document.getElementById('detailModal').classList.remove('hidden');
    };

    window.closeDetailModal = () => {
      document.getElementById('detailModal').classList.add('hidden');
    };

    window.updateAspiration = async (id) => {
      const status = document.getElementById('statusSelect').value;
      const notes = document.getElementById('notesInput').value;

      try {
        await updateDoc(doc(db, 'aspirations', id), {
          status,
          notes,
          updatedAt: serverTimestamp(),
          updatedBy: authService.getCurrentUser().uid
        });

        alert('Aspirasi berhasil diperbarui!');
        window.closeDetailModal();
        await loadAspirations();
      } catch (error) {
        console.error('Error updating aspiration:', error);
        alert('Gagal memperbarui aspirasi');
      }
    };
  }

  // Submit form
  const form = document.getElementById('submitForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const errorMsg = document.getElementById('errorMsg');
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
      errorMsg.classList.add('hidden');

      try {
        const category = document.getElementById('category').value;
        const content = document.getElementById('content').value;
        const anonymous = document.getElementById('anonymous').checked;

        if (content.length < 10) {
          throw new Error('Aspirasi minimal 10 karakter');
        }

        const user = authService.getCurrentUser();
        const profile = authService.getUserProfile();

        await addDoc(collection(db, 'aspirations'), {
          userId: user.uid,
          userName: profile?.name || 'User',
          category,
          content,
          anonymous,
          status: 'baru',
          createdAt: serverTimestamp()
        });

        alert('Aspirasi berhasil dikirim!');
        window.closeSubmitModal();
        await loadAspirations();
      } catch (error) {
        console.error('Error submitting aspiration:', error);
        errorMsg.textContent = error.message || 'Gagal mengirim aspirasi';
        errorMsg.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Aspirasi';
      }
    });
  }
}
