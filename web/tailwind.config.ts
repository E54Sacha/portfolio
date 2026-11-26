import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ultra: "#2E2BFF",
        ink: "#1B1446",
        paper: "#FBFBFE",
        tangerine: "#FF6A1F",
        bubblegum: "#FF4FA3",
        sunflower: "#FFD23F",
        mint: "#22C3A6",
        lilac: "#B9B6FF",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "72rem",
      },
      keyframes: {
        drop: {
          "0%": { opacity: "0", transform: "translateY(-40px) rotate(var(--r))" },
          "100%": { opacity: "1", transform: "translateY(0) rotate(var(--r))" },
        },
      },
      animation: {
        drop: "drop 600ms cubic-bezier(.2,.9,.3,1.2) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
