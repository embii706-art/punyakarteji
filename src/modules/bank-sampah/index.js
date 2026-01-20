// Bank Sampah Module with Offline Support
import { authService } from '../../auth/auth.service.js';

export function BankSampahPage() {
  return `
    <div class="bg-gray-50 min-h-screen pb-20">
      <div class="bg-green-600 text-white p-4">
        <h1 class="text-xl font-bold">Bank Sampah</h1>
        <p class="text-sm text-green-100">Kelola setoran sampah rumah tangga</p>
      </div>

      <div class="p-4">
        <button 
          id="addDepositBtn"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mb-4"
        >
          + Tambah Setoran Sampah
        </button>

        <div id="depositsList" class="space-y-3">
          <div class="text-center py-8 text-gray-500">
            Memuat data setoran...
          </div>
        </div>
      </div>
    </div>
  `;
}

setTimeout(() => {
  loadDeposits();
  document.getElementById('addDepositBtn').onclick = showAddDepositModal;
}, 0);

// Load deposits from Firebase
async function loadDeposits() {
  const listEl = document.getElementById('depositsList');
  if (!listEl) return;
  const snap = await getDocs(collection(db, 'bank_sampah'));
  if (snap.empty) {
    listEl.innerHTML = '<div class="text-center py-8 text-gray-500">Belum ada setoran.</div>';
    return;
  }
  // Fetch anggota for name lookup
  const anggotaSnap = await getDocs(collection(db, 'anggota'));
  const anggotaMap = {};
  anggotaSnap.forEach(doc => anggotaMap[doc.id] = doc.data().name);
  listEl.innerHTML = Array.from(snap.docs).map(doc => {
    const data = doc.data();
    return `<div class="bg-white rounded-xl shadow p-3 flex flex-col sm:flex-row sm:items-center justify-between mb-2">
      <div>
        <div class="font-bold text-green-700 text-base">${anggotaMap[data.anggotaId] || 'Unknown'}</div>
        <div class="text-xs text-gray-500">${data.amount} kg | ${data.type || 'Campuran'}</div>
        <div class="text-xs text-gray-400">${data.date?.substr(0,10) || ''}</div>
      </div>
      <div class="flex gap-2 mt-2 sm:mt-0">
        <button class="edit-btn px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold" data-id="${doc.id}">Edit</button>
        <button class="delete-btn px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold" data-id="${doc.id}">Hapus</button>
      </div>
    </div>`;
  }).join('');
  // Add event listeners
  listEl.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => showEditDepositModal(btn.dataset.id);
  });
  listEl.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => deleteDeposit(btn.dataset.id);
  });
}

// Show add deposit modal
async function showAddDepositModal() {
  // Fetch anggota for selection
  const anggotaSnap = await getDocs(collection(db, 'anggota'));
  const anggotaList = Array.from(anggotaSnap.docs).map(doc => ({ id: doc.id, name: doc.data().name }));
  const anggotaId = prompt('ID anggota penyetor:\n' + anggotaList.map(a => `${a.id}: ${a.name}`).join('\n'));
  if (!anggotaId) return;
  const amount = prompt('Jumlah sampah (kg):');
  if (!amount) return;
  const type = prompt('Jenis sampah:', 'Campuran');
  const date = prompt('Tanggal setoran (YYYY-MM-DD):', new Date().toISOString().substr(0,10));
  addDeposit({ anggotaId, amount: parseFloat(amount), type, date });
}

// Add deposit to Firebase
async function addDeposit(data) {
  await addDoc(collection(db, 'bank_sampah'), {
    ...data,
    createdAt: new Date().toISOString()
  });
  loadDeposits();
}

// Show edit deposit modal
async function showEditDepositModal(id) {
  const docRef = doc(db, 'bank_sampah', id);
  const snap = await getDocs(query(collection(db, 'bank_sampah'), where('__name__', '==', id)));
  if (snap.empty) return;
  const data = snap.docs[0].data();
  const amount = prompt('Edit jumlah sampah (kg):', data.amount);
  if (!amount) return;
  const type = prompt('Edit jenis sampah:', data.type);
  const date = prompt('Edit tanggal (YYYY-MM-DD):', data.date);
  await updateDoc(docRef, { amount: parseFloat(amount), type, date });
  loadDeposits();
}

// Delete deposit from Firebase
async function deleteDeposit(id) {
  if (!confirm('Yakin ingin menghapus setoran ini?')) return;
  await updateDoc(doc(db, 'bank_sampah', id), { deleted: true });
  loadDeposits();
}
}

export default function init() {
  console.log("Bank Sampah Module Ready");
}
