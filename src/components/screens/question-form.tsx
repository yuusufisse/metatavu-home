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
  DialogActions,
} from "@mui/material";

interface NewQuestionDialogProps {
  open: boolean;
  closeDialog: () => void;
  handleAddQuestionSubmit: (questionText: string, options: { label: string; isCorrect: boolean }[]) => void;
}

const NewQuestionDialog: React.FC<NewQuestionDialogProps> = ({ open, closeDialog, handleAddQuestionSubmit }) => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
  ]);

  // Handle option label change
  const handleLabelChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedOptions = [...options];
    updatedOptions[index].label = event.target.value;
    setOptions(updatedOptions);
  };

  // Handle checkbox change
  const handleCheckboxChange = (index: number) => {
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
          <CardContent sx={{width: "100%"}}>
            <Typography variant="h5" gutterBottom>
            Want to add a new question? Fill in the details below.
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
              <FormGroup 
              key={index}
              sx={{width: "100%", display: "flex", flexDirection: "row", alignItems: "center"}}
              >
                <Checkbox
                      checked={option.isCorrect}
                      onChange={() => handleCheckboxChange(index)}
                      name={`option${index + 1}`}
                      sx={{ width: "auto", mt: 2 }}
                    />
                  
                  
                    <TextField
                      variant="outlined"
                      label="Insert Option"
                      value={option.label}
                      onChange={(e) => handleLabelChange(index, e)}
                      fullWidth
                      sx={{mt: 2 }}
                    />
              </FormGroup>
            ))}
            <Button onClick={handleAddNewOption} sx={{mt: 3}}>
            <Typography sx={{ fontWeight: 'bold' }}>
    + Add new answer option
  </Typography>
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleSaveQuestion}>Submit</Button>
        <Button size="large" onClick={closeDialog}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewQuestionDialog;
