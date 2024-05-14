import postcssImport from "postcss-import";
import postcssNesting from "postcss-nesting";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    postcssImport, // Handle @import statements
    postcssNesting, // Enable nesting syntax
    tailwindcss, // Include Tailwind CSS
    autoprefixer, // Add vendor prefixes
    // Add other plugins if needed
  ],
};
