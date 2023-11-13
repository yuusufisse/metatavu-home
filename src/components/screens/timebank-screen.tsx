import { useEffect, useState } from "react";
import { Person, Timespan } from "../../generated/client";
import { CircularProgress, Card, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { userProfileAtom } from "../../atoms/auth";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { errorAtom } from "../../atoms/error";
import {
  dailyEntriesAtom,
  personDailyEntryAtom,
  personTotalTimeAtom,
  personsAtom,
  timespanAtom
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
  const timespan = useAtomValue(timespanAtom);
  const setError = useSetAtom(errorAtom);
  const { personsApi, dailyEntriesApi } = useApi();
  const persons = useAtomValue(personsAtom);
  const [loading, setLoading] = useState(false);
  const [personTotalTime, setPersonTotalTime] = useAtom(personTotalTimeAtom);
  const [personDailyEntry, setPersonDailyEntry] = useAtom(personDailyEntryAtom);
  const [dailyEntries, setDailyEntries] = useAtom(dailyEntriesAtom);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(
    userProfile?.id ? Number(localStorage.getItem("selectedEmployee") || userProfile.id) : null
  );

  useEffect(() => {
    // Ensure that there is a selected employee before fetching data
    if (selectedEmployee !== null) {
      getPersonTotalTime(selectedEmployee);
    }
  }, [selectedEmployee, timespan]);

  useEffect(() => {
    getPersonDailyEntries();
  }, [persons]);

  // Save selectedEmployee to localStorage
  useEffect(() => {
    if (selectedEmployee !== null) {
      localStorage.setItem("selectedEmployee", selectedEmployee.toString());
    }
  }, [selectedEmployee]);

  /**
   * Gets person's total time data.
   */
  const getPersonTotalTime = async (selectedPersonId: number) => {
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
        ); // Gets today's entry or earlier
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
    if (selectedDate) {
      setPersonDailyEntry(
        dailyEntries.find(
          (item) => DateTime.fromJSDate(item.date).toISODate() === selectedDate?.toISODate()
        )
      );
    }
  };

  return (
    <div>
      <Card sx={{ p: "1%", display: "flex", justifyContent: "center" }}>
        <FormControl fullWidth>
          <InputLabel id="employee-select-label">Select Employee</InputLabel>
          <Select
            labelId="employee-select-label"
            id="employee-select"
            value={selectedEmployee}
            onChange={(event) => setSelectedEmployee(Number(event.target.value))}
            label="Select Employee"
          >
            {persons.map((person) => (
              <MenuItem key={person.id} value={person.id}>
                {`${person.firstName} ${person.lastName}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Card>

      <div style={{ marginTop: "16px" }} />

      {!personDailyEntry || !dailyEntries.length || !personTotalTime ? (
        <Card sx={{ p: "25%", display: "flex", justifyContent: "center" }}>
          {loading ? <CircularProgress sx={{ scale: "150%" }} /> : null}
        </Card>
      ) : (
        <TimebankContent handleDailyEntryChange={handleDailyEntryChange} loading={loading} />
      )}
    </div>
  );
};

export default TimebankScreen;
