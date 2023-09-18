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

export const workTimeData = (personTotalTime: PersonTotalTime | undefined) => {
  return [
    { name: "Billable", dataKey: personTotalTime?.billableProjectTime },
    { name: "NonBillable", dataKey: personTotalTime?.nonBillableProjectTime },
    { name: "Internal", dataKey: personTotalTime?.internalTime }
  ];
};

export const renderCustomizedLabel = (props: CustomLabel) => {
  return `${props.name}\n${getHoursAndMinutes(props.value)}`;
}

export const dateEntriesPreprocess = (dateEntries: DailyEntry[]) => {
  const workTimeData: WorkTimeData[] = [];
  const workTimeTotalData: WorkTimeTotalData = {
    name: "WorkTimeData",
    balance: 0,
    logged: 0,
    expected: 0
  };

  dateEntries.forEach(
    entry => {
      const { date, expected, billableProjectTime, nonBillableProjectTime, internalTime, balance, logged } = entry;

      workTimeData.push({
        name: new Date(date).toLocaleDateString(),
        expected: expected,
        billableProject: billableProjectTime,
        nonBillableProject: nonBillableProjectTime,
        internal: internalTime
      });
      workTimeTotalData.balance += balance;
      workTimeTotalData.logged += logged;
      workTimeTotalData.expected += expected;
    }
  );

  return { workTimeData: workTimeData, workTimeTotalData: workTimeTotalData };
};