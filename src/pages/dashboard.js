// Dashboard Page with Charts
import { authService } from '../auth/auth.service.js';
import { collection, query, getDocs, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export function DashboardPage() {
  const profile = authService.getUserProfile();
  const isAdmin = authService.isAdmin();

  const html = `
    <div class="bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 min-h-screen">
      <!-- Welcome Section -->
      <div class="bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500 text-white p-8 shadow-xl relative overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-24 -mb-24"></div>
        
        <div class="relative z-10">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h1 class="text-3xl font-black mb-1 animate-slide-in-right">Selamat Datang! 👋</h1>
              <p class="text-white/90 font-medium text-lg animate-slide-in-right" style="animation-delay: 0.1s;">${profile?.name || 'User'}</p>
              <p class="text-sm text-white/80 mt-1 animate-slide-in-right" style="animation-delay: 0.2s;">${getRoleLabel(profile?.role)}</p>
            </div>
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm animate-float">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="p-5 -mt-8">
        <div class="grid grid-cols-2 gap-4 mb-6" id="dashboardStats">
          <!-- Stats will be loaded here -->
        </div>

        <!-- Charts Section -->
        <div class="space-y-5">
          <!-- Waste Trend Chart -->
          <div class="glass-card rounded-2xl shadow-premium p-5 animate-slide-up" style="animation-delay: 0.1s;">
            <h3 class="font-bold text-gray-800 mb-4 flex items-center text-lg">
              <div class="w-10 h-10 bg-gradient-forest rounded-xl flex items-center justify-center mr-3 shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              Trend Sampah Bulanan
            </h3>
            <canvas id="wasteChart" height="200"></canvas>
          </div>

          ${isAdmin ? `
          <!-- Finance Chart -->
          <div class="glass-card rounded-2xl shadow-premium p-5 animate-slide-up" style="animation-delay: 0.2s;">
            <h3 class="font-bold text-gray-800 mb-4 flex items-center text-lg">
              <div class="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Ringkasan Keuangan
            </h3>
            <canvas id="financeChart" height="200"></canvas>
          </div>
          ` : ''}

          <!-- Recent Activities -->
          <div class="glass-card rounded-2xl shadow-premium p-5 animate-slide-up" style="animation-delay: 0.3s;">
            <h3 class="font-bold text-gray-800 mb-4 flex items-center text-lg">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center mr-3 shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Aktivitas Terbaru
            </h3>
            <div id="recentActivities" class="space-y-3">
              <!-- Activities will be loaded here -->
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        ${getQuickActions(profile?.role)}
      </div>
    </div>
  `;

  // Load data after render
  setTimeout(() => {
    loadDashboardStats();
    loadWasteChart();
    loadFinanceChart();
    loadRecentActivities();
  }, 0);
  // Load live stats from Firebase
  async function loadDashboardStats() {
    const statsEl = document.getElementById('dashboardStats');
    if (!statsEl) return;
    // Fetch stats from Firebase
    const anggotaSnap = await getDocs(query(collection(db, 'anggota'), limit(50)));
    const bankSampahSnap = await getDocs(query(collection(db, 'bank_sampah'), limit(50)));
    const keuanganSnap = await getDocs(query(collection(db, 'keuangan'), limit(50)));
    const umkmSnap = await getDocs(query(collection(db, 'umkm'), limit(50)));
    statsEl.innerHTML = `
    ${createStatCard('Anggota', anggotaSnap.size, 'users', 'bg-blue-500')}
    ${createStatCard('Bank Sampah', `${bankSampahSnap.size} kg`, 'trash', 'bg-green-500')}
    ${createStatCard('Keuangan', `Rp ${getTotalKeuangan(keuanganSnap)}`, 'cash', 'bg-yellow-500')}
    ${createStatCard('UMKM', umkmSnap.size, 'store', 'bg-purple-500')}
  `;
  }

  function getTotalKeuangan(snap) {
    let total = 0;
    (snap.docs || []).forEach(doc => {
      const data = doc.data();
      if (data && typeof data.amount === 'number') total += data.amount;
    });
    return total.toLocaleString('id-ID');
  }

  // Load waste chart from Firebase
  async function loadWasteChart() {
    const chartEl = document.getElementById('wasteChart');
    if (!chartEl) return;
    // Fetch monthly waste data
    const wasteSnap = await getDocs(query(collection(db, 'bank_sampah'), orderBy('date')));
    const monthly = {};
    (wasteSnap.docs || []).forEach(doc => {
      const data = doc.data();
      if (data && data.date && data.amount) {
        const month = data.date.substr(0, 7); // YYYY-MM
        monthly[month] = (monthly[month] || 0) + data.amount;
      }
    });
    const labels = Object.keys(monthly);
    const values = Object.values(monthly);
    new window.Chart(chartEl, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sampah (kg)',
          data: values,
          backgroundColor: '#22c55e',
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  // Load finance chart from Firebase
  async function loadFinanceChart() {
    const chartEl = document.getElementById('financeChart');
    if (!chartEl) return;
    // Fetch monthly finance data
    const financeSnap = await getDocs(query(collection(db, 'keuangan'), orderBy('date')));
    const monthly = {};
    (financeSnap.docs || []).forEach(doc => {
      const data = doc.data();
      if (data && data.date && data.amount) {
        const month = data.date.substr(0, 7); // YYYY-MM
        monthly[month] = (monthly[month] || 0) + data.amount;
      }
    });
    const labels = Object.keys(monthly);
    const values = Object.values(monthly);
    new window.Chart(chartEl, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Keuangan (Rp)',
          data: values,
          borderColor: '#eab308',
          backgroundColor: 'rgba(234,179,8,0.2)',
          fill: true,
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }

  // Load recent activities from Firebase
  async function loadRecentActivities() {
    const actEl = document.getElementById('recentActivities');
    if (!actEl) return;
    // Fetch recent activities (last 10)
    const activitiesSnap = await getDocs(query(collection(db, 'activities'), orderBy('date', 'desc'), limit(10)));
    if (activitiesSnap.empty) {
      actEl.innerHTML = '<div class="text-center text-gray-500 py-4">Belum ada aktivitas terbaru.</div>';
      return;
    }
    actEl.innerHTML = Array.from(activitiesSnap.docs).map(doc => {
      const data = doc.data();
      return `<div class="rounded-lg bg-gray-100 p-3 text-xs sm:text-sm flex items-center justify-between mb-2">
      <span>${data?.description || 'Aktivitas'}</span>
      <span class="text-gray-400">${data?.date?.replace('T', ' ')?.substr(0, 16) || ''}</span>
    </div>`;
    }).join('');
  }

  return html;
}

function createStatCard(label, value, icon, bgColor) {
  const icons = {
    users: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />',
    trash: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />',
    cash: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />',
    store: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />'
  };

  const gradients = {
    'bg-blue-500': 'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-green-500': 'bg-gradient-forest',
    'bg-yellow-500': 'bg-gradient-to-br from-yellow-500 to-orange-500',
    'bg-purple-500': 'bg-gradient-to-br from-purple-500 to-pink-500'
  };

  return `
    <div class="glass-card rounded-2xl shadow-premium p-5 transition-premium hover:-translate-y-1 hover:shadow-glow cursor-pointer animate-slide-up">
      <div class="flex items-center justify-between mb-3">
        <div class="flex-1">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">${label}</p>
          <p class="text-2xl font-black text-gray-800" id="stat-${icon}">${value}</p>
        </div>
        <div class="${gradients[bgColor] || bgColor} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 hover:rotate-6">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${icons[icon]}
          </svg>
        </div>
      </div>
      <div class="mt-2">
        <div class="w-full bg-gray-200 rounded-full h-1.5">
          <div class="${gradients[bgColor] || bgColor} h-1.5 rounded-full transition-all duration-500" style="width: 75%"></div>
        </div>
      </div>
    </div>
  `;
}

function getRoleLabel(role) {
  const labels = {
    super_admin: 'Super Administrator',
    ketua: 'Ketua',
    wakil_ketua: 'Wakil Ketua',
    bendahara: 'Bendahara',
    sekretaris: 'Sekretaris',
    humas: 'Humas',
    anggota: 'Anggota'
  };
  return labels[role] || role;
}

function getQuickActions(role) {
  const isAdmin = authService.isAdmin();
  const hasFinancePermission = authService.hasPermission('finance');
  const hasBankSampahPermission = authService.hasPermission('bank_sampah');
  const hasUMKMPermission = authService.hasPermission('umkm');

  let actions = [];

  if (hasBankSampahPermission) {
    actions.push({
      label: 'Catat Sampah',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />',
      color: 'bg-green-600',
      route: '/bank-sampah'
    });
  }

  if (hasFinancePermission) {
    actions.push({
      label: 'Transaksi Keuangan',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />',
      color: 'bg-yellow-600',
      route: '/finance'
    });
  }

  if (hasUMKMPermission) {
    actions.push({
      label: 'Tambah UMKM',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />',
      color: 'bg-purple-600',
      route: '/umkm'
    });
  }

  if (actions.length === 0) return '';

  return `
    <div class="mt-8 animate-slide-up" style="animation-delay: 0.4s;">
      <h3 class="font-black text-gray-800 mb-4 text-xl">⚡ Quick Actions</h3>
      <div class="grid grid-cols-2 gap-4">
        ${actions.map(action => `
          <button 
            onclick="navigateTo('${action.route}')"
            class="glass-card rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 transition-premium hover:-translate-y-2 hover:shadow-glow group"
          >
            <div class="${action.color.replace('bg-', 'bg-gradient-to-br from-')} to-${action.color.split('-')[1]}-700 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${action.icon}
              </svg>
            </div>
            <span class="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">${action.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

async function loadDashboardData() {
  try {
    // Load member count
    const membersSnapshot = await getDocs(query(collection(db, 'users'), limit(50)));
    document.getElementById('stat-users').textContent = membersSnapshot.size;

    // Load waste total
    const wasteSnapshot = await getDocs(query(collection(db, 'waste_deposits'), limit(50)));
    let totalWaste = 0;
    (wasteSnapshot.docs || []).forEach(doc => {
      totalWaste += doc.data().weight || 0;
    });
    document.getElementById('stat-trash').textContent = `${totalWaste.toFixed(1)} kg`;

    // Load finance balance (if permitted)
    if (authService.hasPermission('finance')) {
      const transactionsSnapshot = await getDocs(query(collection(db, 'transactions'), limit(50)));
      let balance = 0;
      (transactionsSnapshot.docs || []).forEach(doc => {
        const data = doc.data();
        if (data.type === 'income' && data.status === 'approved') {
          balance += data.amount || 0;
        } else if (data.type === 'expense' && data.status === 'approved') {
          balance -= data.amount || 0;
        }
      });
      document.getElementById('stat-cash').textContent = `Rp ${balance.toLocaleString('id-ID')}`;
    }

    // Load UMKM count
    const umkmSnapshot = await getDocs(query(collection(db, 'umkm'), limit(50)));
    document.getElementById('stat-store').textContent = umkmSnapshot.size;

    // Load recent activities
    loadRecentActivities();
  } catch (error) {
    // Error loading dashboard data:
    const statsEl = document.getElementById('dashboardStats');
    if (statsEl) {
      statsEl.innerHTML = `<div class="col-span-2 text-center text-red-500 py-8">Gagal memuat data dashboard.<br>${error.message || 'Cek koneksi dan akses Firestore.'}</div>`;
    }
    const activitiesDiv = document.getElementById('recentActivities');
    if (activitiesDiv) {
      activitiesDiv.innerHTML = `<div class="text-center text-red-500 py-4">Tidak bisa memuat aktivitas.<br>${error.message || 'Cek akses Firestore.'}</div>`;
    }
  }
}

async function loadRecentActivities() {
  try {
    const activitiesDiv = document.getElementById('recentActivities');

    // Get recent waste deposits
    const wasteQuery = query(
      collection(db, 'waste_deposits'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const wasteSnapshot = await getDocs(wasteQuery);

    if (wasteSnapshot.empty) {
      activitiesDiv.innerHTML = `
        <div class="text-center text-gray-500 py-4">
          <p>Belum ada aktivitas</p>
        </div>
      `;
      return;
    }

    let html = '';
    (wasteSnapshot.docs || []).forEach(doc => {
      const data = doc.data();
      const date = data.createdAt?.toDate?.() || new Date();
      html += `
        <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <div class="bg-green-100 p-2 rounded-full">
            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-800">Setoran Sampah</p>
            <p class="text-xs text-gray-600">${data.weight} kg - ${data.householdName || 'Unknown'}</p>
            <p class="text-xs text-gray-400 mt-1">${formatDate(date)}</p>
          </div>
        </div>
      `;
    });

    activitiesDiv.innerHTML = html;
  } catch (error) {
    // Error loading activities:
    document.getElementById('recentActivities').innerHTML = `
      <div class="text-center text-red-500 py-4">
        <p>Gagal memuat aktivitas</p>
      </div>
    `;
  }
}

function initCharts() {
  // Import Chart.js dynamically
  import('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js')
    .then(() => {
      initWasteChart();
      if (authService.isAdmin()) {
        initFinanceChart();
      }
    })
    .catch(error => {
      // Error loading Chart.js:
    });
}

function initWasteChart() {
  const ctx = document.getElementById('wasteChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
      datasets: [{
        label: 'Berat Sampah (kg)',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function initFinanceChart() {
  const ctx = document.getElementById('financeChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Pemasukan', 'Pengeluaran', 'Saldo'],
      datasets: [{
        label: 'Jumlah (Rp)',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} menit yang lalu`;
  } else if (hours < 24) {
    return `${hours} jam yang lalu`;
  } else {
    const days = Math.floor(hours / 24);
    return `${days} hari yang lalu`;
  }
}
