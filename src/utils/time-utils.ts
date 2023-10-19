import { DateTime } from "luxon"

/**
 * Converts inputted minutes into hours and minutes
 * @param minutes value in minutes
 * @returns inputted minute value in X h Y min format as string
 */
export const getHoursAndMinutes = (minutes : number) => {
    return DateTime.fromSeconds(minutes * 60).toFormat("HH 'h' mm 'min'")
}