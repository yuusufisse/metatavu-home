import { useAtomValue, useSetAtom } from "jotai";
import { personsAtom } from "src/atoms/person";
import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Typography,
  CardContent,
  Autocomplete,
  Checkbox,
  TextField,
  type PopperProps,
  Popper,
  styled,
  IconButton
} from "@mui/material";
import { useEffect, useState } from "react";
import strings from "src/localization/strings";
import { useLambdasApi } from "src/hooks/use-api";
import { errorAtom } from "src/atoms/error";
import { fetchProjectDetails, totalAllocations } from "src/utils/sprint-utils";
import SprintViewBarChart from "src/components/charts/sprint-view-bar-chart";
import type { PersonWithAllocations, SprintViewChartData } from "src/types";
import type { Person } from "src/generated/client";
import type { Allocations, Projects } from "src/generated/homeLambdasClient/models/";
import { userProfileAtom } from "src/atoms/auth";
import config from "src/app/config";
import { Search } from "@mui/icons-material";

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
  const [projectOption, setProjectOptions] = useState<Projects[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);

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
      id: projects[index].id || 0,
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
  }, [loggedInPerson]);

  /**
   * Fetches users' allocations and projects
   */
  const fetchProjectAndAllocations = async () => {
    if (!loggedInPerson) return;
    setLoading(true);
    const allPersonProjects: Projects[] = [];
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
        filteredProjects.forEach((project) => {
          if (project && !allPersonProjects.map((project) => project.id).includes(project.id || 0))
            allPersonProjects.push(project);
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
    setProjectOptions(allPersonProjects);
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

    const filteredChartData = selectedProjects.length
      ? chartData.filter((entry) => selectedProjects.includes(entry.id))
      : chartData;

    return (
      <>
        {allocations.length && filteredChartData.length ? (
          <Grid item xs={12} sm={6} md={4} key={person.id}>
            <Card key={person.id}>
              <CardContent sx={{ display: "flex", justifyContent: "left", height: "200px" }}>
                <SprintViewBarChart chartData={filteredChartData} vertical={false} />
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
   * @param _event input change event
   * @param inputValue cought string input
   */
  const handleSearchInputChange = (_event: any, inputValue: string) => {
    const newSearchInput = inputValue;
    setSearchInput(newSearchInput);
    if (newSearchInput === "") {
      setDisplayedPersonAllocations(personsWithAllocations);
      return;
    }
    const newDisplayedPersonsWithAllocations = personsWithAllocations.filter(
      (personsWithAllocations) =>
        `${personsWithAllocations.person.firstName} ${personsWithAllocations.person.lastName}`
          .toLowerCase()
          .includes(newSearchInput.toLowerCase()) ||
        personsWithAllocations.projects.some((project) => project.name?.includes(newSearchInput))
    );
    setDisplayedPersonAllocations(newDisplayedPersonsWithAllocations);
  };

  const CustomPopper = styled((props: PopperProps) => <Popper {...props} placement="bottom" />)({
    "& .MuiAutocomplete-noOptions": {
      display: "none"
    },
    "& .MuiAutocomplete-paper": {
      marginTop: "10px",
      backgroundColor: "#f2f2f2"
    }
  });

  /**
   * Search component with projects checkboxes
   *
   * @param projects list of projects
   */
  const customSearch = (projects?: Projects[]) => {
    if (!loggedInPerson || !projects) return;
    return (
      <Autocomplete
        PopperComponent={CustomPopper}
        multiple
        disableCloseOnSelect
        id="checkboxes-tags-demo"
        options={projects}
        getOptionLabel={(option) => {
          if (!option.name) return "";
          return option.name;
        }}
        clearOnBlur={false}
        inputValue={searchInput}
        onInputChange={handleSearchInputChange}
        onChange={(_event, values) => {
          const selectedProjectIds = values.map((value) => value.id || 0);
          setSelectedProjects(selectedProjectIds);
        }}
        renderOption={(props, option, { selected }) => (
          <li
            {...props}
            style={{ display: "flex", alignItems: "center" }}
            key={`project-option-${option.id}`}
          >
            <Checkbox sx={{ marginRight: 2 }} checked={selected} />
            <Box
              minWidth="5px"
              style={{ marginRight: "10px" }}
              component="span"
              sx={{
                bgcolor: option.color,
                height: 40,
                borderRadius: "5px"
              }}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={strings.sprint.searchProjectsAndPersons}
            sx={{
              "& fieldset": {
                border: "none",
                marginBottom: "20px"
              }
            }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <IconButton>
                    <Search />
                  </IconButton>
                  {params.InputProps.startAdornment}
                </>
              )
            }}
          />
        )}
        ListboxProps={{
          sx: {
            display: "grid",
            columnGap: 3,
            rowGap: 1,
            gridTemplateColumns: "repeat(2, 1fr)",
            "@media (min-width: 900px)": {
              gridTemplateColumns: "repeat(4, 1fr)"
            }
          }
        }}
      />
    );
  };

  return (
    <>
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
        <>
          <Card sx={{ marginBottom: 1 }}>{customSearch(projectOption)}</Card>
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
          </Grid>{" "}
        </>
      )}
    </>
  );
};

export default SprintViewAllScreen;
