import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { personsAtom } from "../../../atoms/person";
import { userProfileAtom } from "../../../atoms/auth";
import { Person } from "../../../generated/client";
import config from "../../../app/config";
import { useLambdasApi } from "../../../hooks/use-api";
import { Allocations, Projects, TimeEntries } from "../../../generated/homeLambdasClient";
import { CardContent, CircularProgress, Typography } from "@mui/material";
import SprintViewBarChart from "../../charts/sprint-view-bar-chart";
import { SprintViewChartData } from "../../../types";
import strings from "../../../localization/strings";

/**
 * Sprint card component for users
 */
const UserSprintViewCard = () => {
  const [loading, setLoading] = useState(false);
  const [persons] = useAtom(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const loggedInPerson = persons.find(
    (person: Person) => person.id === config.person.forecastUserIdOverride || person.keycloakId === userProfile?.id
  );
  const [allocations, setAllocations] = useState<Allocations[]>([]);
	const [projects, setProjects] = useState<(Projects|undefined)[]>([]);
	const [timeEntries, setTimeEntries] = useState<number[]>([]);
  const {allocationsApi, projectsApi, timeEntriesApi} = useLambdasApi();

	useEffect(()=>{
		getAllocationsAndProjects();
	},[loggedInPerson]);

	/**
   * Get allocations, projects and time entries
   */
	const getAllocationsAndProjects = async () => {
		setLoading(true);
		if (loggedInPerson) {
			try {
				const fetchedAllocations = await allocationsApi.listAllocations({personId: loggedInPerson.id.toString(), startDate: new Date()});
				const fetchedProjects = await projectsApi.listProjects();
				const findProjects =fetchedAllocations.map( (allocation)=>{
					return fetchedProjects.find((project) => project.id === allocation.project) || undefined;
				});

				const totalTimeEntries = await Promise.all(fetchedAllocations.map(async(allocation) => {
					try {
						const fetchedTimeEntries = await timeEntriesApi.listProjectTimeEntries({ projectId: allocation.project || 0, startDate: allocation.startDate, endDate: allocation.endDate});
						let totalMinutes = 0;
            fetchedTimeEntries.forEach((timeEntry: TimeEntries) => {
              if (loggedInPerson && timeEntry.person === loggedInPerson.id) {
                totalMinutes += (timeEntry.timeRegistered || 0)
              }
            }); 
            return totalMinutes;
					} catch (error){
						console.error("Error fetching time entries:", error);
						
					}
					return 0;
				}));
				setAllocations(fetchedAllocations);
				setProjects(findProjects);
				setTimeEntries(totalTimeEntries);
			} catch (error) {
				console.error("Error fetching data: ", error);
			}
			setLoading(false);
		}
	} 

	/**
   * Calculates time allocated for 2 weeks
   *
   * @param allocation allocation data
   */
	const calculateAllocationTime = (allocation: Allocations) => {
		const totalTime = (allocation.monday || 0) 
		+ (allocation.tuesday || 0) 
		+ (allocation.wednesday || 0) 
		+ (allocation.thursday || 0) 
		+ (allocation.friday || 0);
		return totalTime * 2;
	}
	
	/**
   * Combines allocations and projects data for chart
   */
	const createChartData = (): SprintViewChartData[] => {
		return allocations.map((allocation, index) => {
			return {projectName: projects[index]?.name || "", timeAllocated: calculateAllocationTime(allocation) || 0, timeEntries: timeEntries[index], color: projects[index]?.color || ""};
		})
	}

	return (
		<>
			{!loggedInPerson || loading ? 
				<CardContent sx={{ display: "flex", justifyContent: "center" } }>
          <CircularProgress sx={{ scale: "100%" }} />
        </CardContent> 
				: 
				<>
					{allocations.length > 0 ?
						<CardContent sx={{ display: "flex", justifyContent: "left"} }>
							<SprintViewBarChart chartData={createChartData()}/>
						</CardContent>
						:
						<Typography style={{paddingLeft:"0"}}>{ strings.sprint.noAllocations }</Typography>
					}
				</>
			}
		</>
	)
} 

export default UserSprintViewCard;