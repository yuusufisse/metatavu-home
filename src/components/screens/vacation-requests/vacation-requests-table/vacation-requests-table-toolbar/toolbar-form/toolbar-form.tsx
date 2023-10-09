import { Box, Grid } from "@mui/material";
import { VacationRequest, VacationType } from "../../../../../../generated/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { DataGridRow, VacationData, ToolbarFormModes } from "../../../../../../types";
import { GridRowId } from "@mui/x-data-grid";
import FormFields from "./form-fields";
import { getVacationDataFromRow } from "./get-vacation-data-from-row";
import { determineToolbarFormMode } from "../../../../../../utils/toolbar-utils";

/**
 * Component properties
 */
interface Props {
  formOpen: boolean;
  setFormOpen: Dispatch<SetStateAction<boolean>>;
  vacationRequests: VacationRequest[];
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
  updateVacationRequest: (
    vacationData: VacationData,
    vacationRequestId: string | undefined
  ) => Promise<void>;
  createVacationRequest: (vacationData: VacationData) => Promise<void>;
  selectedRowIds: GridRowId[] | undefined;
  rows: DataGridRow[] | undefined;
  toolbarFormMode: ToolbarFormModes;
  setToolbarFormMode: Dispatch<SetStateAction<ToolbarFormModes>>;
}

/**
 * Table form component
 *
 * @param props component properties
 */
const TableForm = ({
  formOpen,
  setFormOpen,
  vacationRequests,
  createVacationRequest,
  updateVacationRequest,
  selectedRowIds,
  rows,
  toolbarFormMode,
  setToolbarFormMode
}: Props) => {
  const dateTimeNow = DateTime.now();
  const [initialStartDate, setInitialStartDate] = useState<DateTime | undefined>(dateTimeNow);
  const [initialEndDate, setInitialEndDate] = useState<DateTime | undefined>(dateTimeNow);
  const [vacationData, setVacationData] = useState<VacationData>({
    startDate: dateTimeNow,
    endDate: dateTimeNow,
    type: VacationType.VACATION,
    message: "",
    days: 1
  });
  const [selectedVacationRequestId, setSelectedVacationRequestId] = useState<string | undefined>(
    undefined
  );

  /**
   * Reset vacation data
   */
  const resetVacationData = () => {
    setVacationData({
      type: VacationType.VACATION,
      startDate: dateTimeNow,
      endDate: dateTimeNow,
      message: "",
      days: 1
    });
    setInitialStartDate(dateTimeNow);
    setInitialEndDate(dateTimeNow);
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
   * Set vacation data from selected row if toolbar is in edit mode
   */
  useEffect(() => {
    if (toolbarFormMode === ToolbarFormModes.EDIT && selectedRowIds?.length && rows?.length) {
      getVacationDataFromRow({
        rows: rows,
        selectedRowIds: selectedRowIds,
        vacationRequests: vacationRequests,
        setSelectedVacationRequestId: setSelectedVacationRequestId,
        setInitialStartDate: setInitialStartDate,
        setInitialEndDate: setInitialEndDate,
        setVacationData: setVacationData
      });
    } else {
      resetVacationData();
    }
  }, [toolbarFormMode]);

  /**
   * Handle form submit
   */
  const handleFormSubmit = () => {
    if (toolbarFormMode === ToolbarFormModes.CREATE) {
      createVacationRequest(vacationData);
    } else if (toolbarFormMode === ToolbarFormModes.EDIT) {
      updateVacationRequest(vacationData, selectedVacationRequestId);
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
            <FormFields
              dateTimeNow={dateTimeNow}
              initialEndDate={initialEndDate}
              initialStartDate={initialStartDate}
              setVacationData={setVacationData}
              vacationData={vacationData}
            />
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TableForm;
