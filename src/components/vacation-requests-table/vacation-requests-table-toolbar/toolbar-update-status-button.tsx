import { Check, Close } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import { VacationRequestStatuses } from "../../../generated/client";
import strings from "../../../localization/strings";

/**
 * Component properties
 */
interface UpdateStatusButtonProps {
  updateVacationRequestStatuses: (
    newStatus: VacationRequestStatuses,
    selectedRowIds: GridRowId[]
  ) => Promise<void>;
  approval: boolean;
  selectedRowIds: GridRowId[];
}

/**
 * Status update button component
 *
 * @param props component properties
 */
const UpdateStatusButton = ({
  updateVacationRequestStatuses,
  approval,
  selectedRowIds
}: UpdateStatusButtonProps) => (
  <Button
    variant="contained"
    sx={{
      width: "100%"
    }}
    onClick={() =>
      updateVacationRequestStatuses(
        approval ? VacationRequestStatuses.APPROVED : VacationRequestStatuses.DECLINED,
        selectedRowIds
      )
    }
  >
    {approval ? <Check /> : <Close />}
    <Typography variant="body1">
      {approval
        ? strings.toolbarUpdateStatusButton.approve
        : strings.toolbarUpdateStatusButton.decline}
    </Typography>
  </Button>
);

export default UpdateStatusButton;
