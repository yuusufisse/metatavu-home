import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthenticationProvider from "./components/providers/authentication-provider";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { useAtomValue } from "jotai";
import { languageAtom } from "./atoms/languageAtom";
import HomeScreen from "./components/screens/home/home-screen";
import Layout from "./components/layout/layout";
import ErrorHandler from "./components/contexts/error-handler";

/**
 * Application component
 */
const App = () => {
  useAtomValue(languageAtom);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomeScreen />
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
