import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#037EF3',
          dark: '#1D4ED8',
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
          dark: '#1A1A1A',
          light: '#F9FAFB',
          light2: '#F8F9FA',
          cream: '#FAF5EF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#CED4DA',
        },
        ink: {
          heading: '#374151',
          body: '#6B7280',
        },
      },
      borderRadius: {
        card: '8px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #037EF3 0%, #1D4ED8 100%)',
        'gradient-partner': 'linear-gradient(135deg, #2563EB 0%, #7E22CE 100%)',
        'gradient-youth-cta': 'linear-gradient(135deg, #037EF3 0%, #F97316 100%)',
      },
      fontSize: {
        h1: ['48px', { lineHeight: '60px', letterSpacing: '-0.5px', fontWeight: '700' }],
        'h1-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.5px', fontWeight: '700' }],
        h2: ['36px', { lineHeight: '44px', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '32px', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};

export default config;
