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
        "primary": "#FFFFF0", // Ivory
        "secondary": "#FFD700", // Gold
        "accent": "#FF6347", // Tomato
        "neutral": "#F0F8FF", // Alice Blue
        "base-100": "#FFFAF0", // Floral White
        "info": "#FF1493", // Deep Pink
        "success": "#98FB98", // Pale Green
        "warning": "#FF4500", // Orange Red
        "error": "#FFDAB9", // Peach Puff
      },
    }],
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root",
  }
};
export default config;
