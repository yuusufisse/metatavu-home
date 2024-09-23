import { Card, Grid, Box, CardContent, CardActions } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserRoleUtils from "src/utils/user-role-utils";

/**
 * Some mock Data.
 * TODO: This will be replaced with the actual data from the backend.
 */

const mockQuestionnaires = [
  {
    id: 1,
    title: "Questionnaire 1",
    description: "Description for Questionnaire 1",
    status: <CheckCircleIcon sx={{ color: "green" }} />,
  },
  {
    id: 2,
    title: "Questionnaire 2",
    description: "Description for Questionnaire 2",
    status: <CloseIcon sx={{ color: "red" }} />,
  },
  {
    id: 3,
    title: "Questionnaire 3",
    description: "Description for Questionnaire 3",
    status: <CloseIcon sx={{ color: "red" }} />,
  },
  {
    id: 4,
    title: "Questionnaire 4",
    description: "Description for Questionnaire 4",
    status: <CloseIcon sx={{ color: "red" }} />,
  },
];

/**
 * Questionnaire screen component.
 */

const QuestionnaireScreen = () => {
  /**
   * Navigations for buttons for new questionnaire window.
   */
  const navigate = useNavigate();

  const handleClickOpen = () => {
    navigate("/newQuestionnaire");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const adminMode = UserRoleUtils.adminMode();

  return (
    <Card
      sx={{
        p: 3,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100",
      }}
    >
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            mb: 2,
          }}
        >
          <Grid item xs={12} sm={6} sx={{ alignItems: "center" }}>
            <Typography variant="h4" justifyContent={"center"}>
              Current Questionnaires
            </Typography>
          </Grid>

          <Grid
            item
            xs={6}
            sm={3}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {adminMode ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
                size="large"
              >
                Build New Questionnaire
              </Button>
            ) : null}
          </Grid>

          <Grid
            item
            xs={6}
            sm={3}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGoHome}
              size="large"
            >
              Go back to Homepage
            </Button>
          </Grid>
        </Grid>
        {mockQuestionnaires.map((questionnaire) => (
          <Grid item xs={12} key={questionnaire.id} sx={{ mt: 2 }}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6">{questionnaire.title}</Typography>

                <Typography variant="body2">
                  {questionnaire.description}
                </Typography>

                <Box display="flex" alignItems="center">
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Status:
                  </Typography>
                  {questionnaire.status}
                </Box>
              </CardContent>

              {adminMode ? (
                <CardActions>
                  <Button size="large" variant="outlined" color="primary">
                    <EditIcon sx={{ color: "green", mr: 2 }} />
                    Edit
                  </Button>
                  <Button size="large" variant="contained" color="secondary">
                    <DeleteForeverIcon sx={{ color: "red", mr: 2 }} />
                    Delete
                  </Button>
                </CardActions>
              ) : null}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
};

export default QuestionnaireScreen;
