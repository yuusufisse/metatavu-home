import { Add, Cancel, Edit } from "@mui/icons-material";
import { Box, Collapse, Grid, styled } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DeleteVacationRequests from "../../delete-vacation-requests";
import ToolbarForm from "./toolbar-form/toolbar-form";
import DeleteVacationRequestStatuses from "../../delete-vacation-request-statuses";
import { VacationRequest, VacationRequestStatus } from "../../../../../generated/client";
import { GridRowId } from "@mui/x-data-grid";
import { DataGridRow, ToolbarFormModes } from "../../../../../types";
import ToolbarDeleteButton from "./toolbar-delete-button";
import ToolbarTitle from "./toolbar-title";
import FormToggleButton from "./toolbar-form-toggle-button";
import ConfirmationHandler from "../../../../contexts/confirmation-handler";

/**
 * Component properties
 */
interface Props {
  vacationRequests: VacationRequest[];
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
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
  vacationRequests,
  setVacationRequests,
  vacationRequestStatuses,
  setVacationRequestStatuses,
  setFormOpen,
  formOpen,
  selectedRowIds,
  rows
}: Props) => {
  const [toolbarOpen, setToolbarOpen] = useState<boolean>(false);
  const { deleteVacationRequests } = DeleteVacationRequests({
    vacationRequests: vacationRequests,
    setVacationRequests: setVacationRequests,
    vacationRequestStatuses: vacationRequestStatuses,
    selectedRowIds: selectedRowIds,
    rows: rows
  });
  const { deleteVacationRequestStatuses } = DeleteVacationRequestStatuses({
    setVacationRequestStatuses: setVacationRequestStatuses,
    vacationRequestStatuses: vacationRequestStatuses,
    selectedRowIds: selectedRowIds,
    rows: rows
  });
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
    await deleteVacationRequestStatuses();
    await deleteVacationRequests();
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
    <Box
      sx={{
        border: "1px solid lightgrey",
        borderBottom: "0px",
        margin: "0"
      }}
    >
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
            vacationRequests={vacationRequests}
            setVacationRequests={setVacationRequests}
            setFormOpen={setFormOpen}
            setVacationRequestStatuses={setVacationRequestStatuses}
            vacationRequestStatuses={vacationRequestStatuses}
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
