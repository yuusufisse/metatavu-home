import { DataGridRow } from "../../../../types";
import { DateTime } from "luxon";
import { languageAtom } from "../../../../atoms/languageAtom";
import { VacationRequest } from "../../../../generated/client";
import { rowsAtom } from "../../../../atoms/rows";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { vacationRequestStatusesAtom } from "../../../../atoms/vacationRequestStatuses";
import { vacationRequestsAtom } from "../../../../atoms/vacationRequests";

/**
 * Vacation requests table rows
 * Creates the rows and sets rowsAtom, when vacationRequestsAtom change
 *
 */
function VacationRequestsTableRows() {
  const language = useAtomValue(languageAtom);
  const vacationRequests = useAtomValue(vacationRequestsAtom);
  const vacationRequestStatuses = useAtomValue(vacationRequestStatusesAtom);
  const [rows, setRows] = useAtom(rowsAtom);

  useEffect(() => {
    createRows();
  }, [vacationRequests, vacationRequestStatuses]);

  /**
   * Create vacation request data grid row
   *
   * @param vacationRequest vacation request
   * @returns dataGridRow
   */
  const createRow = (vacationRequest: VacationRequest): DataGridRow => {
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
  const createRows = () => {
    if (vacationRequests && vacationRequestStatuses) {
      const tempRows: DataGridRow[] = [];

      vacationRequests.forEach((vacationRequest) => {
        const row = createRow(vacationRequest);

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

      setRows(tempRows);
    }
  };

  return rows;
}

export default VacationRequestsTableRows;
