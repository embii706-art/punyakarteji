// Finance Module with Approval Flow
import { authService } from '../../auth/auth.service.js';

export function FinancePage() {
  const isAdmin = authService.isAdmin();
  const isBendahara = authService.hasRole('bendahara');

  return `
    <div class="bg-gray-50 min-h-screen pb-20">
      <div class="bg-yellow-600 text-white p-4">
        <h1 class="text-xl font-bold">Keuangan</h1>
        <p class="text-sm text-yellow-100">Manajemen kas masuk & keluar</p>
      </div>

      <div class="p-4">
        <div class="bg-white rounded-xl shadow-md p-4 mb-4">
          <p class="text-sm text-gray-600 mb-1">Saldo Kas</p>
          <p class="text-3xl font-bold text-gray-800" id="saldoKas">Rp 0</p>
        </div>

        ${(isBendahara || isAdmin) ? `
        <button 
          id="addTransactionBtn"
          class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg mb-4"
        >
          + Tambah Transaksi
        </button>
        ` : ''}

        <div id="transactionsList" class="space-y-3">
          <div class="text-center py-8 text-gray-500">
            Memuat data transaksi...
          </div>
        </div>
      </div>
    </div>
  `;

setTimeout(() => {
  loadTransactions();
  const btn = document.getElementById('addTransactionBtn');
  if (btn) btn.onclick = showAddTransactionModal;
}, 0);

// Load transactions from Firebase
async function loadTransactions() {
  const listEl = document.getElementById('transactionsList');
  const saldoEl = document.getElementById('saldoKas');
  if (!listEl) return;
  const snap = await getDocs(query(collection(db, 'keuangan'), limit(50)));
  if (snap.empty) {
    listEl.innerHTML = '<div class="text-center py-8 text-gray-500">Belum ada transaksi.</div>';
    if (saldoEl) saldoEl.textContent = 'Rp 0';
    return;
  }
  let saldo = 0;
  listEl.innerHTML = Array.from(snap.docs).map(doc => {
    const data = doc.data();
    if (data.type === 'masuk') saldo += data.amount;
    else if (data.type === 'keluar') saldo -= data.amount;
    return `<div class="bg-white rounded-xl shadow p-3 flex flex-col sm:flex-row sm:items-center justify-between mb-2">
      <div>
        <div class="font-bold text-yellow-700 text-base">${data.description}</div>
        <div class="text-xs text-gray-500">${data.amount ? 'Rp ' + data.amount.toLocaleString('id-ID') : ''} | ${data.type === 'masuk' ? 'Masuk' : 'Keluar'}</div>
        <div class="text-xs text-gray-400">${data.date?.substr(0,10) || ''}</div>
      </div>
      <div class="flex gap-2 mt-2 sm:mt-0">
        <button class="edit-btn px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold" data-id="${doc.id}">Edit</button>
        <button class="delete-btn px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold" data-id="${doc.id}">Hapus</button>
      </div>
    </div>`;
  }).join('');
  if (saldoEl) saldoEl.textContent = 'Rp ' + saldo.toLocaleString('id-ID');
  // Add event listeners
  listEl.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => showEditTransactionModal(btn.dataset.id);
  });
  listEl.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => deleteTransaction(btn.dataset.id);
  });
}

// Show add transaction modal
function showAddTransactionModal() {
  const description = prompt('Deskripsi transaksi:');
  if (!description) return;
  const amount = prompt('Jumlah (Rp):');
  if (!amount) return;
  const type = prompt('Tipe (masuk/keluar):', 'masuk');
  const date = prompt('Tanggal transaksi (YYYY-MM-DD):', new Date().toISOString().substr(0,10));
  addTransaction({ description, amount: parseInt(amount), type, date });
}

// Add transaction to Firebase
async function addTransaction(data) {
  await addDoc(collection(db, 'keuangan'), {
    ...data,
    createdAt: new Date().toISOString()
  });
  loadTransactions();
}

// Show edit transaction modal
async function showEditTransactionModal(id) {
  const docRef = doc(db, 'keuangan', id);
  const snap = await getDocs(query(collection(db, 'keuangan'), where('__name__', '==', id)));
  if (snap.empty) return;
  const data = snap.docs[0].data();
  const description = prompt('Edit deskripsi:', data.description);
  if (!description) return;
  const amount = prompt('Edit jumlah (Rp):', data.amount);
  if (!amount) return;
  const type = prompt('Edit tipe (masuk/keluar):', data.type);
  const date = prompt('Edit tanggal (YYYY-MM-DD):', data.date);
  await updateDoc(docRef, { description, amount: parseInt(amount), type, date });
  loadTransactions();
}

// Delete transaction from Firebase
async function deleteTransaction(id) {
  if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
  await updateDoc(doc(db, 'keuangan', id), { deleted: true });
  loadTransactions();
}
}

export default function init() {
  // Keuangan Module Ready
}
