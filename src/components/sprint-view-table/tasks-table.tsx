import { Box, Card, CircularProgress, IconButton, Typography } from "@mui/material";
import { Projects, Tasks, TimeEntries } from "../../generated/homeLambdasClient";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useLambdasApi } from "../../hooks/use-api";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import strings from "../../localization/strings";
import sprintViewTasksColumns from "./sprint-tasks-columns";
import { errorAtom } from "../../atoms/error";
import { useSetAtom } from "jotai";

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
 * 
 * @param props component properties
 */
const TaskTable = ({project, loggedInpersonId, filter}: Props) => {
  const { tasksApi, timeEntriesApi } = useLambdasApi();
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [timeEntries, setTimeEntries] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const columns = sprintViewTasksColumns({tasks, timeEntries});
  const setError = useSetAtom(errorAtom);
  const [reload, setReload] = useState(false);

  /**
   * Gather tasks and time entries when project is available and update changes appeared
   */
  useEffect(() => {
    if (project && open) {
      getTasksAndTimeEntries();
    }
  }, [project, open, filter, reload]);

  /**
   * Handle loggenInPersonId change
   */
  useEffect(()=>{
    setReload(true);
  },[loggedInpersonId]);
  
  /**
   * Get tasks and total time entries  
   */
  const getTasksAndTimeEntries = async () => {
    setLoading(true);
    if (reload || !tasks.length || !timeEntries.length){
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
          } catch (error) {
            if (task.id) {
              const message: string = strings.formatString(strings.sprintRequestError.fetchTasksError, task.id||0, error as string).toString();
              setError(message);
            }
          }
          return 0;
        }));
        setTimeEntries(fetchedTimeEntries);
      } catch (error) {
        setError(`${strings.sprintRequestError.fetchTimeEntriesError} ${error}`);
      }
    }
    setReload(false);
    setLoading(false);
  };

  return ( 
    <Card key={0} sx={{ 
      backgroundColor: "#f2f2f2", 
      margin: 0, 
      paddingTop: "5px", 
      paddingBottom: "5px", 
      width: "100%", 
      height: "100", 
      marginBottom: "16px", 
    "& .high_priority": {
      color: "red"}, 
    "& .low_priority": {
      color: "green"} 
    }}>
      <IconButton onClick={() => setOpen(!open)}>
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
      <Typography style={{display:"inline"}}>{project?.name}</Typography>
      {open && 
        <>
          {loading ? 
            <Box sx={{textAlign: "center"}} >
              <CircularProgress sx={{ 
                scale: "100%", 
                mt: "3%", 
                mb: "3%"
              }}
              />
            </Box>
            :
            <DataGrid
              sx={{
                backgroundColor: "#f6f6f6",
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                borderBottom: 0,
                "& .header-color": {
                  backgroundColor: "#f2f2f2"
                }
              }}
              autoHeight={true}
              localeText={{ noResultsOverlayLabel: strings.sprint.notFound }}
              disableColumnFilter
              hideFooter={true}
              filterModel={
                {
                items: [{ 
                  field: "status",
                  operator: "contains", 
                  value: filter
                }]
              }}
              rows={tasks}
              columns={columns}
            /> 
          }
        </>
      }
    </Card>
  )
}

export default TaskTable;