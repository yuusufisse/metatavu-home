import { useAtomValue } from "jotai";
import { authAtom } from "../atoms/auth";
import { useLocation } from "react-router";

/**
 * User Role Utils class
 */

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export  default class UserRoleUtils {
  /**
   * Check if the logged-in user has an admin role
   *
   * @returns boolean, indicates if user is admin
   */
  public static isAdmin = () => {
    const accessToken = useAtomValue(authAtom)?.token;

    if (!accessToken?.realm_access) return false;

    return accessToken.realm_access.roles.includes("admin");
  };

  /**
   * Check if the logged-in user has an developer role
   *
   * @returns boolean, indicates if user is developer
   */
  public static readonly isDeveloper = () => {
    const accessToken = useAtomValue(authAtom)?.token;

    if (!accessToken?.realm_access) return false;

    return accessToken.realm_access.roles.includes("developer");
  };

  /**
   * Check if the logged-in user has admin role and is in admin route
   *
   * @returns boolean, indicates if user is admin and in admin route
   */
  public static adminMode = () => {
    const { pathname } = useLocation();
    const adminPathname = pathname.startsWith("/admin");

    return UserRoleUtils.isAdmin() && adminPathname;
  };

  /**
   * Check if the logged-in user has developer role and is in admin route
   *
   * @returns boolean, indicates if user is developer
   */
  public static readonly developerMode = () => {
    return UserRoleUtils.isDeveloper();
  };
}
