import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#0A4D68',
          50: '#D6EAF8',
          100: '#AED6F1',
          200: '#85C1E9',
          300: '#5DADE2',
          400: '#3498DB',
          500: '#1E7EBF',
          600: '#1565A6',
          700: '#0D6090',
          800: '#0A4D68',
          900: '#052D44',
          foreground: 'hsl(var(--primary-foreground))',
        },
        gold: {
          DEFAULT: '#D4AF37',
          100: '#FEFCF4',
          200: '#FBF8E8',
          300: '#F8F0C5',
          400: '#F4E5A1',
          500: '#F0D97D',
          600: '#DAA520',
          700: '#D4AF37',
          800: '#B8860B',
          900: '#8B6914',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        'gradient-cda': 'linear-gradient(135deg, #0A4D68 0%, #1565A6 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #F0D97D 100%)',
        'gradient-premium': 'linear-gradient(135deg, #052D44 0%, #0A4D68 50%, #1565A6 100%)',
      },
      boxShadow: {
        'premium': '0 30px 60px -15px rgba(5, 45, 68, 0.3), 0 10px 20px -10px rgba(212, 175, 55, 0.2)',
        'gold': '0 10px 30px -5px rgba(212, 175, 55, 0.3)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
