/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#17cf54",
          dark: "#12a341",
          light: "#22ff66",
          glow: "rgba(23, 207, 84, 0.15)",
        },
        danger: "#cf3617",
        "albion-dark": "#0b0e0c",
        "albion-panel": "#131a16",
        "albion-card": "#1a241f",
        "albion-border": "#28352d",
        "albion-border-light": "#3a4d41",
        "albion-text": "#e8f5ed",
        "albion-muted": "#9db5a6",
        green: {
          500: "#17cf54",
          600: "#12a341",
          700: "#0e8230",
          800: "#0a6123",
          900: "#064016",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Noto Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
