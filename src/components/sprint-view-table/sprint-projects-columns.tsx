import type { GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import strings from "../../localization/strings";
import { getHoursAndMinutes } from "src/utils/time-utils";
import {
  getProjectColor,
  getProjectName,
  getTotalTimeEntriesAllocations,
  timeLeft,
  totalAllocations
} from "src/utils/sprint-utils";
import type { Allocations, Projects } from "src/generated/homeLambdasClient";

/**
 * Component properties
 */
interface Props {
  allocations: Allocations[];
  timeEntries: number[];
  projects: Projects[];
}

/**
 * Sprint view projects table columns component
 *
 * @param props component properties
 */
const sprintViewProjectsColumns = ({ allocations, timeEntries, projects }: Props) => {
  /**
   * Define columns for data grid
   */
  const columns: GridColDef[] = [
    {
      field: "projectName",
      headerClassName: "header-color",
      filterable: false,
      headerName: strings.sprint.myAllocation,
      flex: 2,
      valueGetter: (params) => getProjectName(params.row, allocations, projects),
      renderCell: (params) => (
        <>
          <Box
            minWidth="45px"
            style={{ marginRight: "10px" }}
            component="span"
            sx={{
              bgcolor: getProjectColor(params.row, allocations, projects),
              height: 25,
              borderRadius: "5px"
            }}
          />
          {getProjectName(params.row, allocations, projects)}
        </>
      )
    },
    {
      field: "allocation",
      headerClassName: "header-color",
      headerName: strings.sprint.allocation,
      flex: 1,
      valueGetter: (params) => getHoursAndMinutes(totalAllocations(params.row))
    },
    {
      field: "timeEntries",
      headerClassName: "header-color",
      headerName: strings.sprint.timeEntries,
      flex: 1,
      valueGetter: (params) =>
        getHoursAndMinutes(getTotalTimeEntriesAllocations(params.row, allocations, timeEntries))
    },
    {
      field: "allocationsLeft",
      headerClassName: "header-color",
      headerName: strings.sprint.allocationLeft,
      flex: 1,
      cellClassName: (params) =>
        timeLeft(params.row, allocations, timeEntries) < 0 ? "negative-value" : "",
      valueGetter: (params) => getHoursAndMinutes(timeLeft(params.row, allocations, timeEntries))
    }
  ];
  return columns;
};

export default sprintViewProjectsColumns;
