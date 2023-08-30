import { type ReactElement } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import ErrorPage from "./components/screens/error-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardScreen/>,
    errorElement: <ErrorPage/>
  }
]);

/**
 * Application component
 * 
 * @returns ReactElement
 */
export default function App (): ReactElement {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}