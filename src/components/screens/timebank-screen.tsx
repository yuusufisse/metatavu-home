import { useEffect, useState } from "react";
import { Person, Timespan } from "../../generated/client";
import { CircularProgress, Card } from "@mui/material";
import { userProfileAtom } from "../../atoms/auth";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { errorAtom } from "../../atoms/error";
import {
  dailyEntriesAtom,
  personDailyEntryAtom,
  personsAtom,
  timebankScreenPersonTotalTimeAtom,
  timespanAtom
} from "../../atoms/person";
import { useApi } from "../../hooks/use-api";
import TimebankContent from "../timebank/timebank-content";
import { DateTime } from "luxon";
import strings from "../../localization/strings";
import config from "../../app/config";

/**
 * Timebank screen component.
 */
const TimebankScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const timespan = useAtomValue(timespanAtom);
  const setError = useSetAtom(errorAtom);
  const { personsApi, dailyEntriesApi } = useApi();
  const persons = useAtomValue(personsAtom);
  const [loading, setLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useAtom(timebankScreenPersonTotalTimeAtom);
  const [personDailyEntry, setPersonDailyEntry] = useAtom(personDailyEntryAtom);
  const [dailyEntries, setDailyEntries] = useAtom(dailyEntriesAtom);
  const loggedInPerson = persons.find(
    (person: Person) => person.id === config.person.id || person.keycloakId === userProfile?.id
  );
  const [selectedEmployee, setSelectedEmployee] = useState(loggedInPerson?.id);
  const selectedPerson = persons.find((person) => person.id === selectedEmployee);

  useEffect(() => {
    if (selectedEmployee) {
      getSelectedPersonTotalTime(selectedEmployee);
    } else {
      getPersonTotalTime();
    }
  }, [persons, selectedEmployee, timespan]);

  useEffect(() => {
    getPersonDailyEntries();

    if (selectedPerson) {
      getPersonDailyEntriesForPieChart(selectedPerson);
    }
  }, [persons, selectedEmployee]);

  /**
   * Gets  selectedPerson's total time data.
   *
   * @param selectedPersonId selected person id
   */
  const getSelectedPersonTotalTime = async (selectedPersonId: number) => {
    setLoading(true);
    try {
      const fetchedPersonTotalTime = await personsApi.listPersonTotalTime({
        personId: selectedPersonId,
        timespan: timespan || Timespan.ALL_TIME,
        before: DateTime.now().minus({ days: 1 }).toJSDate()
      });
      setPersonTotalTime(fetchedPersonTotalTime[0]);
    } catch (error) {
      setError(`${strings.error.totalTimeFetch}, ${error}`);
    }
    setLoading(false);
  };

  /**
   * Gets person's total time data.
   */
  const getPersonTotalTime = async () => {
    if (persons.length) {
      setLoading(true);
      if (loggedInPerson) {
        try {
          const fetchedPersonTotalTime = await personsApi.listPersonTotalTime({
            personId: loggedInPerson?.id,
            timespan: timespan || Timespan.ALL_TIME,
            before: DateTime.now().minus({ days: 1 }).toJSDate()
          });
          setPersonTotalTime(fetchedPersonTotalTime[0]);
        } catch (error) {
          setError(`${strings.error.totalTimeFetch}, ${error}`);
        }
      }
    }
    setLoading(false);
  };

  /**
   * Gets the logged in person's daily entries.
   */
  const getPersonDailyEntries = async () => {
    if (!persons.length) return null;

    if (loggedInPerson) {
      try {
        const fetchedDailyEntries = await dailyEntriesApi.listDailyEntries({
          personId: loggedInPerson?.id
        });
        setDailyEntries(fetchedDailyEntries);
        setPersonDailyEntry(
          fetchedDailyEntries.find((item) => item.date <= new Date() && item.logged)
        );
      } catch (error) {
        setError(`${strings.error.dailyEntriesFetch}, ${error}`);
      }
    }
  };

  /**
   * Gets daily entries for the selected employee for the pie chart.
   *
   * @param selectedPerson daily entries
   */
  const getPersonDailyEntriesForPieChart = async (selectedPerson: Person) => {
    if (selectedPerson) {
      try {
        const fetchedDailyEntries = await dailyEntriesApi.listDailyEntries({
          personId: selectedPerson.id
        });
        setDailyEntries(fetchedDailyEntries);
        setPersonDailyEntry(
          fetchedDailyEntries.find((item) => item.date <= new Date() && item.logged)
        );
      } catch (error) {
        setError(`${strings.error.dailyEntriesFetch}, ${error}`);
      }
    }
  };

  /**
   * Changes the displayed daily entry in the pie chart via the Date Picker.
   *
   * @param selectedDate selected date from DatePicker
   */
  const handleDailyEntryChange = async (selectedDate: DateTime) => {
    if (selectedDate && selectedEmployee !== null) {
      try {
        const fetchedDailyEntries = await dailyEntriesApi.listDailyEntries({
          personId: selectedEmployee
        });
        setDailyEntries(fetchedDailyEntries);
        setPersonDailyEntry(
          fetchedDailyEntries.find(
            (item) =>
              item.person === selectedEmployee &&
              DateTime.fromJSDate(item.date).toISODate() === selectedDate.toISODate()
          )
        );
      } catch (error) {
        setError(`${strings.error.dailyEntriesFetch}, ${error}`);
      }
    }
  };

  return (
    <div>
      <div style={{ marginTop: "16px" }} />
      {!personDailyEntry || !dailyEntries.length || !personTotalTime ? (
        <Card sx={{ p: "25%", display: "flex", justifyContent: "center" }}>
          {loading ? <CircularProgress sx={{ scale: "150%" }} /> : null}
        </Card>
      ) : (
        <TimebankContent
          handleDailyEntryChange={handleDailyEntryChange}
          loading={loading}
          selectedEmployee={selectedEmployee || loggedInPerson?.id}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}
    </div>
  );
};

export default TimebankScreen;
