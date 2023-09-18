import { PersonTotalTime } from "../generated/client";
import { getHoursAndMinutes } from "./time-utils";

interface CustomLabel {
  value: number;
  name: string;
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