import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-lato)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#037EF3',
          dark: '#0262C2',
        },
        partner: {
          from: '#2563EB',
          to: '#7E22CE',
        },
        accent: {
          yellow: '#FACC15',
          'yellow-dark': '#EAB308',
          green: '#22C55E',
          purple: '#9333EA',
          'purple-dark': '#7E22CE',
          orange: '#F97316',
        },
        surface: {
          dark: '#0F172A',
          light: '#F8FAFC',
          light2: '#F1F5F9',
          cream: '#FAF5EF',
        },
        border: {
          DEFAULT: '#E2E8F0',
          strong: '#CBD5E1',
        },
        ink: {
          heading: '#1E293B',
          body: '#64748B',
        },
      },
      borderRadius: {
        card: '12px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #037EF3 0%, #0262C2 100%)',
        'gradient-partner': 'linear-gradient(135deg, #2563EB 0%, #7E22CE 100%)',
        'gradient-youth-cta': 'linear-gradient(135deg, #037EF3 0%, #F97316 100%)',
      },
      fontSize: {
        h1: ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '800' }],
        'h1-mobile': ['32px', { lineHeight: '38px', letterSpacing: '-0.02em', fontWeight: '800' }],
        h2: ['36px', { lineHeight: '44px', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '32px', fontWeight: '700' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

export default config;
