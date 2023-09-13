import { useEffect, useState } from "react";
import { PersonTotalTime, Timespan } from "../../../generated/client";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import {
  Card,
  CircularProgress,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import { userProfileAtom } from "../../../atoms/auth";
import { useAtomValue, useSetAtom } from "jotai";
import { errorAtom } from "../../../atoms/error";
import { personAtom } from "../../../atoms/person";
import { useApi } from "../../../hooks/use-api";
import { Link } from "react-router-dom";

const BalanceScreen = () => {
  const userProfile = useAtomValue(userProfileAtom);
  const [timespanSelector, setTimespanSelector] = useState<string | undefined>("All");
  const setError = useSetAtom(errorAtom);
  const { personsApi } = useApi();
  const person = useAtomValue(personAtom);
  const [personTotalTime, setPersonTotalTime] = useState<PersonTotalTime>();

  /**
   * Initialize logged in person's time data.
   */
  const getPersonData = async (timespan?: Timespan): Promise<void> => {
    if (person) {
      try {
        const fetchedPerson = await personsApi.listPersonTotalTime({
          personId: person?.id,
          timespan: timespan
        });
        setPersonTotalTime(fetchedPerson[0]);
      } catch (error) {
        setError(`${"Person fetch has failed."}, ${error}`);
      }
    } else {
      setError("Your account does not have any time bank entries.");
    }
  };

  const handleBalanceViewChange = (e?: SelectChangeEvent | undefined) => {
    setTimespanSelector(e?.target?.value);
    switch (e?.target.value) {
      case "Week":
        return getPersonData(Timespan.WEEK);
      case "Month":
        return getPersonData(Timespan.MONTH);
      case "Year":
        return getPersonData(Timespan.YEAR);
      case "All":
        return getPersonData(Timespan.ALL_TIME);
      default:
        return getPersonData(Timespan.ALL_TIME);
    }
  };

  useEffect(() => {
    if (person) getPersonData();
  }, []);

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
      <Link to="/">HOME</Link>
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
            {personTotalTime ? (
              `Balance: ${getHoursAndMinutes(Number(personTotalTime?.balance))}`
            ) : (
              <CircularProgress />
            )}
          </ListItem>
          <ListItem>
            {personTotalTime ? (
              `Logged time: ${getHoursAndMinutes(Number(personTotalTime?.logged))}`
            ) : (
              <CircularProgress />
            )}
          </ListItem>
          <ListItem>
            {personTotalTime ? (
              `Expected: ${getHoursAndMinutes(Number(personTotalTime?.expected))}`
            ) : (
              <CircularProgress />
            )}
          </ListItem>
        </List>
      </Typography>
    </Card>
  );
};

export default BalanceScreen;
