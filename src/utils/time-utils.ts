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
 * Formats inputted time period from @PersonTotalTime
 * @param timespan time period from @PersonTotalTime
 * @returns formatted timespan in the following formats (DD.MM.YYYY – DD.MM.YYYY), (YYYY/WW), (YYYY/MM)
 */
export const formatTimePeriod = (timespan: string[] | undefined) => {
  if (timespan) {
    if (timespan[0].length > 4) {
      const startDate = timespan[0].split("-").reverse().join(".");
      const endDate = timespan[1].split("-").reverse().join(".");
      return `${startDate} – ${endDate}`; //All time
    } else if (timespan.length > 2) {
      return `${timespan[0]}/${timespan[2]}`; //Month
    } else return `${timespan[0]}/${timespan[1]}`; //Week
  }
};
