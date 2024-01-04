import { Typography, Box } from "@mui/material";
import { theme } from "../theme";
import { Person } from "../generated/client";
import strings from "../localization/strings";
import { useState } from "react";
import { personsAtom } from "../atoms/person";
import { useAtom } from "jotai";

const loading = useState(false);
const persons = useAtom(personsAtom);

/**
 * Display persons vacation days
 * @param Person timebank person
 */
export const renderVacationDays = (person: Person | undefined) => {
  const spentVacationsColor =
    person && person.spentVacations > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  const unspentVacationsColor =
    person && person.unspentVacations > 0
      ? theme.palette.success.main
      : theme.palette.error.main;

  if (!person && !loading && persons.length) {
    return <Typography>{strings.error.fetchFailedNoEntriesGeneral}</Typography>;
  } else if (person) {
    return (
      <>
        <Box sx={{ width: "40%" }}>
          <Typography>
            {strings.vacationsCard.spentVacations}
            <span style={{ color: spentVacationsColor }}>
              {person.spentVacations}
            </span>
          </Typography>
        </Box>
        <Box>
          <Typography>
            {strings.vacationsCard.unspentVacations}
            <span style={{ color: unspentVacationsColor }}>
              {person.unspentVacations}
            </span>
          </Typography>
        </Box>
      </>
    );
  }
};
