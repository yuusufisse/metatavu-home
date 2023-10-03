import { DialogContent, Divider, Typography } from "@mui/material";
import { Dispatch, ReactNode, useMemo } from "react";
import GenericDialog from "../generics/generic-dialog";
import { SetStateAction } from "jotai";

/**
 * Component properties
 */
interface Props {
  children: ReactNode;
  confirmation: string | undefined;
  setConfirmation: Dispatch<SetStateAction<string | undefined>>;
  deleteVacationsData: () => void;
}

/**
 * Confirmation handler component
 *
 * @param props component properties
 */
const ConfirmationHandler = ({
  children,
  confirmation,
  setConfirmation,
  deleteVacationsData
}: Props) => {
  /**
   * Handles confirmation message
   *
   * @param message confirmation message
   */
  const handleConfirmation = async (message: string) => {
    setConfirmation(message);
  };

  /**
   * Memoized context value
   */
  useMemo(
    () => ({
      setConfirmation: handleConfirmation
    }),
    [confirmation]
  );

  /**
   * Component render
   */
  return (
    <>
      {children}
      <GenericDialog
        open={confirmation !== undefined}
        error={false}
        onClose={() => setConfirmation(undefined)}
        onCancel={() => setConfirmation(undefined)}
        onConfirm={() => {
          setConfirmation(undefined);
          deleteVacationsData();
        }}
        confirmButtonText={"Yes"}
        cancelButtonText={"No"}
        title={"Are you sure?"}
      >
        <DialogContent id="confirmation-dialog-description">
          {confirmation && (
            <Typography marginBottom={3} sx={{ fontSize: 16, fontWeight: "bold" }}>
              {confirmation}
            </Typography>
          )}
        </DialogContent>
        <Divider />
      </GenericDialog>
    </>
  );
};

export default ConfirmationHandler;
