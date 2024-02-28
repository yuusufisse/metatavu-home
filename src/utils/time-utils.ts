import { DateTime, Duration } from "luxon";

/**
 * Format date
 *
 * @param date datetime object
 * @param dateWithTime datetime object with time
 * @returns formatted date time
 */
export const formatDate = (date: DateTime, dateWithTime?: boolean) => {
  if (!date) return "";

  return date.toLocaleString(dateWithTime ? DateTime.DATETIME_SHORT : undefined);
};

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
 * @returns formatted timespan in the following formats (DD.MM.YYYY – DD.MM.YYYY), (YYYY/WW), (YYYY/MM)
 */
export const formatTimePeriod = (timespan: string[] | undefined) => {
  if (!timespan) {
    return null;
  }

  switch (timespan.length) {
    case 1:
      return `${timespan[0]}`; // Year
    case 2:
      if (timespan[0].length > 4) {
        const startDate = DateTime.fromJSDate(new Date(timespan[0])).toLocaleString(DateTime.DATE_SHORT);
        const endDate = DateTime.fromJSDate(new Date(timespan[1])).toLocaleString(DateTime.DATE_SHORT);
        
        return `${startDate} – ${endDate}`; // All time
      } else {
        return `${timespan[0]}/${timespan[1]}`; // Month
      }
    case 3:
      return `${timespan[0]}/${timespan[2]}`; // Week
    default:
      return null;
  }
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

/**
 * Calculates vacation days
 *
 * @param vacationDayStart vacation start date 
 * @param vacationDayEnd vacation end date
 * @param workingWeek list of working days
 */
export const calculateTotalVacationDays = (vacationStartDate: DateTime, vacationEndDate: DateTime, workingWeek: boolean[]) => {
  let vacationDayStart = vacationStartDate.weekday;
  let vacationDayEnd = vacationEndDate.weekday;
  const diff = vacationEndDate.diff(vacationStartDate, ["days"]);
  const days = Number(Math.round(diff.days));
  let weeks = Math.floor(days/7);

  const startWeek = getStartDayWorkingWeek(workingWeek);
  const endWeek = getEndDayWorkingWeek(workingWeek);
  const workDays = workingWeek.filter(workDay => workDay).length;

  if (startWeek === 0) return 0;

  if (days === 0 && !workingWeek[vacationDayStart-1]) return 0;
  if (days === 0 && workingWeek[vacationDayStart-1]) {
    if (endWeek === startWeek) return 6;
    return 1;
  }

  if (vacationDayStart > endWeek && vacationDayEnd > endWeek || vacationDayEnd < startWeek && vacationDayStart < startWeek){
    if (vacationDayEnd > vacationDayStart) return weeks * 6;
    if (vacationDayEnd === vacationDayStart) return weeks * 6;
    return weeks * 6 + 6;
  }

  if (vacationDayStart > endWeek && vacationDayEnd < startWeek) return weeks * 6;
  
  if (vacationDayEnd > endWeek) vacationDayEnd = endWeek;
  if (vacationDayStart > endWeek) vacationDayStart = startWeek;
  if (vacationDayEnd < startWeek) vacationDayEnd = endWeek;
  if (vacationDayStart < startWeek) vacationDayStart = startWeek;
    
  if (vacationDayStart === vacationDayEnd){
    if (endWeek - startWeek === 0) return weeks * 6 + 6;
    return weeks * 6 + 1;
  }

  if (vacationDayEnd > vacationDayStart){
    let addDay = 0;
    let startIndex = vacationDayStart;
    if (weeks > 0) startIndex+=1;
    if (vacationDayEnd === endWeek && weeks > 0 && workingWeek[vacationDayStart-1]) addDay += 1;
    for (let i = startIndex; i <= vacationDayEnd; i++){
      if (workingWeek[i-1]) addDay+=1;
    }
    if (addDay === workDays) addDay = 6;
    return weeks * 6 + addDay;
  }

  let addDay = 0;
  if (vacationDayEnd === vacationDayStart) weeks -= 1;
  for (let i = vacationDayStart; i <= endWeek; i++){
    if (workingWeek[i-1]) addDay+=1;
  }
  for (let i = startWeek; i <= vacationDayEnd; i++){
    if (workingWeek[i-1]) addDay+=1;
  }
  if (addDay === workDays) addDay = 6;
  return weeks * 6 + addDay;
}

/**
 * Get index - start day of working week
 *
 * @param workingWeek list of working days
 */
const getStartDayWorkingWeek = (workingWeek : boolean []) : number => {
  let i = 0;
  while (true) {
    if (i>6) break;
    if (workingWeek[i]) return i+1;
    i++;
  }
  return 0;
}

/**
 * Get index - end day of working week
 *
 * @param workingWeek list of working days
 */
const getEndDayWorkingWeek = (workingWeek : boolean []) : number => {
  let i = 6;
  while (true) {
    if (i<0) break;
    if (workingWeek[i]) return i+1;
    i--;
  }
  return 0;
}