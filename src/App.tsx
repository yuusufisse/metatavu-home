import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorScreen from "./components/screens/error-screen";
import AuthenticationProvider from "./components/providers/authentication-provider";
import ErrorHandler from "./components/contexts/error-handler";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import BalanceScreen from "./components/screens/timebank/balance-screen";
import { useAtomValue } from "jotai";
import { languageAtom } from "./atoms/languageAtom";
import Header from "./components/header/header";
import HomeScreen from "./components/screens/home/home-screen";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

/**
 * Application component
 *
 */
const App = () => {
  const language = useAtomValue(languageAtom);
  const router = createBrowserRouter([
    {
      element: <Header />,
      children: [
        {
          path: "/",
          element: <HomeScreen />,
          errorElement: <ErrorScreen />
        },
        {
          path: "/timebank",
          element: <BalanceScreen />,
          errorElement: <ErrorScreen />
        }
      ]
    }
  ]);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <ErrorHandler>
            <AuthenticationProvider>
              <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={language}>
                <RouterProvider router={router} />
              </LocalizationProvider>
            </AuthenticationProvider>
          </ErrorHandler>
        </CssBaseline>
      </ThemeProvider>
    </div>
  );
};

export default App;
