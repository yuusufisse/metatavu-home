import { Delete } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

/**
 * Component properties
 */
interface ToolbarDeleteButtonProps {
  deleteVacationsData: Function;
}
/**
 * Delete Button component
 *
 * @param props ToolbarDeleteButtonProps
 */
const ToolbarDeleteButton = (props: ToolbarDeleteButtonProps) => {
  const { deleteVacationsData } = props;
  return (
    <Button
      variant="contained"
      sx={{
        width: "100%"
      }}
      onClick={() => {
        deleteVacationsData();
      }}
    >
      <Delete />
      <Typography variant="h6">&nbsp;Delete</Typography>
    </Button>
  );
};

export default ToolbarDeleteButton;
