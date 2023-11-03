import { useAtomValue } from "jotai";
import { KeycloakTokenParsed } from "keycloak-js";
import { authAtom } from "../atoms/auth";
import { useLocation } from "react-router";

/**
 * User Role Utils class
 */
export default class UserRoleUtils {
  /**
   * Check if the logged-in user has an admin role
   *
   * @param accessToken keycloak access token
   * @returns boolean
   */
  public static isAdmin = (accessToken?: KeycloakTokenParsed) => {
    return !!accessToken?.realm_access && accessToken.realm_access?.roles.includes("admin");
  };

  /**
   * Check if the logged-in user has admin role and is in admin route
   *
   * @returns boolean
   */
  public static adminMode = () => {
    const { pathname } = useLocation();
    const adminPathname = pathname.startsWith("/admin");
    const authToken = useAtomValue(authAtom)?.token;
    return UserRoleUtils.isAdmin(authToken) && adminPathname;
  };
}
