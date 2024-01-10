import { Typography, Grid } from "@mui/material";
import { theme } from "../../theme";
import { Person } from "../../generated/client";
import strings from "../../localization/strings";

/**
 * Display persons vacation days
 *
 * @param Person timebank person
 */
export const renderVacationDaysText = (person: Person) => {
  const spentVacationsColor =
    person && person.spentVacations > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  const unspentVacationsColor =
    person && person.unspentVacations > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  if (person) {
    return (
      <Grid>
        <Grid container>
          <Grid item style={{ flex: 0.55 }}>
            {strings.vacationsCard.spentVacations}
          </Grid>
          <Typography color={spentVacationsColor}>
            {person.spentVacations}
          </Typography>
        </Grid>
        <Grid container>
          <Grid item style={{ flex: 0.55 }}>
            {strings.vacationsCard.unspentVacations}
          </Grid>
          <Typography color={unspentVacationsColor}>
            {person.unspentVacations}
          </Typography>
        </Grid>
      </Grid>
    );
  } else {
    return <Typography>{strings.error.personsFetch}</Typography>;
  }
};
