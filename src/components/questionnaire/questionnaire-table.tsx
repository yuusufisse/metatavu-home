import {
  Paper,
  Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import type { Questionnaire } from "src/generated/homeLambdasClient";
import strings from "src/localization/strings";
import UserRoleUtils from "src/utils/user-role-utils";
import { DataGrid, type GridRenderCellParams } from "@mui/x-data-grid";
import { useLambdasApi } from "src/hooks/use-api";

/**
 * Questionnaire Table Component
 * @returns Questionnaires from DynamoDB rendered in a x-data-grid table
 */

const QuestionnaireTable = () => {
  const adminMode = UserRoleUtils.adminMode();
  const { questionnaireApi } = useLambdasApi();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      const questionnaires = await questionnaireApi.listQuestionnaires();
      setQuestionnaires(questionnaires);
    };
    fetchQuestionnaires();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await questionnaireApi.deleteQuestionnaire(id);
      setQuestionnaires((prevQuestionnaires: Questionnaire[]) =>
        prevQuestionnaires.filter((questionnaire: Questionnaire) => questionnaire.id !== id)
      );
    } catch (error) {
      console.error("Delete Questionnaire failed:", error);
    }
  };

	const columns = [
    { field: 'title', headerName: `${strings.questionnaireTable.title}`, flex: 3 },
    { field: 'description', headerName: `${strings.questionnaireTable.description}`, flex: 5 },
    adminMode
      ? {
          field: 'actions',
          headerName: `${strings.questionnaireTable.actions}`,
          flex: 2.5,
          renderCell: (params: GridRenderCellParams) => (
            <>
              <Button variant="outlined" color="success" sx={{ mr: 1 }}>
                <EditIcon sx={{ color: 'success.main', mr: 1 }} />
                {strings.questionnaireTable.edit}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(params.row.id)}
              >
                <DeleteForeverIcon sx={{ color: 'red', mr: 1 }} />
                {strings.questionnaireTable.delete}
              </Button>
            </>
          ),
        }
      : {
          field: 'status',
          headerName: `${strings.questionnaireTable.status}`,
          flex: 1,
          renderCell: (params: GridRenderCellParams) =>
            params.row.passedUsers && params.row.passedUsers.lenght > 0 ? (
              <CheckCircleIcon sx={{ color: 'green' }} />
            ) : (
              <CloseIcon sx={{ color: 'red' }} />
            ),
        },
  ];

  return (
    <>
        <Paper style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={questionnaires}
            columns={columns}
            pagination
            pageSizeOptions={[5]}
            getRowId={(row) => row.id}
          />
        </Paper>
    </>
  );
};

export default QuestionnaireTable;
