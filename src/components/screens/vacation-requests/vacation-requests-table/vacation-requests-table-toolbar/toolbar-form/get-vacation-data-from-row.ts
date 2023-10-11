import { GridRowId } from "@mui/x-data-grid";
import { VacationRequest } from "../../../../../../generated/client";
import { DataGridRow, VacationData } from "../../../../../../types";
import { DateTime } from "luxon";

/**
 * Component properties
 */
interface Props {
  rows: DataGridRow[];
  selectedRowIds: GridRowId[];
  vacationRequests: VacationRequest[];
  setSelectedVacationRequestId: (selectedVacationRequestId: string) => void;
  setStartDate: (startDate: DateTime) => void;
  setEndDate: (endDate: DateTime) => void;
  setVacationData: (vacationData: VacationData) => void;
}

/**
 * Get vacation data from row functional component
 *
 * @param props component properties
 */
export const getVacationDataFromRow = ({
  rows,
  selectedRowIds,
  setEndDate,
  setStartDate,
  setSelectedVacationRequestId,
  vacationRequests,
  setVacationData
}: Props) => {
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
      if (selectedVacationRequest?.id) {
        setSelectedVacationRequestId(selectedVacationRequest.id);
      }
      setStartDate(startDate);
      setEndDate(endDate);
    }
  }
};
