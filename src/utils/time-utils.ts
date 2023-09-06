/**
 * Converts inputted minutes into hours and minutes
 */
export const getHoursAndMinutes = (minutes : number) : string => {
    return `${Math.trunc(minutes / 60)} h ${(minutes % 60) * (String(minutes).startsWith("-")?-1 :1)} min`
}