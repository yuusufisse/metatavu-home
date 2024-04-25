import { GridColDef } from "@mui/x-data-grid";
import { Box} from "@mui/material";
import strings from "../../localization/strings";
import { getHoursAndMinutes } from "../../utils/time-utils";
import { Allocations, Projects } from "../../generated/homeLambdasClient";

/**
 * Component properties
 */
interface Props {

  allocations: Allocations[],
  timeEntries: number[],
  projects: Projects[]
}

const sprintViewProjectsColumns = ({allocations, timeEntries, projects}: Props) => {
  /**
   * Define columns for data grid
   */
  const columns: GridColDef[] = [
    { 
      field: "projectName",  
      headerClassName: "header-color",                
      filterable: false,
      headerName: strings.sprint.myAllocation, 
      flex: 2, valueGetter: (params) => getProjectName(params.row, allocations, projects),
      renderCell: (params) => <><Box minWidth="45px" style={{ marginRight:"10px" }} component="span" sx={{ bgcolor: getProjectColor(params.row, allocations, projects), height: 25, borderRadius: "5px" }} />{getProjectName(params.row, allocations, projects)}</>
    },
    { 
      field: "allocation", 
      headerClassName: "header-color",
      headerName: strings.sprint.allocation, 
      flex: 1, valueGetter: (params) => getHoursAndMinutes(totalAllocations(params.row))
    },
    { 
      field: "timeEntries", 
      headerClassName: "header-color", 
      headerName: strings.sprint.timeEntries, 
      flex: 1, valueGetter: (params) => getHoursAndMinutes(getTotalTimeEntries(params.row, allocations, timeEntries) || 0),
    },
    { 
      field: "allocationsLeft", 
      headerClassName: "header-color", 
      headerName: strings.sprint.allocationLeft, 
      flex: 1, cellClassName: (params) =>  timeLeft(params.row, allocations, timeEntries) < 0 ? "negative-value" : "", valueGetter: (params) => getHoursAndMinutes(timeLeft(params.row, allocations, timeEntries))
    },
  ];
  return columns;
};

/**
 * Retrieve total time entries for a task
 * 
 * @param task task of allocated project
 */
const getTotalTimeEntries = (allocation: Allocations, allocations: Allocations[], timeEntries: number[]) => {
  if (timeEntries.length) {
    return timeEntries[allocations.indexOf(allocation)];
  }
  return 0;
}

/**
 * Get project name
 * 
 * @param allocation expected work load of user in minutes
 */
const getProjectName = (allocation: Allocations, allocations: Allocations[], projects: Projects[]) => {
  if (projects.length) {
    return projects[allocations.indexOf(allocation)]?.name;
  }
  return "";
}

/**
 * Get project color
 * 
 * @param allocation expected work load of user in minutes
 */
const getProjectColor = (allocation: Allocations, allocations: Allocations[], projects: Projects[]) => {
  if (projects.length) {
    return projects[allocations.indexOf(allocation)]?.color;
  }
  return "";
}

/**
 * Calculate total time allocated to the project for 2 week period
 * 
 * @param allocation expected work load of user in minutes
 */
const totalAllocations = (allocation: Allocations) => {
  const totalMinutes =
    (allocation.monday || 0) + 
    (allocation.tuesday || 0) + 
    (allocation.wednesday || 0) + 
    (allocation.thursday || 0) + 
    (allocation.friday || 0);
  return totalMinutes * 2;
}

/**
 * Calculate the remaining time of project completion
 * 
 * @param allocation expected work load of user in minutes
 */
  const timeLeft = (allocation: Allocations, allocations: Allocations[], timeEntries: number[]) => {
    return totalAllocations(allocation) - getTotalTimeEntries(allocation, allocations, timeEntries)
  }

export default sprintViewProjectsColumns;
