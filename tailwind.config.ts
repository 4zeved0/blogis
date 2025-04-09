const plugin = require('tailwindcss/plugin')

module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        textMuted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addBase }: any) {
      addBase({
        ':root': {
          '--color-bg': '30 27 46',            // #1E1B2E
          '--color-surface': '42 34 58',       // #2A223A
          '--color-primary': '127 90 240',     // #7F5AF0
          '--color-text': '224 222 244',       // #E0DEF4
          '--color-text-muted': '180 178 197', // #B4B2C5
          '--color-border': '63 59 92',        // #3F3B5C
        },
      })
    }),
  ],
}
