import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import LocaleToggle from "./components/localization-buttons/LocalizationButtons";
import ErrorScreen from "./components/screens/error-screen";
import AuthenticationProvider from "./components/providers/authentication-provider";
import ErrorHandler from "./components/contexts/error-handler";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";

/**
 * Application component
 *
 */
function App () {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardScreen />,
      errorElement: <ErrorScreen />
    }
  ]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ErrorHandler>
          <AuthenticationProvider>
            <LocaleToggle />
            <RouterProvider router={router}  />
          </AuthenticationProvider>
        </ErrorHandler>
      </ThemeProvider>
    </div>
  );
}

export default App;