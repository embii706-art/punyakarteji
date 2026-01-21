// Theme event/animation assets for special days
// Usage: import { getSpecialTheme } from './specialTheme.js';

const SPECIAL_DAYS = [
  {
    key: 'ramadhan',
    name: 'Ramadhan',
    start: '2026-02-18',
    end: '2026-03-19',
    theme: 'ramadhan',
    image: '/special/ramadhan.gif',
    color: '#16a34a',
    animation: 'ramadhan-lantern',
    cssVars: {
      '--bg-primary': '#f0fdf4',
      '--color-primary': '#16a34a',
      '--color-primary-dark': '#166534',
      '--color-primary-light': '#bbf7d0',
      '--theme-accent': '#fbbf24',
    },
    banner: 'Marhaban ya Ramadhan',
    icon: '🕌'
  },
  {
    key: 'lebaran',
    name: 'Idul Fitri',
    start: '2026-03-20',
    end: '2026-03-28',
    theme: 'lebaran',
    image: '/special/lebaran.gif',
    color: '#fbbf24',
    animation: 'lebaran-ketupat',
    cssVars: {
      '--bg-primary': '#fefce8',
      '--color-primary': '#fbbf24',
      '--color-primary-dark': '#b45309',
      '--color-primary-light': '#fef9c3',
      '--theme-accent': '#16a34a',
    },
    banner: 'Selamat Idul Fitri',
    icon: '🌙'
  },
  {
    key: 'natal',
    name: 'Natal',
    start: '2026-12-24',
    end: '2026-12-26',
    theme: 'natal',
    image: '/special/natal.gif',
    color: '#dc2626',
    animation: 'natal-snow',
    cssVars: {
      '--bg-primary': '#fef2f2',
      '--color-primary': '#dc2626',
      '--color-primary-dark': '#991b1b',
      '--color-primary-light': '#fee2e2',
      '--theme-accent': '#fbbf24',
    },
    banner: 'Selamat Natal',
    icon: '🎄'
  },
  {
    key: 'hari-ibu',
    name: 'Hari Ibu',
    start: '2026-12-22',
    end: '2026-12-22',
    theme: 'hari-ibu',
    image: '/special/hari-ibu.gif',
    color: '#f472b6',
    animation: 'ibu-flowers',
    cssVars: {
      '--bg-primary': '#fdf2f8',
      '--color-primary': '#f472b6',
      '--color-primary-dark': '#be185d',
      '--color-primary-light': '#fce7f3',
      '--theme-accent': '#fbbf24',
    },
    banner: 'Selamat Hari Ibu',
    icon: '👩‍👧‍👦'
  }
];

export function getSpecialTheme(date = new Date()) {
  const d = new Date(date.toISOString().slice(0, 10));
  for (const event of SPECIAL_DAYS) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    if (d >= start && d <= end) return event;
  }
  return null;
}

export { SPECIAL_DAYS };
