/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        bg1: 'url(/images/bg.jpg)',
      },
      colors: {
        primary: {
          DEFAULT: '#4CBD97 ', // رنگ رس به عنوان پرامری
        },
        secondary: {
          DEFAULT: '#6B7280', // خاکستری به عنوان سکندری
        },
        third: {
          800: '#003F3F', // آبی نفتی
        },
        fourth: {
          300: '#99FF99', // سبز ملایم
        },
      },
    },
  },
  plugins: [],
}
