import { Duration } from "luxon";

/**
 * Converts inputted minutes into hours and minutes
 * @param minutes value in minutes
 * @returns inputted minute value in X h Y min format as string
 */
export const getHoursAndMinutes = (minutes: number) =>
  Duration.fromObject({ minutes: minutes }).toFormat("h 'h' m 'min'");
