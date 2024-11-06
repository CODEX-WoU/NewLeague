/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

const colors = { primary: "#ef495d" };

export default {
  content: ["./index.html", "./src/**/*.{tsx,jsx}"],
  theme: {
    extend: {
      colors: colors,
      fontFamily: {
        plain: ["Plain", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          ...colors,
        },
      },
    ],
  },
};
