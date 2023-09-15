import { Typography, List, ListItem, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { formatTimePeriod, getHoursAndMinutes } from "../../../utils/time-utils";
import type { KeycloakProfile } from "keycloak-js";
import { DailyEntry, PersonTotalTime } from "../../../generated/client";

interface Props {
  userProfile: KeycloakProfile | undefined;
  personTotalTime: PersonTotalTime | undefined;
  personDailyEntry: DailyEntry | undefined;
  timespanSelector: string;
  handleBalanceViewChange: (e: SelectChangeEvent) => void;
}

const Balance = (props: Props) => {
  const {
    userProfile,
    personTotalTime,
    personDailyEntry,
    timespanSelector,
    handleBalanceViewChange
  } = props;
  return (
    <>
      <Link to="/">HOME</Link>
      <Typography>
        Hello, {userProfile?.firstName} {userProfile?.lastName}
      </Typography>
      <br />
      <Typography sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        Latest entry {personDailyEntry?.date.toLocaleDateString()}
        <List>
          <ListItem>Balance: {getHoursAndMinutes(Number(personDailyEntry?.balance))}</ListItem>
          <ListItem>Logged time: {getHoursAndMinutes(Number(personDailyEntry?.logged))}</ListItem>
          <ListItem>Expected: {getHoursAndMinutes(Number(personDailyEntry?.expected))}</ListItem>
        </List>
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
        Time period: {formatTimePeriod(personTotalTime?.timePeriod?.split(","))}
        <List>
          <ListItem>Balance: {getHoursAndMinutes(Number(personTotalTime?.balance))}</ListItem>
          <ListItem>Logged time: {getHoursAndMinutes(Number(personTotalTime?.logged))}</ListItem>
          <ListItem>Expected: {getHoursAndMinutes(Number(personTotalTime?.expected))}</ListItem>
        </List>
      </Typography>
    </>
  );
};

export default Balance;
