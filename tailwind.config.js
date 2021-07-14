var defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  prefix: '',
  mode: 'jit',
  purge: {
    enabled: true,
    content: ['./src/app/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  },
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        xs: '460px',
      },
      boxShadow: {
        floating: '-13px 14px 40px -16px rgb(0 0 0 / 89%)',
      },
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        'primary-10': 'var(--primary-10)',
        dark: {
          50: 'var(--dark-50)',
          500: 'var(--dark-500)',
          700: 'var(--dark-700)',
          800: 'var(--dark-800)',
          900: 'var(--dark-900)',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: '#333',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: 'var(--primary)',
              },
            },
          },
          dark: {
            color: theme('colors.gray.50'),
            a: {
              color: theme('colors.dark.50'),
              '&:hover': {
                color: theme('colors.white'),
              },
            },
          },
        },
      }),
    },
    customForms: (theme) => ({
      default: {
        'input, textarea, checkbox, radio': {
          borderWidth: '1px',
          borderRadius: theme('borderRadius.md'),
          borderColor: theme('colors.gray.300'),
          '&:focus': {
            borderColor: 'var(--primary)',
          },
        },
        'checkbox,radio': {
          color: 'var(--primary)',
        },
      },
    }),
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
};
