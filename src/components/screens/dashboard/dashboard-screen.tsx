import { authAtom, userProfileAtom } from "../../../atoms/auth";
import { Button, Card, CircularProgress, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { personAtom } from "../../../atoms/person";
import { useEffect, useState } from "react";
import config from "../../../app/config";
import { errorAtom } from "../../../atoms/error";
import { PersonTotalTime, Timespan } from "../../../generated/client";
import { useApi } from "../../../hooks/use-api";
import { Link } from "react-router-dom";

/**
 * Dashboard screen component
 */
function DashboardScreen() {
  const auth = useAtomValue(authAtom);
  const setError = useSetAtom(errorAtom);
  const { personsApi } = useApi();
  const [person, setPerson] = useAtom(personAtom);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const userProfile = useAtomValue(userProfileAtom);

  useEffect(() => {
    if (person) getPersonData();
    else getLoggedInPerson();
  }, [person]);

  /**
   * Get logged in person from keycloak ID.
   */
  const getLoggedInPerson = async (): Promise<void> => {
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.filter(
      (person) => person.keycloakId === config.keycloak.id || userProfile?.id
    )[0];
    setPerson(loggedInPerson);
  };

  /**
   * Initialize logged in person's time data.
   */
  const getPersonData = async (timespan?: Timespan): Promise<void> => {
    if (person) {
      try {
        const fetchedPerson = await personsApi.listPersonTotalTime({
          personId: person?.id,
          timespan: timespan
        });
        setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${"Person fetch has failed."}, ${error}`);
      }
    } else {
      setError("Your account does not have any time bank entries.");
    }
  };
  if (!personTotalTime) return <CircularProgress sx={{ marginLeft: "50%", marginTop: "5%" }} />;
  else
    return (
      <Card
        sx={{
          width: "25%",
          textAlign: "center",
          margin: "auto",
          marginTop: "5%",
          padding: "20px",
          backgroundColor: "lightgray"
        }}
      >
        <Link to="/timebank">TIMEBANK</Link>
        <Typography sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {personTotalTime
            ? `Balance: ${getHoursAndMinutes(Number(personTotalTime?.balance))}`
            : null}
        </Typography>
        <Button color="info" variant="contained" onClick={() => auth?.logout()}>
          Log out
        </Button>
        <br />
        <Button color="info" variant="contained" onClick={() => console.log(DateTime.now())}>
          TEST
        </Button>
      </Card>
    );
}

export default DashboardScreen;
