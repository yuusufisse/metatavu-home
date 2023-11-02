import { getHoursAndMinutes } from "../../utils/time-utils";
import { Grid, Typography, Card, CardContent, Skeleton } from "@mui/material";
import strings from "../../localization/strings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { errorAtom } from "../../atoms/error";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useMemo, useState } from "react";
import { useApi } from "../../hooks/use-api";
import { Person, PersonTotalTime, Timespan } from "../../generated/client";
import { personsAtom, personTotalTimeAtom, timespanAtom } from "../../atoms/person";
import { Link } from "react-router-dom";
import { userProfileAtom } from "../../atoms/auth";
import config from "../../app/config";

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
   * Get person total time if it is undefined or set to "all time"
   */
  useMemo(() => {
    if (!personTotalTime || timespan !== Timespan.ALL_TIME) {
      setTimespan(Timespan.ALL_TIME);
      getPersons();
    }
  }, [persons, timespan]);

  /**
   * Renders person's total time
   *
   * @param personTotalTime PersonTotalTime
   */
  const renderPersonTotalTime = (personTotalTime: PersonTotalTime | undefined) => {
    if (!personTotalTime && !loading && persons.length) {
      return <Typography>{strings.error.fetchFailedNoEntriesGeneral}</Typography>;
    }
    if (personTotalTime) {
      return <Typography>{getHoursAndMinutes(personTotalTime.balance)}</Typography>;
    }
    return <Skeleton />;
  };

  return (
    <Link to={"/timebank"} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          "&:hover": {
            background: "#efefef"
          }
        }}
      >
        <CardContent>
          <h3 style={{ marginTop: 6 }}>{strings.timebank.balance}</h3>
          <Grid container>
            <Grid item xs={1}>
              <ScheduleIcon />
            </Grid>
            <Grid item xs={11}>
              {renderPersonTotalTime(personTotalTime)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BalanceCard;
