import { useAtomValue, useSetAtom } from "jotai";
import { authAtom, userProfileAtom } from "../../atoms/auth";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/use-api";
import { PersonTotalTime } from "../../generated/client";
import { errorAtom } from "../../atoms/error";
import LoaderWrapper from "../generics/loader-wrapper";
import {  Container, Grid } from "@mui/material";
import BalanceCard from "./balance-card";
import HomeNav from "./nav";

/**
 * Dashboard screen component
 */
function Header () {
  const auth = useAtomValue(authAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const { personsApi } = useApi();

/**
 * Initialize logged in person's time data.
 */
  const getPersons = async () => {
    setIsLoading(true);
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.filter(person => person.keycloakId === userProfile?.id);

    if (loggedInPerson.length) {
      try {
          const fetchedPerson = await personsApi.listPersonTotalTime({personId: loggedInPerson[0].id});
          setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${ "Person fetch has failed." }, ${ error }`);
      }
    }
    else {
      setError("Your account does not have any time bank entries.");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    getPersons();
  }, [auth])
  

  return (
    <LoaderWrapper loading={isLoading}>
      <Container sx={{ fontFamily: 'Nunito Sans' }}>
        <Grid container sx={{
                    "border-radius":"15px",
                    "background-color":"#f2f2f2",
                    "box-shadow": "5px 5px 5px 0 rgba(50,50,50,0.1)",
                    p:3
                }}>
          <BalanceCard personTotalTime={ personTotalTime } />
        </Grid>
        <br/>
        <Grid container sx={{
                    "border-radius":"15px",
                    "background-color":"#f2f2f2",
                    "box-shadow": "5px 5px 5px 0 rgba(50,50,50,0.1)",
                    p:0
                }}>
          <HomeNav auth={ auth }/>
        </Grid>
      </Container>
    </LoaderWrapper>
  );
}

export default Header;