// UMKM Module with Cloudinary Integration
import { authService } from '../../auth/auth.service.js';
import { hasPermission, PERMISSIONS } from '../../auth/roles.js';

export function UMKMPage() {
  return `
    <div class="bg-gray-50 min-h-screen pb-20">
      <div class="bg-purple-600 text-white p-4">
        <h1 class="text-xl font-bold">UMKM</h1>
        <p class="text-sm text-purple-100">Katalog produk UMKM</p>
      </div>

      <div class="p-4">
        <button 
          id="addUMKMBtn"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg mb-4"
        >
          + Tambah Produk UMKM
        </button>

        <div id="umkmList" class="grid grid-cols-2 gap-3">
          <div class="col-span-2 text-center py-8 text-gray-500">
            Memuat produk UMKM...
          </div>
        </div>
      </div>
    </div>
  `;

setTimeout(() => {
  loadUMKM();
  document.getElementById('addUMKMBtn').onclick = showAddUMKMModal;
}, 0);

// Load UMKM products from Firebase
async function loadUMKM() {
  const listEl = document.getElementById('umkmList');
  if (!listEl) return;
  const snap = await getDocs(query(collection(db, 'umkm'), limit(50)));
  if (snap.empty) {
    listEl.innerHTML = '<div class="col-span-2 text-center py-8 text-gray-500">Belum ada produk UMKM.</div>';
    return;
  }
  listEl.innerHTML = Array.from(snap.docs).map(doc => {
    const data = doc.data();
    return `<div class="bg-white rounded-xl shadow p-3 flex flex-col items-center mb-2">
      <img src="${data.photo || 'https://via.placeholder.com/120x120?text=UMKM'}" alt="Foto Produk" class="w-24 h-24 object-cover rounded-lg mb-2" />
      <div class="font-bold text-purple-700 text-base">${data.name}</div>
      <div class="text-xs text-gray-500">${data.description}</div>
      <div class="text-xs text-green-600 font-semibold">Rp ${data.price ? data.price.toLocaleString('id-ID') : '0'}</div>
      <div class="text-xs text-gray-400">${data.owner || '-'}</div>
      <div class="flex gap-2 mt-2">
        <button class="edit-btn px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold" data-id="${doc.id}">Edit</button>
        <button class="delete-btn px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold" data-id="${doc.id}">Hapus</button>
      </div>
    </div>`;
  }).join('');
  // Add event listeners
  listEl.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => showEditUMKMModal(btn.dataset.id);
  });
  listEl.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => deleteUMKM(btn.dataset.id);
  });
}

// Show add UMKM modal
function showAddUMKMModal() {
  const profile = authService.getUserProfile();
  if (!profile || !hasPermission(profile.role, PERMISSIONS.MANAGE_UMKM)) {
    alert('Permission denied');
    return;
  }
  const name = prompt('Nama produk:');
  if (!name) return;
  const description = prompt('Deskripsi produk:');
  const price = prompt('Harga (Rp):');
  const photo = prompt('URL foto produk:');
  const owner = prompt('Pemilik/anggota:');
  addUMKM({ name, description, price: parseInt(price), photo, owner });
}

// Add UMKM product to Firebase
async function addUMKM(data) {
  await addDoc(collection(db, 'umkm'), {
    ...data,
    createdAt: new Date().toISOString()
  });
  loadUMKM();
}

// Show edit UMKM modal
async function showEditUMKMModal(id) {
  const docRef = doc(db, 'umkm', id);
  const snap = await getDocs(query(collection(db, 'umkm'), where('__name__', '==', id)));
  if (snap.empty) return;
  const data = snap.docs[0].data();
  const profile = authService.getUserProfile();
  if (!profile || !hasPermission(profile.role, PERMISSIONS.MANAGE_UMKM)) {
    alert('Permission denied');
    return;
  }
  const name = prompt('Edit nama produk:', data.name);
  if (!name) return;
  const description = prompt('Edit deskripsi:', data.description);
  const price = prompt('Edit harga (Rp):', data.price);
  const photo = prompt('Edit URL foto:', data.photo);
  const owner = prompt('Edit pemilik/anggota:', data.owner);
  await updateDoc(docRef, { name, description, price: parseInt(price), photo, owner });
  loadUMKM();
}

// Delete UMKM product from Firebase
async function deleteUMKM(id) {
  const profile = authService.getUserProfile();
  if (!profile || !hasPermission(profile.role, PERMISSIONS.MANAGE_UMKM)) {
    alert('Permission denied');
    return;
  }
  if (!confirm('Yakin ingin menghapus produk ini?')) return;
  await updateDoc(doc(db, 'umkm', id), { deleted: true });
  loadUMKM();
}
}

export default function init() {
  // UMKM Module Ready
}
