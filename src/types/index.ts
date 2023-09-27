import { DateTime } from "luxon";
import { VacationType } from "../generated/client";

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
export type Language = "fi" | "en";

/**
 * Type describing row for data grid table
 */
export interface DataGridRow {
  id: string | undefined;
  type: VacationType;
  updatedAt: string;
  startDate: string;
  endDate: string;
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
  variant: string;
  height: string | number;
  width: string | number;
  margin: string;
}

/**
 * Type describing data for vacation request
 */
export interface VacationData {
  startDate: DateTime | undefined;
  endDate: DateTime | undefined;
  type: VacationType | undefined | null;
  message: string | undefined;
  days: number | undefined;
}
