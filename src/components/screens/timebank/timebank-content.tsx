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
  Typography
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
   * Disables the days from the DatePicker which have zero logged and expected hours.
   * @param date
   * @returns boolean value which controls the disabled dates
   */
  const disableNullEntries = (date: DateTime): boolean => {
    const nullEntries = dailyEntries?.filter(
      (item) =>
        item.logged === 0 &&
        item.expected === 0 &&
        DateTime.fromJSDate(item.date).toISODate() === date.toISODate()
    );
    return nullEntries?.length
      ? DateTime.fromJSDate(nullEntries[0].date).toISODate() === date.toISODate()
      : false;
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
                primary={strings.timebank.timeperiod}
                secondary={formatTimePeriod(personTotalTime?.timePeriod?.split(","))}
              />
            </ListItem>
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
          onChange={handleBalanceViewChange}
        >
          <MenuItem value={"Week"}>{strings.timeExpressions.week}</MenuItem>
          <MenuItem value={"Month"}>{strings.timeExpressions.month}</MenuItem>
          <MenuItem value={"All"}>{strings.timeExpressions.allTime}</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", justifyItems: "center" }}>
        {renderOverViewChart()}
      </Box>

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
              secondary={getHoursAndMinutes(Number(personDailyEntry.logged))}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              sx={{ color: theme.palette.success.dark }}
              primary={strings.timebank.billableProject}
              secondary={getHoursAndMinutes(Number(personDailyEntry.billableProjectTime))}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              sx={{ color: theme.palette.success.light }}
              primary={strings.timebank.nonBillableProject}
              secondary={getHoursAndMinutes(Number(personDailyEntry.nonBillableProjectTime))}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              sx={{ color: theme.palette.warning.main }}
              primary={strings.timebank.internal}
              secondary={getHoursAndMinutes(Number(personDailyEntry.internalTime))}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              sx={{ color: theme.palette.info.main }}
              primary={strings.timebank.expected}
              secondary={getHoursAndMinutes(Number(personDailyEntry.expected))}
            />
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default TimebankContent;
