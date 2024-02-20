import { Button, Box, LinearProgress, Snackbar, Alert } from "@mui/material";
import { DateTime } from "luxon";
import { SyntheticEvent, useState } from "react";
import { useApi } from "../../hooks/use-api";
import { errorAtom } from "../../atoms/error";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import SyncDialog from "../contexts/sync-handler";
import strings from "../../localization/strings";
import { dailyEntriesAtom, personTotalTimeAtom, personsAtom } from "../../atoms/person";
import { DailyEntry, Person } from "../../generated/client";
import config from "../../app/config";
import { userProfileAtom } from "../../atoms/auth";

/**
 * Sync button component
 */
const SyncButton = () => {
  const { synchronizeApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const yesterday: DateTime = DateTime.now().minus({ days: 1 });
  const [syncStartDate, setSyncStartDate] = useState(yesterday);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncHandlerOpen, setSyncHandlerOpen] = useState(false);
  const [dailyEntries, setDailyEntries] = useAtom(dailyEntriesAtom);
  const [persons, setPersons] = useAtom(personsAtom);
  const { personsApi, dailyEntriesApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const personTotalTime = useAtomValue(personTotalTimeAtom);

  /**
   * Get latest daily entry date
   */
  const getLatestDailyEntryDate = async () => {
    let dailyEntryDates: DateTime[] = [];

    if (dailyEntries.length) {
      dailyEntryDates = dailyEntries.map((dailyEntry) => DateTime.fromJSDate(dailyEntry.date));
    } else {
      let tempPersons: Person[] = persons;
      let dailyEntries: DailyEntry[] = [];

      if (!persons.length) {
        try {
          tempPersons = await personsApi.listPersons({});
          setPersons(tempPersons);
        } catch (error) {
          setError(`${strings.error.fetchFailedGeneral}, ${error}`);
        }
      }

      if (tempPersons.length && personTotalTime) {
        try {
          const loggedInPerson = persons.find(
            (person: Person) => person.keycloakId === userProfile?.id
          );

          dailyEntries = await dailyEntriesApi.listDailyEntries({
            personId: loggedInPerson?.id || config.person.forecastUserIdOverride
          });
          setDailyEntries(dailyEntries);
        } catch (error) {
          setError(`${strings.error.fetchFailedNoEntriesGeneral}, ${error}`);
        }
      }

      if (dailyEntries.length) {
        dailyEntryDates = dailyEntries.map((dailyEntry) => DateTime.fromJSDate(dailyEntry.date));
      }
    }

    if (dailyEntryDates.length) {
      setSyncStartDate(DateTime.max(...dailyEntryDates));
    }
  };

  /**
   * Handle sync button close
   *
   * @param _event event object
   * @param reason reason for button close
   */
  const handleSyncButtonClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setSyncSuccess(false);
  };

  /**
   * Synchronize time entries
   */
  const synchronizeTimeEntries = async () => {
    setSyncing(true);
    try {
      await synchronizeApi.synchronizeTimeEntries({
        after: syncStartDate.toJSDate() || undefined,
        syncDeleted: false
      });
      setSyncSuccess(true);
    } catch (error) {
      setError(`${strings.syncButton.error} ${error}`);
      setSyncSuccess(false);
    }
    setSyncing(false);
    setSyncStartDate(yesterday);
  };

  /**
   * Event handler for sync button click
   */
  const handleSyncButtonClick = () => {
    getLatestDailyEntryDate().then(() => {
      setSyncHandlerOpen(true);
    });
  };

  return (
    <>
      <SyncDialog
        setSyncStartDate={setSyncStartDate}
        syncStartDate={syncStartDate}
        syncHandlerOpen={syncHandlerOpen}
        setSyncHandlerOpen={setSyncHandlerOpen}
        synchronizeTimeEntries={synchronizeTimeEntries}
      />
      <Button
        variant="contained"
        onClick={() => {
          handleSyncButtonClick();
        }}
        disabled={syncing}
      >
        <Box sx={{ width: "100%" }}>
          {strings.syncButton.sync}
          {syncing && <LinearProgress />}
        </Box>
      </Button>
      <Snackbar open={syncSuccess} autoHideDuration={6000} onClose={handleSyncButtonClose}>
        <Alert onClose={handleSyncButtonClose} severity={"success"} sx={{ width: "100%" }}>
          {strings.syncButton.success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SyncButton;
