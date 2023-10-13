import { Box, Grid } from "@mui/material";
import { VacationType } from "../../../../../../generated/client";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { DataGridRow, VacationData, ToolbarFormModes } from "../../../../../../types";
import { GridRowId } from "@mui/x-data-grid";
import FormFields from "./form-fields";
import { getVacationDataFromRow } from "./get-vacation-data-from-row";
import { determineToolbarFormMode } from "../../../../../../utils/toolbar-utils";
import { useAtomValue } from "jotai";
import { vacationRequestsAtom } from "../../../../../../atoms/vacationRequests";

/**
 * Component properties
 */
interface Props {
  formOpen: boolean;
  setFormOpen: (formOpen: boolean) => void;
  updateVacationRequest: (
    vacationData: VacationData,
    vacationRequestId: string | undefined
  ) => Promise<void>;
  createVacationRequest: (vacationData: VacationData) => Promise<void>;
  selectedRowIds: GridRowId[];
  rows: DataGridRow[];
  toolbarFormMode: ToolbarFormModes;
  setToolbarFormMode: (toolbarFormMode: ToolbarFormModes) => void;
}

/**
 * Table form component
 *
 * @param props component properties
 */
const TableForm = ({
  formOpen,
  setFormOpen,
  createVacationRequest,
  updateVacationRequest,
  selectedRowIds,
  rows,
  toolbarFormMode,
  setToolbarFormMode
}: Props) => {
  const dateTimeNow = DateTime.now();
  const [startDate, setStartDate] = useState<DateTime>(dateTimeNow);
  const [endDate, setEndDate] = useState<DateTime>(dateTimeNow);
  const [vacationData, setVacationData] = useState<VacationData>({
    startDate: dateTimeNow,
    endDate: dateTimeNow,
    type: VacationType.VACATION,
    message: "",
    days: 1
  });
  const [selectedVacationRequestId, setSelectedVacationRequestId] = useState("");
  const vacationRequests = useAtomValue(vacationRequestsAtom);

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
   * Set vacation data from selected row if toolbar is in edit mode
   */
  useEffect(() => {
    if (toolbarFormMode === ToolbarFormModes.EDIT && selectedRowIds?.length && rows?.length) {
      getVacationDataFromRow({
        vacationRequests: vacationRequests,
        rows: rows,
        selectedRowIds: selectedRowIds,
        setSelectedVacationRequestId: setSelectedVacationRequestId,
        setStartDate: setStartDate,
        setEndDate: setEndDate,
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

export default TableForm;
