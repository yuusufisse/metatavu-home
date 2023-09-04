import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import ErrorPage from "./components/screens/error-page";
import AuthenticationProvider from "./components/providers/authentication-provider";

/**
 * Application component
 *
 */
function App () {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardScreen />,
      errorElement: <ErrorPage />
    }
  ]);

  return (
    <div className="App">
      <AuthenticationProvider>
        <RouterProvider router={router} />
      </AuthenticationProvider>
    </div>
  );
}

export default App;