import { useState, useEffect } from "react";
import { Card,FormControl, InputLabel, MenuItem, Select, CircularProgress, Typography, Box, FormControlLabel, Switch} from "@mui/material";
import { useLambdasApi } from "src/hooks/use-api";
import { Person } from "src/generated/client";
import { useAtomValue, useSetAtom } from "jotai";
import { personsAtom,  } from "src/atoms/person";
import config from "src/app/config";
import { userProfileAtom } from "src/atoms/auth";
import { Allocations, Projects, TimeEntries } from "src/generated/homeLambdasClient/models/";
import { DataGrid } from "@mui/x-data-grid";
import { getHoursAndMinutes, getSprintEnd, getSprintStart } from "src/utils/time-utils";
import TaskTable from "src/components/sprint-view-table/tasks-table";
import strings from "src/localization/strings";
import sprintViewProjectsColumns from "src/components/sprint-view-table/sprint-projects-columns";
import { errorAtom } from "src/atoms/error";
import { calculateWorkingLoad, totalAllocations } from "src/utils/sprint-utils";

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
  const sprintEndDate = getSprintEnd(todaysDate);
  const columns = sprintViewProjectsColumns({allocations, timeEntries, projects});
  const setError = useSetAtom(errorAtom);

  /**
   * Get project data if user is logged in
   */
  useEffect(() => {
    fetchProjectDetails();
  },[loggedInPerson]);

  /**
   * Fetch allocations, project names and time entries
   */
  const fetchProjectDetails = async () => {
    setLoading(true);
    if (loggedInPerson){
      try {
        const fetchedAllocations = await allocationsApi.listAllocations({
          startDate: new Date(),
          personId: loggedInPerson?.id.toString()
        });
        const fetchedProjects = await projectsApi.listProjects({ startDate: new Date() });
        const fetchedTimeEntries = await Promise.all(fetchedAllocations.map(async (allocation) => {
          try {
            if (allocation.project) {
              const totalTimeEntries = await timeEntriesApi.listProjectTimeEntries({ projectId: allocation.project, startDate: allocation.startDate, endDate: allocation.endDate });
              let totalMinutes = 0;
              totalTimeEntries.forEach((timeEntry: TimeEntries) => {
                if (loggedInPerson && timeEntry.person === loggedInPerson.id) {
                  totalMinutes += (timeEntry.timeRegistered || 0)
                }
              }); 
              return totalMinutes;
            }
          } catch (error) {
            if (allocation.id) {
              const message: string = strings.formatString(strings.sprintRequestError.fetchAllocationError, (allocation.id).toString(), error as string).toString();
              setError(message);          
            }
          }
          return 0;
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
    }
    setLoading(false);
  };

  /**
   * Calculate total unallocated time for the user in the current 2 week period
   * 
   * @param allocation task allocated within a project
   */
  const unallocatedTime = (allocation: Allocations[]) => {
    const totalAllocatedTime = allocation.reduce((total, allocation) => total + totalAllocations(allocation), 0);
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
      {!allocations.length && !projects.length && !timeEntries.length ? (
        <Card sx={{ 
          p: "25%", 
          display: "flex", 
          justifyContent: "center" 
          }}
        >
          {loading && <Box sx={{ textAlign: "center" }} >
            <Typography>{strings.placeHolder.pleaseWait}</Typography>
            <CircularProgress 
              sx={{ 
                scale: "150%", 
                mt: "5%", 
                mb: "5%" 
              }} 
            />
          </Box>}
        </Card> 
      ) : (
        <>
          <FormControlLabel 
            control={<Switch checked={myTasks}/>} 
            label={strings.sprint.showMyTasks}  
            onClick={() =>  handleOnClickTask()}
          />  
          <FormControl size= "small" style={{ width: "200px", float: "right" }}>           
            <InputLabel disableAnimation={false}>
              {strings.sprint.taskStatus}
            </InputLabel>
            <Select
              defaultValue={strings.sprint.allTasks}
              style={{ 
                borderRadius: "30px", 
                marginBottom: "15px", 
                float: "right" 
              }}
              label={strings.sprint.taskStatus}             
            >   
              <MenuItem 
                key={1} 
                value={strings.sprint.toDo} 
                onClick={() => setFilter("TODO")}
              >
                {strings.sprint.toDo}
              </MenuItem>
              <MenuItem 
                key={2} 
                value={strings.sprint.inProgress} 
                onClick={() => setFilter("INPROGRESS")}
              >
                {strings.sprint.inProgress}
              </MenuItem>
              <MenuItem 
                key={3} 
                value={strings.sprint.allTasks} 
                onClick={() => setFilter("DONE")}
              >
                {strings.sprint.completed}
              </MenuItem>
              <MenuItem 
                key={4} 
                value={strings.sprint.allTasks} 
                onClick={() => setFilter("")}
              >
                {strings.sprint.allTasks}
              </MenuItem>
            </Select>
          </FormControl>
          <Card 
            sx={{ 
              margin: 0, 
              width: "100%", 
              height: "100", 
              marginBottom: "16px", 
              marginTop: "16px", 
              padding: "0px",
              "& .negative-value": {
                color: "red"
              }
            }}
          >
            <DataGrid 
              sx={{
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
              rows={allocations}
              columns={columns}
            />
            <Box 
              sx={{ 
                backgroundColor:"#e6e6e6", 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "5px", 
                paddingTop:" 10px", 
                paddingBottom:" 10px" 
              }}
            >
              <Typography> 
                {strings.sprint.unAllocated} 
                <span style={{ 
                  paddingLeft: "5px", 
                  color: unallocatedTime(allocations) < 0 ? "red" : "" 
                  }}
                >
                  {getHoursAndMinutes(unallocatedTime(allocations))}
                </span> 
              </Typography>
              <Typography style={{ paddingRight:"5px"}}>
                {strings.formatString(strings.sprint.current, sprintStartDate.toLocaleString(), sprintEndDate.toLocaleString() )}
              </Typography>
            </Box>
          </Card>
          {projects.map((project) =>
            <TaskTable 
              key={project.id} 
              project={project} 
              loggedInPersonId={myTasks ? loggedInPerson?.id : undefined} 
              filter={filter} 
            />
          )}
        </>
      )}
    </>
  );
};

export default SprintViewScreen;