import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from "@mui/material";
import {
  VacationRequest,
  VacationRequestStatus,
  VacationType
} from "../../../../../../generated/client";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { DateTime } from "luxon";
import getLocalizedVacationType from "../../../../../../utils/vacation-type-utils";
import { DataGridRow, VacationData, ToolbarFormModes } from "../../../../../../types";
import CreateVacationRequest from "../../../create-vacation-request";
import { hasAllPropsDefined } from "../../../../../../utils/check-utils";
import DateRangePicker from "../../../../../generics/date-range-picker";
import { GridRowId } from "@mui/x-data-grid";
import UpdateVacationRequest from "../../../update-vacation-request";

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
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [selectedVacationRequestId, setSelectedVacationRequestId] = useState<string | undefined>(
    undefined
  );

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
    if (selectedRowIds) {
      switch (true) {
        case selectedRowIds.length === 0 && formOpen:
          setToolbarFormMode(ToolbarFormModes.CREATE);
          break;
        case selectedRowIds.length === 1:
          setToolbarFormMode(ToolbarFormModes.EDIT);
          break;
        default:
          setToolbarFormMode(ToolbarFormModes.NONE);
          break;
      }
    }
  }, [selectedRowIds, formOpen]);

  /**
   * Set vacation data if toolbar form is opened in edit mode
   */
  useEffect(() => {
    if (toolbarFormMode === ToolbarFormModes.EDIT && selectedRowIds?.length && rows?.length) {
      const selectedVacationRow = rows.find((row) => row.id === selectedRowIds[0]);

      if (selectedVacationRow) {
        const selectedVacationRequest = vacationRequests.find(
          (vacationRequest) => vacationRequest.id === selectedVacationRow.id
        );

        if (selectedVacationRequest) {
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
          setInitialStartDate(startDate);
          setInitialEndDate(endDate);
        }
      }
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

  /**
   * Handle dates
   *
   * @param startDate
   * @param endDate
   * @param days
   */
  const setDates = (
    startDate: DateTime | undefined,
    endDate: DateTime | undefined,
    days: number
  ) => {
    setVacationData({
      ...vacationData,
      startDate: startDate,
      endDate: endDate,
      days: days
    });
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
              <FormControl sx={{ width: "100%" }}>
                <FormLabel>Vacation Type</FormLabel>
                <Select
                  name="type"
                  value={String(vacationData.type)}
                  onChange={(event: SelectChangeEvent<string>) => {
                    setVacationData({
                      ...vacationData,
                      type: getLocalizedVacationType(event.target.value)
                    });
                  }}
                  sx={{ marginBottom: "5px", width: "100%" }}
                >
                  {(Object.keys(VacationType) as Array<keyof typeof VacationType>).map(
                    (vacationType) => {
                      return (
                        <MenuItem key={vacationType} value={vacationType}>
                          {vacationType}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
                <FormLabel>Message</FormLabel>
                <TextField
                  value={vacationData.message}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setVacationData({
                      ...vacationData,
                      message: event.target.value
                    });
                  }}
                  sx={{ marginBottom: "5px" }}
                />
                <FormLabel sx={{ marginBottom: "5px" }}>Duration</FormLabel>
                <DateRangePicker
                  dateTimeNow={dateTimeNow}
                  setDates={setDates}
                  initialStartDate={initialStartDate}
                  initialEndDate={initialEndDate}
                />
                <Button
                  disabled={!readyToSubmit}
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ marginTop: "10px" }}
                >
                  Submit
                </Button>
              </FormControl>
            </form>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TableForm;
