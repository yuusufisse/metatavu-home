import { useAtomValue } from "jotai";
import { personsAtom } from "../../atoms/person";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { languageAtom } from "../../atoms/language";

const TimebankScreenViewAll = () => {
  const persons = useAtomValue(personsAtom);
  const language = useAtomValue(languageAtom);

  return (
    <Grid container spacing={1} textAlign={"center"}>
      {persons.map((person, idx) => {
        return (
          <Grid item xl={4} key={`person-totaltime-card-${idx}`}>
            <Card>
              <CardContent>
                <Typography variant="body1">{`${person.firstName} ${person.lastName}`}</Typography>
                <Typography>
                  {person.startDate &&
                    DateTime.fromFormat(person.startDate, "yyyy-M-d")
                      .setLocale(language)
                      .toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TimebankScreenViewAll;
