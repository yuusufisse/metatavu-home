import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { personsAtom, personsWithTotalTimeAtom } from "../../atoms/person";
import {
  Box,
  Card,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography
} from "@mui/material";
import { DateTime } from "luxon";
import { languageAtom } from "../../atoms/language";
import { theme } from "../../theme";
import { PieChart, Pie, Cell, Legend, TooltipProps, Tooltip, ResponsiveContainer } from "recharts";
import { PersonWithTotalTime, WorkTimeCategory, WorkTimeTotalData } from "../../types";
import { getHoursAndMinutes } from "../../utils/time-utils";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import strings from "../../localization/strings";
import { useApi } from "../../hooks/use-api";
import { errorAtom } from "../../atoms/error";
import { Person, PersonTotalTime, Timespan } from "../../generated/client";
import { ChangeEvent, useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import { COLORS } from "../constants";

/**
 * Timebank view all screen component
 */
const TimebankViewAllScreen = () => {
  const { personsApi } = useApi();
  const language = useAtomValue(languageAtom);
  const setError = useSetAtom(errorAtom);
  const [personsWithTotalTime, setPersonsWithTotalTime] = useAtom(personsWithTotalTimeAtom);
  const [persons, setPersons] = useAtom(personsAtom);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [displayedPersonsWithTotalTime, setDisplayedPersonsWithTotalTime] = useState<
    PersonWithTotalTime[]
  >([]);

  /**
   * Renders the customized tooltip for charts
   *
   * @param props props of the custom tooltip
   */
  const renderCustomizedTooltip = (props: TooltipProps<ValueType, NameType>) => {
    const { active, payload } = props;

    if (!active || !payload || !payload.length) {
      return null;
    }

    const selectedData = payload[0];

    if (!selectedData.value || !selectedData.name) {
      return null;
    }

    const sectionName = {
      [WorkTimeCategory.BILLABLE_PROJECT]: strings.timebank.billableProjectTime,
      [WorkTimeCategory.NON_BILLABLE_PROJECT]: strings.timebank.nonBillableProjectTime,
      [WorkTimeCategory.INTERNAL]: strings.timebank.internalTime
    }[selectedData.name];

    return (
      <Box style={{ backgroundColor: "rgba(0, 0, 0)", opacity: "70%" }}>
        <Typography
          variant="h6"
          style={{
            color: "#fff",
            padding: theme.spacing(1)
          }}
        >
          {`${sectionName}: ${getHoursAndMinutes(selectedData.value as number)}`}
        </Typography>
      </Box>
    );
  };

  /**
   * Render piechart component
   *
   * @param personWithTotalTime person with total time object
   * @param legend legend boolean
   */
  const renderPieChart = (personWithTotalTime: PersonWithTotalTime, legend: boolean) => {
    const { person, personTotalTime } = personWithTotalTime;

    if (!person || !personTotalTime) return null;

    const workTimeData: WorkTimeTotalData[] = [
      { name: WorkTimeCategory.BILLABLE_PROJECT, balance: personTotalTime.billableProjectTime },
      {
        name: WorkTimeCategory.NON_BILLABLE_PROJECT,
        balance: personTotalTime.nonBillableProjectTime
      },
      { name: WorkTimeCategory.INTERNAL, balance: personTotalTime.internalTime }
    ];

    return (
      <ResponsiveContainer width={"75%"} height={150}>
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            dataKey="balance"
            data={workTimeData}
            label={(props) => getHoursAndMinutes(props.value)}
          >
            {workTimeData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {legend ? <Legend wrapperStyle={{ position: "relative" }} /> : null}
          <Tooltip content={renderCustomizedTooltip} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  /**
   * Populate one person's total work data
   *
   * @param person person with total time data
   */
  const populatePersonTotalTimeData = async (
    person: PersonWithTotalTime
  ): Promise<PersonWithTotalTime> => {
    let totalTime: PersonTotalTime[] = [];

    try {
      totalTime = await personsApi.listPersonTotalTime({
        personId: person.person.id,
        timespan: Timespan.ALL_TIME
      });
    } catch (error) {
      setError(`${error} ${strings.error.totalTimeFetch}`);
    }

    return {
      ...person,
      personTotalTime: totalTime[0]
    };
  };

  /**
   * Fetches the person data & person total time data
   */
  const fetchPersonsAndPersonsTotalTime = async () => {
    setLoading(true);

    try {
      let fetchedPersons: Person[] = persons;

      if (!fetchedPersons.length) {
        fetchedPersons = await personsApi.listPersons({
          active: true
        });
        setPersons(fetchedPersons);
      }

      const personTotalsTimeList: PersonWithTotalTime[] = persons.map((_person) => ({
        person: _person
      }));

      const populatedPersonTotalsTimeList = await Promise.all(
        personTotalsTimeList.map(populatePersonTotalTimeData)
      );

      setPersonsWithTotalTime(populatedPersonTotalsTimeList);
      setDisplayedPersonsWithTotalTime(populatedPersonTotalsTimeList);
    } catch (error) {
      setError(`${error} ${strings.error.fetchFailedGeneral}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPersonsAndPersonsTotalTime();
  }, []);

  /**
   * Renders the search
   */
  const renderSearch = () => (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <TextField
        value={searchInput}
        onChange={handleSearchInputChange}
        placeholder={strings.timebank.searchPlaceholder}
        variant="standard"
        disabled={loading}
        sx={{ width: "99%", padding: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
      />
    </Box>
  );

  /**
   * Handle search input change
   *
   * @param event input change event
   */
  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newSearchInput = event.target.value;
    setSearchInput(newSearchInput);

    if (newSearchInput === "") {
      setDisplayedPersonsWithTotalTime(personsWithTotalTime);
      return;
    }

    const newDisplayedPersonsWithTotalTime = personsWithTotalTime.filter((personsWithTotalTime) =>
      `${personsWithTotalTime.person.firstName} ${personsWithTotalTime.person.lastName}`
        .toLowerCase()
        .includes(newSearchInput.toLowerCase())
    );

    setDisplayedPersonsWithTotalTime(newDisplayedPersonsWithTotalTime);
  };

  return (
    <>
      <Card sx={{ marginBottom: 2 }}>{renderSearch()}</Card>
      <Grid container spacing={2} textAlign={"center"} marginBottom={20}>
        {!loading ? (
          displayedPersonsWithTotalTime.map((personWithTotalTime, idx) => {
            const balanceColor =
              personWithTotalTime.personTotalTime && personWithTotalTime.personTotalTime.balance > 0
                ? theme.palette.success.main
                : theme.palette.error.main;
            return (
              <Grid item xs={12} sm={6} md={4} key={`person-totaltime-card-${idx}`}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "400px",
                    "& .recharts-wrapper .recharts-surface": {
                      overflow: "visible"
                    }
                  }}
                >
                  <Box sx={{ padding: "10px", marginBottom: "60px" }}>
                    <Typography variant="h4">{`${personWithTotalTime.person.firstName} ${personWithTotalTime.person.lastName}`}</Typography>
                    <Typography>
                      {personWithTotalTime.person.startDate &&
                        DateTime.fromFormat(personWithTotalTime.person.startDate, "yyyy-M-d")
                          .setLocale(language)
                          .toLocaleString()}
                    </Typography>
                  </Box>
                  {renderPieChart(personWithTotalTime, false)}
                  <Box sx={{ marginTop: "60px" }}>
                    {personWithTotalTime.personTotalTime && (
                      <Typography fontSize={22} color={balanceColor}>
                        {getHoursAndMinutes(personWithTotalTime.personTotalTime.balance)}
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })
        ) : (
          <CircularProgress sx={{ margin: "auto", mt: "5%", mb: "5%" }} />
        )}
      </Grid>
    </>
  );
};

export default TimebankViewAllScreen;
