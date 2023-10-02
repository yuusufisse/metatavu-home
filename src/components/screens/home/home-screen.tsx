
import { Grid } from "@mui/material";
import BalanceCard from "./balance-card";

/**
 * Home screen component
 */
const HomeScreen = () => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <BalanceCard />
            </Grid>
        </Grid>
    );
}

export default HomeScreen;