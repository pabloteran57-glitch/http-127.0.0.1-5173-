import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#05070b",
        steel: "#0f1621",
        fog: "#aeb6c4",
        line: "#243246",
        signal: "#6ce8ff",
        power: "#f6b84c",
        control: "#6ee7a8",
        caution: "#ff8673",
        lidar: "#d4a5ff"
      },
      boxShadow: {
        panel: "0 24px 80px rgba(0, 0, 0, 0.34)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(174, 182, 196, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(174, 182, 196, 0.06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
} satisfies Config;

