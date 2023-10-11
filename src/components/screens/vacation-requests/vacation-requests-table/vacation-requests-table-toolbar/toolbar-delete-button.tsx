import { Delete } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { SetStateAction } from "jotai";
import { Dispatch } from "react";
import strings from "../../../../../localization/strings";

/**
 * Component properties
 */
interface Props {
  setConfirmation: Dispatch<SetStateAction<string | undefined>>;
}
/**
 * Delete Button component
 *
 * @param props component properties
 */
const ToolbarDeleteButton = ({ setConfirmation }: Props) => {
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
      <Typography variant="h6">&nbsp;{strings.tableToolbar.delete}</Typography>
    </Button>
  );
};

export default ToolbarDeleteButton;
