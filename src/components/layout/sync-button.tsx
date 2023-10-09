import { Button, Box, LinearProgress, Snackbar, Alert } from "@mui/material";
import { DateTime } from "luxon";
import { useState } from "react";
import { useApi } from "../../hooks/use-api";
import { errorAtom } from "../../atoms/error";
import { useSetAtom } from "jotai";
import SyncHandler from "../contexts/sync-handler";

/**
 * Sync button component
 */
const SyncButton = () => {
  const { synchronizeApi } = useApi();
  const setError = useSetAtom(errorAtom);
  const yesterday = DateTime.now().minus({ days: 1 });
  const [syncStartDate, setSyncStartDate] = useState<DateTime>(yesterday);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean | undefined>(false);
  const [syncHandlerOpen, setSyncHandlerOpen] = useState<boolean>(false);
  const handleSyncButtonClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setSyncSuccess(undefined);
  };

  /**
   * Synchronize time-bank-api work-time balances
   */
  const synchronize = async () => {
    setIsSyncing(true);
    try {
      await synchronizeApi.synchronizeTimeEntries({
        after: syncStartDate.toJSDate() || undefined,
        syncDeleted: false
      });
      setSyncSuccess(true);
    } catch (error) {
      setError(`${"Synchronizing has failed"} ${error}`);
      setSyncSuccess(false);
    }
    setIsSyncing(false);
    setSyncStartDate(yesterday);
  };

  /**
   * Event handler for sync button click
   */
  const handleSyncButtonClick = async () => {
    setSyncHandlerOpen(true);
  };
  return (
    <>
      <SyncHandler
        setSyncStartDate={setSyncStartDate}
        syncStartDate={syncStartDate}
        yesterday={yesterday}
        syncHandlerOpen={syncHandlerOpen}
        setSyncHandlerOpen={setSyncHandlerOpen}
        synchronize={synchronize}
      />
      <Button
        variant="contained"
        onClick={() => {
          handleSyncButtonClick();
        }}
        disabled={isSyncing}
      >
        <Box sx={{ width: "100%" }}>
          Sync
          {isSyncing ? <LinearProgress /> : null}
        </Box>
      </Button>
      <Snackbar open={syncSuccess} autoHideDuration={6000} onClose={handleSyncButtonClose}>
        <Alert onClose={handleSyncButtonClose} severity={"success"} sx={{ width: "100%" }}>
          Synchronization was successful!
        </Alert>
      </Snackbar>
    </>
  );
};

export default SyncButton;
