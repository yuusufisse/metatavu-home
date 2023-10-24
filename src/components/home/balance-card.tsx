import { getHoursAndMinutes } from "../../utils/time-utils";
import { Grid, Typography, Card, CardContent, Skeleton } from "@mui/material";
import strings from "../../localization/strings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { errorAtom } from "../../atoms/error";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/use-api";
import { Person, PersonTotalTime } from "../../generated/client";
import { personsAtom, personTotalTimeAtom } from "../../atoms/person";
import { Link } from "react-router-dom";
import { userProfileAtom } from "../../atoms/auth";
import config from "../../app/config";

/**
 * Component for displaying user's balance
 */
const BalanceCard = () => {
  const persons = useAtomValue(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const { personsApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const [loading, setLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useAtom(personTotalTimeAtom);

  /**
   * Get person total time if it is undefined or set to "all time"
   */
  useEffect(() => {
    if (!personTotalTime || personTotalTime.timePeriod?.split("-").length !== 5) getPersons();
  }, [personTotalTime, persons]);

  /**
   * Initialize logged in person's time data.
   */
  const getPersons = async () => {
    setLoading(true);
    if (persons.length) {
      try {
        const loggedInPerson = persons.filter(
          (person: Person) => person.keycloakId === userProfile?.id
        )[0];
        const fetchedPerson = await personsApi.listPersonTotalTime({
          personId: loggedInPerson?.id || config.person.id
        });
        setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${strings.error.fetchFailedGeneral}, ${error}`);
      }
      setLoading(false);
    }
  };

  /**
   * Renders person's total time
   *
   * @param personTotalTime PersonTotalTime
   */
  const renderPersonTotalTime = (personTotalTime: PersonTotalTime) => {
    if (!personTotalTime) {
      return <Typography>{strings.error.fetchFailedNoEntriesGeneral}</Typography>;
    }

    return <Typography>{getHoursAndMinutes(personTotalTime.balance)}</Typography>;
  };

  if (loading) {
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
                <Skeleton />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Link>
    );
  }

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
              {personTotalTime ? renderPersonTotalTime(personTotalTime) : null}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BalanceCard;
