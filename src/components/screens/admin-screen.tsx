import { Grid } from "@mui/material";
import BalanceCard from "../home/balance-card";
import VacationsCard from "../home/vacations-card";
import SprintViewCard from "../home/sprint-view-card";
import UserRoleUtils from "src/utils/user-role-utils";
import QuestionnaireCard from "../home/questionnaire-card";

/**
 * Admin screen component
 */
const AdminScreen = () => {
  const developerMode = UserRoleUtils.developerMode();
  const balanceCard = developerMode ? <BalanceCard /> : null;
  const sprintViewCard = developerMode ? <SprintViewCard /> : null;
  const vacationsCard = developerMode ? <VacationsCard /> : null;
  const questionairesCard = developerMode ? <QuestionnaireCard /> : null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {balanceCard}
      </Grid>
      <Grid item xs={12}>
        {sprintViewCard}
      </Grid>
      <Grid item xs={12}>
        {vacationsCard}
      </Grid>
      <Grid item xs={12}>
        {questionairesCard}
      </Grid>
    </Grid>
  );
};

export default AdminScreen;
