/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        odoo: {
          primary: "#714B67",
          primaryHover: "#5c3d54",
          secondary: "#00A09D",
          bg: "#F9FAFB",
          card: "#FFFFFF",
          text: "#212529"
        }
      }
    },
  },
  plugins: [],
};
