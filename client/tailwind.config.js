/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ef495d",
      },
      fontFamily: {
        plain: ["Plain", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
};