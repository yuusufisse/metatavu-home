import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import LocaleToggle from "./components/locale-toggle/LocaleToggle";
import ErrorScreen from "./components/screens/error-screen";
import AuthenticationProvider from "./components/providers/authentication-provider";
import ErrorHandler from "./components/contexts/error-handler";
import { Provider } from "jotai";

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
      <Provider>
        <ErrorHandler>
          <AuthenticationProvider>
            <LocaleToggle />
            <RouterProvider router={router}  />
          </AuthenticationProvider>
        </ErrorHandler>
      </Provider>
    </div>
  );
}

export default App;