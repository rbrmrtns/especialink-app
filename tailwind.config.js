/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
      extend: {
        colors: {
          "dark-pink" : "#FB6F93",
          "light-beige" : "#F5EDE5",
          "dark-beige" : "#C8BBA8",
          "pastel-green" : "#E2E0C1",

        // Blue
          "light-blue" : "#F7FDFF",
          "blue" : "#4F9EC5",

        //   Pink
          "pink" : "#FB6F93",
          "pink-light" : "#FFFAFB",
          "pastel-pink": "#E7B1AF",
          "pinkie" : "#F5EBEF",

          //Yellow
          "yellow" : "#FFFEFB",
          "dark-yellow" : "#D59630",

          //Orange
          "orange": "#ffbf00",
          "dark-orange": "#ff7900"
        },
        width: {
          '18': '4.5rem',
        },
        height:{
          '18': '4.5rem',
        },
        fontSize: {
          xxs: ['10px', '14px']
        },
        fontFamily: {
          montLight: ['Montserrat_200ExtraLight'],
          montRegular: ['Montserrat_400Regular'],
          montMedium: ['Montserrat_500Medium'],
          montSemibold: ['Montserrat_600SemiBold'],
          montExtrabold: ['Montserrat_800ExtraBold'],
        },
      },
  },
  plugins: [],
};