import { Typography, Card, CardContent, Grid } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Component for displaying question card
 */
const QuestionCard = () => {
    return (
        <Link to="/questionnaire" style={{ textDecoration: "none" }}>
        <Card
            sx={{
            "&:hover": {
                background: "#efefef"
            }
            }}
        >
            <CardContent>
            <Typography variant="h6" fontWeight={"bold"} style={{ marginTop: 6, marginBottom: 3 }}>
                Quiz
            </Typography>
            <Grid container>
                <Grid item xs={12}>
                    Progress bar
                </Grid>
            </Grid>
            </CardContent>
        </Card>
        </Link>
    );
};

export default QuestionCard;