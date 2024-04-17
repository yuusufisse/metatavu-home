import { Card, IconButton } from "@mui/material";
import { Projects, Tasks, TimeEntries } from "../../generated/homeLambdasClient";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useLambdasApi } from "../../hooks/use-api";
import { getHoursAndMinutes } from "../../utils/time-utils";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import strings from "../../localization/strings";

/**
 * Component properties
 */
interface Props {
  project : Projects,
  loggedInpersonId?: number,
  filter?: string
}

/**
 * Task component
 */
const TaskTable = ({project, loggedInpersonId, filter}: Props) => {
  const { tasksApi, timeEntriesApi } = useLambdasApi();
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [timeEntries, setTimeEntries] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  /**
   * Gather tasks and time entries when project is available and update changes appeared
   */
  useEffect(() => {
    const fetchData = async () => {
      if (project) {
        await getTasksAndTimeEntries();
      }
    };
    fetchData();
  }, [project, loggedInpersonId, filter]);

  /**
   * Get tasks and total time entries  
   */
  const getTasksAndTimeEntries = async () => {
    try {
      let fetchedTasks = await tasksApi.listProjectTasks({projectId: project.id});
      if (loggedInpersonId) {
        fetchedTasks = fetchedTasks.filter((task)=> task.assignedPersons?.includes(loggedInpersonId ));
      }
      setTasks(fetchedTasks);
      const fetchedTimeEntries = await Promise.all(fetchedTasks.map(async (task) => {
        try {
          if (project.id ){           
            const totalTimeEntries = await timeEntriesApi.listProjectTimeEntries({ projectId: project.id, taskId: task.id });
            let totalMinutes = 0;
            totalTimeEntries.forEach((timeEntry: TimeEntries)=> {
              if (loggedInpersonId && timeEntry.person===loggedInpersonId) {
                totalMinutes+=(timeEntry.timeRegistered || 0)
              }
              if (!loggedInpersonId) {
                totalMinutes += timeEntry.timeRegistered || 0;
              }
            })
            return totalMinutes;
          }
          return 0;
        } catch (error) {
          console.error(`Error fetching time entries for task ${task.id}: ${error}`);
          return 0;
        }
      }));
      setTimeEntries(fetchedTimeEntries);
    } catch (error) {
      console.error(`Error fetching time entries: ${error}`);
    }
  };

  /**
   * Retrieve total time entries for a task
   */
  const getTotalTimeEntries = (task: Tasks) => {
    if (timeEntries.length!==0) {
      return timeEntries[tasks.indexOf(task)];
    }
    return 0;
  }

  return ( 
    <Card key={0} sx={{ margin: 0, padding: "10px", width: "100%", height: "100", marginBottom: "16px", 
    '& .high_priority': {
      color: 'red'}, 
    '& .low_priority': {
      color: 'green'} 
    }}>
      <IconButton onClick={() => setOpen(!open)}>
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      <span>{project ? project.name : ""}</span>
      {open && tasks.length !== 0 && 
        <DataGrid
          sx={{
            borderTop: 0,
            borderLeft: 0,
            borderRight: 0,
            borderBottom: 0,
          }}
          autoHeight={true}
          localeText={{ noResultsOverlayLabel: strings.sprint.notFound }}
          disableColumnFilter
          hideFooter={true}
          filterModel={
            {
            items: [{ 
              field: 'status',
              operator: 'contains', 
              value: filter
            }]
          }}
          rows={tasks}
          columns={[
            { 
              field: 'title',
              headerName: strings.sprint.taskName,
              minWidth: 0,
              flex: 3
            },
            { 
              field: 'assignedPersons',             
              headerName: strings.sprint.assigned, 
              flex: 1
            },
            { 
              field: 'status', 
              headerName: strings.sprint.taskStatus, 
              flex: 1, valueGetter: (params) => getTotalTimeEntries(params.row)!==0 ? "In progress" : "On hold"
            },
            { 
              field: 'priority', 
              headerName: strings.sprint.taskPriority,
              cellClassName: (params) => params.row.highPriority ? 'high_priority' :  'low_priority',
              flex: 1, valueGetter: (params) => params.row.highPriority ? 'High' : 'Normal'   
            },
            { field: 'estimate', 
              headerName: strings.sprint.estimatedTime, 
              flex: 1, valueGetter: (params) => getHoursAndMinutes(params.row.estimate || 0) 
            },
            { 
              field: 'timeEntries', 
              headerName: strings.sprint.timeEntries, 
              flex: 1, valueGetter: (params) => getHoursAndMinutes(getTotalTimeEntries(params.row)) 
            }
          ]}
        />
      }
    </Card>
  )
}

export default TaskTable;