import { KeycloakTokenParsed } from "keycloak-js";

export default class UserRoleUtils {
  public static isAdmin = (accessToken?: KeycloakTokenParsed): boolean => {
    return !!accessToken?.realm_access && accessToken.realm_access?.roles.includes("admin");
  };
}
