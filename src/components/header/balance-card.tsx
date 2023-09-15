import { PersonTotalTime } from "../../generated/client";
import { getHoursAndMinutes } from "../../utils/time-utils";
import { Box, Grid, Typography } from "@mui/material";
import Logo from "../../../img/Metatavu-icon.svg";
import { userProfileAtom } from "../../atoms/auth";
import { useAtomValue } from "jotai";

/**
 * Component props
 * @date 9/15/2023 - 11:15:09 AM
 *
 * @interface BalanceCardProps
 * @typedef {BalanceCardProps}
 */
interface BalanceCardProps {
  personTotalTime: PersonTotalTime | undefined;
}

/**
 * Component for displaying user's balance
 * @date 9/15/2023 - 9:34:16 AM
 *
 * @param {BalanceCardProps} props
 * @returns {*}
 */
const BalanceCard = (props: BalanceCardProps) => {
  const { personTotalTime } = props;
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
