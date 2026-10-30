import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FFF9F2",
        "canvas-alt": "#F5EEE6",
        lotus: "#F3A5C7",
        lavender: "#C9B6ED",
        peacock: "#258CA7",
        leaf: "#69A981",
        saffron: "#F5C65E",
        maroon: "#812E48",
        ink: "#20243B",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
