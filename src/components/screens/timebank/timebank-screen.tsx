import { useEffect, useState } from "react";
import { Person, Timespan } from "../../../generated/client";
import { CircularProgress, Card } from "@mui/material";
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

/**
 * Time bank screen component containing functions and logic to run time bank features.
 */
const TimebankScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const [timespanSelector, setTimespanSelector] = useState<Timespan>(Timespan.ALL_TIME);
  const setError = useSetAtom(errorAtom);
  const { personsApi, dailyEntriesApi } = useApi();
  const persons = useAtomValue(personsAtom);
  const [personTotalTimeLoading, setPersonTotalTimeLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useAtom(personTotalTimeAtom);
  const [personDailyEntry, setPersonDailyEntry] = useAtom(personDailyEntryAtom);
  const [dailyEntries, setDailyEntries] = useAtom(dailyEntriesAtom);

  /**
   * Gets the logged in person from the persons list atom and then gets that person's total time data.
   * Function is called on initial load / persons list changes or timespan changes.
   * @param timespan Optional Timespan string which controls whether @PersonTotalTime results are condensed into weeks, months, years or all time. Defaults to all time.
   */
  const getPersonTotalTime = async (timespan?: Timespan): Promise<void> => {
    if (!personTotalTime || timespan) {
      setPersonTotalTimeLoading(true);
      setTimespanSelector(timespan || Timespan.ALL_TIME);
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
   * Gets the logged in person from persons list atom and then fetches the person's daily entries.
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
   * Changes the displayed daily entry in the pie chart via the Date Picker.
   * @param selectedDate selected date from DatePicker
   */
  const handleDailyEntryChange = (selectedDate: DateTime | null) => {
    setPersonDailyEntry(
      dailyEntries?.filter(
        (item) => DateTime.fromJSDate(item.date).toISODate() === selectedDate?.toISODate()
      )[0]
    );
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
          getPersonTotalTime={getPersonTotalTime}
          timespanSelector={timespanSelector}
        />
      </>
    );
};

export default TimebankScreen;
