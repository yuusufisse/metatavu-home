import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import ErrorPage from "./components/screens/error-page";
import AuthenticationProvider from "./components/providers/authentication-provider";
import { useState } from "react";
import { type KeycloakProfile, type KeycloakTokenParsed } from "keycloak-js";

export interface Auth {
  token: KeycloakTokenParsed | undefined
  tokenRaw: string | undefined
  logout: () => void
}

/**
 * Application component
 *
 */
function App () {
  const [auth, setAuth] = useState<Auth>();
  const [userProfile, setUserProfile] = useState<KeycloakProfile | undefined>(undefined);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardScreen auth={auth!}/>,
      errorElement: <ErrorPage />
    }
  ]);

  return (
    <div className="App">
      <AuthenticationProvider
        auth={auth}
        setAuth={setAuth}
        userProfile={userProfile}
        setUserProfile={setUserProfile}>
        <RouterProvider router={router}/>
      </AuthenticationProvider>
    </div>
  );
}

export default App;