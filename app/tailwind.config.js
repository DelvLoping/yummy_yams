import formsPlugin from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme"; // Use import instead of require

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "#02010A",
        "background-secondary": "#000000",
        //primary: "#854442",
        primary: "#3b82f6",
      },
    },
  },

  plugins: [formsPlugin], // Use imported variable directly
};
