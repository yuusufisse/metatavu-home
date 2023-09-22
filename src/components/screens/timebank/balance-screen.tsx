import { useEffect, useState } from "react";
import { DailyEntry, PersonTotalTime, Timespan } from "../../../generated/client";
import { Grid, CircularProgress, SelectChangeEvent, Button } from "@mui/material";
import { userProfileAtom } from "../../../atoms/auth";
import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom } from "../../../atoms/error";
import { personAtom } from "../../../atoms/person";
import { useApi } from "../../../hooks/use-api";
import Balance from "./balance";
import { DateTime } from "luxon";

const BalanceScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const [timespanSelector, setTimespanSelector] = useState<string>("All");
  const setError = useSetAtom(errorAtom);
  const { personsApi, dailyEntriesApi } = useApi();
  const person = useAtomValue(personAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const [personDailyEntry, setPersonDailyEntry] = useState<DailyEntry>();
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>();

/**
 * Fetches the person's total time and daily entries
 * @param timespan Timespan string which controls if @PersonTotalTime results are condensed into weeks, months, years or all time
 */
  const getPersonData = async (timespan?: Timespan): Promise<void> => {
    setIsLoading(true);
    if (person) {
      try {
        Promise.allSettled([
          await personsApi.listPersonTotalTime({
            personId: person?.id,
            timespan: timespan
          }),
          await dailyEntriesApi.listDailyEntries({
            personId: person?.id
          })
        ]).then((values: any) => {
          setPersonTotalTime(values[0].value[0]);
          setDailyEntries(values[1].value);
          setPersonDailyEntry(values[1].value[0]);
        });
      } catch (error) {
        setError(`${"Person fetch has failed."}, ${error}`);
      }
    } else {
      setError("Your account does not have any time bank entries.");
    }
    setIsLoading(false);
  };

  /**
   * Changes the displayed daily entry via the Date Picker.
   * @param e Event value (date)
   */
  const handleDailyEntryChange = (selectedDate : DateTime | null) => {
    setPersonDailyEntry(
      dailyEntries?.filter(
        (item) =>
          DateTime.fromJSDate(item.date).day === selectedDate?.day &&
          DateTime.fromJSDate(item.date).month === selectedDate?.month &&
          DateTime.fromJSDate(item.date).year === selectedDate?.year
      )[0]
    );
  };

  /**
   * Changes the displayed timespan of @PersonTotalTime results
   * @param e Event value (string)
   * @returns function call with the selected timespan
   */
  const handleBalanceViewChange = (e: SelectChangeEvent) => {
    setTimespanSelector(e.target.value);
    switch (e.target.value) {
      case "Week":
        return getPersonData(Timespan.WEEK);
      case "Month":
        return getPersonData(Timespan.MONTH);
      case "Year":
        return getPersonData(Timespan.YEAR);
      case "All":
        return getPersonData(Timespan.ALL_TIME);
      default:
        return getPersonData(Timespan.ALL_TIME);
    }
  };

  useEffect(() => {
    if (person) getPersonData();
  }, [person]);

  return (
    <Grid
      sx={{
        borderRadius: "15px",
        backgroundColor: "#f2f2f2",
        boxShadow: "5px 5px 5px 0 rgba(50,50,50,0.1)",
        p: 3
      }}
    >
      {isLoading ? (
        <CircularProgress sx={{ textAlign: "center" }} />
      ) : (
        <>
          <Balance
            userProfile={userProfile}
            handleDailyEntryChange={handleDailyEntryChange}
            handleBalanceViewChange={handleBalanceViewChange}
            personDailyEntry={personDailyEntry}
            dailyEntries={dailyEntries}
            personTotalTime={personTotalTime}
            timespanSelector={timespanSelector}
          />
          <Button onClick={() => console.log(dailyEntries)}>LOG</Button>
        </>
      )}
    </Grid>
  );
};

export default BalanceScreen;
