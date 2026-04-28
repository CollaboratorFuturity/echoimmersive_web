import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-blue':           '#010440',
        'primary-blue':      '#2128A6',
        'light-blue':        '#3038D9',
        'highlight-purple':  '#8E72F2',
        'highlight-green':   '#7EF28F',
        // Official brand palette (from docs/branding/brand.css)
        'brand-cream':       '#F7F3E0',
        'brand-charcoal':    '#202124',
        'brand-lilac':       '#DA80FF',
        'brand-purple':      '#8843A3',
        'brand-plum':        '#5A4263',
      },
    },
  },
  plugins: [],
} satisfies Config
