import { DataGridRow } from "../../../../types";
import { DateTime } from "luxon";
import { languageAtom } from "../../../../atoms/languageAtom";
import { VacationRequest, VacationRequestStatus } from "../../../../generated/client";
import { useAtomValue } from "jotai";

/**
 * Vacation requests table rows functional component
 *
 * @returns createDataGridRows
 */
function VacationRequestsTableRows() {
  const language = useAtomValue(languageAtom);

  /**
   * Create vacation request data grid row
   *
   * @param vacationRequest vacation request
   * @returns dataGridRow
   */
  const createDataGridRow = (vacationRequest: VacationRequest): DataGridRow => {
    const row: DataGridRow = {
      id: vacationRequest.id,
      type: vacationRequest.type,
      updatedAt: DateTime.fromJSDate(vacationRequest.updatedAt)
        .setLocale(language)
        .toLocaleString(),
      startDate: DateTime.fromJSDate(vacationRequest.startDate)
        .setLocale(language)
        .toLocaleString(),
      endDate: DateTime.fromJSDate(vacationRequest.endDate).setLocale(language).toLocaleString(),
      days: vacationRequest.days,
      message: "No message",
      status: "No Status"
    };

    return row;
  };

  /**
   * Create vacation requests data grid rows
   */
  const createDataGridRows = (
    vacationRequests: VacationRequest[],
    vacationRequestStatuses: VacationRequestStatus[]
  ): DataGridRow[] | undefined => {
    if (vacationRequests && vacationRequestStatuses) {
      const tempRows: DataGridRow[] = [];

      vacationRequests.forEach((vacationRequest) => {
        const row = createDataGridRow(vacationRequest);

        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            row.status = vacationRequestStatus.status;
          }
          if (vacationRequest.message.length) {
            row.message = vacationRequest.message;
          }
        });

        tempRows.push(row);
      });

      return tempRows;
    }
  };

  return { createDataGridRows };
}

export default VacationRequestsTableRows;
