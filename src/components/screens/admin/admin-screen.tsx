import { useAtomValue } from "jotai";
import { authAtom } from "../../../atoms/auth";
import { Container, Typography } from "@mui/material";
import { KeycloakTokenParsed } from "keycloak-js";

const AdminScreen = () => {
  const authToken = useAtomValue(authAtom)?.token;

  const isAdmin = (accessToken?: KeycloakTokenParsed): boolean => {
    return !!accessToken?.realm_access && accessToken.realm_access?.roles.includes("admin");
  };

  return (
    <Container>
      <Typography variant="h5">AdminScreen</Typography>
      <Typography>Implement</Typography>
      <Typography>{isAdmin(authToken) ? "You are an admin" : "You are not an admin"}</Typography>
    </Container>
  );
};

export default AdminScreen;
