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
          <h4>{strings.timebank.balance}</h4>

        <Grid>
          <Typography>
            {`${strings.header.hello}, ${userProfile?.firstName}!`}
            <br />
            {strings.timebank.yourBalanceIs}
            {personTotalTime
              ? `${getHoursAndMinutes(
                  Number(personTotalTime?.balance)
                )}`
              : "..."}
          </Typography>
        </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default BalanceCard;
