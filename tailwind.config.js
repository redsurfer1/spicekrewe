/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'spice-purple': 'var(--sk-purple)',
        'spice-blue': 'var(--sk-blue)',
        'sk-purple': 'var(--sk-purple)',
        'sk-purple-dark': 'var(--sk-purple-dark)',
        'sk-purple-light': 'var(--sk-purple-light)',
        'sk-purple-mid': 'var(--sk-purple-mid)',
        'sk-blue': 'var(--sk-blue)',
        'sk-blue-dark': 'var(--sk-blue-dark)',
        'sk-blue-light': 'var(--sk-blue-light)',
        'sk-gold': 'var(--sk-gold)',
        'sk-gold-light': 'var(--sk-gold-light)',
        'sk-navy': 'var(--sk-navy)',
        'sk-navy-mid': 'var(--sk-navy-mid)',
        'sk-muted-purple': 'var(--sk-muted-purple)',
        'sk-body-bg': 'var(--sk-body-bg)',
        'sk-card-border': 'var(--sk-card-border)',
      },
      borderRadius: {
        'sk-sm': 'var(--sk-radius-sm)',
        'sk-md': 'var(--sk-radius-md)',
        'sk-lg': 'var(--sk-radius-lg)',
        'sk-pill': 'var(--sk-radius-pill)',
      },
    },
  },
  plugins: [],
};
