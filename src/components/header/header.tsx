import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, userProfileAtom } from "../../atoms/auth";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/use-api";
import { errorAtom } from "../../atoms/error";
import { Container } from "@mui/material";
import { Outlet } from "react-router";
import ResponsiveAppBar from "./responsive-appbar";

/**
 * Header component
 */
const Header = () => {
  const auth = useAtomValue(authAtom);
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(false);
  // const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();

  return (
    <>
      <Container>
        <ResponsiveAppBar auth={auth}/>
      </Container>
      <Container>
        <br />
        <Outlet />
      </Container>
    </>
  );
};

export default Header;
