import {
  Box,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  ListItemText,
  CircularProgress,
  Typography,
  Card
} from "@mui/material";
import { formatTimePeriod, getHoursAndMinutes } from "../../../utils/time-utils";
import type { KeycloakProfile } from "keycloak-js";
import { DailyEntry, Timespan } from "../../../generated/client";
import TimebankPieChart from "./charts/timebank-piechart";
import TimebankOverviewChart from "./charts/timebank-overviewchart";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import strings from "../../../localization/strings";
import TimebankMultiBarChart from "./charts/timebank-multibarchart";
import DateRangePicker from "./timebank-daterange-picker";
import { Dispatch, SetStateAction, useState } from "react";
import { theme } from "../../../theme";
import { useAtomValue } from "jotai";
import { personTotalTimeAtom, personDailyEntryAtom, dailyEntriesAtom } from "../../../atoms/person";

interface Props {
  personTotalTimeLoading: boolean;
  setPersonTotalTimeLoading: Dispatch<SetStateAction<boolean>>;
  userProfile: KeycloakProfile | undefined;
  timespanSelector: string;
  getPersonTotalTime: (e?: Timespan) => void;
  handleDailyEntryChange: (e: DateTime | null) => void;
}

/**
 * Date range picker object.
 */
export interface Range {
  start: DateTime | null;
  end: DateTime | null;
}

/**
 * Component that contains the entirety of Timebank content, such as charts
 */
const TimebankContent = (props: Props) => {
  const { timespanSelector, getPersonTotalTime, handleDailyEntryChange, personTotalTimeLoading } =
    props;

  const [selectedEntries, setSelectedEntries] = useState<DailyEntry[]>();
  const [byRange, setByRange] = useState({
    dailyEntries: false
  });
  const personTotalTime = useAtomValue(personTotalTimeAtom);
  const personDailyEntry = useAtomValue(personDailyEntryAtom);
  const dailyEntries = useAtomValue(dailyEntriesAtom);

  /**
   * Disables the days from the DatePicker which have zero logged and expected hours, commonly weekends.
   * Also prevents selecting a start date that is later than end date in the date range picker.
   * @param date DateTime object passed from the date picker
   * @param range Optional Range object to compare start and end dates
   * @returns boolean value which controls the disabled dates.
   */
  const disableNullEntries = (date: DateTime, range?: Range): boolean => {
    const nullEntries = dailyEntries.filter(
      (item) =>
        item.logged === 0 &&
        item.expected === 0 &&
        DateTime.fromJSDate(item.date).toISODate() === date.toISODate()
    );
    return nullEntries.length
      ? DateTime.fromJSDate(nullEntries[0].date).toISODate() === date.toISODate()
      : String(range?.end?.minus({ days: 1 }).toISODate()) < String(date.toISODate()) || false;
  };

  /**
   * Renders overview chart and list item elements containing total time summaries
   */
  const renderOverViewChart = () => {
    if (personTotalTimeLoading) return <CircularProgress sx={{ margin: "auto", mt: "5%" }} />;
    else if (personTotalTime)
      return (
        <>
          <TimebankOverviewChart />
          <List dense sx={{ marginLeft: "5%" }}>
            <ListItem>
              <ListItemText
                primary={strings.timebank.timeperiod}
                secondary={formatTimePeriod(personTotalTime.timePeriod?.split(","))}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{
                  color: getHoursAndMinutes(Number(personTotalTime.balance)).startsWith("-")
                    ? theme.palette.error.main
                    : theme.palette.success.main
                }}
                primary={strings.timebank.balance}
                secondary={getHoursAndMinutes(Number(personTotalTime.balance))}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={strings.timebank.logged}
                secondary={getHoursAndMinutes(Number(personTotalTime.logged))}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={strings.timebank.expected}
                secondary={getHoursAndMinutes(Number(personTotalTime.expected))}
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
    if (byRange.dailyEntries && selectedEntries) {
      return <TimebankMultiBarChart selectedEntries={selectedEntries} />;
    } else return <TimebankPieChart />;
  };

  /**
   * Renders date picker or range date picker associated with above charts.
   * @returns JSX.Element consisting of either chart component
   */
  const renderDatePickers = () => {
    if (dailyEntries && byRange.dailyEntries) {
      return (
        <DateRangePicker
          dailyEntries={dailyEntries}
          setSelectedEntries={setSelectedEntries}
          disableNullEntries={disableNullEntries}
        />
      );
    } else if (dailyEntries) {
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
      <Card sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5" sx={{ textAlign: "center" }}>
          {strings.timebank.barChartDescription}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Select
            sx={{
              width: "50%",
              marginRight: "1%",
              textAlign: "center"
            }}
            value={timespanSelector}
            onChange={(e) => getPersonTotalTime(e.target.value as Timespan)}
          >
            <MenuItem value={Timespan.WEEK}>{strings.timeExpressions.week}</MenuItem>
            <MenuItem value={Timespan.MONTH}>{strings.timeExpressions.month}</MenuItem>
            <MenuItem value={Timespan.ALL_TIME}>{strings.timeExpressions.allTime}</MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", justifyItems: "center" }}>
          {renderOverViewChart()}
        </Box>
      </Card>
      <br />
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: "1%" }}>
          {strings.timebank.pieChartDescription}
        </Typography>

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
                primary={strings.timebank.logged}
                secondary={
                  byRange.dailyEntries && selectedEntries
                    ? getHoursAndMinutes(
                        Number(selectedEntries.reduce((prev, next) => prev + next.logged, 0))
                      )
                    : getHoursAndMinutes(Number(personDailyEntry?.logged))
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.success.dark }}
                primary={strings.timebank.billableProject}
                secondary={
                  byRange.dailyEntries && selectedEntries
                    ? getHoursAndMinutes(
                        Number(
                          selectedEntries.reduce((prev, next) => prev + next.billableProjectTime, 0)
                        )
                      )
                    : getHoursAndMinutes(Number(personDailyEntry?.billableProjectTime))
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.success.light }}
                primary={strings.timebank.nonBillableProject}
                secondary={
                  byRange.dailyEntries && selectedEntries
                    ? getHoursAndMinutes(
                        Number(
                          selectedEntries.reduce(
                            (prev, next) => prev + next.nonBillableProjectTime,
                            0
                          )
                        )
                      )
                    : getHoursAndMinutes(Number(personDailyEntry?.nonBillableProjectTime))
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.warning.main }}
                primary={strings.timebank.internal}
                secondary={
                  byRange.dailyEntries && selectedEntries
                    ? getHoursAndMinutes(
                        Number(selectedEntries.reduce((prev, next) => prev + next.internalTime, 0))
                      )
                    : getHoursAndMinutes(Number(personDailyEntry?.internalTime))
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                sx={{ color: theme.palette.info.main }}
                primary={strings.timebank.expected}
                secondary={
                  byRange.dailyEntries && selectedEntries
                    ? getHoursAndMinutes(
                        Number(selectedEntries.reduce((prev, next) => prev + next.expected, 0))
                      )
                    : getHoursAndMinutes(Number(personDailyEntry?.expected))
                }
              />
            </ListItem>
          </List>
        </Box>
      </Card>
    </>
  );
};

export default TimebankContent;
