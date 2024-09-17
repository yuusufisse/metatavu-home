import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardContent,
  Typography,
  TextField,
  Checkbox,
  Button,
  DialogActions,
  Box,
} from "@mui/material";

/**
 * NewQuestionDialog component
 * Interface for the NewQuestionDialog component
 */

interface NewQuestionDialogProps {
  open: boolean;
  closeDialog: () => void;
  handleAddQuestionSubmit: (
    questionText: string,
    options: { label: string; value: boolean }[],
  ) => void;
}

const NewQuestionDialog: React.FC<NewQuestionDialogProps> = ({
  open,
  closeDialog,
  handleAddQuestionSubmit,
}) => {
  /**
   * State for the question text and options
   */
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { label: "", value: false },
    { label: "", value: false },
    { label: "", value: false },
    { label: "", value: false },
  ]);

  /**
   * Handle options label change
   */
  const handleAnswerLabelChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const updatedOptions = [...options];
    updatedOptions[index].label = event.target.value;
    setOptions(updatedOptions);
  };

  /**
   * Handle checkbox options value change
   * @param index
   */
  const handleCheckboxChange = (index: number) => {
    const updatedOptions = [...options];
    updatedOptions[index].value = !updatedOptions[index].value;
    setOptions(updatedOptions);
  };

  /**
   * Handle adding a new option (adds an empty option to the list)
   */
  const handleAddNewOption = () => {
    setOptions([...options, { label: "", value: false }]);
  };

  /**
   * Handle saving the question (submitting the question and options + resetting the form)
   */
  const handleSaveQuestion = () => {
    handleAddQuestionSubmit(questionText, options);

    setQuestionText("");
    setOptions([
      { label: "", value: false },
      { label: "", value: false },
      { label: "", value: false },
      { label: "", value: false },
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
          <CardContent sx={{ width: "100%" }}>
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
              <Box
                key={index}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}
                >
                  <Checkbox
                    checked={option.value}
                    onChange={() => handleCheckboxChange(index)}
                    name={`option${index + 1}`}
                    sx={{ width: "auto", mt: 2 }}
                  />
                </Box>
                <Box
                  sx={{
                    width: "100%",
                    ml: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    id="textfield-answer-option"
                    variant="outlined"
                    label="Insert Option"
                    value={option.label}
                    onChange={(e) => handleAnswerLabelChange(index, e)}
                    fullWidth
                    sx={{ mt: 2 }}
                  />
                </Box>
              </Box>
            ))}
            <Button onClick={handleAddNewOption} sx={{ mt: 3 }}>
              <Typography sx={{ fontWeight: "bold" }}>
                + Add new answer option
              </Typography>
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button size="large" onClick={handleSaveQuestion}>
          Submit
        </Button>
        <Button size="large" onClick={closeDialog}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewQuestionDialog;
