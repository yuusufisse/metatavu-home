import { Delete } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { SetStateAction } from "jotai";
import { Dispatch } from "react";

/**
 * Component properties
 */
interface ToolbarDeleteButtonProps {
  setConfirmation: Dispatch<SetStateAction<string | undefined>>;
}
/**
 * Delete Button component
 *
 * @param props ToolbarDeleteButtonProps
 */
const ToolbarDeleteButton = ({ setConfirmation }: ToolbarDeleteButtonProps) => {
  return (
    <Button
      variant="contained"
      sx={{
        width: "100%"
      }}
      onClick={() => {
        setConfirmation("Delete the selected Vacation Request(s)?");
      }}
    >
      <Delete />
      <Typography variant="h6">&nbsp;Delete</Typography>
    </Button>
  );
};

export default ToolbarDeleteButton;
