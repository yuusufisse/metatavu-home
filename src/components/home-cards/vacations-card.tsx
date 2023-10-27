import { Grid, Card, CardContent } from "@mui/material";
import strings from "../../localization/strings";
import { List } from "@mui/icons-material";
import { Link } from "react-router-dom";

/**
 * Vacations card component
 */
const VacationsCard = () => (
  <Card>
    <CardContent>
      <h3 style={{ marginTop: 6 }}>{strings.tableToolbar.myRequests}</h3>
      <Grid container>
        <Grid item xs={1}>
          <List />
        </Grid>
        <Grid item xs={11}>
          <Link to={"/vacations"}>{strings.vacationsCard.vacations}</Link>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default VacationsCard;
