import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { authAtom, userProfileAtom } from "../../../atoms/auth";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { DailyEntry, PersonTotalTime, Timespan } from "../../../generated/client";
import { errorAtom } from "../../../atoms/error";
import LoaderWrapper from "../../generics/loader-wrapper";
import BalanceData from "./balance-screen";
import { Button, Card, Typography } from "@mui/material";
import { personAtom } from "../../../atoms/person";
import config from "../../../app/config";
import { DateTime } from "luxon";

/**
 * Dashboard screen component
 */
function DashboardScreen () {
  const auth = useAtomValue(authAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(true);
  const { personsApi, dailyEntriesApi } = useApi();
  const [timespanSelector, setTimespanSelector] = useState<any>("All");
  const [person, setPerson] = useAtom(personAtom);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const [personDailyEntry, setPersonDailyEntry] = useState<DailyEntry>();

/**
 * Get logged in person from keycloak ID.
 */
  const getLoggedInPerson = async () : Promise<void> => {
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.filter(person => person.keycloakId === config.keycloak.id || userProfile?.id)[0];
    setPerson(loggedInPerson);
  }

/**
 * Initialize logged in person's time data.
 */
  const getPersonData = async (tspan? : Timespan) : Promise<void> => {
    setIsLoading(true);
    console.log(person);
    if (person) {
      try {
          const fetchedPerson = await personsApi.listPersonTotalTime({personId: person?.id, timespan: tspan});
          setPersonTotalTime(fetchedPerson[0]);

          const today = new Date();
          const todayOffset = new Date().setHours(today.getHours() - 6) // 6 hours back from now
          const dailyEntries = await dailyEntriesApi.listDailyEntries({
            personId: person?.id,
            before: today,
            after: new Date(todayOffset)
          })
          setPersonDailyEntry(dailyEntries[0]);
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
    if (!person)
    getLoggedInPerson()
    else 
    getPersonData();
  }, [person])
  

  return (
    <LoaderWrapper loading={isLoading}>
      <Card sx={{width:"25%", textAlign:"center", margin:"auto", marginTop:"5%", padding:"20px", backgroundColor:"lightgray"}}>
        {
          (!personTotalTime || !personDailyEntry)
          ?<Typography>Loading...</Typography>
          :<><BalanceData
          personTotalTime={personTotalTime}
          personDailyEntry={personDailyEntry}
          getPersonData={getPersonData}
          timespanSelector={timespanSelector} 
          setTimespanSelector={setTimespanSelector}/>
        <Button color="info" variant="contained" onClick={() => auth?.logout()}>Log out</Button><br/>
        <Button color="info" variant="contained" onClick={() => console.log(DateTime.now())}>TEST</Button>
        </>
        }
      </Card>
    </LoaderWrapper>
  );
}

export default DashboardScreen;