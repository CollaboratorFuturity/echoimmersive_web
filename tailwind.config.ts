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
      },
    },
  },
  plugins: [],
} satisfies Config
