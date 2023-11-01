import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthenticationProvider from "./components/providers/authentication-provider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import VacationRequestsScreen from "./components/screens/vacation-requests/vacation-requests-screen";
import BalanceScreen from "./components/screens/timebank-screen";
import { useAtomValue } from "jotai";
import { languageAtom } from "./atoms/languageAtom";
import HomeScreen from "./components/screens/home-screen";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import strings from "./localization/strings";
import Layout from "./components/layout/layout";
import ErrorHandler from "./components/contexts/error-handler";
import ErrorScreen from "./components/screens/error-screen";

/**
 * Application component
 */
const App = () => {
  const language = useAtomValue(languageAtom);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomeScreen />
        },
        {
          path: "/vacations",
          element: <VacationRequestsScreen />
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
        <ErrorHandler>
          <AuthenticationProvider>
            <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale={language}>
              <CssBaseline>
                <RouterProvider router={router} />
              </CssBaseline>
            </LocalizationProvider>
          </AuthenticationProvider>
        </ErrorHandler>
      </ThemeProvider>
    </div>
  );
};

export default App;
