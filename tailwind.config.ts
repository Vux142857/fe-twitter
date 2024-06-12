import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      'serif': 'Dancing Script',
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      mytheme: {
        "primary": "#FFFFFF", // White
        "secondary": "#000000", // Black
        "accent": "#A9A9A9", // Gray
        "neutral": "#000000", // Black
        "base-100": "#FFFFFF", // White
        "info": "#A9A9A9", // Gray
        "success": "#FFFFFF", // White
        "warning": "#FFFFFF", // White
        "error": "#000000", // Black
      },
    }],
    // themes: ['retro'],
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root",
  }
};
export default config;
