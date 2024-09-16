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
  // State to control the dialog open/close
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to handle opening the dialog
  const openDialog = () => setIsDialogOpen(true);

  // Function to handle closing the dialog
  const closeDialog = () => setIsDialogOpen(false);

  // FOR TESTING PURPOSES
  const [questions, setQuestions] = useState<
    { questionText: string; options: { label: string; isCorrect: boolean }[] }[]
  >([]);

  // Function to handle submitting the question and options, this is for testing purposes at this moment
  const handleAddQuestionSubmit = (
    questionText: string,
    options: { label: string; isCorrect: boolean }[],
  ) => {
    console.log("Question Submitted:", questionText);
    console.log("Options:", options);

    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { questionText, options },
    ]);

    // TODO: add logic here to save the question and options to DB
  };

  const navigate = useNavigate();

  const handleClickGoBack = () => {
    navigate("/questionnaire");
  };

  const [questionnaireTitle, setQuestionnaireTitle] = useState("");

  const handleQuestionTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionnaireTitle(event.target.value);
  };

  // OLD VERSION

  // interface Question {
  //   questionText: string;
  //   options: string[];
  //   correctAnswers: boolean[];
  // }

  // const questionnaire: { title: string; questions: Question[] } = {
  //   title: questionnaireTitle,
  //   questions: []
  //   // Array of question objects { questionText, options{} }
  // };

  // const handleAddQuestionSubmit = (questionText: string, options: Array<string>, correctAnswers: Array<boolean> ) => {

  //   const newQuestion = {
  //     questionText: questionText,
  //     options: options,
  //     correctAnswers: correctAnswers
  //   };

  //   questionnaire.questions.push(newQuestion);

  //   console.log("Question body: ", questionText);
  //   console.log("Options: ", options);
  //   console.log("Question added:" , newQuestion);
  // };

  // TODO
  // NEW DESIGN

  // const QuestionForm = ({ onSubmit }) => {
  //   const [questionText, setQuestionText] = useState('');
  //   const [options, setOptions] = useState([
  //       { label: '', isCorrect: false },
  //       { label: '', isCorrect: false },
  //       { label: '', isCorrect: false },
  //       { label: '', isCorrect: false }
  //   ]);

  //   // Handle option label change
  //   const handleLabelChange = (index, event) => {
  //       const updatedOptions = [...options];
  //       updatedOptions[index].label = event.target.value;
  //       setOptions(updatedOptions);
  //   };

  //   // Handle checkbox change
  //   const handleCheckboxChange = (index) => {
  //       const updatedOptions = [...options];
  //       updatedOptions[index].isCorrect = !updatedOptions[index].isCorrect;
  //       setOptions(updatedOptions);
  //   };

  //   // Handle form submission
  //   const handleSubmit = () => {
  //       onSubmit(questionText, options); // Call the handleAddQuestionSubmit function
  //   };
  // };
  // OLD VERSION END

  /**
   * This should save the question title and questions to DB.
   * TODO
   */

  const handleSaveSubmit = () => {
    console.log("Question Title: ", questionnaireTitle);
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
                        {option.label} ({option.isCorrect.toString()})
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
