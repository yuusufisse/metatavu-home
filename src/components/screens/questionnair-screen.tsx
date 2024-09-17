import { Card, Grid, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

  return (
    <div>
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
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Current Questionnaires
            </Typography>
          </Grid>
          {mockQuestionnaires.map((questionnaire) => (
            <Grid item xs={12} key={questionnaire.id} sx={{ mb: 2 }}>
              <Card sx={{ p: 2 }}>
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
              </Card>
            </Grid>
          ))}
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Build New Questionnaire
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGoHome}
              sx={{ ml: 2 }}
            >
              Go back to Homepage
            </Button>
          </Grid>
        </Grid>
      </Card>
    </div>
  );
};

export default QuestionnaireScreen;
