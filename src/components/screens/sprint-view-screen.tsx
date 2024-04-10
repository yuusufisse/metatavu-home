import { useState, useEffect } from 'react';
import { Card,FormControl, InputLabel, MenuItem, Select, CircularProgress, Typography, Box} from '@mui/material';
import { useLambdasApi } from "../../hooks/use-api";
import { Person } from "../../generated/client";
import { useAtomValue } from "jotai";
import { personsAtom } from "../../atoms/person";
import config from "../../app/config";
import { userProfileAtom } from "../../atoms/auth";
import { Allocations } from "../../generated/homeLambdasClient/models/Allocations";
import { Projects } from "../../generated/homeLambdasClient/models/Projects";
import { TimeEntries } from "../../generated/homeLambdasClient/models/TimeEntries";
import { DataGrid } from '@mui/x-data-grid';
import { getHoursAndMinutes } from '../../utils/time-utils';
import TaskTable from '../sprint-view-table/tasks-table';
import strings from "../../localization/strings";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [myTasks, setMyTasks] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("");

  /**
   * Get project data if user is logged in otherwise endless loading
   */
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await getPersonAllocations();
      await getProjects();
      await getTimeEntries();
      setLoading(false);
    };
    if (loggedInPerson) {
      fetchData();
    }
  }, [loggedInPerson]);

  /**
   * Get project allocations for logged in user 
   */
  const getProjects = async () => {
    if (loggedInPerson) {
      const projects : Projects[] = [];
      try {
        const fetchedAllocations = await allocationsApi.listAllocations({
          startDate: new Date(), 
          personId: loggedInPerson.id.toString()});
        const fetchedProjects = await projectsApi.listProjects({ startDate: new Date() });
        fetchedAllocations.forEach((allocation)=> {
          const projectFound = fetchedProjects.find((project)=> project.id === allocation.project);
          projectFound && projects.push(projectFound);
        })
        setProjects(projects);
      } catch (error) {
        console.error(error, "Error fetching projects:");
      }
    }
  };
  const getPersonAllocations = async () => {
    if (loggedInPerson) {
      try {
        const fetchedAllocations = await allocationsApi.listAllocations({
          startDate: new Date(),
          personId: loggedInPerson.id.toString()
        });
        setAllocations(fetchedAllocations);
      } catch (error) {
        console.error("Error fetching allocations:", error);
      }
    }
  };

  /**
   * Get project time entries for logged in user 
   */
  const getTimeEntries = async () => {
    if (loggedInPerson) {
      try {
        const fetchedAllocations = await allocationsApi.listAllocations({ startDate: new Date() , personId: loggedInPerson.id.toString()});  
        const fetchedTimeEntries = await Promise.all(fetchedAllocations.map(async (allocation) => {
          try {
            const totalTimeEntries = await timeEntriesApi.listProjectTimeEntries({ projectId: allocation.project || 0});
            let totalMinutes = 0;
            totalTimeEntries.forEach((timeEntry: TimeEntries)=> {
              if (loggedInPerson && timeEntry.person===loggedInPerson.id) {
                totalMinutes+=(timeEntry.timeRegistered || 0)
              }})
            return totalMinutes;
          } catch (error) {
            console.error(`Error fetching time entries for allocation ${allocation.id}: ${error}`);
            return 0;
          }
        }));
        setTimeEntries(fetchedTimeEntries);
      } catch (error) {
        console.error(`Error fetching time entries: ${error}`);
      }
    }
  };

  /**
   * Calculate project total time spent on the project by the user
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
   * Get total time required to complete the project 
   */
  const getTotalTimeEntries = (allocation: Allocations) => {
    if (timeEntries.length!==0) {
      return timeEntries[allocations.indexOf(allocation)];
    }
    return 0;
  }

  /**
   * Calculate the remaining time of project completion
   */
  const timeLeft = (allocation: Allocations) => {
    return totalAllocations(allocation) - (getTotalTimeEntries(allocation) || 0)
  }

  /**
   * Get project name
   */
  const getProjectName = (allocation: Allocations) => {
    if (projects.length !== 0) {
      return projects[allocations.indexOf(allocation)]?.name;
    }
    return "";
  }

  /**
   * Get project color
   */
  const getProjectColor = (allocation: Allocations) => {
    if (projects.length !== 0) {
      return projects[allocations.indexOf(allocation)]?.color;
    }
    return "";
  }

  /**
   * Calculate total unallocated time for the user 
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
  const handleOnClick = () => {
    setMyTasks(!myTasks);
    setFilter("");
  }
  
  return (
    <>
      {loading || !loggedInPerson ? (
        
        <Card sx={{ p: "25%", display: "flex", justifyContent: "center" }}>
          <Box sx={{textAlign: 'center'}} >
          <Typography>{strings.placeHolder.pleaseWait}</Typography>
          <CircularProgress sx={{ scale: "150%", mt: "5%", mb: "5%"}} />
          </Box>
        </Card>
      ) : (
        <>
          <FormControlLabel control={<Switch checked={myTasks}/>} label={strings.sprint.showMyTasks}  onClick={() =>  handleOnClick()}/>
          <FormControl size="small"  style= {{width: "200px", float:"right"}}>
          <InputLabel disableAnimation={false} >{strings.sprint.taskStatus}</InputLabel>
            <Select 
              style={{borderRadius: "30px", marginBottom: "15px" , float:  "right"}}
              label={strings.sprint.taskStatus}             
            >   
              <MenuItem key={1} value={strings.sprint.onHold} onClick={() => setFilter("On hold")} >
                {strings.sprint.onHold} 
              </MenuItem>
              <MenuItem key={2} value={strings.sprint.inProgress} onClick={() => setFilter("In progress")}>
                {strings.sprint.inProgress}
              </MenuItem>
              <MenuItem key={3} value={strings.sprint.allTasks} onClick={() => setFilter("")}>
                {strings.sprint.allTasks}
              </MenuItem>
            </Select>
          </FormControl>
          <Card sx={{ margin: 0, padding: "10px", width: "100%", height: "100", marginBottom: "16px" , marginTop: "16px",
            '& .negative-value': {
              color: 'red',
            }}}>
            <DataGrid            
              disableColumnFilter
              hideFooter={true}            
              rows={allocations}
              columns={[
                { 
                  field: 'projectName',                  
                  filterable: false,
                  headerName: strings.sprint.projectName, 
                  flex: 2, valueGetter: (params) => getProjectName(params.row),
                  renderCell:(params) => <><Box style={{marginRight:"10px"}} component="span" sx={{ bgcolor: getProjectColor(params.row), width: 45, height: 25, borderRadius: "5px"}} />{getProjectName(params.row)}</>
                },
                { 
                  field: 'allocation', 
                  headerName: strings.sprint.allocation, 
                  flex: 1, valueGetter: (params) => getHoursAndMinutes(totalAllocations(params.row))
                },
                { 
                  field: 'timeEntries', 
                  headerName: strings.sprint.timeEntries, 
                  flex: 1, valueGetter: (params) => getHoursAndMinutes(getTotalTimeEntries(params.row) || 0),
                },
                { 
                  field: 'allocationsLeft', 
                  headerName: strings.sprint.allocationLeft, 
                  flex: 1, cellClassName: (params) =>  timeLeft(params.row) < 0 ? "negative-value" : "", valueGetter: (params) => getHoursAndMinutes(timeLeft(params.row))
                },
              ]}             
            />
            <Box sx={{ p: 1, display: 'flex',marginLeft:"2px" }}>
            {strings.sprint.unAllocated}<span style={{paddingLeft: "5px", color: unallocatedTime(allocations) < 0 ? "red" : ""}}> {getHoursAndMinutes(unallocatedTime(allocations))} </span> 
            </Box>
          </Card>
          {projects.map((project, index) => {
            return (
            <TaskTable key={index} project={project} loggedInpersonId={myTasks ? loggedInPerson?.id : undefined} filter={filter} />        
            )
          }
          )}
        </>
      )}
    </>
  );
};

export default SprintViewScreen;