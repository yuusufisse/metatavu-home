import { useState, useEffect } from "react";
import { Card,FormControl, InputLabel, MenuItem, Select, CircularProgress, Typography, Box, FormControlLabel, Switch} from "@mui/material";
import { useLambdasApi } from "src/hooks/use-api";
import { Person } from "src/generated/client";
import { useAtomValue, useSetAtom } from "jotai";
import { personsAtom,  } from "src/atoms/person";
import config from "src/app/config";
import { userProfileAtom } from "src/atoms/auth";
import { Allocations, Projects, TimeEntries } from "src/generated/homeLambdasClient/models/";
import { DataGrid } from '@mui/x-data-grid';
import { getHoursAndMinutes, getSprintEnd, getSprintStart } from 'src/utils/time-utils';
import TaskTable from '../sprint-view-table/tasks-table';
import strings from "src/localization/strings";
import sprintViewProjectsColumns from "../sprint-view-table/sprint-projects-columns";
import { errorAtom } from "src/atoms/error";

/**
 * Sprint view screen component
 */
const SprintViewScreen = () => {
  const { allocationsApi, projectsApi, timeEntriesApi } = useLambdasApi();
  const persons: Person[] = useAtomValue(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const loggedInPerson = persons.find(
    (person: Person) => person.id === config.person.forecastUserIdOverride || person.keycloakId === userProfile?.id
  );
  const [allocations, setAllocations] = useState<Allocations[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [timeEntries, setTimeEntries] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [myTasks, setMyTasks] = useState(true);
  const [filter, setFilter] = useState("");
  const todaysDate = (new Date()).toISOString()
  const sprintStartDate = getSprintStart(todaysDate);
  const sprintEndDate = getSprintEnd((new Date()).toISOString());
  const columns = sprintViewProjectsColumns({allocations, timeEntries, projects});
  const setError = useSetAtom(errorAtom);

  /**
   * Get project data if user is logged in
   */
  useEffect(() => {
    setLoading(true);
    if (loggedInPerson) {
      fetchPersonEngagement();
    }
  }, [loggedInPerson]);

  /**
   * Fetch allocations, project names and time entries
   */
  const fetchPersonEngagement = async () => {
    try {
      const fetchedAllocations = await allocationsApi.listAllocations({
        startDate: new Date(),
        personId: loggedInPerson?.id.toString()
      });
  
      const fetchedProjects = await projectsApi.listProjects({ startDate: new Date() });
      const fetchedTimeEntries = await Promise.all(fetchedAllocations.map(async (allocation) => {
        try {
          const totalTimeEntries = await timeEntriesApi.listProjectTimeEntries({ projectId: allocation.project || 0, startDate: allocation.startDate, endDate: allocation.endDate });
          let totalMinutes = 0;
          totalTimeEntries.forEach((timeEntry: TimeEntries) => {
            if (loggedInPerson && timeEntry.person === loggedInPerson.id) {
              totalMinutes += (timeEntry.timeRegistered || 0)
            }
          }); 
          return totalMinutes;
        } catch (error) {
          const message: string = strings.formatString(strings.sprintRequestError.fetchAllocationError, (allocation.id||0).toString(), error as string).toString();
          setError(message);
          return 0;
        }
      }));

      const projects : Projects[] = [];
      fetchedAllocations.forEach((allocation) => {
        const projectFound = fetchedProjects.find((project) => project.id === allocation.project);
        projectFound && projects.push(projectFound);
      });

      setProjects(projects);
      setAllocations(fetchedAllocations);
      setTimeEntries(fetchedTimeEntries);
    } catch (error) {
      setError(`${strings.sprintRequestError.fetchError}, ${error}`);
    }
    setLoading(false);
  };

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
   * Calculate total unallocated time for the user in the current 2 week period
   * @param total 
   * @param person user time spent  on the project in minutes
   */
  const unallocatedTime = (allocation: Allocations[]) => {
      const totalAllocatedTime = allocation.reduce((total, allocation) => total + totalAllocations(allocation), 0);
      const calculateWorkingLoad = (person?: Person) => {
        if (!person) {
          return 0;
        }
        const totalMinutes =
          (person.monday || 0) + 
          (person.tuesday || 0) + 
          (person.wednesday || 0) + 
          (person.thursday || 0) + 
          (person.friday || 0);
        return totalMinutes * 2;
      }
      return calculateWorkingLoad(loggedInPerson) - totalAllocatedTime;
    }

  /**
   * Featute for task filtering 
   */
  const handleOnClickTask = () => {
    setMyTasks(!myTasks);
    setFilter("");
  }
  
  return (
    <>
      {loading ? (
        <Card sx={{ p: "25%", display: "flex", justifyContent: "center" }}>
          <Box sx={{ textAlign: "center" }} >
            <Typography>{strings.placeHolder.pleaseWait}</Typography>
            <CircularProgress sx={{ scale: "150%", mt: "5%", mb: "5%" }} />
          </Box>
        </Card>
      ) : (
        <>
          <FormControlLabel control={<Switch checked={myTasks}/>} label={strings.sprint.showMyTasks}  onClick={() =>  handleOnClickTask()}/>  
          <FormControl size= "small" style= {{ width: "200px", float: "right" }}>           
            <InputLabel disableAnimation={false} >{strings.sprint.taskStatus}</InputLabel>
            <Select
              defaultValue={strings.sprint.allTasks}
              style={{ borderRadius: "30px", marginBottom: "15px", float: "right" }}
              label={strings.sprint.taskStatus}             
            >   
              <MenuItem key={1} value={strings.sprint.toDo} onClick={() => setFilter("TODO")} >
                {strings.sprint.toDo} 
              </MenuItem>
              <MenuItem key={2} value={strings.sprint.inProgress} onClick={() => setFilter("INPROGRESS")}>
                {strings.sprint.inProgress}
              </MenuItem>
              <MenuItem key={3} value={strings.sprint.allTasks} onClick={() => setFilter("DONE")}>
                {strings.sprint.completed}
              </MenuItem>
              <MenuItem key={4} value={strings.sprint.allTasks} onClick={() => setFilter("")}>
                {strings.sprint.allTasks}
              </MenuItem>
            </Select>
          </FormControl>
          <Card sx={{ margin: 0, width: "100%", height: "100", marginBottom: "16px", marginTop: "16px", padding: "0px",
            "& .negative-value": {
              color: "red",
            }}}>
            <DataGrid
              sx={{
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                borderBottom: 0,
                "& .header-color": {
                  backgroundColor: "#f2f2f2",
                }
              }} 
              autoHeight={true}
              localeText={{ noResultsOverlayLabel: strings.sprint.notFound }}
              disableColumnFilter
              hideFooter={true}            
              rows={allocations}
              columns={columns}
            />
            <Box sx={{ backgroundColor:"#e6e6e6", display: 'flex', justifyContent: "space-between", padding: "5px", paddingTop:" 10px", paddingBottom:" 10px" }}>
              <span style={{paddingLeft: "5px", color: unallocatedTime(allocations) < 0 ? "red" : ""}}>{strings.sprint.unAllocated} {getHoursAndMinutes(unallocatedTime(allocations))}</span> 
              <span style={{ paddingRight:"5px"}}>
                {strings.formatString(strings.sprint.current, sprintStartDate.toLocaleString(), sprintEndDate.toLocaleString() )}
              </span>
            </Box>
          </Card>
          {projects.map((project) =>
            <TaskTable key={project.id} project={project} loggedInpersonId={myTasks ? loggedInPerson?.id : undefined} filter={filter} />
          )}
        </>
      )}
    </>
  );
};

export default SprintViewScreen;