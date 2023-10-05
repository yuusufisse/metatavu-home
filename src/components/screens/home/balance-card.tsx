import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Grid, Typography, Card, CardContent, Skeleton } from "@mui/material";
import strings from "../../../localization/strings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { errorAtom } from "../../../atoms/error";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { authAtom, userProfileAtom } from "../../../atoms/auth";
import { PersonTotalTime } from "../../../generated/client";

/**
 * Component for displaying user's balance
 */
const BalanceCard = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const { personsApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();

  /**
   * Initialize logged in person's time data.
   */
  const getPersons = async () => {
    setIsLoading(true);
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.filter((person) => person.keycloakId === userProfile?.id);

    try {
      const fetchedPerson = await personsApi.listPersonTotalTime({
        personId: loggedInPerson[0].id
      });
      setPersonTotalTime(fetchedPerson[0]);
    } catch (error) {
      setError(`${strings.errors.fetchFailedGeneral}, ${error}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getPersons();
  }, [authAtom]);

  /**
   * Renders person's total time
   *
   * @param personTotalTime PersonTotalTime
   */
  const renderPersonTotalTime = (personTotalTime: PersonTotalTime | undefined) => {
    if (!personTotalTime) {
      return <Typography>{strings.errors.fetchFailedNoEntriesGeneral}</Typography>
    }

    return (
      <Typography>
        {getHoursAndMinutes(personTotalTime.balance)}
      </Typography>
    )
  }

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
              {isLoading
                ? <Skeleton />
                : renderPersonTotalTime(personTotalTime)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default BalanceCard;