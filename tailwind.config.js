const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      xs: "320px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
