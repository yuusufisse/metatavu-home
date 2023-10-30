import { DateTime, Duration } from "luxon";

/**
 * Converts minutes into hours and minutes
 * @param minutes minutes
 * @returns formatted hours and minutes
 */
export const getHoursAndMinutes = (minutes: number) => {
  if (minutes < 0) {
    return `-${Duration.fromObject({ minutes: minutes }).negate().toFormat("h 'h' m 'min'")}`;
  } else return Duration.fromObject({ minutes: minutes }).toFormat("h 'h' m 'min'");
};

/**
 * Get time difference in days
 *
 * @param startDate start date
 * @param endDate end date
 * @returns days
 */
export const getVacationDurationInDays = (startDate: DateTime, endDate: DateTime) => {
  let days;
  if (startDate && endDate) {
    const diff = endDate.diff(startDate, ["days"]);
    days = Number(Math.round(diff.days));
  }
  if ((days && days < 1) || !days) {
    days = 1;
  } else {
    days += 1;
  }
  return days;
};
