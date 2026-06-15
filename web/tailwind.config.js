/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{svelte,js,ts}'],
  theme: {
    extend: {
      colors: {
        ox: {
          bg: '#09090b',
          surface: '#0f0f11',
          card: '#141416',
          elevated: '#1a1a1d',
          hover: '#1f1f23',
          active: '#27272b',
          border: 'rgba(255,255,255,0.07)',
          'border-light': 'rgba(255,255,255,0.12)',
          dim: '#3f3f46',
          muted: '#71717a',
          subtle: '#a1a1aa',
          text: '#d4d4d8',
          bright: '#fafafa',
          danger: '#ef4444',
          'danger-soft': 'rgba(239,68,68,0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        ox: '10px',
        'ox-lg': '14px',
        'ox-sm': '6px',
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'scale-in': 'scale-in 0.18s ease-out',
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(8px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: 0, transform: 'scale(0.97)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
