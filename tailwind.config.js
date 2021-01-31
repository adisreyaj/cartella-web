const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  prefix: '',
  purge: {
    content: ['./src/app/**/*.{html,ts}', './projects/ui/**/*.{html,ts}'],
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-dark': 'var(--primary-dark)',
        'primary-10': 'var(--primary-10)',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      typography: {
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
        },
      },
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
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
};
