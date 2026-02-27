import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7faf8",
        card: "#ffffff",
        primary: "#2f6f61",
        muted: "#d9ebe4",
        accent: "#89b7a9"
      }
    }
  },
  plugins: []
};

export default config;
