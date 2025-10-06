
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#A41623",
          accent: "#F85E00",
        }
      }
    },
  },
  plugins: [],
}
