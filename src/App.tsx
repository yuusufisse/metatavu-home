import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import ErrorPage from "./components/screens/error-page";
import LanguageSwitcher, { LocaleProvider } from "./localization/LanguageSwitcher";

/**
 * Implementing browser router
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardScreen />,
    errorElement: <ErrorPage />
  }
]);

/**
 * Application component
 *
 */
function App () {
  return (
    <div className="App">
      <LocaleProvider>
        <LanguageSwitcher />
        <RouterProvider router={router} />
      </LocaleProvider>
    </div>
  );
}

export default App;