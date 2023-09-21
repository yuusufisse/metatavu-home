import { Box, List, ListItem, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { formatTimePeriod, getHoursAndMinutes } from "../../../utils/time-utils";
import type { KeycloakProfile } from "keycloak-js";
import { DailyEntry, PersonTotalTime } from "../../../generated/client";
import BalancePieChart from "./balance-piechart";
import BalanceOverviewChart from "./balance-overviewchart";

interface Props {
  userProfile: KeycloakProfile | undefined;
  personTotalTime: PersonTotalTime | undefined;
  personDailyEntry: DailyEntry | undefined;
  dailyEntries: DailyEntry[] | undefined;
  timespanSelector: string;
  handleBalanceViewChange: (e: SelectChangeEvent) => void;
  handleDailyEntryChange: (e: SelectChangeEvent) => void;
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

  return (
    <>
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
        {dailyEntries?.map((entry: DailyEntry) => {
          // rome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          return <MenuItem>{entry.date.toLocaleDateString()}</MenuItem>;
        })}
      </Select>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <BalancePieChart personTotalTime={personTotalTime} dailyEntries={dailyEntries} />
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
      {/* <Button onClick={() => console.log(personTotalTime)}>TEST</Button> */}
    </>
  );
};

export default Balance;
