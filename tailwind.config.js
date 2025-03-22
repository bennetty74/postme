module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        melad: {
          100: "#FDFBF7", // Very Light Cream (lighter, softer background)
          200: "#F6ECE3", // Pale Warm Sand (subtle, airy tone)
          300: "#C9B698", // Muted Gold (unchanged, elegant mid-tone)
          400: "#A68A64", // Sage-Tinted Taupe (unchanged, earthy mid-tone)
          500: "#7D552F", // Rich Terracotta (unchanged, deep warm shade)
          600: "#5E4032", // Dark Mocha (unchanged, richer brown)
          700: "#3F2C22", // Deep Espresso (unchanged, darkest contrast)
        },
      },
    },
  },
  plugins: [
    // require("@tailwindcss/typography"),
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};