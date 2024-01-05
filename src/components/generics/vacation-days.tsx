import { Typography, Box } from "@mui/material";
import { theme } from "../../theme";
import { Person } from "../../generated/client";
import strings from "../../localization/strings";
import { personsAtom } from "../../atoms/person";
import { useAtom } from "jotai";

/**
 * Display persons vacation days
 * @param Person timebank person
 */
export const renderVacationDays = (person: Person) => {
  const persons = useAtom(personsAtom);

  const spentVacationsColor =
    person.spentVacations > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  const unspentVacationsColor =
    person.unspentVacations > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  if (persons.length) {
    return <Typography>{strings.error.personsFetch}</Typography>;
  } else if (person) {
    return (
      <>
        <Box>
          {strings.vacationsCard.spentVacations}
          <span style={{ color: spentVacationsColor }}>{person.spentVacations}</span>
        </Box>
        <Box sx={{ mb: 2 }}>
          {strings.vacationsCard.unspentVacations}
          <span style={{ color: unspentVacationsColor }}>{person.unspentVacations}</span>
        </Box>
      </>
    );
  }
};
