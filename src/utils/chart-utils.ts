import { DailyEntry, PersonTotalTime } from "../generated/client";
import { getHoursAndMinutes } from "./time-utils";

export interface CustomLabel {
  value: number;
  name: string;
}

/**
 * Type for work time data
 */
export interface WorkTimeData {
  name: string;
  expected: number;
  billableProject: number;
  nonBillableProject: number;
  internal: number;
}

/**
 * Type for work time data
 */
export interface WorkTimeTotalData {
  name: string;
  balance: number;
  logged?: number;
  expected?: number;
}

export const dailyEntryToChart = (dailyEntry: DailyEntry | undefined) => {
  return [
    { name: "Billable", dataKey: dailyEntry?.billableProjectTime },
    { name: "NonBillable", dataKey: dailyEntry?.nonBillableProjectTime },
    { name: "Internal", dataKey: dailyEntry?.internalTime }
  ];
};

export const workTimeData = (personTotalTime: PersonTotalTime | undefined) => {
  return [
    { name: "Billable", dataKey: personTotalTime?.billableProjectTime },
    { name: "NonBillable", dataKey: personTotalTime?.nonBillableProjectTime },
    { name: "Internal", dataKey: personTotalTime?.internalTime }
  ];
};

export const workTimeDataOverview = (personTotalTime: PersonTotalTime | undefined) => {
  return [
    {
      name: "Logged",
      internal: personTotalTime?.internalTime,
      billableProject: personTotalTime?.billableProjectTime,
      nonBillableProject: personTotalTime?.nonBillableProjectTime
    },
    { name: "Expected", expected: personTotalTime?.expected }
  ];
};

export const renderCustomizedLabel = (props: CustomLabel) => {
  return `${props.name} ${getHoursAndMinutes(props.value)}`;
};
