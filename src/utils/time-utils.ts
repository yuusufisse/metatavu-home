import { Duration } from "luxon";
import strings from "../localization/strings";

/**
 * Converts inputted minutes into hours and minutes
 *
 * @param minutes value in minutes
 * @returns inputted minute value in X h Y min format as string
 */
export const getHoursAndMinutes = (minutes: number) => {
  if (minutes < 0) {
    return `-${Duration.fromObject({ minutes: minutes }).negate().toFormat("h 'h' m 'min'")}`;
  } else return Duration.fromObject({ minutes: minutes }).toFormat("h 'h' m 'min'");
};

/**
 * Converts inputted minutes into full hours
 *
 * @param minutes value in minutes
 * @returns inputted minute value in X h
 */
export const getHours = (minutes: number) =>
  Duration.fromObject({ minutes: minutes }).toFormat("h 'h'");

/**
 * Formats inputted time period from @PersonTotalTime
 *
 * @param timespan time period
 * @returns formatted timespan in the following formats (DD.MM.YYYY – DD.MM.YYYY), (YYYY/WW), (YYYY/MM), (YYYY)
 */
export const formatTimePeriod = (timespan: string[] | undefined) => {
  if (!timespan) return null;

  if (timespan[0].length > 4) {
    const startDate = new Date(timespan[0].split("-").join(", ")).toLocaleDateString(
      strings.localization.time
    );
    const endDate = new Date(timespan[1].split("-").join(", ")).toLocaleDateString(
      strings.localization.time
    );
    return `${startDate} – ${endDate}`; //All time
  } else if (timespan.length === 2 && timespan[0].length <= 4) {
    return `${timespan[0]}/${timespan[1]}`; //Month
  } else if (timespan.length === 3) {
    return `${timespan[0]}/${timespan[2]}`; //Week
  } else return `${timespan[0]}`; // Year
};

/**
 * Formats inputted week value to be parsable in ISO string
 * 
 * @param weeks week number as string
 * @returns always a double digit value
 */
export const formatISOWeeks = (weeks : string | undefined) => {
  if (!weeks) return null;

  if (weeks.length < 2) return `0${weeks}`
  else return weeks 
}
