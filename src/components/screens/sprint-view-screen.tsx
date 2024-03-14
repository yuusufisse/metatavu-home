import React, { useState, useEffect, useMemo } from 'react';
import strings from "../../localization/strings";
import { Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useLambdasApi } from "../../hooks/use-api";
import { Person } from "../../generated/client";
import { useAtomValue } from "jotai";
import { personsAtom } from "../../atoms/person";
import config from "../../app/config";
import { userProfileAtom } from "../../atoms/auth";
import { Allocations } from "../../generated/homeLambdasClient/models/Allocations";
import { Projects } from "../../generated/homeLambdasClient/models/Projects";
import { Tasks } from "../../generated/homeLambdasClient/models/Tasks";
import { TimeEntries } from "../../generated/homeLambdasClient/models/TimeEntries";

const SprintViewScreen = () => {
  const { allocationsApi, projectsApi, tasksApi, timeEntriesApi } = useLambdasApi();
  const persons: Person[] = useAtomValue(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const loggedInPerson = persons.find(
    (person: Person) => person.id === config.person.forecastUserIdOverride || person.keycloakId === userProfile?.id
  );
  
  const [allocations, setAllocations] = useState<Allocations[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntries[]>([]);
  const [minimizedProjects, setMinimizedProjects] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch person allocations
        const allocationsData = await getPersonAllocations();
        setAllocations(allocationsData);
        
        // Fetch projects
        const projectsData = await getProjects();
        setProjects(projectsData);
        
        // Fetch tasks
        const tasksData = await getTasks();
        setTasks(tasksData);
        
        // Fetch time entries
        const timeEntriesData = await getTimeEntries();
        setTimeEntries(timeEntriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [loggedInPerson]);

  const getProjects = async () => {
    if (!loggedInPerson) return [];
  
    try {
      const fetchedAllocations = await allocationsApi.listAllocations({
        startDate: new Date(),
      });
      const filteredAllocations = fetchedAllocations.filter(allocation => allocation.person === loggedInPerson.id);
  

      console.log("in projects, allocations", filteredAllocations);
  
      const fetchedProjects = await Promise.all(filteredAllocations.map(async (allocation) => {
        try {
          const fetchedProjects = await projectsApi.listProjects({
            startDate: new Date()
          });
          const filteredProjects = fetchedProjects.filter(project => project.id === allocation.project);
          console.log("filtered projects", filteredProjects)
          return filteredProjects;
        } catch (error) {
          console.error('Error fetching time entries for project:', error);
          return [];
        }
      }));
  
      const mergedProjects = fetchedProjects.flat();
      console.log("projects in projects", mergedProjects)
      setProjects(prevState => [...prevState, ...mergedProjects]);
      return mergedProjects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  };

  const getPersonAllocations = async () => {
    if (!loggedInPerson) return [];
  
    try {
      const fetchedAllocations = await allocationsApi.listAllocations({
        startDate: new Date(),
      });
  
      const filteredAllocations = fetchedAllocations.filter(allocation => allocation.person === loggedInPerson.id);
      console.log("in allocations", filteredAllocations);
      return filteredAllocations;
    } catch (error) {
      console.error("Error fetching allocations:", error);
      return []; // Ensure that an empty array is returned in case of an error
    }
  };

  const getTasks = async () => {
    if (!loggedInPerson) return [];
  
    try {
      const fetchedTasks = await tasksApi.listProjectTasks({
        projectId: 0
      });
  
      const filteredTasks = fetchedTasks.filter(task => task.assignedPersons.includes(loggedInPerson.id));
  
      
      return filteredTasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };

  const getTimeEntries = async () => {
    if (!loggedInPerson || !projects.length) return [];
  
    try {
      const timeEntriesData = await Promise.all(projects.map(async (project) => {
        if (!project.id) return [];
  
        try {
          const fetchedTimeEntries = await timeEntriesApi.listProjectTimeEntries({
            projectId: project.id
          });
  
          return fetchedTimeEntries;
        } catch (error) {
          console.error('Error fetching time entries for project', error);
          return [];
        }
      }));
      
      const flattenedTimeEntries = timeEntriesData.flat();
      console.log("time entries",timeEntriesData);
      return flattenedTimeEntries;
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  };

  const toggleMinimizeProject = (projectId: number) => {
    setMinimizedProjects((prevMinimizedProjects) => {
      if (prevMinimizedProjects.includes(projectId)) {
        return prevMinimizedProjects.filter((id) => id !== projectId);
      } else {
        return [...prevMinimizedProjects, projectId];
      }
    });
  };

  const calculateTotalHours = useMemo(
    () => (allocation: Allocations | undefined) => {
      if (!allocation) {
        return {
          total: '0h 0min',
          timeEntries: '0h 0min',
          allocationsLeft: '0h 0min',
        };
      }
  
      const totalMinutes =
        (allocation.monday || 0) +
        (allocation.tuesday || 0) +
        (allocation.wednesday || 0) +
        (allocation.thursday || 0) +
        (allocation.friday || 0);
  
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
  
      const relevantTimeEntries = timeEntries.filter(
        (entry) => entry.project === allocation.project
      );
  
      const timeRegistered = relevantTimeEntries.reduce((total, entry) => total + entry.timeRegistered, 0);
  
      const allocationsLeft = totalMinutes - timeRegistered;
      const leftHours = Math.floor(allocationsLeft / 60);
      const leftMinutes = allocationsLeft % 60;
  
      return {
        total: `${hours}h ${minutes}min`,
        timeEntries: `${Math.floor(timeRegistered / 60)}h ${
          timeRegistered % 60
        }min`,
        allocationsLeft: `${leftHours}h ${leftMinutes}min`,
      };
    },
    [timeEntries]
  );

  const filteredTasks = (projectId: number) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  const filteredTimeEntries = (projectId: number) => {
    return timeEntries.filter(entry => entry.project === projectId);
  };

  return (
    <>
      <h1>{strings.sprint.sprintviewScreen}</h1>

      <Card sx={{ margin: 0, width: '100%', marginBottom: '16px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>
              <TableRow>
                <TableCell>My allocations</TableCell>
                <TableCell>Allocation</TableCell>
                <TableCell>Time Entries</TableCell>
                <TableCell>Allocations Left</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocations.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{projects.find(project => project.id === row.project)?.name}</TableCell>
                  <TableCell>{calculateTotalHours(row).total}</TableCell>
                  <TableCell>{filteredTimeEntries(row.project).reduce((acc, entry) => acc + entry.timeRegistered, 0)}</TableCell>
                  <TableCell>{calculateTotalHours(row).allocationsLeft}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {projects.map((project) => (
        <Card key={project.id} style={{ marginBottom: '16px' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>
                <TableRow>
                  <TableCell style={{ width: '500px' }}>
                    <IconButton onClick={() => toggleMinimizeProject(project.id)}>
                      {minimizedProjects.includes(project.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    <span>{project.name}</span>
                  </TableCell>
                  <TableCell>Assignees</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Estimate</TableCell>
                  <TableCell>Time Entries</TableCell>
                </TableRow>
              </TableHead>
              {!minimizedProjects.includes(project.id) && (
                <TableBody>
                  {filteredTasks(project.id).map((task) => {
                    const relevantTimeEntries = filteredTimeEntries(project.id);
                    const relevantTimeEntry = relevantTimeEntries.find(entry => entry.task === task.id);
                    const estimateHours = Math.floor(task.estimate / 60);
                    const estimateMinutes = task.estimate % 60;
                    const formattedEstimate = `${estimateHours}h ${estimateMinutes}min`;
                    const timeRegistered = relevantTimeEntry ? relevantTimeEntry.timeRegistered : '-';
                    return (
                      <TableRow key={task.id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.assignedPersons}</TableCell>
                        <TableCell>{project.status}</TableCell>
                        <TableCell>{task.highPriority}</TableCell>
                        <TableCell>{formattedEstimate}</TableCell>
                        <TableCell>{timeRegistered}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Card>
      ))}
    </>
  );
};

export default SprintViewScreen;
