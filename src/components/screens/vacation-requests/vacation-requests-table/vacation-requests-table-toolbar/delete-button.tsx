import { Delete } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

/**
 * Interface describing DeleteButton properties
 */
interface DeleteButtonProps {
  deleteVacationsData: Function;
}
/**
 * Delete Button component
 *
 * @param props DeleteButtonProps
 */
const DeleteButton = (props: DeleteButtonProps) => {
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

export default DeleteButton;
