import { Divider } from "@mui/material";
import { Dispatch } from "react";
import GenericDialog from "../generics/generic-dialog";
import { DatePicker } from "@mui/x-date-pickers";
import { SetStateAction } from "jotai/ts3.8/vanilla";
import { DateTime } from "luxon";

/**
 * Component properties
 */
interface Props {
  syncStartDate: DateTime;
  setSyncStartDate: Dispatch<SetStateAction<DateTime>>;
  yesterday: DateTime;
  syncHandlerOpen: boolean;
  setSyncHandlerOpen: Dispatch<SetStateAction<boolean>>;
  synchronize: () => void;
}

/**
 * syncStartDate handler component
 *
 * @param props component properties
 */
const SyncHandler = ({
  syncStartDate,
  setSyncStartDate,
  syncHandlerOpen,
  setSyncHandlerOpen,
  synchronize
}: Props) => {
  /**
   * Component render
   */
  return (
    <>
      <GenericDialog
        open={syncHandlerOpen}
        onClose={() => {
          setSyncHandlerOpen(false);
        }}
        onCancel={() => {
          setSyncHandlerOpen(false);
        }}
        onConfirm={() => {
          synchronize();
          setSyncHandlerOpen(false);
        }}
        cancelButtonText={"Cancel"}
        confirmButtonText={"Sync"}
        title={"Select date"}
      >
        <DatePicker
          label="Sync from"
          value={syncStartDate}
          onChange={(newValue: DateTime | null) => newValue && setSyncStartDate(newValue)}
        />

        <Divider />
      </GenericDialog>
    </>
  );
};

export default SyncHandler;
