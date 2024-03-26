// theme.ts

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";

// 3. extend the theme
const theme = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  colors: {
    brand: {
      darkMain: "#233064",
      lightMain: "#446ab3",
      darkSub: "#f04d48",
      lightSub: "#ffff",
    },
  },
});

export default theme;
