import { PersonTotalTime } from "../../generated/client";
import { getHoursAndMinutes } from "../../utils/time-utils";
import { Box, Grid, Typography } from "@mui/material";
import Logo from "../../../resources/img/Metatavu-icon.svg";
import { userProfileAtom } from "../../atoms/auth";
import { useAtomValue } from "jotai";
import strings from "../../localization/strings";

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
      <Grid>
        <Box
          component="img"
          sx={{ height: 48, filter: "invert(100%)" }}
          alt="Metatavu logo"
          src={Logo}
        />
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
    </>
  );
};

export default BalanceCard;
