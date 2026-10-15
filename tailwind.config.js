/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      /**
       * Colours resolve through CSS variables rather than fixed hex, so a
       * section can flip its whole palette by adding `.on-dark`. `ink` is
       * always the surface and `bone` always the type — only what they point
       * at changes. That is what lets paper reading sections and near-black
       * cinematic sections share one set of components.
       */
      colors: {
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          800: "rgb(var(--c-ink-800) / <alpha-value>)",
          700: "rgb(var(--c-ink-700) / <alpha-value>)",
          600: "rgb(var(--c-ink-600) / <alpha-value>)",
          500: "rgb(var(--c-ink-500) / <alpha-value>)",
        },
        bone: {
          DEFAULT: "rgb(var(--c-bone) / <alpha-value>)",
          600: "rgb(var(--c-bone-600) / <alpha-value>)",
          500: "rgb(var(--c-bone-500) / <alpha-value>)",
          400: "rgb(var(--c-bone-400) / <alpha-value>)",
        },
        steel: {
          DEFAULT: "rgb(var(--c-steel) / <alpha-value>)",
          400: "rgb(var(--c-steel-400) / <alpha-value>)",
          300: "rgb(var(--c-steel-300) / <alpha-value>)",
          600: "rgb(var(--c-steel-600) / <alpha-value>)",
          700: "rgb(var(--c-steel-700) / <alpha-value>)",
        },
        sand: { DEFAULT: "rgb(var(--c-sand) / <alpha-value>)" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
        sans:    ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: { tightest: "-0.045em", mega: "-0.055em" },
      fontSize: {
        xs: ["13px", { lineHeight: "1.45" }],
        sm: ["15px", { lineHeight: "1.6" }],
        base: ["17px", { lineHeight: "1.65" }],
      },
      screens: { xs: "480px" },
    },
  },
  plugins: [],
};
