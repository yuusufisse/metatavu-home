import { Container } from "@mui/material";
import { Outlet } from "react-router";
import NavBar from "./navbar";

/**
 * Layout component
 */
const Layout = () => {
  return (
    <>
      {/* HEADER START */}
      <Container>
        <NavBar/>
      </Container>
      {/* HEADER END *** CONTENT START */}
      <Container sx={{ marginTop: 4 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
