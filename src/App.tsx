import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorScreen from "./components/screens/error-screen";
import AuthenticationProvider from "./components/providers/authentication-provider";
import ErrorHandler from "./components/contexts/error-handler";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import VacationRequestsScreen from "./components/screens/vacation-requests/vacation-requests-screen";
import { useAtomValue } from "jotai";
import { languageAtom } from "./atoms/languageAtom";
import Header from "./components/header/header";
import HomeScreen from "./components/screens/home/home-screen";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

/**
 * Application component
 *
 */
const App = () => {
  useAtomValue(languageAtom);
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
          path: "/vacations",
          element: <VacationRequestsScreen />,
          errorElement: <ErrorScreen />
        }
      ]
    }
  ]);

  return (
    <div className="App">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <ErrorHandler>
            <AuthenticationProvider>
              <RouterProvider router={router} />
            </AuthenticationProvider>
          </ErrorHandler>
        </ThemeProvider>
      </LocalizationProvider>
    </div>
  );
};

export default App;
