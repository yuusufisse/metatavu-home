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
  const userProfile = useAtomValue(userProfileAtom);
  const { personsApi } = useApi();

  /**
   * Initialize logged in person's time data.
   */
  const getPersons = async () => {
    setIsLoading(true);
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.filter((person) => person.keycloakId === userProfile?.id);

    if (loggedInPerson.length) {
      try {
        const fetchedPerson = await personsApi.listPersonTotalTime({
          personId: loggedInPerson[0].id
        });
        setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${"Person fetch has failed."}, ${error}`);
      }
    } else {
      setError("Your account does not have any time bank entries.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPersons();
  }, [auth]);

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
