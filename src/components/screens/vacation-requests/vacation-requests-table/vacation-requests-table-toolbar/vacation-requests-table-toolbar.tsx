import { Add, Cancel, Edit } from "@mui/icons-material";
import { Box, Collapse, Grid, styled } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ToolbarForm from "./toolbar-form/toolbar-form";
import { GridRowId } from "@mui/x-data-grid";
import { DataGridRow, ToolbarFormModes, VacationData } from "../../../../../types";
import ToolbarDeleteButton from "./toolbar-delete-button";
import ToolbarTitle from "./toolbar-title";
import FormToggleButton from "./toolbar-form-toggle-button";
import ConfirmationHandler from "../../../../contexts/confirmation-handler";

/**
 * Component properties
 */
interface Props {
  deleteVacationRequests: (
    selectedRowIds: GridRowId[] | undefined,
    rows: DataGridRow[]
  ) => Promise<void>;
  createVacationRequest: (vacationData: VacationData) => Promise<void>;
  updateVacationRequest: (
    vacationData: VacationData,
    vacationRequestId: string | undefined
  ) => Promise<void>;
  setFormOpen: Dispatch<SetStateAction<boolean>>;
  formOpen: boolean;
  selectedRowIds: GridRowId[] | undefined;
  rows: DataGridRow[];
}
/**
 * Table toolbar component
 *
 * @param props component properties
 */
const TableToolbar = ({
  deleteVacationRequests,
  createVacationRequest,
  updateVacationRequest,
  setFormOpen,
  formOpen,
  selectedRowIds,
  rows
}: Props) => {
  const [toolbarOpen, setToolbarOpen] = useState<boolean>(false);
  const [toolbarFormMode, setToolbarFormMode] = useState<ToolbarFormModes>(ToolbarFormModes.NONE);
  const [confirmation, setConfirmation] = useState<string | undefined>(undefined);

  /**
   * Set toolbar open
   */
  useEffect(() => {
    if (selectedRowIds) {
      setToolbarOpen(true);
    } else {
      setToolbarOpen(false);
    }
  }, [selectedRowIds]);

  /**
   * Delete vacation requests and statuses
   */
  const deleteVacationsData = async () => {
    await deleteVacationRequests(selectedRowIds, rows);
  };

  /**
   * Toolbar grid item component
   */
  const ToolbarGridItem = styled(Grid)({
    padding: "10px"
  });

  /**
   * Toolbar grid container component
   */
  const ToolbarGridContainer = styled(Grid)({
    alignContent: "space-around",
    alignItems: "center"
  });

  return (
    <Box>
      <ConfirmationHandler
        confirmation={confirmation}
        setConfirmation={setConfirmation}
        deleteVacationsData={deleteVacationsData}
      >
        {toolbarOpen && !formOpen && selectedRowIds?.length ? (
          <ToolbarGridContainer container>
            <ToolbarGridItem item xs={selectedRowIds?.length === 1 ? 6 : 12}>
              <ToolbarDeleteButton setConfirmation={setConfirmation} />
            </ToolbarGridItem>
            {selectedRowIds?.length === 1 ? (
              <ToolbarGridItem item xs={6}>
                <FormToggleButton
                  title="Edit"
                  ButtonIcon={Edit}
                  value={formOpen}
                  setValue={setFormOpen}
                />
              </ToolbarGridItem>
            ) : null}
          </ToolbarGridContainer>
        ) : (
          <ToolbarGridContainer container>
            <ToolbarGridItem item xs={6}>
              <ToolbarTitle toolbarFormMode={toolbarFormMode} />
            </ToolbarGridItem>
            <ToolbarGridItem item xs={6}>
              {formOpen ? (
                <FormToggleButton
                  title="Cancel"
                  ButtonIcon={Cancel}
                  value={formOpen}
                  setValue={setFormOpen}
                  buttonVariant="outlined"
                />
              ) : (
                <FormToggleButton
                  value={formOpen}
                  setValue={setFormOpen}
                  title="Create"
                  ButtonIcon={Add}
                />
              )}
            </ToolbarGridItem>
          </ToolbarGridContainer>
        )}
        <Collapse in={formOpen}>
          <ToolbarForm
            formOpen={formOpen}
            setFormOpen={setFormOpen}
            createVacationRequest={createVacationRequest}
            updateVacationRequest={updateVacationRequest}
            selectedRowIds={selectedRowIds}
            rows={rows}
            toolbarFormMode={toolbarFormMode}
            setToolbarFormMode={setToolbarFormMode}
          />
        </Collapse>
      </ConfirmationHandler>
    </Box>
  );
};

export default TableToolbar;
