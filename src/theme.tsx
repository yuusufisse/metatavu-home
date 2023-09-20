import { createTheme } from "@mui/material";
import NunitoSans from "../resources/fonts/NunitoSans.ttf";

export const theme = createTheme({
  typography: {
    fontFamily: "Nunito Sans",
    fontWeightRegular: 300,
    fontSize: 15
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Nunito Sans';
          font-style: sans-serif;
          font-display: swap;
          font-weight: 300;
          font-size: 2em;
          src: local('NunitoSans'), url(${NunitoSans}) format(truetype);
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `
    }
  },
  palette: {
    primary: {
      main: "#222"
    },
    secondary: {
      main: "#f78da7"
    }
  }
});
