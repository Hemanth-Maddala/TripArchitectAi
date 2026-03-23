// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // These strings MUST match the keys in your useFonts hook
        DancingScript: ["DancingScript"], 
        Lobster: ["Lobster"],
      },
    },
  },
  plugins: [],
}