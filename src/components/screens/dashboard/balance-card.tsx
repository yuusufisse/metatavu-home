import { PersonTotalTime } from "../../../generated/client";
import { getHoursAndMinutes } from "../../../utils/time-utils";
import { Box, Grid, Typography } from "@mui/material";
import Logo from "../../../../img/Metatavu-icon.svg";
import { userProfileAtom } from "../../../atoms/auth";
import { useAtomValue } from "jotai";

interface BalanceCardProps {personTotalTime: PersonTotalTime | undefined}

const BalanceCard = (props: BalanceCardProps) => {
    const {personTotalTime} = props;
    const userProfile = useAtomValue(userProfileAtom);
    const hello = "Hi, "; //put this in the localization file, SOMEBODY, PLEASE

    return (
        <>
            <Grid xs={12} sm={8}>
                <Box
                    component="img"
                    sx={{height:48, "filter":"invert(100%)"}}
                    alt="Your logo."
                    src={Logo} 
                />
                <Typography>
                    {hello + userProfile?.firstName}
                    <br/>
                    {(personTotalTime) ?`Your balance is ${getHoursAndMinutes(Number(personTotalTime?.balance))}` :null}
                </Typography>
            </Grid>
            <Grid xs={12} sm={4}>
                
            </Grid>
            
        </>
    );

}

export default BalanceCard;