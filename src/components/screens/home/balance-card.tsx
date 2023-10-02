import { PersonTotalTime } from "../../../generated/client";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Grid, Typography, Button, Card, CardActions, CardContent } from "@mui/material";
import { userProfileAtom } from "../../../atoms/auth";
import { useAtomValue } from "jotai";
import strings from "../../../localization/strings";

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
  const userProfile = useAtomValue(userProfileAtom);
  return (
    <>
      <Card>
        <CardContent>
          <h1>Home</h1>

        <Grid>
          <Typography>
            {`${strings.header.hello}, ${userProfile?.firstName}!`}
            <br />
            {personTotalTime
              ? `${strings.timebank.yourBalanceIs} ${getHoursAndMinutes(
                  Number(personTotalTime?.balance)
                )}`
              : null}
          </Typography>
        </Grid>
        </CardContent>
        <CardActions>
          <Button>BTN</Button>
        </CardActions>
      </Card>
    </>
  );
};

export default BalanceCard;
