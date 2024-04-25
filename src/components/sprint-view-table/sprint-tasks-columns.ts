import { GridColDef } from "@mui/x-data-grid";
import strings from "../../localization/strings";
import { getHoursAndMinutes } from "../../utils/time-utils";
import { Tasks } from "../../generated/homeLambdasClient";

/**
 * Component properties
 */
interface Props {
  tasks : Tasks[],
  timeEntries: number[]
}

const sprintViewTasksColumns = ({tasks, timeEntries}: Props) => {
  /**
   * Define columns for data grid
   */
  const columns: GridColDef[] = [
    { 
      field: "title",
      headerClassName: "header-color", 
      headerName: strings.sprint.taskName,
      minWidth: 0,
      flex: 3
    },
    { 
      field: "assignedPersons",
      headerClassName: "header-color",         
      headerName: strings.sprint.assigned, 
      flex: 1
    },
    { 
      field: "status",
      headerClassName: "header-color", 
      headerName: strings.sprint.taskStatus, 
      flex: 1, valueGetter: (params) => params.row.status || "",
    },
    { 
      field: "priority",
      headerClassName: "header-color", 
      headerName: strings.sprint.taskPriority,
      cellClassName: (params) => params.row.highPriority ? "high_priority": "low_priority",
      flex: 1, valueGetter: (params) => params.row.highPriority ? "High" : "Normal"   
    },
    { field: "estimate",
      headerClassName: "header-color", 
      headerName: strings.sprint.estimatedTime, 
      flex: 1, valueGetter: (params) => getHoursAndMinutes(params.row.estimate || 0) 
    },
    { 
      field: "timeEntries", headerClassName: "header-color", 
      headerName: strings.sprint.timeEntries, 
      flex: 1, valueGetter: (params) => getHoursAndMinutes(getTotalTimeEntries(params.row, tasks, timeEntries)) 
    },
  ];
  return columns;
};

/**
 * Retrieve total time entries for a task
 * 
 * @param task task of allocated project
 */
const getTotalTimeEntries = (task: Tasks, tasks: Tasks[], timeEntries: number[]) => {
  if (timeEntries.length) {
    return timeEntries[tasks.indexOf(task)];
  }
  return 0;
}

export default sprintViewTasksColumns;
