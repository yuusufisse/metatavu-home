import { Box, List, ListItem, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { formatTimePeriod, getHoursAndMinutes } from "../../../utils/time-utils";
import type { KeycloakProfile } from "keycloak-js";
import { DailyEntry, PersonTotalTime } from "../../../generated/client";
import TimebankPieChart from "./timebank-piechart";
import TimebankOverviewChart from "./timebank-overviewchart";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import strings from "../../../localization/strings";

interface Props {
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
    dailyEntries
  } = props;

  /**
   * Disables the days from the DatePicker which have zero logged and expected hours.
   * @param day
   * @returns boolean value which controls the disabled dates
   */
  const disableNullEntries = (date: DateTime): boolean => {
    const nullEntries = dailyEntries?.filter(
      (item) =>
        item.logged === 0 &&
        item.expected === 0 &&
        DateTime.fromJSDate(item.date).day === date.day &&
        DateTime.fromJSDate(item.date).month === date.month &&
        DateTime.fromJSDate(item.date).year === date.year
    );
    return nullEntries?.length
      ? DateTime.fromJSDate(nullEntries[0].date).day === date.day &&
          DateTime.fromJSDate(nullEntries[0].date).month === date.month &&
          DateTime.fromJSDate(nullEntries[0].date).year === date.year
      : false;
  };

  return (
    <>
      <DatePicker
        sx={{
          width: "50%",
          marginLeft: "25%",
          marginRight: "25%",
          marginBottom: "1%"
        }}
        label={strings.timebank.selectEntry}
        disableFuture
        onChange={handleDailyEntryChange}
        value={DateTime.fromJSDate(dailyEntries[0].date)}
        minDate={DateTime.fromJSDate(dailyEntries[dailyEntries.length - 1].date)}
        maxDate={DateTime.fromJSDate(dailyEntries[0].date)}
        shouldDisableDate={disableNullEntries}
      />
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <TimebankPieChart
          personDailyEntry={personDailyEntry}
          personTotalTime={personTotalTime}
          dailyEntries={dailyEntries}
        />
        <List sx={{ marginLeft: "5%" }}>
          <ListItem sx={{ fontWeight: "bold" }}>
            {strings.timebank.latestEntry}{" "}
            {personDailyEntry.date.toLocaleDateString(strings.localization.time)}
          </ListItem>
          <ListItem>
            {strings.timebank.billableProject}:{" "}
            {getHoursAndMinutes(Number(personDailyEntry.billableProjectTime))}
          </ListItem>
          <ListItem>
            {strings.timebank.nonBillableProject}:{" "}
            {getHoursAndMinutes(Number(personDailyEntry.nonBillableProjectTime))}
          </ListItem>
          <ListItem>
            {strings.timebank.internal}: {getHoursAndMinutes(Number(personDailyEntry.internalTime))}
          </ListItem>
          <ListItem>
            {strings.timebank.logged}: {getHoursAndMinutes(Number(personDailyEntry.logged))}
          </ListItem>
          <ListItem>
            {strings.timebank.expected}: {getHoursAndMinutes(Number(personDailyEntry.expected))}
          </ListItem>
        </List>
      </Box>
      <br />
      <Select
        sx={{
          width: "50%",
          marginLeft: "25%",
          marginRight: "25%",
          marginBottom: "1%",
          textAlign: "center"
        }}
        value={timespanSelector}
        onChange={handleBalanceViewChange}
      >
        <MenuItem value={"Week"}>{strings.timeExpressions.week}</MenuItem>
        <MenuItem value={"Month"}>{strings.timeExpressions.month}</MenuItem>
        <MenuItem value={"All"}>{strings.timeExpressions.allTime}</MenuItem>
      </Select>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <TimebankOverviewChart personTotalTime={personTotalTime} />
        <List sx={{ marginLeft: "5%" }}>
          <ListItem sx={{ fontWeight: "bold" }}>
            {strings.timebank.timeperiod}:{" "}
            {formatTimePeriod(personTotalTime?.timePeriod?.split(","))}
          </ListItem>
          <ListItem>
            {strings.timebank.balance} {getHoursAndMinutes(Number(personTotalTime?.balance))}
          </ListItem>
          <ListItem>
            {strings.timebank.logged}: {getHoursAndMinutes(Number(personTotalTime?.logged))}
          </ListItem>
          <ListItem>
            {strings.timebank.expected}: {getHoursAndMinutes(Number(personTotalTime?.expected))}
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default TimebankContent;
