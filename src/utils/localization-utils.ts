import { VacationRequestStatuses, VacationType } from "../generated/client";
import strings from "../localization/strings";

export default class LocalizationUtils {
  /**
   * Get localized vacation request status
   *
   * @param vacationRequestStatus vacation request status
   */
  public static getLocalizedVacationRequestStatus = (
    vacationRequestStatus: VacationRequestStatuses
  ) =>
    ({
      [VacationRequestStatuses.PENDING]: strings.vacationRequest.pending,
      [VacationRequestStatuses.APPROVED]: strings.vacationRequest.approved,
      [VacationRequestStatuses.DECLINED]: strings.vacationRequest.declined
    })[vacationRequestStatus];

  /**
   * Get localized vacation request type
   *
   * @param vacationType vacationType
   */
  public static getLocalizedVacationRequestType = (vacationType: VacationType) => {
    switch (vacationType) {
      case VacationType.VACATION:
        return strings.vacationRequest.vacation;
      case VacationType.PERSONAL_DAYS:
        return strings.vacationRequest.personalDays;
      case VacationType.UNPAID_TIME_OFF:
        return strings.vacationRequest.unpaidTimeOff;
      case VacationType.MATERNITY_PATERNITY:
        return strings.vacationRequest.maternityPaternityLeave;
      case VacationType.SICKNESS:
        return strings.vacationRequest.sickness;
      case VacationType.CHILD_SICKNESS:
        return strings.vacationRequest.childSickness;
      default:
        return strings.vacationRequest.vacation;
    }
  };
}
