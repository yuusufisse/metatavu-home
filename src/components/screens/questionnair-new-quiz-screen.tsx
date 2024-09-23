import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewQuestionCard from "./question-form";

/**
 * New Questionnaire Card component
 * Includes a dialog window (question-form.tsx) to create a new question
 */
const NewQuizCard = () => {
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
   * This should save the question title and questions to DB.
   * TODO
   */
  const handleSaveSubmit = () => {
    console.log("Information above should be saved to DB: ");
  };

  /**
   * Function to navigate back to the questionnaire screen
   */
  const navigate = useNavigate();
  const handleClickGoBack = () => {
    navigate("/questionnaire");
  };

  return (
    <>
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
            sx={{ mt: 2, mb: 4 }}
          />
          {/* Card element (questin-form.tsx) to make new question */}
          <NewQuestionCard handleAddQuestionSubmit={handleAddQuestionSubmit}  />

          <CardActions
            sx={{
              display: "flex",
              justifyContent: "right",
              padding: 2,
              mt: 3,
            }}
          >
            <Button
              sx={{ display: "flex", mr: 3 }}
              id="save-submit"
              size="large"
              variant="contained"
              color="secondary"
              onClick={handleSaveSubmit}
            >
              Save & Submit questionnaire
            </Button>
            <Button
              sx={{ display: "flex" }}
              id="cancel"
              size="large"
              variant="outlined"
              color="primary"
              onClick={handleClickGoBack}
            >
              Cancel & go back
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
                        {option.label} is ({option.value.toString()})
                      </li>
                    ))}
                  </ol>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default NewQuizCard;
