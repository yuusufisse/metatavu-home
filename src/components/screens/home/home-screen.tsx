import { Grid } from "@mui/material";
import BalanceCard from "./balance-card";
import VacationsCard from "./vacations-card";

/**
 * Home screen component
 */
const HomeScreen = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <BalanceCard />
      </Grid>
      <Grid item xs={6}>
        <VacationsCard />
      </Grid>
    </Grid>
  );
};

export default HomeScreen;
