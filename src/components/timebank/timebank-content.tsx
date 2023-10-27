import {
  Box,
  List,
  ListItem,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  ListItemText,
  Typography,
  Card,
  CircularProgress
} from "@mui/material";
import { formatTimePeriod, getHoursAndMinutes } from "../../utils/time-utils";
import { DailyEntry, PersonTotalTime, Timespan } from "../../generated/client";
import TimebankPieChart from "../charts/timebank-piechart";
import TimebankOverviewChart from "../charts/timebank-overviewchart";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import strings from "../../localization/strings";
import TimebankMultiBarChart from "../charts/timebank-multibarchart";
import DateRangePicker from "./timebank-daterange-picker";
import { useState } from "react";
import { theme } from "../../theme";
import { useAtom, useAtomValue } from "jotai";
import { personTotalTimeAtom, personDailyEntryAtom, dailyEntriesAtom, timespanAtom, totalTimeAtom } from "../../atoms/person";
import OverviewRangePicker from "./timebank-overview-picker";
import TimebankOverviewRangeChart from "../charts/timebank-overviewrangechart";

/**
 * Component properties
 */
interface Props {
  handleDailyEntryChange: (selectedDate: DateTime) => void;
  loading: boolean;
}

/**
 * Component that contains the entirety of Timebank content, such as charts
 *
 * @param props Component properties
 */
const TimebankContent = (props: Props) => {
  const { handleDailyEntryChange, loading } = props;

  const [selectedEntries, setSelectedEntries] = useState<DailyEntry[]>([]);
  const [selectedTotalEntries, setSelectedTotalEntries] = useState<PersonTotalTime[]>([]);
  const [byRange, setByRange] = useState({
    overview: false,
    dailyEntries: false
  });
  const personTotalTime = useAtomValue(personTotalTimeAtom);
  const [timespan, setTimespan] = useAtom(timespanAtom);
  const personDailyEntry = useAtomValue(personDailyEntryAtom);
  const dailyEntries = useAtomValue(dailyEntriesAtom);
  const totalTime = useAtomValue(totalTimeAtom);
  const todayOrEarlier = DateTime.fromJSDate(
    dailyEntries.filter((item) => item.date <= new Date() && item.logged)[0].date
  );

  /**
   * Allows only logged dates or with expected hours to be selected in the date time picker.
   *
   * @param date DateTime object passed from the date picker
   */
  const disableNullEntries = (date: DateTime) => {
    const loggedDates = dailyEntries.find(
      (item) =>
        item.logged &&
        item.expected &&
        DateTime.fromJSDate(item.date).toISODate() === date.toISODate()
    );

    return loggedDates
      ? !(DateTime.fromJSDate(loggedDates.date).toISODate() === date.toISODate())
      : true;
  };

  /**
   * Renders overview chart and list item elements containing total time summaries
   */
  const renderOverviewOrRangeChart = () => {
    if (loading) {
      return <CircularProgress sx={{ margin: "auto", mt: "5%", mb: "5%" }} />;
    }
    if (!personTotalTime) return null;

    return (
      <>
        {byRange.overview ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <OverviewRangePicker totalTime={totalTime} selectedTotalEntries={selectedTotalEntries} setSelectedTotalEntries={setSelectedTotalEntries} today={todayOrEarlier}/>
            <TimebankOverviewRangeChart selectedTotalEntries={selectedTotalEntries} />
          </Box>

        ) : (
          <TimebankOverviewChart />
        )}

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
                color: getHoursAndMinutes(personTotalTime.balance).startsWith("-")
                  ? theme.palette.error.main
                  : theme.palette.success.main
              }}
              primary={strings.timebank.balance}
              secondary={getHoursAndMinutes(personTotalTime.balance)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={strings.timebank.logged}
              secondary={getHoursAndMinutes(personTotalTime.logged)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={strings.timebank.expected}
              secondary={getHoursAndMinutes(personTotalTime.expected)}
            />
          </ListItem>
        </List>
      </>
    );
  };

  /**
   * Renders a daily entry pie chart or a bar chart of daily entries from a selected range.
   *
   * @returns JSX.Element consisting of either chart component
   */
  const renderDailyEntryOrRangeChart = () => {
    if (byRange.dailyEntries && selectedEntries) {
      return <TimebankMultiBarChart selectedEntries={selectedEntries} />;
    }

    return <TimebankPieChart />;
  };

  /**
   * Renders date picker or range date picker associated with above charts.
   *
   * @returns JSX.Element consisting of either date picker component.
   */
  const renderDatePickers = () => {
    if (dailyEntries && !byRange.dailyEntries) {
      return (
        <DatePicker
          sx={{
            width: "40%",
            marginRight: "1%"
          }}
          label={strings.timebank.selectEntry}
          onChange={(value) => (value ? handleDailyEntryChange(value) : null)}
          value={todayOrEarlier}
          minDate={DateTime.fromJSDate(dailyEntries[dailyEntries.length - 1].date)}
          maxDate={DateTime.fromJSDate(dailyEntries[0].date)}
          shouldDisableDate={disableNullEntries}
        />
      );
    }

    return (
      <DateRangePicker
        dailyEntries={dailyEntries}
        setSelectedEntries={setSelectedEntries}
        today={todayOrEarlier}
      />
    );
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
            value={timespan}
            onChange={(e) => {
              setTimespan(e.target.value as Timespan);
            }}
          >
            <MenuItem value={Timespan.WEEK}>{strings.timeExpressions.week}</MenuItem>
            <MenuItem value={Timespan.MONTH}>{strings.timeExpressions.month}</MenuItem>
            <MenuItem value={Timespan.ALL_TIME}>{strings.timeExpressions.allTime}</MenuItem>
          </Select>
          <FormControlLabel
            sx={{ display: "inline" }}
            label={strings.timebank.byrange}
            control={
              <Checkbox
                checked={byRange.overview}
                onClick={() =>
                  setByRange({ ...byRange, overview: byRange.overview ? false : true })
                }
              />
            }
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", justifyItems: "center" }}>
          {renderOverviewOrRangeChart()}
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
            label={strings.timebank.byrange}
            control={
              <Checkbox
                checked={byRange.dailyEntries}
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
                          selectedEntries.reduce((prev, next) => prev + next.nonBillableProjectTime, 0)
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
