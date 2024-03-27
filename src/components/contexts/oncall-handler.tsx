import React, { useState } from "react";
import GenericDialog from "../generics/generic-dialog";
import { OnCallCalendarEntry } from "../../types";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { DateTime } from "luxon";

/**
 * Component properties
 */
interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  onCallEntry: OnCallCalendarEntry;
  updatePaidStatus: (entry: OnCallCalendarEntry) => void;
}

const OnCallHandler = ({ open, setOpen, onCallEntry, updatePaidStatus }: Props) => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  if (onCallEntry)
    return (
      <GenericDialog
        title={`Week ${DateTime.fromISO(onCallEntry.date).weekNumber}`}
        open={open}
        error={false}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
          <DialogContent>Are you sure?</DialogContent>
          <DialogActions>
            <Button onClick={async () => {await updatePaidStatus(onCallEntry); setConfirmationOpen(false); setOpen(false)}}>Yes</Button>
            <Button onClick={() => setConfirmationOpen(false)}>No</Button>
          </DialogActions>
        </Dialog>
        Person: {onCallEntry.person}
        <br />
        Paid status: {onCallEntry.paid?.toString()}
        <br />
        <Button onClick={() => setConfirmationOpen(true)}>Update status</Button>
      </GenericDialog>
    );
  return "";
};

export default OnCallHandler;
