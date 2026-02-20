/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', '"General Sans"', 'ui-sans-serif', 'system-ui'],
        body: ['"Satoshi"', '"General Sans"', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: {
          deep: '#09090b',
          surface: '#111113',
          elevated: '#1a1a1f',
          hover: '#232329',
        },
        border: {
          subtle: '#27272a',
          visible: '#3f3f46',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          glow: 'rgba(245, 158, 11, 0.15)',
          subtle: 'rgba(245, 158, 11, 0.08)',
        },
        success: '#22c55e',
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'section': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'subtitle': ['clamp(1.125rem, 2vw, 1.375rem)', { lineHeight: '1.6' }],
      },
      spacing: {
        'section': 'clamp(5rem, 12vw, 10rem)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow': '0 0 60px rgba(245, 158, 11, 0.12)',
        'glow-sm': '0 0 30px rgba(245, 158, 11, 0.08)',
        'card': '0 4px 40px rgba(0, 0, 0, 0.3)',
        'elevated': '0 8px 60px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #f59e0b, #ef4444)',
        'gradient-surface': 'linear-gradient(180deg, #111113 0%, #09090b 100%)',
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        waveform: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '20px' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 500ms ease-out',
        slideInLeft: 'slideInLeft 500ms ease-out',
        slideInRight: 'slideInRight 500ms ease-out',
        pulse: 'pulse 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        waveform: 'waveform 0.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
