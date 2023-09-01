import config from "../../app/config";
import Keycloak from "keycloak-js";
import { type Dispatch, type SetStateAction, useCallback, useEffect } from "react";
import { type Auth } from "../../App";

interface Props {
  auth: Auth | undefined
  setAuth: Dispatch<SetStateAction<Auth | undefined>>
  userProfile: Keycloak.KeycloakProfile | undefined
  setUserProfile: Dispatch<SetStateAction<Keycloak.KeycloakProfile | undefined>>
  children: JSX.Element
}

const keycloak = new Keycloak(config.auth);
/**
* Provides Keycloak authentication functions, such as login and logout
*/
const AuthenticationProvider = ({ auth, setAuth, setUserProfile, children }: Props) => {
  const updateAuthData = useCallback(() => {
    console.log(auth);
    setAuth({
      token: keycloak.tokenParsed!,
      tokenRaw: keycloak.token!,
      logout: () => keycloak.logout({ redirectUri: window.location.origin })
    });
    setUserProfile(keycloak.profile);
  }, [auth]);

  const clearAuthData = useCallback(() => {
    setAuth(undefined);
    setUserProfile(undefined);
  }, [auth]);

  const initAuth = useCallback(async (): Promise<void> => {
    try {
      keycloak.onTokenExpired = () => keycloak.updateToken(5);

      keycloak.onAuthRefreshError = () => keycloak.login();
      keycloak.onAuthRefreshSuccess = () => { updateAuthData(); };

      keycloak.onAuthError = error => { console.error(error); };
      keycloak.onAuthSuccess = async () => {
        try {
          await keycloak.loadUserProfile();
        } catch (error) {
          console.error("Could not load user profile", error);
        }

        updateAuthData();
      };

      keycloak.onAuthLogout = () => {
        clearAuthData();
        keycloak.login();
      };

      await keycloak.init({
        onLoad: "login-required",
        checkLoginIframe: false
      });
    } catch (error) {
      console.error(error);
    }
  }, [auth]);

  /**
   * Initializes authentication when component mounts
   */
  useEffect(() => {
    if (keycloak.authenticated === undefined) initAuth();
  }, []);

  if (!auth) return null;

  return children;
};

export default AuthenticationProvider;