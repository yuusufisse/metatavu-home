import { VacationType } from "../generated/client";

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
