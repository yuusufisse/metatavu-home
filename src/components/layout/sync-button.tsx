import { Button, Box, LinearProgress, Snackbar, Alert } from "@mui/material";
import { DateTime } from "luxon";
import { SyntheticEvent, useEffect, useState } from "react";
import { useApi } from "../../hooks/use-api";
import { errorAtom } from "../../atoms/error";
import { useAtomValue, useSetAtom } from "jotai";
import SyncDialog from "../contexts/sync-handler";
import strings from "../../localization/strings";
import { dailyEntriesAtom } from "../../atoms/person";

/**
 * Sync button component
 */
const SyncButton = () => {
  const { synchronizeApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const yesterday = DateTime.now().minus({ days: 1 });
  const [syncStartDate, setSyncStartDate] = useState(yesterday);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncHandlerOpen, setSyncHandlerOpen] = useState(false);
  const dailyEntries = useAtomValue(dailyEntriesAtom);

  useEffect(() => {
    getLatestDailyEntryDate();
  }, [dailyEntries]);

  /**
   * Get latest daily entry date
   */
  const getLatestDailyEntryDate = () => {
    let dailyEntryDates: DateTime[] = [];
    if (dailyEntries) {
      dailyEntryDates = dailyEntries.map((dailyEntry) => DateTime.fromJSDate(dailyEntry.date));
    }
    if (dailyEntryDates.length) {
      setSyncStartDate(DateTime.max(...dailyEntryDates));
      console.log("latest: ", DateTime.max(...dailyEntryDates));
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
    setSyncHandlerOpen(true);
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
