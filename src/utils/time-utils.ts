import strings from "../localization/strings";

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
 * Converts inputted minutes into full hours
 * @param minutes value in minutes
 * @returns inputted minute value in X h
 */
export const getHours = (minutes: number): string => {
  return `${Math.trunc(minutes / 60)} h`;
};
/**
 * Formats inputted time period from @PersonTotalTime
 * @param timespan time period from @PersonTotalTime
 * @returns formatted timespan in the following formats (DD.MM.YYYY – DD.MM.YYYY), (YYYY/WW), (YYYY/MM)
 */
export const formatTimePeriod = (timespan: string[] | undefined) => {
  if (timespan) {
    if (timespan[0].length > 4) {
      const startDate = new Date(timespan[0].split("-").join(", ")).toLocaleDateString(
        strings.localization.time
      );
      const endDate = new Date(timespan[1].split("-").join(", ")).toLocaleDateString(
        strings.localization.time
      );
      return `${startDate} – ${endDate}`; //All time
    } else if (timespan.length > 2) {
      return `${timespan[0]}/${timespan[2]}`; //Month
    } else return `${timespan[0]}/${timespan[1]}`; //Week
  }
};
