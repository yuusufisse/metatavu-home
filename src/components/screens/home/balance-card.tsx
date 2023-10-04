import { PersonTotalTime } from "../../../generated/client";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Grid, Typography, Card, CardContent, Skeleton } from "@mui/material";
import strings from "../../../localization/strings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { errorAtom } from "../../../atoms/error";
import { useAtom } from "jotai";

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
  const fetchError = useAtom(errorAtom);
  console.log(fetchError);
  return (
    <>
      <Card>
        <CardContent>
          <h3 style={{ marginTop: 6 }}>{strings.timebank.balance}</h3>
          <Grid container>
            <Grid item xs={1}>
              <ScheduleIcon />
            </Grid>
            <Grid item xs={11}>
              {personTotalTime ? (
                <Typography>` ${getHoursAndMinutes(Number(personTotalTime?.balance))}`</Typography>
              ) : { fetchError } ? (
                strings.errors.fetchFailedGeneral
              ) : (
                <Skeleton />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default BalanceCard;
