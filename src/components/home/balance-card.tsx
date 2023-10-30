import { Typography, Card, CardContent, Grid, Skeleton } from "@mui/material";
import { useAtomValue, useAtom, useSetAtom } from "jotai";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import config from "../../app/config";
import { userProfileAtom } from "../../atoms/auth";
import { errorAtom } from "../../atoms/error";
import { personsAtom, timespanAtom, personTotalTimeAtom } from "../../atoms/person";
import { Timespan, Person, PersonTotalTime } from "../../generated/client";
import { useApi } from "../../hooks/use-api";
import strings from "../../localization/strings";
import { getHoursAndMinutes } from "../../utils/time-utils";
import ScheduleIcon from "@mui/icons-material/Schedule";

/**
 * Component for displaying user's balance
 */
const BalanceCard = () => {
  const persons = useAtomValue(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const [timespan, setTimespan] = useAtom(timespanAtom);
  const { personsApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const [loading, setLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useAtom(personTotalTimeAtom);

  /**
   * Get person total time if it is undefined or set to "all time"
   */
  useEffect(() => {
    if (!personTotalTime || timespan !== Timespan.ALL_TIME) {
      setTimespan(Timespan.ALL_TIME);
      getPersons();
    }
  }, [persons, timespan]);

  /**
   * Initialize logged in person's time data.
   */
  const getPersons = async () => {
    if (persons.length) {
      setLoading(true);
      const loggedInPerson = persons.find(
        (person: Person) => person.keycloakId === userProfile?.id
      );
      if (loggedInPerson || config.person.id) {
        try {
          const fetchedPerson = await personsApi.listPersonTotalTime({
            personId: loggedInPerson?.id || config.person.id
          });
          setPersonTotalTime(fetchedPerson[0]);
        } catch (error) {
          setError(`${strings.error.fetchFailedGeneral}, ${error}`);
        }
      }
      setLoading(false);
    }
  };

  /**
   * Renders person's total time
   *
   * @param personTotalTime PersonTotalTime
   */
  const renderPersonTotalTime = (personTotalTime: PersonTotalTime | undefined) => {
    if (!personTotalTime) {
      return <Typography>{strings.error.fetchFailedNoEntriesGeneral}</Typography>;
    }

    return <Typography>{getHoursAndMinutes(personTotalTime.balance)}</Typography>;
  };

  return (
    <Link to={"/timebank"} style={{ textDecoration: "none" }}>
      <Card>
        <CardContent>
          <h3 style={{ marginTop: 6 }}>{strings.timebank.balance}</h3>
          <Grid container>
            <Grid item xs={1}>
              <ScheduleIcon />
            </Grid>
            <Grid item xs={11}>
              {loading ? <Skeleton /> : renderPersonTotalTime(personTotalTime)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BalanceCard;
