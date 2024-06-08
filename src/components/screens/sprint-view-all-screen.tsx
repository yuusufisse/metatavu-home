import { useAtomValue, useSetAtom } from "jotai";
import { personsAtom } from "src/atoms/person";
import { Box, Card, CircularProgress, Grid, Typography, CardContent } from "@mui/material";
import { type ChangeEvent, useEffect, useState } from "react";
import strings from "src/localization/strings";
import { useLambdasApi } from "src/hooks/use-api";
import { errorAtom } from "src/atoms/error";
import { fetchProjectDetails, totalAllocations } from "src/utils/sprint-utils";
import SprintViewAllBarChart from "../charts/sprint-view-all-bar-chart";
import { renderSearch } from "src/utils/search-utils";
import type { PersonWithAllocations, SprintViewChartData } from "src/types";
import type { Person } from "src/generated/client";
import type { Allocations, Projects } from "src/generated/homeLambdasClient/models/";
import { userProfileAtom } from "src/atoms/auth";
import config from "src/app/config";

/**
 * Sprint view all screen component
 */
const SprintViewAllScreen = () => {
  const { allocationsApi, projectsApi, timeEntriesApi } = useLambdasApi();
  const setError = useSetAtom(errorAtom);
  const persons: Person[] = useAtomValue(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const loggedInPerson = persons.find(
    (person: Person) =>
      person.id === config.person.forecastUserIdOverride || person.keycloakId === userProfile?.id
  );
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [personsWithAllocations, setAllocations] = useState<PersonWithAllocations[]>([]);
  const [displayedPersonAllocations, setDisplayedPersonAllocations] = useState<
    PersonWithAllocations[]
  >([]);

  /**
   * Combines allocations and projects data for chart
   */
  const createChartData = (
    allocations: Allocations[],
    projects: Projects[],
    timeEntries: number[],
    person: Person
  ): SprintViewChartData[] => {
    return allocations.map((allocation, index) => ({
      id: index,
      projectName: projects[index]?.name || "",
      timeAllocated: totalAllocations(allocation),
      timeEntries: timeEntries[index],
      color: projects[index]?.color || "",
      firstName: person.firstName,
      lastName: person.lastName
    }));
  };

  useEffect(() => {
    fetchProjectAndAllocations();
  }, []);

  /**
   * Fetches users' allocations and projects
   */
  const fetchProjectAndAllocations = async () => {
    setLoading(true);
    if (!loggedInPerson) return;
    const allPersonAllocations: PersonWithAllocations[] = await Promise.all(
      persons.map(async (person) => {
        const { filteredAllocations, filteredProjects, fetchedTimeEntries } =
          await fetchProjectDetails({
            setError,
            person,
            allocationsApi,
            projectsApi,
            timeEntriesApi
          });

        return {
          allocations: filteredAllocations,
          projects: filteredProjects,
          timeEntries: fetchedTimeEntries,
          person: person
        };
      })
    );
    setAllocations(allPersonAllocations);
    setDisplayedPersonAllocations(allPersonAllocations);
    setLoading(false);
  };

  /**
   * Renders sprint view bar chart
   */
  const renderBarChart = (
    allocations: Allocations[],
    projects: Projects[],
    timeEntries: number[],
    person: Person
  ) => {
    const chartData = createChartData(allocations, projects, timeEntries, person);

    return (
      <>
        {allocations.length ? (
          <Grid item xs={12} sm={6} md={4} key={person.id}>
            <Card key={person.id}>
              <CardContent sx={{ display: "flex", justifyContent: "left", height: "200px" }}>
                <SprintViewAllBarChart chartData={chartData} />
                <Typography
                  style={{ paddingLeft: "0" }}
                  fontSize={"20px"}
                >{`${person.firstName} ${person.lastName}`}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          <></>
        )}
      </>
    );
  };

  /**
   * Handle search input change
   *
   * @param event input change event
   */
  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchInput = event.target.value;
    setSearchInput(newSearchInput);
    if (newSearchInput === "") {
      setDisplayedPersonAllocations(personsWithAllocations);
      return;
    }

    const newDisplayedPersonsWithAllocations = personsWithAllocations.filter(
      (personsWithAllocations) =>
        `${personsWithAllocations.person.firstName} ${personsWithAllocations.person.lastName}`
          .toLowerCase()
          .includes(newSearchInput.toLowerCase())
    );
    setDisplayedPersonAllocations(newDisplayedPersonsWithAllocations);
  };

  return (
    <>
      <Card sx={{ marginBottom: 2 }}>
        {renderSearch({ loading, searchInput, handleSearchInputChange })}
      </Card>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginTop: 10
          }}
        >
          <Typography>{strings.placeHolder.pleaseWait}</Typography>
          <CircularProgress sx={{ margin: "auto", mt: "5%", mb: "5%" }} />
        </Box>
      ) : (
        <Grid container spacing={2} marginBottom={20} textAlign={"center"}>
          {displayedPersonAllocations.map((personsWithAllocations) => (
            <>
              {renderBarChart(
                personsWithAllocations.allocations,
                personsWithAllocations.projects,
                personsWithAllocations.timeEntries,
                personsWithAllocations.person
              )}
            </>
          ))}
        </Grid>
      )}
    </>
  );
};

export default SprintViewAllScreen;
