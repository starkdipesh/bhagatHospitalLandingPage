/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          bg: 'rgb(var(--color-background) / <alpha-value>)',
          surface: 'rgb(var(--color-surface) / <alpha-value>)',
          surfaceElevated: 'rgb(var(--color-surface-soft) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',
          borderGlow: 'rgb(var(--color-brand) / <alpha-value>)',
          navy: 'rgb(var(--color-primary) / <alpha-value>)',
          cyan: 'rgb(var(--color-brand) / <alpha-value>)',
          cyanGlow: 'rgb(var(--color-brand-light) / <alpha-value>)',
          teal: 'rgb(var(--color-brand-light) / <alpha-value>)',
          light: 'rgb(var(--color-primary) / <alpha-value>)',
          muted: 'rgb(var(--color-secondary) / <alpha-value>)',
          emergency: 'rgb(var(--color-emergency) / <alpha-value>)',
          emergencyGlow: 'rgb(var(--color-emergency) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 35px -5px rgba(0, 163, 200, 0.35)',
        'glow-cyan-sm': '0 0 15px -2px rgba(0, 163, 200, 0.4)',
        'glow-coral': '0 0 24px -5px rgba(214, 69, 80, 0.28)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.25s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.12)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.08)' },
          '70%': { transform: 'scale(1)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        }
      }
    },
  },
  plugins: [],
}
