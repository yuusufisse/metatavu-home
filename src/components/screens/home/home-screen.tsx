import { Grid } from "@mui/material";
import BalanceCard from "./balance-card";
import { useAtomValue, useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { useEffect, useState } from "react";
import { authAtom, userProfileAtom } from "../../../atoms/auth";
import { errorAtom } from "../../../atoms/error";
import { PersonTotalTime } from "../../../generated/client";

/**
 * Home screen component
 */
const HomeScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const { personsApi } = useApi();
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const setError = useSetAtom(errorAtom);

  /**
   * Initialize logged in person's time data.
   */
  const getPersons = async () => {
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
  };

  useEffect(() => {
    getPersons();
  }, [authAtom]);

  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <BalanceCard personTotalTime={personTotalTime} />
      </Grid>
      <Grid item xs={12} md={8}>
        {/* TODO: MORE CARDS */}
      </Grid>
    </Grid>
  );
};

export default HomeScreen;
