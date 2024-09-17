import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewQuestionDialog from "./question-form";

/**
 * New Questionnaire Card component
 * Includes a dialog window (question-form.tsx) to create a new question
 */
const NewQuizCard = () => {
  /**
   * State and function to open and close the dialog window
   * @returns {boolean}
   */
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  /**
   * State and function to handle the questions and options
   * @returns {object} 
   */
  const [questions, setQuestions] = useState<
    { questionText: string; options: { label: string; value: boolean }[] }[]
  >([]);

  const handleAddQuestionSubmit = (
    questionText: string,
    options: { label: string; value: boolean }[],
  ) => {
    console.log("Question Submitted:", questionText);
    console.log("Options:", options);

    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { questionText, options },
    ]);
  };

  /**
   * Function to navigate back to the questionnaire screen
   */
  const navigate = useNavigate();
  const handleClickGoBack = () => {
    navigate("/questionnaire");
  };

  /**
   * State and function for the questionnaire title change
   */
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");
  const handleQuestionTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionnaireTitle(event.target.value);
  };

  /**
   * This should save the question title and questions to DB.
   * TODO
   */
  const handleSaveSubmit = () => {
    console.log("Information above should be saved to DB: ");
  };

  return (
    <Paper>
      {/* Card containing functions to insert new Quiz */}
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
          <TextField
            label="Title"
            placeholder="Insert title here"
            value={questionnaireTitle}
            onChange={handleQuestionTitleChange}
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
          />
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 2,
              mt: 3,
            }}
          >
            <Button
              sx={{ alignSelf: "flex-start" }}
              id="add-new-question"
              size="large"
              variant="contained"
              color="primary"
              disabled={!questionnaireTitle}
              onClick={openDialog}
            >
              + Add new Question
            </Button>
            <Button
              sx={{ display: "flex" }}
              id="save-submit"
              size="large"
              variant="contained"
              color="secondary"
              onClick={handleSaveSubmit}
            >
              Save & Submit
            </Button>
            <Button
              sx={{ display: "flex" }}
              id="cancel"
              size="large"
              variant="outlined"
              color="primary"
              onClick={handleClickGoBack}
            >
              Cancel
            </Button>
          </CardActions>
        </CardContent>
      </Card>

      {/* Render all questins in list THIS TODO*/}
      <Card
        sx={{
          p: 3,
          mt: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100",
        }}
      >
        <CardContent>
          {/* Testing if form will render something */}
          <Grid container sx={{ flexGrow: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                All questions will be rendered here as list
              </Typography>
            </Grid>
            <Typography variant="h4" gutterBottom>
              {questionnaireTitle}
            </Typography>
            {questions.map((q, index) => (
              <Grid item xs={12} key={index} sx={{ mb: 2 }}>
                <Card sx={{ p: 2 }}>
                  <Typography>{q.questionText}</Typography>

                  <ol>
                    {q.options.map((option, idx) => (
                      <li key={idx}>
                        {option.label} ({option.value.toString()})
                      </li>
                    ))}
                  </ol>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      {/* Dialog window to make new question */}
      <NewQuestionDialog
        open={isDialogOpen}
        closeDialog={closeDialog}
        handleAddQuestionSubmit={handleAddQuestionSubmit}
      />
    </Paper>
  );
};

export default NewQuizCard;
