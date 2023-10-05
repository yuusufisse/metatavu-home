import { PersonTotalTime } from "../../../generated/client";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Grid, Typography, Card, CardContent, Skeleton, Alert } from "@mui/material";
import strings from "../../../localization/strings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { errorAtom } from "../../../atoms/error";
import { useAtom } from "jotai";
import { useState } from "react";

/**
 * Component props
 */
interface Props {
  personTotalTime: PersonTotalTime | undefined;
}

/**
 * Component for displaying user's balance
 */
const BalanceCard = ({ personTotalTime }: Props) => {
  const fetchError = useAtom(errorAtom)[0];
  const [error, setError] = useState(false);

  if (fetchError !== undefined && !error) {
    setError(true);
  }

  return (
    <>
      <Card>
        <CardContent>
          <h3 style={{ marginTop: 6 }}>{strings.timebank.balance}</h3>
          <Grid container>
            {personTotalTime ? (
              <>
                <Grid item xs={1}>
                  <ScheduleIcon />
                </Grid>
                <Grid item xs={11}>
                  <Typography>
                    {getHoursAndMinutes(Number(personTotalTime?.balance))}
                  </Typography>
                </Grid>
              </>
            ) : error ? (
              <Grid item xs={12}>
                <Alert severity="error">{strings.errors.fetchFailedGeneral}</Alert>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Skeleton sx={{height:48}}/>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default BalanceCard;
