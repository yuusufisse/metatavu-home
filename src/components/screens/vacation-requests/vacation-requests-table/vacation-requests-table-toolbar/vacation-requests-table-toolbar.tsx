import { Add, Cancel, Edit } from "@mui/icons-material";
import { Box, Collapse, Grid, Typography, styled } from "@mui/material";
import { useEffect, useState } from "react";
import ToolbarForm from "./toolbar-form/toolbar-form";
import { GridRowId } from "@mui/x-data-grid";
import { DataGridRow, ToolbarFormModes, VacationData } from "../../../../../types";
import ToolbarDeleteButton from "./toolbar-delete-button";
import FormToggleButton from "./toolbar-form-toggle-button";
import ConfirmationHandler from "../../../../contexts/confirmation-handler";
import strings from "../../../../../localization/strings";
import { getToolbarTitle } from "../../../../../utils/toolbar-utils";

/**
 * Component properties
 */
interface Props {
  deleteVacationRequests: (selectedRowIds: GridRowId[], rows: DataGridRow[]) => Promise<void>;
  createVacationRequest: (vacationData: VacationData) => Promise<void>;
  updateVacationRequest: (vacationData: VacationData, vacationRequestId: string) => Promise<void>;
  setFormOpen: (formOpen: boolean) => void;
  formOpen: boolean;
  selectedRowIds: GridRowId[];
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
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [toolbarFormMode, setToolbarFormMode] = useState<ToolbarFormModes>(ToolbarFormModes.NONE);
  const [confirmationHandlerOpen, setConfirmationHandlerOpen] = useState(false);
  const [title, setTitle] = useState(strings.tableToolbar.myRequests);

  useEffect(() => {
    if (toolbarFormMode) {
      setTitle(getToolbarTitle(toolbarFormMode));
    }
  }, [toolbarFormMode]);

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
        open={confirmationHandlerOpen}
        setOpen={setConfirmationHandlerOpen}
        deleteVacationsData={deleteVacationsData}
      />
      {toolbarOpen && !formOpen && selectedRowIds?.length ? (
        <ToolbarGridContainer container>
          <ToolbarGridItem item xs={selectedRowIds?.length === 1 ? 6 : 12}>
            <ToolbarDeleteButton setConfirmationHandlerOpen={setConfirmationHandlerOpen} />
          </ToolbarGridItem>
          {selectedRowIds?.length === 1 ? (
            <ToolbarGridItem item xs={6}>
              <FormToggleButton
                title={strings.tableToolbar.edit}
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
            <Typography variant="h5">{title}</Typography>
          </ToolbarGridItem>
          <ToolbarGridItem item xs={6}>
            {formOpen ? (
              <FormToggleButton
                title={strings.tableToolbar.cancel}
                ButtonIcon={Cancel}
                value={formOpen}
                setValue={setFormOpen}
                buttonVariant="outlined"
              />
            ) : (
              <FormToggleButton
                value={formOpen}
                setValue={setFormOpen}
                title={strings.tableToolbar.create}
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
    </Box>
  );
};

export default TableToolbar;
