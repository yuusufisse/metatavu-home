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

/**
 * New Questionnaire Card component
 * Includes a dialog window to create a new question
 */

const NewQuizCard = () => {
  const [open, setOpen] = useState(false);

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  // const handleClickAddNew = () => {
  //   navigate("/addNewQuestion");
  // };
  const handleClickGoBack = () => {
    navigate("/questionnaire");
  };

  const [questionTitle, setQuestionTitle] = useState("");
  const [questionBody, setQuestionBody] = useState("");
  const [options, setOptions] = useState([false, false, false, false]);

  const handleQuestionTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionTitle(event.target.value);
  };

  const handleQuestionBodyChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuestionBody(event.target.value);
  };

  const handleOptionChange = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions[index] = !updatedOptions[index];
    setOptions(updatedOptions);
  };

  const handleAddQuestionSubmit = () => {
    console.log("Question body: ", questionBody);
    console.log("Options: ", options);
  };

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

      {/* Render all questins in list */}
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
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Make new question</DialogTitle>
        <DialogContent>
          <Card
            className="new-question"
            sx={{
              p: 3,
              width: "80%",
              display: "flex",
              flexDirection: "column",
              height: "100",
            }}
          >
            <CardContent>
              <Typography variant="h4" gutterBottom>
                New Question
              </Typography>

              <TextField
                id="textfield-question-body"
                label="Question"
                multiline
                rows={6}
                defaultValue="Insert question here"
                value={questionBody}
                onChange={handleQuestionBodyChange}
                fullWidth
              />

              {/* <Box>

                <FormGroup
                  row
                  aria-label="List of answers, correct ones should be marked with a checkmark"
                >
                  
                  <Checkbox
                    icon={<Check />}
                    checkedIcon={<Check />}
                    name="checkedH"
                    checked={false}
                    onChange={() => {}}
                  />
                  <TextField variant="outlined" label="Insert Option" />

                </FormGroup>

              </Box> */}

              <Box sx={{ display: "flex" }}>
                <FormControl
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormLabel component="legend">
                    List of answers, correct ones should be marked with a
                    checkmark
                  </FormLabel>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options[0]}
                          onChange={() => handleOptionChange}
                          name="option1"
                        />
                      }
                      label={
                        <TextField variant="outlined" label="Insert Option" />
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options[1]}
                          onChange={() => handleOptionChange}
                          name="option2"
                        />
                      }
                      label={
                        <TextField variant="outlined" label="Insert Option" />
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options[2]}
                          onChange={() => handleOptionChange}
                          name="option3"
                        />
                      }
                      label={
                        <TextField variant="outlined" label="Insert Option" />
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={options[3]}
                          onChange={() => handleOptionChange}
                          name="option4"
                        />
                      }
                      label={
                        <TextField variant="outlined" label="Insert Option" />
                      }
                    />
                  </FormGroup>
                </FormControl>
              </Box>

              <ButtonGroup>
                <Button size="large" variant="contained" color="primary">
                  + Add new Answer option
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onSubmit={handleAddQuestionSubmit}
                >
                  Save question
                </Button>
              </ButtonGroup>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button>+ Add new answer option</Button>
          <Button onClick={handleSaveSubmit}>Submit</Button>
          <Button onClick={closeDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default NewQuizCard;
