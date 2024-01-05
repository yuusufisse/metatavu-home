import { Typography, Box } from "@mui/material";
import { theme } from "../../theme";
import { Person } from "../../generated/client";
import strings from "../../localization/strings";

/**
 * Display persons vacation days
 * @param Person timebank person
 */
export const renderVacationDays = (person: Person) => {
  const loading = true;

  const spentVacationsColor =
    person && person.spentVacations > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  const unspentVacationsColor =
    person && person.unspentVacations > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  if (!loading) {
    return <Typography>{strings.error.personsFetch}</Typography>;
  } else if (person) {
    return (
      <>
        <Box>
          {strings.vacationsCard.spentVacations}
          <span style={{ color: spentVacationsColor }}>{person.spentVacations}</span>
        </Box>
        <Box>
          {strings.vacationsCard.unspentVacations}
          <span style={{ color: unspentVacationsColor }}>{person.unspentVacations}</span>
        </Box>
      </>
    );
  }
};
