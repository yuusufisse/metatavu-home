import { Alert, Box, Button, Card, CardActions, CardContent, CircularProgress, Grid, List, ListItem, ListItemText, Slider, TextField, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import NewQuestionnaireCard from "../questionnaire/new-questionnaire-card";
import { KeyboardReturn } from "@mui/icons-material";
import UserRoleUtils from "src/utils/user-role-utils";
import type { Question, QuestionOption } from "src/types/index";
import strings from "src/localization/strings";
import { set } from "react-hook-form";

/**
 * New Questionnaire Screen component
 * Includes a card (new-questionnaire-card.tsx) to create questions for a new questionnaire
 */
const NewQuestionnaireScreen = () => {
  const adminMode = UserRoleUtils.adminMode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionnaireTitle, setQuestionnaireTitle] = useState("");
  const [questionnaireDescription, setQuestionnaireDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [passScoreValue, setPassScoreValue] = useState(0);

  const handleQuestionTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestionnaireTitle(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestionnaireDescription(event.target.value);
  };

  const handlePassScoreSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassScoreValue(Number(event.target.value));
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
   * Function to count all correct answers in the questionnaire, used for passScore determination
   */
  const countCorrectAnswers = () => {
    return questions.reduce((count, question) => {
      return count + question.options.filter(option => option.value === true).length;
    }, 0);
  };

  /**
   * Function to save the new questionnaire
   */
  const handleSaveSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const newQuestionnaireData = { 
        title: questionnaireTitle, 
        description: questionnaireDescription,
        options: questions,
        passScore: passScoreValue
      };

      await createQuestionnaire(newQuestionnaireData);
      /**
       * TODO: fix api.ts to include questionnaire API
       */
    } catch (error) {
      console.error("Failed to save questionnaire", error);
      setError("Failed to save questionnaire. Please try again.");
      setTimeout(() => {setError(null);}, 3000);
    } finally {
      setLoading(false);
      setQuestionnaireTitle("");
      setQuestionnaireDescription("");
      setQuestions([]);
      setPassScoreValue(0);
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
              padding: 0, 
              alignItems: "flex-start",
              flexDirection: { xs: "column", sm: "row" },
              width: "100%"
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", width: "75%", mr: 2 }}>
            <Typography variant="h6" gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 1, mt: 3 }}>
                {strings.newQuestionnaireScreen.countedAnswers} {countCorrectAnswers()}
            </Typography>
            <Typography variant="h6" gutterBottom 
              sx={{ mb: 1, mt: 1 }}>
                {strings.newQuestionnaireScreen.requiredAnswers} {passScoreValue}
            </Typography>
            <Slider
              value={passScoreValue}
              onChange={handlePassScoreSliderChange as any}
              step={1}
              marks
              min={0}
              max={countCorrectAnswers()}
              valueLabelDisplay="auto"
              sx={{ mt: 1, width: "70%" }}
            />
            </Box>
            <Button
              sx={{ display: "flex", alignItems: "center", mt: 8 }}
              id="save-submit"
              size="large"
              variant="contained"
              color="success"
              onClick={handleSaveSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : strings.newQuestionnaireScreen.saveButton}
              {error && <Alert severity="error">{error}</Alert>}
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
