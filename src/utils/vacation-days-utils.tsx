import { Grid, Typography } from "@mui/material";
import { theme } from "../theme";
import strings from "../localization/strings";
import type { User } from "src/generated/homeLambdasClient";

/**
 * Display persons vacation days
 *
 * @param User KeyCloak user
 */
export const renderVacationDaysTextForCard = (user: User) => {
  // const spentVacationsColor =
  //   user && user.spentVacations > 0 ? theme.palette.success.main : theme.palette.error.main;
  //
  // const unspentVacationsColor =
  //   user && user.unspentVacations > 0 ? theme.palette.success.main : theme.palette.error.main;

  //FIXME: Deal with the spent and unspent vacations
  const spentVacationsColor = theme.palette.error.main;
  const unspentVacationsColor = theme.palette.error.main;

  if (user) {
    return (
      <Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            {strings.vacationsCard.spentVacations}
          </Grid>
          <Grid item xs={6}>
            <Typography color={spentVacationsColor}>
              {/*{user.spentVacations}*/}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            {strings.vacationsCard.unspentVacations}
          </Grid>
          <Grid item xs={6}>
            <Typography color={unspentVacationsColor}>
              {/*{user.unspentVacations}*/}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
    return <Typography>{strings.error.personsFetch}</Typography>;
};

/**
 * Display persons vacation days
 *
 * @param Person timebank user
 */
export const renderVacationDaysTextForScreen = (user: User) => {
  // const spentVacationsColor =
  //   user && user.spentVacations > 0 ? theme.palette.success.main : theme.palette.error.main;
  //
  // const unspentVacationsColor =
  //   user && user.unspentVacations > 0 ? theme.palette.success.main : theme.palette.error.main;

  //FIXME: Deal with the spent and unspent vacations
  const spentVacationsColor = theme.palette.error.main;
  const unspentVacationsColor = theme.palette.error.main;

  if (user) {
    return (
      <Grid container justifyContent="space-around">
        <Grid item style={{ display: "flex", alignItems: "center" }}>
          {strings.vacationsCard.spentVacations}
          <Typography color={spentVacationsColor} style={{ marginLeft: "8px" }}>
            {/*{user.spentVacations}*/}
          </Typography>
        </Grid>
        <Grid item style={{ display: "flex", alignItems: "center" }}>
          {strings.vacationsCard.unspentVacations}
          <Typography color={unspentVacationsColor} style={{ marginLeft: "8px" }}>
            {/*{user.unspentVacations}*/}
          </Typography>
        </Grid>
      </Grid>
    );
  }
    return <Typography>{strings.error.personsFetch}</Typography>;
};
