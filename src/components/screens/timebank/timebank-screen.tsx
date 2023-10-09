import { useEffect, useState } from "react";
import { Person, Timespan } from "../../../generated/client";
import { CircularProgress, SelectChangeEvent, Card } from "@mui/material";
import { userProfileAtom } from "../../../atoms/auth";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { errorAtom } from "../../../atoms/error";
import {
  dailyEntriesAtom,
  personDailyEntryAtom,
  personTotalTimeAtom,
  personsAtom
} from "../../../atoms/person";
import { useApi } from "../../../hooks/use-api";
import TimebankContent from "./timebank-content";
import { DateTime } from "luxon";
import strings from "../../../localization/strings";
import config from "../../../app/config";

const TimebankScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const [timespanSelector, setTimespanSelector] = useState("Week");
  const setError = useSetAtom(errorAtom);
  const { personsApi, dailyEntriesApi } = useApi();
  const persons = useAtomValue(personsAtom);
  const [personTotalTimeLoading, setPersonTotalTimeLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useAtom(personTotalTimeAtom);
  const [personDailyEntry, setPersonDailyEntry] = useAtom(personDailyEntryAtom);
  const [dailyEntries, setDailyEntries] = useAtom(dailyEntriesAtom);

  /**
   * Fetches the person's total time to display data such as balance.
   * @param timespan Timespan string which controls whether @PersonTotalTime results are condensed into weeks, months, years or all time
   */
  const getPersonTotalTime = async (timespan?: Timespan): Promise<void> => {
    if (!personTotalTime || timespan) {
      setPersonTotalTimeLoading(true);
      if (persons.length) {
        try {
          const loggedInPerson = persons.filter(
            (person: Person) => person.keycloakId === config.keycloak.id || userProfile?.id
          )[0];
          const fetchedPersonTotalTime = await personsApi.listPersonTotalTime({
            personId: loggedInPerson?.id,
            timespan: timespan
          });
          setPersonTotalTime(fetchedPersonTotalTime[0]);
        } catch (error) {
          setError(`${strings.error.totalTimeFetch}, ${error}`);
        }
        setPersonTotalTimeLoading(false);
      }
    }
  };

  /**
   * Fetches the person's daily entries.
   */
  const getPersonDailyEntries = async (): Promise<void> => {
    if (persons.length) {
      try {
        const loggedInPerson = persons.filter(
          (person: Person) => person.keycloakId === config.keycloak.id || userProfile?.id
        )[0];
        const fetchedDailyEntries = await dailyEntriesApi.listDailyEntries({
          personId: loggedInPerson?.id
        });
        setDailyEntries(fetchedDailyEntries);
        setPersonDailyEntry(fetchedDailyEntries[0]);
      } catch (error) {
        setError(`${strings.error.dailyEntriesFetch}, ${error}`);
      }
      setPersonTotalTimeLoading(false);
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
    getPersonTotalTime();
    getPersonDailyEntries();
  }, [persons]);

  if (personTotalTimeLoading || !personDailyEntry || !dailyEntries || !personTotalTime)
    return (
      <Card sx={{ p: "25%", display: "flex", justifyContent: "center" }}>
        <CircularProgress sx={{ scale: "150%" }} />
      </Card>
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
          timespanSelector={timespanSelector}
        />
      </>
    );
};

export default TimebankScreen;
