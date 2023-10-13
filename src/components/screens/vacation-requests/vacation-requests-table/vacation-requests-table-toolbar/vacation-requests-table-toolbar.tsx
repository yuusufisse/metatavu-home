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
import { VacationRequestStatuses } from "../../../../../generated/client";
import UpdateStatusButton from "./toolbar-update-status-button";

/**
 * Component properties
 */
interface Props {
  deleteVacationRequests: (selectedRowIds: GridRowId[], rows: DataGridRow[]) => Promise<void>;
  createVacationRequest: (vacationData: VacationData) => Promise<void>;
  updateVacationRequest: (
    vacationData: VacationData,
    vacationRequestId: string | undefined
  ) => Promise<void>;
  updateVacationRequestStatuses: (
    newStatus: VacationRequestStatuses,
    selectedRowIds: GridRowId[]
  ) => Promise<void>;
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
  updateVacationRequestStatuses,
  setFormOpen,
  formOpen,
  selectedRowIds,
  rows
}: Props) => {
  const [toolbarOpen, setToolbarOpen] = useState<boolean>(false);
  const [toolbarFormMode, setToolbarFormMode] = useState<ToolbarFormModes>(ToolbarFormModes.NONE);
  const [confirmation, setConfirmation] = useState("");

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

  /**
   * Component properties
   */
  interface ToolbarTitleProps {
    toolbarFormMode: ToolbarFormModes;
  }

  /**
   * Toolbar title component
   *
   * @param props component properties
   */
  const ToolbarTitle = ({ toolbarFormMode }: ToolbarTitleProps) => {
    const [title, setTitle] = useState(strings.tableToolbar.myRequests);

    useEffect(() => {
      if (toolbarFormMode) {
        setTitle(getToolbarTitle(toolbarFormMode));
      }
    }, [toolbarFormMode]);
    return <Typography variant="h5">{title}</Typography>;
  };

  return (
    <Box>
      <ConfirmationHandler
        confirmation={confirmation}
        setConfirmation={setConfirmation}
        deleteVacationsData={deleteVacationsData}
      >
        {toolbarOpen && !formOpen && selectedRowIds?.length ? (
          <ToolbarGridContainer container>
            <ToolbarGridItem item xs={selectedRowIds?.length === 1 ? 3 : 6}>
              <ToolbarDeleteButton setConfirmation={setConfirmation} />
            </ToolbarGridItem>
            {selectedRowIds?.length === 1 ? (
              <ToolbarGridItem item xs={3}>
                <FormToggleButton
                  title={strings.tableToolbar.edit}
                  ButtonIcon={Edit}
                  value={formOpen}
                  setValue={setFormOpen}
                />
              </ToolbarGridItem>
            ) : null}
            <ToolbarGridItem item xs={3}>
              <UpdateStatusButton
                updateVacationRequestStatuses={updateVacationRequestStatuses}
                approval={true}
                selectedRowIds={selectedRowIds}
              />
            </ToolbarGridItem>
            <ToolbarGridItem item xs={3}>
              <UpdateStatusButton
                updateVacationRequestStatuses={updateVacationRequestStatuses}
                approval={false}
                selectedRowIds={selectedRowIds}
              />
            </ToolbarGridItem>
          </ToolbarGridContainer>
        ) : (
          <ToolbarGridContainer container>
            <ToolbarGridItem item xs={6}>
              <ToolbarTitle toolbarFormMode={toolbarFormMode} />
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
      </ConfirmationHandler>
    </Box>
  );
};

export default TableToolbar;
