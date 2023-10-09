import { useEffect, useState } from "react";
import { DailyEntry, PersonTotalTime, Timespan } from "../../../generated/client";
import { CircularProgress, SelectChangeEvent, Card, Grow, Collapse } from "@mui/material";
import { userProfileAtom } from "../../../atoms/auth";
import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom } from "../../../atoms/error";
import { personAtom } from "../../../atoms/person";
import { useApi } from "../../../hooks/use-api";
import TimebankContent from "./timebank-content";
import { DateTime } from "luxon";
import strings from "../../../localization/strings";

const TimebankScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const [timespanSelector, setTimespanSelector] = useState("Week");
  const setError = useSetAtom(errorAtom);
  const { personsApi, dailyEntriesApi } = useApi();
  const person = useAtomValue(personAtom);
  const [personTotalTimeLoading, setPersonTotalTimeLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();
  const [personDailyEntry, setPersonDailyEntry] = useState<DailyEntry>();
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>();

  /**
   * Fetches the person's total time and daily entries
   * @param timespan Timespan string which controls whether @PersonTotalTime results are condensed into weeks, months, years or all time
   */
  const getPersonTotalTime = async (timespan?: Timespan): Promise<void> => {
    setPersonTotalTimeLoading(true);
    if (person) {
      try {
        const fetchedPersonTotalTime = await personsApi.listPersonTotalTime({
          personId: person?.id,
          timespan: timespan || Timespan.WEEK
        });
        setPersonTotalTime(fetchedPersonTotalTime[0]);
      } catch (error) {
        setError(`${strings.error.totalTimeFetch}, ${error}`);
      }
    } else {
      setError(strings.error.totalTimeNotFound);
    }
    setPersonTotalTimeLoading(false);
  };

  /**
   * Fetches the person's total time and daily entries
   * @param timespan Timespan string which controls whether @PersonTotalTime results are condensed into weeks, months, years or all time
   */
  const getPersonDailyEntries = async (): Promise<void> => {
    if (person) {
      try {
        const fetchedDailyEntries = await dailyEntriesApi.listDailyEntries({
          personId: person?.id
        });
        setDailyEntries(fetchedDailyEntries);
        setPersonDailyEntry(fetchedDailyEntries[0]);
      } catch (error) {
        setError(`${strings.error.dailyEntriesFetch}, ${error}`);
      }
    } else {
      setError(strings.error.dailyEntriesNotFound);
    }
  };

  /**
   * Changes the displayed daily entry via the Date Picker.
   * @param selectedDate selected date from DatePicker
   */
  const handleDailyEntryChange = (selectedDate: DateTime | null) => {
    setPersonDailyEntry(
      dailyEntries?.filter(
        (item) => DateTime.fromJSDate(item.date).toISODate() === selectedDate?.toISODate()
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
        return getPersonTotalTime(Timespan.WEEK);
      case "Month":
        return getPersonTotalTime(Timespan.MONTH);
      case "Year":
        return getPersonTotalTime(Timespan.YEAR);
      case "All":
        return getPersonTotalTime(Timespan.ALL_TIME);
      default:
        return getPersonTotalTime(Timespan.WEEK);
    }
  };

  useEffect(() => {
    if (person) getPersonTotalTime();
    getPersonDailyEntries();
  }, [person]);

  if (!personDailyEntry && !dailyEntries && !personTotalTime)
    return (
      <Collapse in={personTotalTimeLoading}>
        <Card sx={{ p: "25%", display: "flex", justifyContent: "center" }}>
          <CircularProgress sx={{ scale: "150%" }} />
        </Card>
      </Collapse>
    );
  else if (personDailyEntry && dailyEntries && personTotalTime)
    return (
      <>
        <TimebankContent
          personTotalTimeLoading={personTotalTimeLoading}
          setPersonTotalTimeLoading={setPersonTotalTimeLoading}
          userProfile={userProfile}
          handleDailyEntryChange={handleDailyEntryChange}
          handleBalanceViewChange={handleBalanceViewChange}
          personDailyEntry={personDailyEntry}
          dailyEntries={dailyEntries}
          personTotalTime={personTotalTime}
          timespanSelector={timespanSelector}
        />
      </>
    );
};

export default TimebankScreen;
