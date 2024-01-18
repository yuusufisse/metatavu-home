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
  const loggedInPerson = persons.find((person: Person) => person.keycloakId === userProfile?.id);
  const [selectedEmployee, setSelectedEmployee] = useState(loggedInPerson?.id);

  useEffect(() => {
    if (selectedEmployee) {
      getSelectedPersonTotalTime(selectedEmployee);
    } else {
      getPersonTotalTime();
    }
  }, [selectedEmployee, timespan]);

  useEffect(() => {
    getPersonDailyEntries();
    const selectedPerson = persons.find((person) => person.id === selectedEmployee);

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
    if (selectedEmployee) {
      if (selectedPersonId) {
        setLoading(true);
        const loggedInPerson = persons.find(
          (person: Person) => person.keycloakId === userProfile?.id
        );
        if (loggedInPerson || config.person.id) {
          try {
            const fetchedPersonTotalTime = await personsApi.listPersonTotalTime({
              personId: selectedPersonId,
              timespan: timespan || Timespan.ALL_TIME,
              before: new Date()
            });
            setPersonTotalTime(fetchedPersonTotalTime[0]);
          } catch (error) {
            setError(`${strings.error.totalTimeFetch}, ${error}`);
          }
        }
      }
    }
    setLoading(false);
  };

  /**
   * Gets person's total time data.
   */
  const getPersonTotalTime = async () => {
    if (persons.length) {
      setLoading(true);
      const loggedInPerson = persons.find(
        (person: Person) => person.keycloakId === userProfile?.id
      );
      if (loggedInPerson || config.person.id) {
        try {
          const fetchedPersonTotalTime = await personsApi.listPersonTotalTime({
            personId: loggedInPerson?.id || config.person.id,
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
    if (!persons.length || !userProfile) return null;

    const loggedInPerson = persons.find((person: Person) => person.keycloakId === userProfile?.id);
    if (loggedInPerson || config.person.id) {
      try {
        const fetchedDailyEntries = await dailyEntriesApi.listDailyEntries({
          personId: loggedInPerson?.id || config.person.id
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
  const handleDailyEntryChange = (selectedDate: DateTime) => {
    if (selectedDate && selectedEmployee !== null) {
      setPersonDailyEntry(
        dailyEntries.find(
          (item) =>
            item.person === selectedEmployee &&
            DateTime.fromJSDate(item.date).toISODate() === selectedDate.toISODate()
        )
      );
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
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
        />
      )}
    </div>
  );
};

export default TimebankScreen;
