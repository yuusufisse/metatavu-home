import { VacationRequestStatuses, VacationType } from "../generated/client";
import strings from "../localization/strings";

/**
 * Localization Utils class
 */
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
  public static getLocalizedVacationRequestType = (vacationType: VacationType) =>
    ({
      [VacationType.VACATION]: strings.vacationRequest.vacation,
      [VacationType.PERSONAL_DAYS]: strings.vacationRequest.personalDays,
      [VacationType.UNPAID_TIME_OFF]: strings.vacationRequest.unpaidTimeOff,
      [VacationType.MATERNITY_PATERNITY]: strings.vacationRequest.maternityPaternityLeave,
      [VacationType.SICKNESS]: strings.vacationRequest.sickness,
      [VacationType.CHILD_SICKNESS]: strings.vacationRequest.childSickness
    })[vacationType];
}
