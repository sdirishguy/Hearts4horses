import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barn: {
          900: "#4B352A", // primary
          700: "#6a4a3b",
          500: "#8b6a58",
        },
        copper: {
          600: "#CA7842",
          500: "#d88a57",
          400: "#e39b6d",
        },
        sage: {
          500: "#B2CD9C",
          400: "#c1d7b1",
        },
        butter: {
          300: "#F0F2BD",
          200: "#f6f7cf",
        }
      },
      fontFamily: {
        display: ["'Inter'", "ui-sans-serif", "system-ui"],
        body: ["'Inter'", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,.08)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    },
  },
  plugins: [],
};

export default config;
