import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import ErrorPage from "./components/screens/error-page";

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
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;