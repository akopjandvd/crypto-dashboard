export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class", 
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
