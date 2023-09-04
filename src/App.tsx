import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardScreen from "./components/screens/dashboard/dashboard-screen";
import ErrorScreen from "./components/screens/error-screen";
import AuthenticationProvider from "./components/providers/authentication-provider";
import { useState } from "react";
import type { KeycloakProfile, KeycloakTokenParsed } from "keycloak-js";
import ErrorHandler from "./components/contexts/error-handler";

export interface Auth {
  token: KeycloakTokenParsed 
  tokenRaw: string
  logout: () => void
}

/**
 * Application component
 *
 */
function App () {
  const [auth, setAuth] = useState<Auth>();
  const [userProfile, setUserProfile] = useState<KeycloakProfile>();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardScreen auth={auth} />,
      errorElement: <ErrorScreen />
    }
  ]);

  return (
    <div className="App">
      <ErrorHandler>
        <AuthenticationProvider
          auth={auth}
          setAuth={setAuth}
          userProfile={userProfile}
          setUserProfile={setUserProfile}>
          <RouterProvider router={router} />
        </AuthenticationProvider>
      </ErrorHandler>
    </div>
  );
}

export default App;