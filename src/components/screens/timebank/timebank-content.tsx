import {
  Box,
  List,
  ListItem,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControlLabel,
  Checkbox,
  ListItemText,
  CircularProgress,
  Typography,
  Card,
  InputLabel,
  FormControl
} from "@mui/material";
import { formatTimePeriod, getHoursAndMinutes } from "../../../utils/time-utils";
import type { KeycloakProfile } from "keycloak-js";
import { DailyEntry, PersonTotalTime } from "../../../generated/client";
import TimebankPieChart from "./charts/timebank-piechart";
import TimebankOverviewChart from "./charts/timebank-overviewchart";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import strings from "../../../localization/strings";
import TimebankMultiBarChart from "./charts/timebank-multibarchart";
import DateRangePicker from "./timebank-daterange-picker";
import { Dispatch, SetStateAction, useState } from "react";
import { theme } from "../../../theme";

interface Props {
  personTotalTimeLoading: boolean;
  setPersonTotalTimeLoading: Dispatch<SetStateAction<boolean>>;
  userProfile: KeycloakProfile | undefined;
  personTotalTime: PersonTotalTime;
  personDailyEntry: DailyEntry;
  dailyEntries: DailyEntry[];
  timespanSelector: string;
  handleBalanceViewChange: (e: SelectChangeEvent) => void;
  handleDailyEntryChange: (e: DateTime | null) => void;
}

/**
 * Date range picker object.
 */
export interface Range {
  start: DateTime | null;
  end: DateTime | null;
}

const TimebankContent = (props: Props) => {
  const {
    personTotalTime,
    personDailyEntry,
    timespanSelector,
    handleBalanceViewChange,
    handleDailyEntryChange,
    dailyEntries,
    personTotalTimeLoading
  } = props;

  const [selectedEntries, setSelectedEntries] = useState<DailyEntry[]>();
  const [byRange, setByRange] = useState({
    dailyEntries: false
  });

  /**
   * Disables the days from the DatePicker which have zero logged and expected hours, commonly weekends.
   * Also prevents selecting a start date that is later than end date in the date range picker.
   * @param date DateTime object passed from the date picker
   * @param range Optional Range object to compare start and end dates
   * @returns boolean value which controls the disabled dates.
   */
  const disableNullEntries = (date: DateTime, range?: Range): boolean => {
    const nullEntries = dailyEntries?.filter(
      (item) =>
        item.logged === 0 &&
        item.expected === 0 &&
        DateTime.fromJSDate(item.date).toISODate() === date.toISODate()
    );
    return nullEntries?.length
      ? DateTime.fromJSDate(nullEntries[0].date).toISODate() === date.toISODate()
      : String(range?.end?.minus({ days: 1 }).toISODate()) < String(date.toISODate()) || false;
  };

  /**
   *
   */
  const renderOverViewChart = () => {
    if (personTotalTimeLoading) return <CircularProgress sx={{ margin: "auto", mt: "5%" }} />;
    else
      return (
        <>
          <TimebankOverviewChart personTotalTime={personTotalTime} />
          <List dense sx={{ marginLeft: "5%" }}>
            <ListItem>
              <ListItemText
                sx={{
                  color: getHoursAndMinutes(Number(personTotalTime?.balance)).startsWith("-")
                    ? theme.palette.error.main
                    : theme.palette.success.main
                }}
                primary={strings.timebank.balance}
                secondary={getHoursAndMinutes(Number(personTotalTime?.balance))}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={strings.timebank.logged}
                secondary={getHoursAndMinutes(Number(personTotalTime?.logged))}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={strings.timebank.expected}
                secondary={getHoursAndMinutes(Number(personTotalTime?.expected))}
              />
            </ListItem>
          </List>
        </>
      );
  };

  /**
   * Renders a daily entry pie chart or a bar chart of daily entries from a selected range.
   * @returns JSX.Element consisting of either chart component
   */
  const renderDailyEntryOrRangeChart = () => {
    if (byRange.dailyEntries) {
      return <TimebankMultiBarChart selectedEntries={selectedEntries} />;
    } else return <TimebankPieChart personDailyEntry={personDailyEntry} />;
  };

  /**
   * Renders a daily entry pie chart or a bar chart of daily entries from a selected range.
   * @returns JSX.Element consisting of either chart component
   */
  const renderDatePickers = () => {
    if (byRange.dailyEntries) {
      return (
        <DateRangePicker
          dailyEntries={dailyEntries}
          setSelectedEntries={setSelectedEntries}
          disableNullEntries={disableNullEntries}
        />
      );
    } else {
      return (
        <DatePicker
          sx={{
            width: "40%",
            marginRight: "1%"
          }}
          label={strings.timebank.selectEntry}
          disableFuture
          onChange={handleDailyEntryChange}
          value={DateTime.fromJSDate(dailyEntries[0].date)}
          minDate={DateTime.fromJSDate(dailyEntries[dailyEntries.length - 1].date)}
          maxDate={DateTime.fromJSDate(dailyEntries[0].date)}
          shouldDisableDate={disableNullEntries}
        />
      );
    }
  };

  return (
    <>
      <Card sx={{ border: "2px solid #bdbdbd;" }}>
        <Typography
          gutterBottom
          fontWeight={"bold"}
          variant="h6"
          sx={{
            color: "white",
            textAlign: "center",
            backgroundColor: "#bdbdbd",
            width: "100%",
            p: 2
          }}
        >
          {strings.timebank.barChartDescription}
        </Typography>

        <Box sx={{ p: 3 }}>
          <ListItemText
            sx={{ textAlign: "center", scale: "150%", p: 3 }}
            primary={strings.timebank.timeperiod}
            secondary={formatTimePeriod(personTotalTime?.timePeriod?.split(","))}
          />
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <FormControl
              sx={{
                width: "50%",
                marginRight: "1%",
                textAlign: "center"
              }}
            >
              <InputLabel id="select">Select a time span</InputLabel>
              <Select
                label={"Select a time span"}
                labelId="select"
                sx={{
                  width: "100%"
                }}
                value={timespanSelector}
                onChange={handleBalanceViewChange}
              >
                <MenuItem value={"Week"}>{strings.timeExpressions.week}</MenuItem>
                <MenuItem value={"Month"}>{strings.timeExpressions.month}</MenuItem>
                <MenuItem value={"All"}>{strings.timeExpressions.allTime}</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", justifyItems: "center" }}>
            {renderOverViewChart()}
          </Box>
        </Box>
      </Card>
      <br />
      <Card sx={{ border: "2px solid #bdbdbd;" }}>
        <Typography
          gutterBottom
          fontWeight={"bold"}
          variant="h6"
          sx={{
            textAlign: "center",
            color: "white",
            backgroundColor: "#bdbdbd",
            width: "100%",
            p: 2
          }}
        >
          {strings.timebank.pieChartDescription}
        </Typography>

        <Box sx={{ p: 3 }}>
          <ListItemText
            sx={{ textAlign: "center", scale: "150%", p: 3 }}
            primary={strings.timebank.logged}
            secondary={
              byRange.dailyEntries
                ? getHoursAndMinutes(
                    Number(selectedEntries?.reduce((prev, next) => prev + next.logged, 0))
                  )
                : getHoursAndMinutes(Number(personDailyEntry.logged))
            }
          />
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            {renderDatePickers()}
            <FormControlLabel
              sx={{ display: "inline" }}
              label="By range"
              control={
                <Checkbox
                  defaultChecked={byRange.dailyEntries}
                  onClick={() =>
                    setByRange({ ...byRange, dailyEntries: byRange.dailyEntries ? false : true })
                  }
                />
              }
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "row", justifyItems: "center" }}>
            {renderDailyEntryOrRangeChart()}
            <List dense sx={{ marginLeft: "5%" }}>
              <ListItem>
                <ListItemText
                  sx={{ color: theme.palette.success.dark }}
                  primary={strings.timebank.billableProject}
                  secondary={
                    byRange.dailyEntries
                      ? getHoursAndMinutes(
                          Number(
                            selectedEntries?.reduce(
                              (prev, next) => prev + next.billableProjectTime,
                              0
                            )
                          )
                        )
                      : getHoursAndMinutes(Number(personDailyEntry.billableProjectTime))
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  sx={{ color: theme.palette.success.light }}
                  primary={strings.timebank.nonBillableProject}
                  secondary={
                    byRange.dailyEntries
                      ? getHoursAndMinutes(
                          Number(
                            selectedEntries?.reduce(
                              (prev, next) => prev + next.nonBillableProjectTime,
                              0
                            )
                          )
                        )
                      : getHoursAndMinutes(Number(personDailyEntry.nonBillableProjectTime))
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  sx={{ color: theme.palette.warning.main }}
                  primary={strings.timebank.internal}
                  secondary={
                    byRange.dailyEntries
                      ? getHoursAndMinutes(
                          Number(
                            selectedEntries?.reduce((prev, next) => prev + next.internalTime, 0)
                          )
                        )
                      : getHoursAndMinutes(Number(personDailyEntry.internalTime))
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  sx={{ color: theme.palette.info.main }}
                  primary={strings.timebank.expected}
                  secondary={
                    byRange.dailyEntries
                      ? getHoursAndMinutes(
                          Number(selectedEntries?.reduce((prev, next) => prev + next.expected, 0))
                        )
                      : getHoursAndMinutes(Number(personDailyEntry.expected))
                  }
                />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Card>
    </>
  );
};

export default TimebankContent;
