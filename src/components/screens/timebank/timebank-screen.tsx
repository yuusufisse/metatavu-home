import { useEffect, useState } from "react";
import { DailyEntry, PersonTotalTime, Timespan } from "../../../generated/client";
import { Grid, CircularProgress, SelectChangeEvent, Box } from "@mui/material";
import { userProfileAtom } from "../../../atoms/auth";
import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom } from "../../../atoms/error";
import { personAtom } from "../../../atoms/person";
import { useApi } from "../../../hooks/use-api";
import TimebankContent from "./timebank-content";
import { DateTime } from "luxon";

const TimebankScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const [timespanSelector, setTimespanSelector] = useState("All");
  const setError = useSetAtom(errorAtom);
  const { personsApi, dailyEntriesApi } = useApi();
  const person = useAtomValue(personAtom);
  const [isLoading, setIsLoading] = useState(true);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const [personDailyEntry, setPersonDailyEntry] = useState<DailyEntry>();
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>();
  const [multiChartChosen, setMultiChartChosen] = useState(false);

  /**
   * Fetches the person's total time and daily entries
   * @param timespan Timespan string which controls if @PersonTotalTime results are condensed into weeks, months, years or all time
   */
  const getPersonData = async (timespan?: Timespan): Promise<void> => {
    setIsLoading(true);
    if (person) {
      try {
        const fetchedPersonTotalTime = await personsApi.listPersonTotalTime({
          personId: person?.id,
          timespan: timespan
        });
        const fetchedDailyEntries = await dailyEntriesApi.listDailyEntries({
          personId: person?.id
        });
        setPersonTotalTime(fetchedPersonTotalTime[0]);
        setDailyEntries(fetchedDailyEntries);
        setPersonDailyEntry(fetchedDailyEntries[0]);
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
   * @param selectedDate selected date from DatePicker
   */
  const handleDailyEntryChange = (selectedDate: DateTime | null) => {
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
        getPersonData(Timespan.WEEK);
      case "Month":
        getPersonData(Timespan.MONTH);
      case "Year":
        getPersonData(Timespan.YEAR);
      case "All":
        getPersonData(Timespan.ALL_TIME);
      case "Range":
        setMultiChartChosen(true);
      default:
        getPersonData(Timespan.ALL_TIME);
    }
  };

  useEffect(() => {
    if (person) getPersonData();
  }, [person]);

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  else
    return (
      <Grid
        sx={{
          borderRadius: "15px",
          backgroundColor: "#f2f2f2",
          boxShadow: "5px 5px 5px 0 rgba(50,50,50,0.1)",
          p: 3
        }}
      >
        <>
          {personDailyEntry && dailyEntries && personTotalTime ? (
            <TimebankContent
              userProfile={userProfile}
              handleDailyEntryChange={handleDailyEntryChange}
              handleBalanceViewChange={handleBalanceViewChange}
              personDailyEntry={personDailyEntry}
              dailyEntries={dailyEntries}
              personTotalTime={personTotalTime}
              timespanSelector={timespanSelector}
              multiChartChosen={multiChartChosen}
            />
          ) : (
            setError("Could not find time entries")
          )}
        </>
      </Grid>
    );
};

export default TimebankScreen;
