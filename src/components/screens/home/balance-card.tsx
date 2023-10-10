import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Grid, Typography, Card, CardContent, Skeleton } from "@mui/material";
import strings from "../../../localization/strings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { errorAtom } from "../../../atoms/error";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { Person, PersonTotalTime } from "../../../generated/client";
import { personsAtom, personTotalTimeAtom } from "../../../atoms/person";
import { Link } from "react-router-dom";
import config from "../../../app/config";
import { userProfileAtom } from "../../../atoms/auth";

/**
 * Component for displaying user's balance
 */
const BalanceCard = () => {
  const persons = useAtomValue(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const { personsApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useAtom(personTotalTimeAtom);

  /**
   * Initialize logged in person's time data.
   */
  const getPersons = async () => {
    setIsLoading(true);
    if (persons.length) {
      try {
        const loggedInPerson = persons.filter(
          (person: Person) => person.keycloakId === config.keycloak.id || userProfile?.id
        )[0];
        const fetchedPerson = await personsApi.listPersonTotalTime({
          personId: loggedInPerson?.id
        });
        setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${strings.error.fetchFailedGeneral}, ${error}`);
      }
      setIsLoading(false);
    }
  };

  /**
   * Get persontotaltime if it doesn't exist, or if it exists but the atom is set to other than "all time"
   */
  useEffect(() => {
    if (!personTotalTime || personTotalTime?.timePeriod?.split("-").length !== 5) getPersons();
  }, [persons]);

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

  if (isLoading) {
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
              {renderPersonTotalTime(personTotalTime)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BalanceCard;
