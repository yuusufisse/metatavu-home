import { VacationType } from "../generated/client";

/**
 * Type describing available languages
 */
export type Language = "fi" | "en";

export interface DataGridRow {
  id: string | undefined;
  type: VacationType;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
}

export interface SkeletonTableColumn {
  variant: string;
  height: number | string;
  width: number | string;
  margin: number | string;
}

export interface SkeletonTableRow {
  variant: string;
  height: string | number;
  width: string | number;
  margin: string;
}

// export interface VacationData {
//   startDate: Date | undefined | null;
//   endDate: Date | undefined | null;
//   type: VacationType | undefined | null;
//   message: string | undefined | null;
//   days: number | undefined | null;
// }

export interface VacationData {
  startDate: Date;
  endDate: Date;
  type: VacationType;
  message: string;
  days: number;
}
