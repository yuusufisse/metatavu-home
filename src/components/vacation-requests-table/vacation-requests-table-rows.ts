import { VacationsDataGridRow } from "../../types";
import { DateTime } from "luxon";
import { VacationRequest, VacationRequestStatus } from "../../generated/client";
import LocalizationUtils from "../../utils/localization-utils";
import strings from "../../localization/strings";
import { useAtomValue } from "jotai";
import { personsAtom } from "../../atoms/person";
import { userProfileAtom } from "../../atoms/auth";
import { getVacationRequestPersonFullName } from "../../utils/vacation-request-utils";

/**
 * Vacation requests table rows component
 */
const VacationRequestsTableRows = () => {
  const persons = useAtomValue(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);

  /**
   * Create a single vacation request data grid row
   *
   * @param vacationRequest vacation request
   * @returns dataGridRow
   */
  const createDataGridRow = (vacationRequest: VacationRequest) => {
    const row: VacationsDataGridRow = {
      id: vacationRequest.id,
      type: LocalizationUtils.getLocalizedVacationRequestType(vacationRequest.type),
      personFullName: vacationRequest.personId ?? strings.vacationRequest.noPersonFullName,
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
   *
   * @param vacationRequest vacation request
   * @param vacationRequestStatuses vacation request statuses
   */
  const createDataGridRows = (
    vacationRequests: VacationRequest[],
    vacationRequestStatuses: VacationRequestStatus[]
  ) => {
    const tempRows: VacationsDataGridRow[] = [];
    if (vacationRequests.length && vacationRequestStatuses.length) {
      vacationRequests.forEach((vacationRequest) => {
        const row = createDataGridRow(vacationRequest);

        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            row.status = vacationRequestStatus.status;
          }
        });

        if (vacationRequest.message.length) {
          row.message = vacationRequest.message;
        }

        if (vacationRequest.personId) {
          row.personFullName = getVacationRequestPersonFullName(
            vacationRequest,
            persons,
            userProfile
          );
        }

        tempRows.push(row);
      });
    }
    return tempRows;
  };

  return createDataGridRows;
};

export default VacationRequestsTableRows;
