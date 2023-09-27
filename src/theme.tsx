import { Theme, createTheme } from "@mui/material";
import NunitoSans from "../resources/fonts/NunitoSans.ttf";

export const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#222",
    },
    secondary: {
      main: "#f78da7"
    },
  },
  typography: {
    fontFamily: 'Nunito Sans',
    fontWeightRegular: 400,
    fontSize: 15
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Nunito Sans';
          src: local('NunitoSans'), url(${NunitoSans}) format('truetype');
        }
      `,
    },
    MuiAppBar: {
      defaultProps: {
        color: 'default',
      },
      styleOverrides: {
        root: {
          top: "1em",
          borderRadius: 15,
        },
      },
      
    },
    MuiTooltip: {
      defaultProps:{
        arrow: true,
      }
    },
  },
  shape: {
    borderRadius: 15,
  },
});
