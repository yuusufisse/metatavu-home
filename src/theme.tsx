import { Theme, ToggleButtonGroup, createTheme, styled } from "@mui/material";
import NunitoSans from "../resources/fonts/NunitoSans.ttf";

export const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#222"
    },
    secondary: {
      main: "#f78da7"
    }
  },
  typography: {
    fontFamily: "Nunito Sans",
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
      `
    },
    MuiAppBar: {
      defaultProps: {
        color: "default"
      },
      styleOverrides: {
        root: {
          top: "1em",
          borderRadius: 15
        }
      }
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          height: 48,
          width: 48
        }
      }
    },
    MuiCard: {
      defaultProps: {
        elevation: 4
      },
      styleOverrides: {
        root: {
          backgroundColor: "#f5f5f5"
        }
      }
    }
  },
  shape: {
    borderRadius: 15
  }
});

/**
 * Styled toggle button group component for language switching
 */
export const LanguageButtons = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(1),
    border: 0,
    width: 48,
    height: 48,
    "&.Mui-disabled": {
      border: 0
    },
    "&:not(:first-of-type)": {
      borderRadius: "50%"
    },
    "&:first-of-type": {
      borderRadius: "50%"
    }
  }
}));