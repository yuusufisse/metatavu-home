import { Check } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
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

  // Function to handle submitting the question and options, this is for testing purposes
  const handleAddQuestionSubmit = (questionText, options) => {
    console.log("Question Submitted:", questionText);
    console.log("Options:", options);

    // You can add your logic here to save the question and options to state,
    // send to the backend, or handle them however your application needs.
    closeDialog();
    // Close the dialog after submitting
  };

  const navigate = useNavigate();

  const handleClickGoBack = () => {
    navigate("/questionnaire");
  };

  /**
   *
   */
  const [questionTitle, setQuestionTitle] = useState("");

  const handleQuestionTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionTitle(event.target.value);
  };

  // OLD VERSION

  // interface Question {
  //   questionText: string;
  //   options: string[];
  //   correctAnswers: boolean[];
  // }

  // const questionnaire: { title: string; questions: Question[] } = {
  //   title: questionTitle,
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
    console.log("Question Title: ", questionTitle);
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
            value={questionTitle}
            onChange={handleQuestionTitleChange}
            variant="outlined"
            fullWidth
          />
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            <Button
              sx={{ alignSelf: "flex-start" }}
              id="add-new-question"
              size="large"
              variant="contained"
              color="primary"
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
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100",
        }}
      >
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            All questions are render here as list
          </Typography>
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
