import { authAtom } from "../../../atoms/auth";
import { Button, Card, CircularProgress, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import { useAtom, useAtomValue } from "jotai";
import DashboardFetch from "./dashboard-fetch";
import { personTotalTimeAtom } from "../../../atoms/person";
import { useEffect } from "react";

/**
 * Dashboard screen component
 */
function DashboardScreen() {
  const auth = useAtomValue(authAtom);
  const [personTotalTime, setPersonTotalTime] = useAtom(personTotalTimeAtom);

  const initialize = async () : Promise<void> => {
    const { personTotalTime } = await DashboardFetch();
    const result = personTotalTime;
    setPersonTotalTime(result)
  }

  useEffect(() => {
    initialize()
  }, [])
  

  if (!personTotalTime) return <CircularProgress sx={{ marginLeft: "50%", marginTop: "5%" }} />;
  else
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
        <Typography sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {personTotalTime
            ? `Balance: ${getHoursAndMinutes(Number(personTotalTime?.balance))}`
            : null}
        </Typography>
        <Button color="info" variant="contained" onClick={() => auth?.logout()}>
          Log out
        </Button>
        <br />
        <Button color="info" variant="contained" onClick={() => console.log(DateTime.now())}>
          TEST
        </Button>
      </Card>
    );
}

export default DashboardScreen;
