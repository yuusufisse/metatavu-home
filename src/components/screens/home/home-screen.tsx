import { Grid } from "@mui/material";
import BalanceCard from "./balance-card";

/**
 * Home screen component
 */
const HomeScreen = () => {
  return (
    <Grid container>
      <Grid item xs={12} md={4}>
        <BalanceCard />
      </Grid>
      <Grid item xs={12} md={8}>
        {/* TODO: MORE CARDS */}
      </Grid>
    </Grid>
  );
};

export default HomeScreen;
