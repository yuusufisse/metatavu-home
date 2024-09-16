import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Typography,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  ButtonGroup,
  DialogActions,
  Box,
} from "@mui/material";

const NewQuestionDialog = ({ open, closeDialog, handleAddQuestionSubmit }) => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
  ]);

  // Handle option label change
  const handleLabelChange = (index, event) => {
    const updatedOptions = [...options];
    updatedOptions[index].label = event.target.value;
    setOptions(updatedOptions);
  };

  // Handle checkbox change
  const handleCheckboxChange = (index) => {
    const updatedOptions = [...options];
    updatedOptions[index].isCorrect = !updatedOptions[index].isCorrect;
    setOptions(updatedOptions);
  };

  // Handle adding a new option (adds an empty option to the list)
  const handleAddNewOption = () => {
    setOptions([...options, { label: "", isCorrect: false }]);
  };

  // Handle form submission
  const handleSaveQuestion = () => {
    // Call the submit function with the current question and options
    handleAddQuestionSubmit(questionText, options);
    // Reset form
    setQuestionText("");
    setOptions([
      { label: "", isCorrect: false },
      { label: "", isCorrect: false },
      { label: "", isCorrect: false },
      { label: "", isCorrect: false },
    ]);
    closeDialog();
  };

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth={true} maxWidth="md">
      <DialogTitle>Build new question</DialogTitle>
      <DialogContent>
        <Card
          className="new-question"
          sx={{
            p: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Do we need this ?
            </Typography>

            <TextField
              id="textfield-question-body"
              label="Question"
              multiline
              rows={6}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              fullWidth
            />

            {options.map((option, index) => (
              <FormGroup key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.isCorrect}
                      onChange={() => handleCheckboxChange(index)}
                      name={`option${index + 1}`}
                    />
                  }
                  label={
                    <TextField
                      variant="outlined"
                      label="Insert Option"
                      value={option.label}
                      onChange={(e) => handleLabelChange(index, e)}
                      sx={{ width: "100%" }}
                    />
                  }
                />
              </FormGroup>
            ))}
            <Button onClick={handleAddNewOption}>
              + Add new answer option
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSaveQuestion}>Submit</Button>
        <Button onClick={closeDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewQuestionDialog;
