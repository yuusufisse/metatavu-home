import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import LanguageSwitcher, { LocaleProvider } from "./localization/LanguageSwitcher";
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
      <LocaleProvider>
      <ErrorHandler>
        <AuthenticationProvider>
        <LanguageSwitcher />
        <RouterProvider router={router}  />
        </AuthenticationProvider>
      </ErrorHandler>
      </LocaleProvider>
    </div>
  );
}

export default App;