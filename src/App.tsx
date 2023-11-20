import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthenticationProvider from "./components/providers/authentication-provider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import VacationRequestsScreen from "./components/screens/vacation-requests-screen";
import BalanceScreen from "./components/screens/timebank-screen";
import { useAtomValue } from "jotai";
import { languageAtom } from "./atoms/language";
import HomeScreen from "./components/screens/home-screen";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import Layout from "./components/layout/layout";
import ErrorHandler from "./components/contexts/error-handler";
import ErrorScreen from "./components/screens/error-screen";
import AdminScreen from "./components/screens/admin-screen";
import UserRoleUtils from "./utils/user-role-utils";
import strings from "./localization/strings";
import { Settings } from "luxon";
import { useMemo } from "react";

/**
 * Application component
 */
const App = () => {
  const language = useAtomValue(languageAtom);
  const admin = UserRoleUtils.isAdmin();

  /**
   * Admin route error screen component
   */
  const AdminRouteErrorScreen = () => (
    <ErrorScreen
      message={strings.adminRouteAccess.notAdmin}
      title={strings.adminRouteAccess.noAccess}
    />
  );

  useMemo(() => {
    Settings.defaultLocale = language;
  }, [language]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorScreen />,
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
          element: <BalanceScreen />
        }
      ]
    },
    {
      path: "/admin",
      element: <Layout />,
      errorElement: <ErrorScreen />,
      children: admin
        ? [
            {
              path: "/admin",
              element: <AdminScreen />
            },
            {
              path: "/admin/vacations",
              element: <VacationRequestsScreen />
            }
          ]
        : [
            {
              path: "/admin",
              element: <AdminRouteErrorScreen />
            },
            {
              path: "/admin/*",
              element: <AdminRouteErrorScreen />
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
