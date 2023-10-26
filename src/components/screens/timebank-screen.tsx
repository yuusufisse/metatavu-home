import { useEffect, useState } from "react";
import { Person, Timespan } from "../../generated/client";
import { CircularProgress, Card } from "@mui/material";
import { userProfileAtom } from "../../atoms/auth";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { errorAtom } from "../../atoms/error";
import {
  dailyEntriesAtom,
  employmentYearsAtom,
  personDailyEntryAtom,
  personTotalTimeAtom,
  personsAtom,
  totalTimeAtom
} from "../../atoms/person";
import { useApi } from "../../hooks/use-api";
import TimebankContent from "../timebank/timebank-content";
import { DateTime } from "luxon";
import strings from "../../localization/strings";
import config from "../../app/config";

/**
 * Time bank screen component.
 */
const TimebankScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const [timespanSelector, setTimespanSelector] = useState<Timespan>(Timespan.ALL_TIME);
  const setError = useSetAtom(errorAtom);
  const { personsApi, dailyEntriesApi } = useApi();
  const persons = useAtomValue(personsAtom);
  const [loading, setLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useAtom(personTotalTimeAtom);
  const [personDailyEntry, setPersonDailyEntry] = useAtom(personDailyEntryAtom);
  const setTotalTime = useSetAtom(totalTimeAtom);
  const [dailyEntries, setDailyEntries] = useAtom(dailyEntriesAtom);
  const [employmentYears, setEmploymentYears] = useAtom(employmentYearsAtom);

  useEffect(() => {
    getPersonTotalTime();
    getEmploymentYears();
  }, [persons, timespanSelector]);

  useEffect(() => {
    getPersonDailyEntries();
  }, [persons]);

  /**
   * Gets person's total time data.
   *
   * @param timespan enum
   */
  const getPersonTotalTime = async () => {
    setLoading(true);
    if (persons.length) {
      try {
        const loggedInPerson = persons.filter(
          (person: Person) => person.keycloakId === userProfile?.id
        )[0];
        const fetchedPersonTotalTime = await personsApi.listPersonTotalTime({
          personId: loggedInPerson?.id || config.person.id,
          timespan: timespanSelector || Timespan.ALL_TIME,
          before: new Date()
        });
        setTotalTime(fetchedPersonTotalTime)
        setPersonTotalTime(fetchedPersonTotalTime[0]);
      } catch (error) {
        setError(`${strings.error.totalTimeFetch}, ${error}`);
      }
    }
    setLoading(false);
  };

  /**
   * Gets the logged in person's daily entries.
   */
  const getPersonDailyEntries = async () => {
    if (!persons.length) return null;

    try {
      const loggedInPerson = persons.filter(
        (person: Person) => person.keycloakId === userProfile?.id
      )[0];
      const fetchedDailyEntries = await dailyEntriesApi.listDailyEntries({
        personId: loggedInPerson?.id || config.person.id
      });
      setDailyEntries(fetchedDailyEntries);
      setPersonDailyEntry(fetchedDailyEntries.find((item) => item.date <= new Date())); // Gets today's entry or earlier
    } catch (error) {
      setError(`${strings.error.dailyEntriesFetch}, ${error}`);
    }
  };

  /**
   * Gets the person's employment start and current years
   */
  const getEmploymentYears = () => {
    if (personTotalTime && timespanSelector === Timespan.ALL_TIME) {
      setEmploymentYears([
        String(personTotalTime.timePeriod?.split(",")[0].substring(0, 4)),
        String(personTotalTime.timePeriod?.split(",")[1].substring(0, 4))
      ]);
    }
    console.log(employmentYears);
  };

  /**
   * Changes the displayed daily entry in the pie chart via the Date Picker.
   *
   * @param selectedDate selected date from DatePicker
   */
  const handleDailyEntryChange = (selectedDate: DateTime) => {
    if (selectedDate)
      setPersonDailyEntry(
        dailyEntries.find(
          (item) => DateTime.fromJSDate(item.date).toISODate() === selectedDate?.toISODate()
        )
      );
  };

  if (!personDailyEntry || !dailyEntries.length || !personTotalTime) {
    return (
      <Card sx={{ p: "25%", display: "flex", justifyContent: "center" }}>
        <CircularProgress sx={{ scale: "150%" }} />
      </Card>
    );
  }

  return (
    <TimebankContent
      userProfile={userProfile}
      handleDailyEntryChange={handleDailyEntryChange}
      getPersonTotalTime={getPersonTotalTime}
      timespanSelector={timespanSelector}
      setTimespanSelector={setTimespanSelector}
      loading={loading}
    />
  );
};

export default TimebankScreen;
