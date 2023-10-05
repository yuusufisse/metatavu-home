import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Grid, Typography, Card, CardContent, Skeleton } from "@mui/material";
import strings from "../../../localization/strings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { errorAtom } from "../../../atoms/error";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { PersonTotalTime } from "../../../generated/client";
import { personAtom } from "../../../atoms/person";
import { Link } from "react-router-dom";

/**
 * Component for displaying user's balance
 */
const BalanceCard = () => {
  const person = useAtomValue(personAtom);
  const { personsApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();

  /**
   * Initialize logged in person's time data.
   */
  const getPersons = async () => {
    setIsLoading(true);
    try {
      const fetchedPerson = await personsApi.listPersonTotalTime({
        personId: Number(person?.id)
      });
      setPersonTotalTime(fetchedPerson[0]);
    } catch (error) {
      setError(`${strings.error.fetchFailedGeneral}, ${error}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (person) getPersons();
  }, [person]);

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
    <>
      <Link to={"/timebank"} style={{ textDecoration: "none" }}>
        <Card>
          <CardContent>
            <h3 style={{ marginTop: 6 }}>{strings.timebank.balance}</h3>
            <Grid container>
              <Grid item xs={1}>
                <ScheduleIcon />
              </Grid>
              <Grid item xs={11}>
                {isLoading ? <Skeleton /> : renderPersonTotalTime(personTotalTime)}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Link>
    </>
  );
};

export default BalanceCard;
