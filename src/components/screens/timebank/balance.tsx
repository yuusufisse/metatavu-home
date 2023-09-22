import { Box, List, ListItem, Select, MenuItem, Button, SelectChangeEvent } from "@mui/material";
import { formatTimePeriod, getHoursAndMinutes } from "../../../utils/time-utils";
import type { KeycloakProfile } from "keycloak-js";
import { DailyEntry, PersonTotalTime } from "../../../generated/client";
import BalancePieChart from "./balance-piechart";
import BalanceOverviewChart from "./balance-overviewchart";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";

interface Props {
  userProfile: KeycloakProfile | undefined;
  personTotalTime: PersonTotalTime;
  personDailyEntry: DailyEntry;
  dailyEntries: DailyEntry[];
  timespanSelector: string;
  handleBalanceViewChange: (e: SelectChangeEvent) => void;
  handleDailyEntryChange: (e: DateTime | null) => void;
}

const Balance = (props: Props) => {
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
  const disableNullEntries = (day : DateTime): boolean => {
    const nullEntries = dailyEntries?.filter(
      (item) =>
        item.logged === 0 &&
        item.expected === 0 &&
        DateTime.fromJSDate(item.date).day === day.day &&
        DateTime.fromJSDate(item.date).month === day.month &&
        DateTime.fromJSDate(item.date).year === day.year
    );
    return nullEntries?.length
      ? DateTime.fromJSDate(nullEntries[0].date).day === day.day &&
          DateTime.fromJSDate(nullEntries[0].date).month === day.month &&
          DateTime.fromJSDate(nullEntries[0].date).year === day.year
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
        label="Select entry date"
        disableFuture
        onChange={handleDailyEntryChange}
        value={DateTime.fromJSDate(dailyEntries[0].date)}
        minDate={DateTime.fromJSDate(dailyEntries[dailyEntries?.length - 1].date)}
        maxDate={DateTime.fromJSDate(dailyEntries[0].date)}
        shouldDisableDate={disableNullEntries}
      />
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <BalancePieChart
          personDailyEntry={personDailyEntry}
          personTotalTime={personTotalTime}
          dailyEntries={dailyEntries}
        />
        <List sx={{ marginLeft: "5%" }}>
          <ListItem sx={{ fontWeight: "bold" }}>
            Latest entry {personDailyEntry?.date.toLocaleDateString()}
          </ListItem>
          <ListItem>
            Billable: {getHoursAndMinutes(Number(personDailyEntry?.billableProjectTime))}
          </ListItem>
          <ListItem>
            Non-billable: {getHoursAndMinutes(Number(personDailyEntry?.nonBillableProjectTime))}
          </ListItem>
          <ListItem>
            Internal: {getHoursAndMinutes(Number(personDailyEntry?.internalTime))}
          </ListItem>
          <ListItem>Logged: {getHoursAndMinutes(Number(personDailyEntry?.logged))}</ListItem>
          <ListItem>Expected: {getHoursAndMinutes(Number(personDailyEntry?.expected))}</ListItem>
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
        <MenuItem value={"Week"}>Week</MenuItem>
        <MenuItem value={"Month"}>Month</MenuItem>
        <MenuItem value={"All"}>All time</MenuItem>
      </Select>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <BalanceOverviewChart personTotalTime={personTotalTime} />
        <List sx={{ marginLeft: "5%" }}>
          <ListItem sx={{ fontWeight: "bold" }}>
            Time period: {formatTimePeriod(personTotalTime?.timePeriod?.split(","))}
          </ListItem>
          <ListItem>Balance: {getHoursAndMinutes(Number(personTotalTime?.balance))}</ListItem>
          <ListItem>Logged time: {getHoursAndMinutes(Number(personTotalTime?.logged))}</ListItem>
          <ListItem>Expected: {getHoursAndMinutes(Number(personTotalTime?.expected))}</ListItem>
        </List>
      </Box>
      <Button onClick={() => console.log(DateTime.local(), new Date(2023, 9, 19).getTime())}>
        DATE
      </Button>
    </>
  );
};

export default Balance;
