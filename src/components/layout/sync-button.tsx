import { Button, Box, LinearProgress, Snackbar, Alert } from "@mui/material";
import { DateTime } from "luxon";
import { SyntheticEvent, useState } from "react";
import { useApi } from "../../hooks/use-api";
import { errorAtom } from "../../atoms/error";
import { useSetAtom } from "jotai";
import SyncDialog from "../contexts/sync-handler";
import strings from "../../localization/strings";

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
    setIsSyncing(true);
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
    setIsSyncing(false);
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
        disabled={isSyncing}
      >
        <Box sx={{ width: "100%" }}>
          {strings.syncButton.sync}
          {isSyncing && <LinearProgress />}
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
