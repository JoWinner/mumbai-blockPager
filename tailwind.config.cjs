/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },
    extend: {
      screens: {
        xs: "360px",
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }
      },
      colors: {
        // "field-bg": "#e2e2f9",
        "field-bg": "#f3f3fd",
        blue: "#456aef",
        "deep-blue": "#2546bd",
        black: "#222328",
        "dark-black": "#141313",
        green: "#13ce66",
        "deep-green": "#127812",
        red: "#ec1708",
        "gray-dark": "#273444",
        gray: "#8492a6",
        "gray-light": "#d3dce6",
      },
      boxShadow: {
        card: "rgba(0, 0, 0, 0.38) 0px 19px 38px, rgba(0, 0, 0, 0.30) 0px 15px 12px;",
        cardhover:
          "0px 0px 0px 4px rgba(0, 0, 0, 0.2),0px 0px 0px 2px rgba(0, 0, 0, 0.5)",
      },

      keyframes: {
        "slide-in": {
          "0%": {
            "-webkit-transform": "translateX(120%)",
            transform: "translateX(120%)",
          },
          "100%": {
            "-webkit-transform": "translateX(0%)",
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 0.5s ease-out",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("tailwindcss-highlights"),
  ],
};
