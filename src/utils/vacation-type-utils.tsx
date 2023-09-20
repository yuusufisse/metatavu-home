import { VacationType } from "../generated/client";

/**
 * Set the string to corresponding enum value
 *
 * @param typeString filter scope as string
 */
const getLocalizedVacationType = (typeString: string) => {
  switch (typeString) {
    case "VACATION":
      return VacationType.VACATION;
    case "UNPAID_TIME_OFF":
      return VacationType.UNPAID_TIME_OFF;
    case "SICKNESS":
      return VacationType.SICKNESS;
    case "PERSONAL_DAYS":
      return VacationType.PERSONAL_DAYS;
    case "MATERNITY_PATERNITY":
      return VacationType.MATERNITY_PATERNITY;
    case "CHILD_SICKNESS":
      return VacationType.CHILD_SICKNESS;
    default:
      return null;
  }
};

export default getLocalizedVacationType;
