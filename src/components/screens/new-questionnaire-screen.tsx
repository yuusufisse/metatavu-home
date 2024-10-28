import { Button, Card, CardActions, CardContent, CircularProgress, Grid, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import NewQuestionnaireCard from "../questionnaire/new-questionnaire-card";
import { KeyboardReturn } from "@mui/icons-material";
import UserRoleUtils from "src/utils/user-role-utils";
import type { Question, QuestionOption } from "src/types/index";
import strings from "src/localization/strings";

/**
 * New Questionnaire Screen component
 * Includes a card (new-questionnaire-card.tsx) to create questions for a new questionnaire
 */
const NewQuestionnaireScreen = () => {
  const adminMode = UserRoleUtils.adminMode();
  const [loading, setLoading] = useState(false);
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");
  const [questionnaireDescription, setQuestionnaireDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleQuestionTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestionnaireTitle(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestionnaireDescription(event.target.value);
  };

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
   * Function to save the new questionnaire
   */
  const handleSaveSubmit = async () => {
    setLoading(true);
    try {
      const newQuestionnaireData = { 
        title: questionnaireTitle, 
        description: questionnaireDescription,
        options: questions,
        passScore: 0
      /*TODO: passScore needs to be added to UI*/
      };

      // const result = await createQuestionnaire(newQuestionnaireData);
      /**
       * TODO: fix api.ts to include questionnaire API
       */
      console.log(newQuestionnaireData);
    } catch (error) {
      console.error("Error saving questionnaire:", error);
    } finally {
      setLoading(false);
    }
  };

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
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label={strings.newQuestionnaireScreen.description}
            placeholder={strings.newQuestionnaireScreen.insertDescription}
            value={questionnaireDescription}
            onChange={handleDescriptionChange}
            variant="outlined"
            fullWidth
            sx={{ mt: 2, mb: 4 }}
          />
          <NewQuestionnaireCard handleAddQuestionSubmit={handleAddQuestionSubmit} />
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : strings.newQuestionnaireScreen.saveButton}
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
            <Typography>{strings.newQuestionnaireScreen.back}</Typography>
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

export default NewQuestionnaireScreen;
