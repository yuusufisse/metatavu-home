import { useAtomValue } from "jotai";
import { personsAtom } from "../../atoms/person";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { DateTime } from "luxon";
import { languageAtom } from "../../atoms/language";

const TimebankViewAllScreen = () => {
  const persons = useAtomValue(personsAtom);
  const language = useAtomValue(languageAtom);

  return (
    <Grid container spacing={1} textAlign={"center"}>
      {persons.map((person) => {
        return (
          <Grid item xl={4}>
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

export default TimebankViewAllScreen;
