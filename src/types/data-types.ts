import { VacationType } from "../generated/client";

export interface DataGridRow {
  id: string | undefined;
  type: VacationType;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
}
