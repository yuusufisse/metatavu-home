import { DataGridRow } from "../../../../types";
import { DateTime } from "luxon";
import { VacationRequest, VacationRequestStatus } from "../../../../generated/client";
import LocalizationUtils from "../../../../utils/localization-utils";
import strings from "../../../../localization/strings";

/**
 * Vacation requests table rows component
 *
 */
const VacationRequestsTableRows = () => {
  /**
   * Create a single vacation request data grid row
   *
   * @param vacationRequest vacation request
   * @returns dataGridRow
   */
  const createDataGridRow = (vacationRequest: VacationRequest): DataGridRow => {
    const row: DataGridRow = {
      id: vacationRequest.id,
      type: LocalizationUtils.getLocalizedVacationRequestType(vacationRequest.type),
      updatedAt: DateTime.fromJSDate(vacationRequest.updatedAt),
      startDate: DateTime.fromJSDate(vacationRequest.startDate),
      endDate: DateTime.fromJSDate(vacationRequest.endDate),
      days: vacationRequest.days,
      message: strings.vacationRequest.noMessage,
      status: strings.vacationRequest.noStatus
    };

    return row;
  };

  /**
   * Create vacation requests data grid rows
   */
  const createDataGridRows = (
    vacationRequests: VacationRequest[],
    vacationRequestStatuses: VacationRequestStatus[]
  ): DataGridRow[] => {
    const tempRows: DataGridRow[] = [];
    if (vacationRequests.length && vacationRequestStatuses.length) {
      vacationRequests.forEach((vacationRequest) => {
        const row = createDataGridRow(vacationRequest);

        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            row.status = LocalizationUtils.getLocalizedVacationRequestStatus(
              vacationRequestStatus.status
            );
          }
          if (vacationRequest.message.length) {
            row.message = vacationRequest.message;
          }
        });

        tempRows.push(row);
      });
    }
    return tempRows;
  };

  return createDataGridRows;
};

export default VacationRequestsTableRows;
