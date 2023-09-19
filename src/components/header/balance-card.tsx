import { PersonTotalTime } from "../../generated/client";
import { getHoursAndMinutes } from "../../utils/time-utils";
import { Box, Grid, Typography } from "@mui/material";
import Logo from "../../../resources/img/Metatavu-icon.svg";
import { userProfileAtom } from "../../atoms/auth";
import { useAtomValue } from "jotai";

/**
 * Component props
 */
interface Props {
  personTotalTime: PersonTotalTime | undefined;
}

/**
 * Component for displaying user's balance
 */
const BalanceCard = ({personTotalTime}: Props) => {
  const userProfile = useAtomValue(userProfileAtom);
  const hello = "Hi, "; //put this in the localization file, SOMEBODY, PLEASE
  return (
    <>
      <Grid xs={12} sm={8}>
        <Box
          component="img"
          sx={{ height: 48, filter: "invert(100%)" }}
          alt="Metatavu logo"
          src={Logo}
        />
        <Typography>
          {hello + userProfile?.firstName}
          <br />
          {personTotalTime
            ? `Your balance is ${getHoursAndMinutes(Number(personTotalTime?.balance))}`
            : null}
        </Typography>
      </Grid>
    </>
  );
};

export default BalanceCard;
