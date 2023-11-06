import { VacationRequestStatuses } from "../generated/client";

/**
 * Get color code corresponding to the vacation request status
 *
 * @param vacationRequestStatus vacation request status
 * @returns color code as string
 */
export const getVacationRequestStatusColor = (vacationRequestStatus: VacationRequestStatuses) =>
  ({
    [VacationRequestStatuses.APPROVED]: "#45cf36",
    [VacationRequestStatuses.DECLINED]: "#FF493C",
    [VacationRequestStatuses.PENDING]: "#d48a02"
  })[vacationRequestStatus];
