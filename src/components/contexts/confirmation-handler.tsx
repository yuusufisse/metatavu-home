import { Divider, Typography } from "@mui/material";
import { ReactNode } from "react";
import GenericDialog from "../generics/generic-dialog";
import strings from "../../localization/strings";

/**
 * Component properties
 */
interface Props {
  children: ReactNode;
  confirmation: string | undefined;
  setConfirmation: (confirmation: string | undefined) => void;
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
        confirmButtonText={strings.confirmationHandler.confirmButtonText}
        cancelButtonText={strings.confirmationHandler.cancelButtonText}
        title={strings.confirmationHandler.title}
      >
        {confirmation && (
          <Typography marginBottom={3} sx={{ fontSize: 16, fontWeight: "bold" }}>
            {confirmation}
          </Typography>
        )}
        <Divider />
      </GenericDialog>
    </>
  );
};

export default ConfirmationHandler;
