import { Box, Divider, Grid } from "@mui/material";
import {
  VacationRequest,
  VacationRequestStatus,
  VacationType
} from "../../../../../../generated/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { DataGridRow, VacationData, ToolbarFormModes } from "../../../../../../types";
import CreateVacationRequest from "../../../create-vacation-request";
import { hasAllPropsDefined } from "../../../../../../utils/check-utils";
import { GridRowId } from "@mui/x-data-grid";
import UpdateVacationRequest from "../../../update-vacation-request";
import FormFields from "./form-fields";
import { getVacationDataFromRow } from "./get-vacation-data-from-row";
import { determineToolbarFormMode } from "../../../../../../utils/toolbar-utils";

/**
 * Component properties
 */
interface TableFormProps {
  formOpen: boolean;
  setFormOpen: Dispatch<SetStateAction<boolean>>;
  vacationRequests: VacationRequest[];
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
  setVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
  selectedRowIds: GridRowId[] | undefined;
  rows: DataGridRow[] | undefined;
  toolbarFormMode: ToolbarFormModes;
  setToolbarFormMode: Dispatch<SetStateAction<ToolbarFormModes>>;
}
/**
 * Table form component
 *
 * @param props TableFormProps
 */
const TableForm = (props: TableFormProps) => {
  const {
    formOpen,
    setFormOpen,
    vacationRequestStatuses,
    setVacationRequestStatuses,
    vacationRequests,
    setVacationRequests,
    selectedRowIds,
    rows,
    toolbarFormMode,
    setToolbarFormMode
  } = props;
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
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [selectedVacationRequestId, setSelectedVacationRequestId] = useState<string | undefined>(
    undefined
  );
  const { createVacationRequest } = CreateVacationRequest({
    vacationRequests: vacationRequests,
    vacationRequestStatuses: vacationRequestStatuses,
    setVacationRequestStatuses: setVacationRequestStatuses,
    setVacationRequests: setVacationRequests
  });
  const { updateVacationRequest } = UpdateVacationRequest({
    vacationRequests: vacationRequests,
    setVacationRequests: setVacationRequests
  });

  /**
   * Reset vacation data
   */
  const resetVacationData = () => {
    setVacationData({
      type: "VACATION",
      message: "",
      startDate: dateTimeNow,
      endDate: dateTimeNow,
      days: 1
    });
    setInitialStartDate(undefined);
    setInitialEndDate(undefined);
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
   * Vacation data validation
   */
  useEffect(() => {
    if (hasAllPropsDefined(vacationData) && vacationData.message?.length) {
      setReadyToSubmit(true);
    } else {
      setReadyToSubmit(false);
    }
  });

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
    resetVacationData();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Divider />
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
                readyToSubmit={readyToSubmit}
                setVacationData={setVacationData}
                vacationData={vacationData}
              />
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TableForm;
