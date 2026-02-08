// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#114AB1',
        secondary: '#6793AC',
        accent: '#E4580B',
        dark: '#1a213d',
        border: '#dcdcdc',
      },
      borderRadius: {
        md: '12px',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
