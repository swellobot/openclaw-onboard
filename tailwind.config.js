/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "ui-sans-serif", "system-ui"],
        body: ["Sora", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0,0,0,0.18)",
      },
      colors: {
        night: {
          900: "#0a0b0f",
          800: "#12131a",
          700: "#1a1b25",
          600: "#252636",
        },
        ice: {
          900: "#e9eef5",
          800: "#d6dee8",
        },
        accent: {
          500: "#60a5fa",
          600: "#3b82f6",
        },
        lime: {
          500: "#a3e635",
        }
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 400ms ease-out",
        slideIn: "slideIn 400ms ease-out",
      },
    },
  },
  plugins: [],
};
