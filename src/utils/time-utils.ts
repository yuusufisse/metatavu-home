import { DateTime } from "luxon";

/**
 * Converts inputted minutes into hours and minutes
 * @param minutes value in minutes
 * @returns inputted minute value in X h Y min format as string
 */
export const getHoursAndMinutes = (minutes: number): string => {
  return `${Math.trunc(minutes / 60)} h ${
    (minutes % 60) * (String(minutes).startsWith("-") ? -1 : 1)
  } min`;
};

/**
 * Get time difference in days
 *
 * @param startDate start date
 * @param endDate end date
 * @returns days
 */
export const getTimeDifferenceInDays = (
  startDate: DateTime | null | undefined,
  endDate: DateTime | null | undefined
) => {
  let days;
  if (startDate && endDate) {
    const diff = endDate.diff(startDate, ["days"]);
    days = Number(Math.round(diff.days)) + 1;
    if (days < 1) {
      days = 1;
    }
  }
  return days;
};
