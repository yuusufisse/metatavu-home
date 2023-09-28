import { DailyEntry, PersonTotalTime } from "../generated/client";
import strings from "../localization/strings";
import { getHoursAndMinutes } from "./time-utils";

export interface CustomLabel {
  value: number;
  name: string;
}

/**
 * Reformats inputted daily entry to be presented in the pie chart
 * @param dailyEntry
 * @returns an array of elements each representing a section in the pie chart
 */
export const dailyEntryToChart = (dailyEntry: DailyEntry) => {
  return [
    { name: strings.timebank.billableProject, dataKey: dailyEntry.billableProjectTime },
    { name: strings.timebank.nonBillableProject, dataKey: dailyEntry.nonBillableProjectTime },
    { name: strings.timebank.internal, dataKey: dailyEntry.internalTime }
  ];
};
/**
 * Reformats inputted person total time object to be presented in the bar chart
 * @param personTotalTime
 * @returns an array of objects, each object representing a bar in the bar chart
 */
export const totalTimeToChart = (personTotalTime: PersonTotalTime) => {
  return [
    {
      name: strings.timebank.logged,
      internal: personTotalTime.internalTime,
      billableProject: personTotalTime.billableProjectTime,
      nonBillableProject: personTotalTime.nonBillableProjectTime
    },
    { name: strings.timebank.expected, expected: personTotalTime.expected }
  ];
};
/**
 * Renders custom labels in the pie chart
 * @param props Props from the pie chart data, such as name and value
 * @returns custom label
 */
export const renderCustomizedLabel = (props: CustomLabel) => {
  return `${props.name} ${getHoursAndMinutes(props.value)}`;
};
