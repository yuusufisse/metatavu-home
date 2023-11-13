import { DateTime } from "luxon";
import { Person, PersonTotalTime, VacationType } from "../generated/client";

/**
 * Enum describing table form modes
 */
export enum ToolbarFormModes {
  CREATE = "CREATE",
  EDIT = "EDIT",
  NONE = "NONE"
}

/**
 * Type describing Icon properties
 */
export type ButtonIconProps = {};

/**
 * Type describing available languages
 */
export type Language = "fi" | "en-gb";

/**
 * Type describing row for data grid table
 */
export interface DataGridRow {
  id: string | undefined;
  type: VacationType | string;
  updatedAt: string | DateTime;
  startDate: string | DateTime;
  endDate: string | DateTime;
  days: number;
  message: string | undefined;
  status: string;
}

/**
 * Type describing column for skeleton table
 */
export interface SkeletonTableColumn {
  variant: string;
  height: number | string;
  width: number | string;
  margin: number | string;
}

/**
 * Type describing row for skeleton table
 */
export interface SkeletonTableRow {
  variant: "rounded" | "text" | "rectangular" | "circular";
  height: string | number;
  width: string | number;
  margin: string;
}

/**
 * Type describing data for vacation request
 */
export interface VacationData {
  startDate: DateTime;
  endDate: DateTime;
  type: VacationType;
  message: string;
  days: number;
}

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

/**
 * Interface for person with total time
 */
export interface PersonWithTotalTime {
  person: Person;
  personTotalTime?: PersonTotalTime;
}

/**
 * Enum for work time category
 */
export enum WorkTimeCategory {
  BILLABLE_PROJECT = "Billable Project",
  NON_BILLABLE_PROJECT = "Non Billable Project",
  INTERNAL = "Internal",
  EXPECTED = "Expected",
  BALANCE = "Balance",
  LOGGED = "Logged"
}

/**
 * Type for work time data
 */
export interface WorkTimeTotalData {
  name: WorkTimeCategory;
  balance: number;
  logged?: number;
  expected?: number;
}
