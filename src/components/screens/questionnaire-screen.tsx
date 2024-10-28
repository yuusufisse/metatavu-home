import { Card, Grid, Box, CardContent, CardActions, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import UserRoleUtils from "src/utils/user-role-utils";
import { KeyboardReturn } from "@mui/icons-material";
import strings from "src/localization/strings";
import type { Questionnaire } from "src/generated/homeLambdasClient/models/Questionnaire";
import { useEffect, useState } from "react";

const mockQuestionnaires = [
  {
    id: '1',
    title: 'Math Basics',
    description: 'A simple questionnaire to test basic math skills.',
    passedUsers: true,
  },
  {
    id: '2',
    title: 'Science Facts',
    description: 'Test your knowledge of fundamental science facts.',
    passedUsers: false,
  },
  {
    id: '3',
    title: 'History Quiz',
    description: 'A deep dive into world history questions.',
    passedUsers: false,
  },
  {
    id: '4',
    title: 'Programming Fundamentals',
    description: 'Basic questions to evaluate understanding of programming.',
    passedUsers: false,
  },
  {
    id: '5',
    title: 'Geography Challenge',
    description: 'Quiz to assess knowledge on global geography.',
    passedUsers: false,
  },
];

/**
 * Questionnaire Screen Component
 */
const QuestionnaireScreen = () => {
  const adminMode = UserRoleUtils.adminMode();
  const [, setQuestionnaires] = useState<Questionnaire[]>([]);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      const questionnaires = await listQuestionnaires();
      setQuestionnaires(questionnaires);
    };
    fetchQuestionnaires(); 
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestionnaire(id);
      setQuestionnaires((prevQuestionnaires: Questionnaire[]) => prevQuestionnaires.filter((questionnaire: Questionnaire) => questionnaire.id !== id));
    } catch (error) {
      console.error("Delete Questionnaire failed:", error);
    }
  };

  return (
    <Card
      sx={{
        p: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100"
      }}
    >
      <Grid container sx={{ flexGrow: 1 }}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "space-between" },
            alignItems: "center",
            mb: 2,
            mt: 2
          }}
        >
          <Grid item xs={12} sm={6} sx={{ alignItems: "center" }}>
            <Typography variant="h4" justifyContent={"center"}>
              {strings.questionnaireScreen.currentQuestionnaires}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "flex-end" }
            }}
          >
            {adminMode && 
              <Link to="/admin/newQuestionnaire" style={{ textDecoration: "none" }}>
                <Button variant="contained" color="primary" size="large">
                  {strings.questionnaireScreen.buildNewQuestionnaire}
                </Button>
              </Link>
            }
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 2 }}>
            <Card>
              <CardContent>

              <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Questionnaire Title</TableCell>
            <TableCell>Description</TableCell>
            {adminMode ? ( <TableCell>Actions</TableCell>) : (<TableCell>Status</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {mockQuestionnaires.map((questionnaire) => (
            <TableRow key={questionnaire.id}>
              <TableCell>{questionnaire.title}</TableCell>
              <TableCell>{questionnaire.description}</TableCell>
              {adminMode ? (
                <TableCell>
                  <Button variant="outlined" color="success" sx={{ mr: 2 }}>
                    <EditIcon sx={{ color: "success", mr: 1 }} />
                    {strings.questionnaireScreen.edit}
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => handleDelete(questionnaire.id)}>
                    <DeleteForeverIcon sx={{ color: "red", mr: 1 }} />
                    {strings.questionnaireScreen.delete}
                  </Button>
                </TableCell>) : (
                  <TableCell>
                  {questionnaire.passedUsers ? (
                    <CheckCircleIcon sx={{ color: 'green' }} />
                  ) : (
                    <CloseIcon sx={{ color: 'red' }} />
                  )}
                </TableCell>
                )
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
              </CardContent>
            </Card>
          </Grid>
      </Grid>
      <Card sx={{ mt: 2, width: "100%" }}>
        <Link to={adminMode ? "/admin" : "/"} style={{ textDecoration: "none" }}>
          <Button variant="contained" sx={{ p: 2, width: "100%" }}>
            <KeyboardReturn sx={{ marginRight: "10px" }} />
            <Typography>{strings.questionnaireScreen.back}</Typography>
          </Button>
        </Link>
      </Card>
    </Card>
  );
};

export default QuestionnaireScreen;