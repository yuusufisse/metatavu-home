import { useAtomValue } from "jotai";
import { authAtom } from "../../../atoms/auth";
import { Container, Typography } from "@mui/material";
import { KeycloakTokenParsed } from "keycloak-js";

const AdminScreen = () => {
  const authToken = useAtomValue(authAtom)?.token;

  const isAdmin = (accessToken?: KeycloakTokenParsed): boolean => {
    if (!!accessToken?.realm_access) {
      console.log(accessToken.realm_access?.roles);
    }
    return !!accessToken?.realm_access && accessToken.realm_access?.roles.includes("admin");
  };

  return (
    <Container>
      <Typography variant="h5">AdminScreen</Typography>
      <Typography>TODO: Design admin screen</Typography>
      <Typography>{isAdmin(authToken) ? "You are an admin" : "You are not an admin"}</Typography>
    </Container>
  );
};

export default AdminScreen;
