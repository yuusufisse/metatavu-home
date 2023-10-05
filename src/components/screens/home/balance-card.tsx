import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Grid, Typography, Card, CardContent, Skeleton } from "@mui/material";
import strings from "../../../localization/strings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { errorAtom } from "../../../atoms/error";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { authAtom, userProfileAtom } from "../../../atoms/auth";

/**
 * Component for displaying user's balance
 */
const BalanceCard = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const { personsApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState("");

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
        setResult(getHoursAndMinutes(fetchedPerson[0].balance))
      } catch (error) {
        setError(`${strings.errors.fetchFailedGeneral}, ${error}`);
        setResult(`${strings.errors.fetchFailedGeneral}, ${error}`);
      }
    } else {
      setError(strings.errors.fetchFailedNoEntriesGeneral);
      setResult(strings.errors.fetchFailedNoEntriesGeneral);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPersons();
  }, [authAtom]);

  return (
    <>
      <Card>
        <CardContent>
          <h3 style={{ marginTop: 6 }}>{strings.timebank.balance}</h3>
          <Grid container>
            <Grid item xs={1}>
              <ScheduleIcon />
            </Grid>
            <Grid item xs={11}>
              {isLoading ? (
                <Skeleton />
              ) : (
                <Typography>{result}</Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default BalanceCard;
