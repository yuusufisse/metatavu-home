import React, { useState, useEffect } from 'react';
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

const SprintViewScreen = () => {
  const { allocationsApi, projectsApi, tasksApi } = useLambdasApi();
  const persons = useAtomValue(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const loggedInPerson = persons.find(
    (person: Person) => person.id === config.person.forecastUserIdOverride || person.keycloakId === userProfile?.id
  );

  const [allocations, setAllocations] = useState<Allocations[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [minimizedProjects, setMinimizedProjects] = useState<number[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([getPersonAllocations(), getProjects(), getTasks()]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loggedInPerson]);

  const getProjects = async () => {
    if (loggedInPerson) {
      try {
        const fetchedProjects = await projectsApi.listProjects({
          startDate: new Date()
        });

        const mappedProjects: Projects[] = fetchedProjects.map((project: Projects) => ({
          id: project.id,
          name: project.name
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }
  };

  const getPersonAllocations = async () => {
    try {
      const fetchedAllocations = await allocationsApi.listAllocations({
        startDate: new Date(),
      });

      const mappedAllocations: Allocations[] = fetchedAllocations.map((allocation) => ({
        id: allocation.id,
        project: allocation.project,
        person: allocation.person,
        monday: allocation.monday,
        tuesday: allocation.tuesday,
        wednesday: allocation.wednesday,
        thursday: allocation.thursday,
        friday: allocation.friday,
      }));

      mappedAllocations.forEach((row) => {
        const totalMinutes = row.monday + row.tuesday + row.wednesday + row.thursday + row.friday;
        console.log("Total Minutes:", totalMinutes);
  
        // Perform additional calculations or set the value as needed
        // For example, set the totalMinutes value to the row
        row.totalMinutes = totalMinutes;
      });

      setAllocations(mappedAllocations);
    } catch (error) {
      console.error("Error fetching allocations:", error);
    }
  };

  const getTasks = async () => {
    if (loggedInPerson) {
      try {
        const fetchedTasks = await tasksApi.listProjectTasks({
          projectId: 0
        });

        const mappedTasks: Tasks[] = fetchedTasks.map((task: Tasks) => ({
          id: task.id,
          title: task.title,
          assignees: task.assignedPersons,
          projectId: task.projectId,
          priority: task.highPriority,
          estimate: task.estimate,
          remaining: task.remaining     
        }));
        setTasks(mappedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
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

  const allocationColumns = ["Project Name", "Allocation", "Time Entries", "Allocations Left"];
  const projectColumns = ["Task Title", "Assigned Persons", "Status", "High Priority", "End Date"];

  /* const calculateTotalHours = (allocation: Allocations) => {
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    const relatedTimeEntries = mockTimeEntries.filter(entry => entry.project === row.project);

    const timeRegistered = relatedTimeEntries.reduce((total, entry) => total + entry.time_registered, 0);
    const allocationsLeft = totalMinutes - timeRegistered;
  
    const timeRegisteredHours = Math.floor(timeRegistered / 60);
    const timeRegisteredMinutes = timeRegistered % 60;
  
    const leftHours = Math.floor(allocationsLeft / 60);
    const leftMinutes = allocationsLeft % 60;
  
    return {
      total: totalMinutes,
      timeEntries: timeRegistered,
      allocationsLeft: allocationsLeft,
    };
  }; */

  const filteredTasks = (projectId: number) => {
    return tasks.filter((task) => task.projectId === projectId);
  };

  return (
    <>
      <h1>{strings.sprint.sprintviewScreen}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Card sx={{ margin: 0, width: '100%', marginBottom: '16px' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>
                <TableRow>
                  {allocationColumns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allocations.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{projects.find(project => project.id === row.project)?.name}</TableCell>
                    <TableCell>{calculateTotalHours(row).total}</TableCell>
                    <TableCell>{calculateTotalHours(row).timeEntries}</TableCell>
                    <TableCell>{calculateTotalHours(row).allocationsLeft}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
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
                  {projectColumns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {!minimizedProjects.includes(project.id) && (
                <TableBody>
                  {filteredTasks(project.id).map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.assignees}</TableCell>
                      <TableCell>{project.status}</TableCell>
                      <TableCell>{task.priority}</TableCell>
                      <TableCell>{task.remaining}</TableCell>
                    </TableRow>
                  ))}
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
