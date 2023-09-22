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
 * Expands JavaScripts Math.round, Math.floor and Math.ceil methods
 * Documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor#decimal_adjustment
 * @param type choose method @param value input value to adjust @param exp exponent
 * @returns adjusted value
 */
// const decimalAdjust = (type: string, value: number, exp: number) => {
//   if (!["round", "floor", "ceil"].includes(type)) {
//     throw new TypeError(
//       "The type of decimal adjustment must be one of 'round', 'floor', or 'ceil'."
//     );
//   }
//   if (exp % 1 !== 0 || Number.isNaN(value)) {
//     return NaN;
//   } else if (exp === 0) {
//     return Math[type](value);
//   }
//   const [magnitude, exponent = 0] = value.toString().split("e");
//   const adjustedValue = Math[type](`${magnitude}e${exponent - exp}`);
//   // Shift back
//   const [newMagnitude, newExponent = 0] = adjustedValue.toString().split("e");
//   return Number(`${newMagnitude}e${+newExponent + exp}`);
// };

/**
 * Converts inputted minutes into rounded hours
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
      const startDate = timespan[0].split("-").reverse().join(".");
      const endDate = timespan[1].split("-").reverse().join(".");
      return `${startDate} – ${endDate}`; //All time
    } else if (timespan.length > 2) {
      return `${timespan[0]}/${timespan[2]}`; //Month
    } else return `${timespan[0]}/${timespan[1]}`; //Week
  }
};
