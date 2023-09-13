import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import LocaleToggle from "./components/locale-toggle/LocaleToggle";
import ErrorScreen from "./components/screens/error-screen";
import AuthenticationProvider from "./components/providers/authentication-provider";
import ErrorHandler from "./components/contexts/error-handler";

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
        <ErrorHandler>
          <AuthenticationProvider>
            <LocaleToggle />
            <RouterProvider router={router}  />
          </AuthenticationProvider>
        </ErrorHandler>
    </div>
  );
}

export default App;