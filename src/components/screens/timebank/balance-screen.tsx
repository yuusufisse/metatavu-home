import { useState } from "react";
import { Timespan } from "../../../generated/client";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import {
  Card,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import { userProfileAtom } from "../../../atoms/auth";
import { useAtomValue } from "jotai";
import DashboardFetch from "../dashboard/dashboard-fetch";

const BalanceScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const [timespanSelector, setTimespanSelector] = useState<string | undefined>("All");
  const { personTotalTime } = DashboardFetch();

  const handleBalanceViewChange = (e?: SelectChangeEvent | undefined) => {
    setTimespanSelector(e?.target?.value);
    switch (e?.target.value) {
      case "Week":
        return DashboardFetch(Timespan.WEEK);
      case "Month":
        return DashboardFetch(Timespan.MONTH);
      case "Year":
        return DashboardFetch(Timespan.YEAR);
      case "All":
        return DashboardFetch(Timespan.ALL_TIME);
      default:
        return DashboardFetch(Timespan.ALL_TIME);
    }
  };

  return (
    <Card
      sx={{
        width: "25%",
        textAlign: "center",
        margin: "auto",
        marginTop: "5%",
        padding: "20px",
        backgroundColor: "lightgray"
      }}
    >
      <Typography>
        Hello, {userProfile?.firstName} {userProfile?.lastName}
      </Typography>
      <br />
      <Typography sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        Your work hour statistics of today:
        {/* <List>
          <ListItem>Balance: {getHoursAndMinutes(Number(personDailyEntry?.balance))}</ListItem>
          <ListItem>Logged time: {getHoursAndMinutes(Number(personDailyEntry?.logged))}</ListItem>
          <ListItem>Expected: {getHoursAndMinutes(Number(personDailyEntry?.expected))}</ListItem>
        </List> */}
      </Typography>
      <br />
      <Select
        sx={{ width: "50%", marginBottom: "20px" }}
        value={timespanSelector}
        onChange={handleBalanceViewChange}
      >
        <MenuItem value={"Week"}>Week</MenuItem>
        <MenuItem value={"Month"}>Month</MenuItem>
        <MenuItem value={"All"}>All time</MenuItem>
      </Select>
      <Typography sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <List>
          <ListItem>
            {personTotalTime
              ? `Balance: ${getHoursAndMinutes(Number(personTotalTime?.balance))}`
              : null}
          </ListItem>
          <ListItem>
            {personTotalTime
              ? `Logged time: ${getHoursAndMinutes(Number(personTotalTime?.logged))}`
              : null}
          </ListItem>
          <ListItem>
            {personTotalTime
              ? `Expected: ${getHoursAndMinutes(Number(personTotalTime?.expected))}`
              : null}
          </ListItem>
        </List>
      </Typography>
    </Card>
  );
};

export default BalanceScreen;
