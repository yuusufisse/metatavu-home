import { Button, Card, CardActions, CardContent, Grid, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import NewQuestionCard from "./question-form";
import { KeyboardReturn } from "@mui/icons-material";
import UserRoleUtils from "src/utils/user-role-utils";
import type { Question, QuestionOption } from "src/types/index";
import strings from "src/localization/strings";

/**
 * New Questionnaire Card component
 * Includes a card (question-form.tsx) to create a new question
 */
const NewQuestionnaireCard = () => {
  const adminMode = UserRoleUtils.adminMode();
  
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");

  const handleQuestionTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestionnaireTitle(event.target.value);
  };

  /**
   * State and functions to handle the questions and options
   */
  const [questions, setQuestions] = useState<Question[]>([]);

  /**
   * Functions to add new question to Questionnaire
   * @param questionText 
   * @param options 
   */
  const handleAddQuestionSubmit = (
    questionText: string,
    options: QuestionOption[]
  ) => {
    setQuestions((prevQuestions: Question[]) => [...prevQuestions, { questionText, options }]);
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  /**
   * This should save the question title and questions to DB.
   * TODO:
   */
  const handleSaveSubmit = () => {};

  return (
    <>
      {/* Card containing functions to insert new Quiz */}
      <Card
        sx={{
          p: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100"
        }}
      >
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>
            {strings.newQuestionnaireScreen.makeNewQuestionnaire}
          </Typography>
          <TextField
            label={strings.newQuestionnaireScreen.title}
            placeholder={strings.newQuestionnaireScreen.insertTitle}
            value={questionnaireTitle}
            onChange={handleQuestionTitleChange}
            variant="outlined"
            fullWidth
            sx={{ mt: 2, mb: 4 }}
          />
          {/* Card element (questin-form.tsx) to make new question */}
          <NewQuestionCard handleAddQuestionSubmit={handleAddQuestionSubmit} />
          <CardActions
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              padding: 0
            }}
          >
            <Button
              sx={{ display: "flex", alignItems: "center", mt: 4 }}
              id="save-submit"
              size="large"
              variant="contained"
              color="success"
              onClick={handleSaveSubmit}
            >
              {strings.newQuestionnaireScreen.saveButton}
            </Button>
          </CardActions>
        </CardContent>
      </Card>
      <Card sx={{ mt: 2, width: "100%" }}>
        <Link
          to={adminMode ? "/admin/questionnaire" : "/questionnaire"}
          style={{ textDecoration: "none" }}
        >
          <Button variant="contained" sx={{ p: 2, width: "100%" }}>
            <KeyboardReturn sx={{ marginRight: "10px" }} />
            <Typography>Back</Typography>
          </Button>
        </Link>
      </Card>
      {/* Card containing all the build questions */}
      <Card
        sx={{
          p: 2,
          mt: 2,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100"
        }}
      >
        <CardContent>
          <Grid container sx={{ flexGrow: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h4" gutterBottom>
                {strings.newQuestionnaireScreen.preview}
              </Typography>
            </Grid>
            <Typography variant="h5" gutterBottom>
              {questionnaireTitle}
            </Typography>
            {questions.map((q, index) => (
              <Grid item xs={12} key={index} sx={{ mb: 2 }}>
                <Card sx={{ p: 2 }}>
                  <Typography>{q.questionText}</Typography>

                  <List component="ol">
                    {q.options.map((option, idx) => (
                      <ListItem component="li" key={idx}>
                        <ListItemText primary={`${option.label} ${strings.newQuestionnaireScreen.is} ${option.value.toString()}`} />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    <DeleteForeverIcon sx={{ color: "red", mr: 2 }} />
                    {strings.newQuestionnaireScreen.delete}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default NewQuestionnaireCard;
