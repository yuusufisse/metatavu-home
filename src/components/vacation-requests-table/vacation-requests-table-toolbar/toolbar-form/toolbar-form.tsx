import { Box, Grid } from "@mui/material";
import { VacationType } from "../../../../generated/client";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { VacationsDataGridRow, VacationData, ToolbarFormModes } from "../../../../types";
import { GridRowId } from "@mui/x-data-grid";
import { determineToolbarFormMode } from "../../../../utils/toolbar-utils";
import { useAtomValue } from "jotai";
import ToolbarFormFields from "./toolbar-form-fields";
import { allVacationRequestsAtom, vacationRequestsAtom } from "../../../../atoms/vacation";
import UserRoleUtils from "../../../../utils/user-role-utils";

/**
 * Component properties
 */
interface Props {
  formOpen: boolean;
  setFormOpen: (formOpen: boolean) => void;
  updateVacationRequest: (vacationData: VacationData, vacationRequestId: string) => Promise<void>;
  createVacationRequest: (vacationData: VacationData) => Promise<void>;
  selectedRowIds: GridRowId[];
  rows: VacationsDataGridRow[];
  toolbarFormMode: ToolbarFormModes;
  setToolbarFormMode: (toolbarFormMode: ToolbarFormModes) => void;
  setSelectedRowIds: (selectedRowIds: GridRowId[]) => void;
}

/**
 * Toolbar form component
 *
 * @param props component properties
 */
const ToolbarForm = ({
  formOpen,
  setFormOpen,
  createVacationRequest,
  updateVacationRequest,
  selectedRowIds,
  rows,
  toolbarFormMode,
  setToolbarFormMode,
  setSelectedRowIds
}: Props) => {
  const dateTimeNow = DateTime.now();
  const [startDate, setStartDate] = useState<DateTime>(dateTimeNow);
  const [endDate, setEndDate] = useState<DateTime>(dateTimeNow);
  const defaultVacationData = {
    type: VacationType.VACATION,
    startDate: dateTimeNow,
    endDate: dateTimeNow,
    message: "",
    days: 1
  };
  const [vacationData, setVacationData] = useState<VacationData>(defaultVacationData);
  const [selectedVacationRequestId, setSelectedVacationRequestId] = useState("");
  const adminMode = UserRoleUtils.adminMode();
  const vacationRequests = useAtomValue(adminMode ? allVacationRequestsAtom : vacationRequestsAtom);

  /**
   * Reset vacation data
   */
  const resetVacationData = () => {
    setVacationData(defaultVacationData);
    setStartDate(dateTimeNow);
    setEndDate(dateTimeNow);
  };

  /**
   * Determine toolbar form mode
   */
  useEffect(() => {
    determineToolbarFormMode({
      formOpen: formOpen,
      selectedRowIds: selectedRowIds,
      setToolbarFormMode: setToolbarFormMode
    });
  }, [selectedRowIds, formOpen]);

  /**
   * Get vacation data from row
   */
  const getVacationDataFromRow = () => {
    const selectedVacationRow = rows.find((row) => row.id === selectedRowIds[0]);

    if (selectedVacationRow) {
      const selectedVacationRequest = vacationRequests.find(
        (vacationRequest) => vacationRequest.id === selectedVacationRow.id
      );

      if (selectedVacationRequest?.id) {
        const startDate = DateTime.fromJSDate(selectedVacationRequest.startDate);
        const endDate = DateTime.fromJSDate(selectedVacationRequest.endDate);
        const days = selectedVacationRequest.days;

        setVacationData({
          type: selectedVacationRequest.type,
          message: selectedVacationRequest.message,
          startDate: startDate,
          endDate: endDate,
          days: days
        });
        setSelectedVacationRequestId(selectedVacationRequest.id);
        setStartDate(startDate);
        setEndDate(endDate);
      }
    }
  };

  /**
   * Set vacation data from selected row if toolbar is in edit mode
   */
  useEffect(() => {
    if (toolbarFormMode === ToolbarFormModes.EDIT && selectedRowIds?.length && rows?.length) {
      getVacationDataFromRow();
    } else {
      resetVacationData();
    }
  }, [toolbarFormMode]);

  /**
   * Handle form submit
   */
  const handleFormSubmit = async () => {
    if (toolbarFormMode === ToolbarFormModes.CREATE) {
      await createVacationRequest(vacationData);
    } else if (toolbarFormMode === ToolbarFormModes.EDIT) {
      await updateVacationRequest(vacationData, selectedVacationRequestId).then(() => {
        setSelectedRowIds([]);
      });
    }
    setFormOpen(false);
    if (toolbarFormMode !== ToolbarFormModes.EDIT) {
      resetVacationData();
    }
  };

  return (
    <Box sx={{ padding: "10px", width: "100%" }}>
      <Grid container>
        <Grid item xs={12}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleFormSubmit();
            }}
          >
            <ToolbarFormFields
              dateTimeNow={dateTimeNow}
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setVacationData={setVacationData}
              vacationData={vacationData}
              toolbarFormMode={toolbarFormMode}
            />
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ToolbarForm;
