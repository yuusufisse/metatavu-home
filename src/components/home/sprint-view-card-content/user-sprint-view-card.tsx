import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { personsAtom } from "src/atoms/person";
import { userProfileAtom } from "src/atoms/auth";
import type { Person } from "src/generated/client";
import config from "src/app/config";
import { useLambdasApi } from "src/hooks/use-api";
import type { Allocations, Projects } from "src/generated/homeLambdasClient";
import { CardContent, Skeleton, Typography } from "@mui/material";
import SprintViewBarChart from "src/components/charts/sprint-view-bar-chart";
import type { SprintViewChartData } from "src/types";
import strings from "src/localization/strings";
import { totalAllocations, fetchProjectDetails } from "src/utils/sprint-utils";
import { errorAtom } from "src/atoms/error";

/**
 * Sprint card component for users
 */
const UserSprintViewCard = () => {
  const [loading, setLoading] = useState(false);
  const [persons] = useAtom(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const loggedInPerson = persons.find(
    (person: Person) =>
      person.id === config.person.forecastUserIdOverride || person.keycloakId === userProfile?.id
  );
  const [allocations, setAllocations] = useState<Allocations[]>([]);
  const [projects, setProjects] = useState<Projects[]>([]);
  const [timeEntries, setTimeEntries] = useState<number[]>([]);
  const { allocationsApi, projectsApi, timeEntriesApi } = useLambdasApi();
  const setError = useSetAtom(errorAtom);

  useEffect(() => {
    fetchProjectAndAllocations();
  }, [loggedInPerson]);

  /**
   * Fetches users' allocations and projects
   */
  const fetchProjectAndAllocations = async () => {
    setLoading(true);
    if (!loggedInPerson) return;
    const { filteredAllocations, filteredProjects, fetchedTimeEntries } = await fetchProjectDetails(
      {
        setError,
        person: loggedInPerson,
        allocationsApi,
        projectsApi,
        timeEntriesApi
      }
    );
    setAllocations(filteredAllocations);
    setProjects(filteredProjects);
    setTimeEntries(fetchedTimeEntries);
    setLoading(false);
  };

  /**
   * Combines allocations and projects data for chart
   */
  const createChartData = (): SprintViewChartData[] => {
    return allocations.map((allocation, index) => {
      return {
        id: index,
        projectName: projects[index].name || "",
        timeAllocated: totalAllocations(allocation),
        timeEntries: timeEntries[index],
        color: projects[index].color || ""
      };
    });
  };

  /**
   * Renders sprint view bar chart
   */
  const renderBarChart = () => (
    <>
      {allocations.length ? (
        <CardContent sx={{ display: "flex", justifyContent: "left" }}>
          <SprintViewBarChart chartData={createChartData()} />
        </CardContent>
      ) : (
        <Typography style={{ paddingLeft: "0" }}>{strings.sprint.noAllocation}</Typography>
      )}
    </>
  );

  return <>{!loggedInPerson || loading ? <Skeleton /> : renderBarChart()}</>;
};

export default UserSprintViewCard;
