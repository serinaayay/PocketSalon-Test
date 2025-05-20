/** @type {import('tailwindcss').Config} */
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#E7D4BF",
      },
    },
  },
  plugins: [],
};