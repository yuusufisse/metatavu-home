import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NewQuizCard = () => {
  const navigate = useNavigate();
	
  const handleClickAddNew = () => {
    navigate("/addNewQuestion");
  };
	const handleClickGoBack = () => {
    navigate("/questionnaire");
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
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Make a new questionnairy
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <Button
            sx={{ alignSelf: "flex-start" }}
            size="large"
            variant="contained"
            color="primary"
            onClick={handleClickAddNew}
          >
            + Add new Question
          </Button>
          <Button
            sx={{ display: "flex" }}
            size="large"
            variant="contained"
            color="secondary"
          >
            Save & Submit
          </Button>
          <Button
            sx={{ display: "flex" }}
            size="large"
            variant="outlined"
            color="primary"
						onClick={handleClickGoBack}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default NewQuizCard;
