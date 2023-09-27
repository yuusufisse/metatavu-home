import { GridRowId } from "@mui/x-data-grid";
import { VacationRequest } from "../../../../../../generated/client";
import { DataGridRow, VacationData } from "../../../../../../types";
import { Dispatch } from "react";
import { SetStateAction } from "jotai";
import { DateTime } from "luxon";

/**
 * Component props
 */
interface getVacationDataFromRowProps {
  rows: DataGridRow[];
  selectedRowIds: GridRowId[];
  vacationRequests: VacationRequest[];
  setSelectedVacationRequestId: Dispatch<SetStateAction<string | undefined>>;
  setInitialStartDate: Dispatch<SetStateAction<DateTime | undefined>>;
  setInitialEndDate: Dispatch<SetStateAction<DateTime | undefined>>;
  setVacationData: Dispatch<SetStateAction<VacationData>>;
}
/**
 * Get vacation data from row functional component
 */
export const getVacationDataFromRow = (props: getVacationDataFromRowProps) => {
  const {
    rows,
    selectedRowIds,
    setInitialEndDate,
    setInitialStartDate,
    setSelectedVacationRequestId,
    vacationRequests,
    setVacationData
  } = props;
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
};
