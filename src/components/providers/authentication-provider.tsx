import config from "src/app/config";
import { authAtom, userProfileAtom } from "src/atoms/auth";
import { useAtom, useSetAtom } from "jotai";
import Keycloak from "keycloak-js";
import { ReactNode, useCallback, useEffect } from "react";
import { avatarsAtom, personsAtom } from "src/atoms/person";
import { useApi, useLambdasApi } from "src/hooks/use-api";

interface Props {
  children: ReactNode;
}

const keycloak = new Keycloak(config.auth);

/**
 * Provides Keycloak authentication functions, such as login and logout
 */
const AuthenticationProvider = ({ children }: Props) => {
  const [auth, setAuth] = useAtom(authAtom);
  const setUserProfile = useSetAtom(userProfileAtom);
  const setPersons = useSetAtom(personsAtom);
  const setAvatars = useSetAtom(avatarsAtom);
  const { personsApi } = useApi();
  const { slackAvatarsApi } = useLambdasApi();

  const updateAuthData = useCallback(() => {
    setAuth({
      token: keycloak?.tokenParsed,
      tokenRaw: keycloak?.token,
      logout: () => keycloak?.logout({ redirectUri: window.location.origin })
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
      keycloak.onAuthRefreshSuccess = () => {
        updateAuthData();
      };

      keycloak.onAuthError = (error) => {
        console.error(error);
      };
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

      const keycloakInitialized = await keycloak.init({
        onLoad: "check-sso",
        checkLoginIframe: false
      });

      if (!keycloakInitialized) {
        await keycloak.login();
      }
    } catch (error) {
      console.error(error);
    }
  }, [auth]);

  /**
   * Sets the logged in timebank person from keycloak ID into global state
   */
  const getPersonsList = async () => {
    const fetchedPersons = await personsApi.listPersons({ active: true });
    setPersons(fetchedPersons);
  };

  /**
   * fetchs avatars
   */
  const getSlackAvatars = async () => {
    const fetchedAvatars = await slackAvatarsApi.slackAvatar();
    setAvatars(fetchedAvatars);
  };

  useEffect(() => {
    if (auth) {
      getPersonsList();
      getSlackAvatars();
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
