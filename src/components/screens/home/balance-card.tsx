import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Grid, Typography, Card, CardContent, Skeleton } from "@mui/material";
import strings from "../../../localization/strings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { errorAtom } from "../../../atoms/error";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useApi } from "../../../hooks/use-api";
import { authAtom, userProfileAtom } from "../../../atoms/auth";
import { PersonTotalTime, Timespan } from "../../../generated/client";
import config from "../../../app/config";
import { DateTime } from "luxon";
import { languageAtom } from "../../../atoms/languageAtom";

/**
 * Component for displaying user's balance
 */
const BalanceCard = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const { personsApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const [loading, setLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const currentDate = DateTime.now();
  const beforeDate = currentDate.minus({ days: 1 }).set({ hour: 23, minute: 59 });
  const language = useAtomValue(languageAtom);
  const formattedBeforeDate = beforeDate.setLocale(language).toFormat("dd LLL yyyy");

  /**
   * Initialize logged in person's time data.
   */
  const getPersons = async () => {
    setLoading(true);
    const fetchedPersons = await personsApi.listPersons({ active: true });
    const loggedInPerson = fetchedPersons.find((person) => person.keycloakId === userProfile?.id);

    if (loggedInPerson || config.person.id)
      try {
        const fetchedPerson = await personsApi.listPersonTotalTime({
          personId: loggedInPerson?.id || config.person.id,
          timespan: Timespan.ALL_TIME,
          before: beforeDate.toJSDate()
        });
        setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${strings.errors.fetchFailedGeneral}, ${error}`);
      }

    setLoading(false);
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
      return <Typography>{strings.errors.fetchFailedNoEntriesGeneral}</Typography>;
    }

    return <Typography>{getHoursAndMinutes(personTotalTime.balance)}</Typography>;
  };

  return (
    <>
      <Card>
        <CardContent>
          <h3 style={{ marginTop: 6 }}>{strings.timebank.balance}</h3>
          <Grid container>
            <Grid item xs={12}>
              {`${formattedBeforeDate}`}
            </Grid>
            <Grid style={{ marginBottom: 1 }} item xs={1}>
              <ScheduleIcon style={{ marginTop: 1 }} />
            </Grid>
            <Grid item xs={11}>
              {loading ? <Skeleton /> : renderPersonTotalTime(personTotalTime)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default BalanceCard;
