import { DateTime } from "luxon";

/**
 * Type describing available languages
 */
export type Language = "fi" | "en";

/**
 * Date range picker object.
 */
export interface Range {
  start: DateTime | null;
  end: DateTime | null;
}

/**
 * Interface for custom label used in the pie chart.
 */
export interface CustomLabel {
  value: number;
  name: string;
}

/**
 * Enum for work time entry categories
 */
export enum Worktime {
  Billable = "billableProject",
  NonBillable = "nonBillableProject",
  Internal = "internal",
  Expected = "expected"
}
