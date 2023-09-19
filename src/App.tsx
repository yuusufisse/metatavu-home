import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import LocaleToggle from "./components/layout-components/localization-buttons";
import ErrorScreen from "./components/screens/error-screen";
import AuthenticationProvider from "./components/providers/authentication-provider";
import ErrorHandler from "./components/contexts/error-handler";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import BalanceScreen from "./components/screens/timebank/balance-screen";
import { useAtomValue } from "jotai";
import { languageAtom } from "./atoms/languageAtom";

/**
 * Application component
 *
 */
const App = () => {
  useAtomValue(languageAtom);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardScreen />,
      errorElement: <ErrorScreen />
    },
    {
      path: "/timebank",
      element: <BalanceScreen />,
      errorElement: <ErrorScreen />
    }
  ]);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ErrorHandler>
          <AuthenticationProvider>
            <LocaleToggle />
            <RouterProvider router={router} />
          </AuthenticationProvider>
        </ErrorHandler>
      </ThemeProvider>
    </div>
  );
};

export default App;
