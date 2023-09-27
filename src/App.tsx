import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorScreen from "./components/screens/error-screen";
import AuthenticationProvider from "./components/providers/authentication-provider";
import ErrorHandler from "./components/contexts/error-handler";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { useAtomValue } from "jotai";
import { languageAtom } from "./atoms/languageAtom";
import Header from "./components/header/header";
import HomeScreen from "./components/screens/home/home-screen";

/**
 * Application component
 *
 */
const App = () => {
  useAtomValue(languageAtom);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header />,
      children: [
        {
          path: "/",
          element: <HomeScreen />,
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
            <CssBaseline>
              <RouterProvider router={router} />
            </CssBaseline>
          </AuthenticationProvider>
        </ErrorHandler>
      </ThemeProvider>
    </div>
  );
};

export default App;
