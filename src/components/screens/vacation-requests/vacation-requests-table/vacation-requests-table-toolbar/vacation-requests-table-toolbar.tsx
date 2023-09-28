import { Add, Cancel, Edit } from "@mui/icons-material";
import { Box, Collapse, Grid, styled } from "@mui/material";
import { ComponentType, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import DeleteVacationRequests from "../../delete-vacation-requests";
import ToolbarForm from "./toolbar-form/toolbar-form";
import DeleteVacationRequestStatuses from "../../delete-vacation-request-statuses";
import { VacationRequest, VacationRequestStatus } from "../../../../../generated/client";
import { GridRowId } from "@mui/x-data-grid";
import { ButtonIconProps, DataGridRow, ToolbarFormModes } from "../../../../../types";
import GenericToggleButton from "../../../../generics/generic-toggle-button";
import ToolbarDeleteButton from "./toolbar-delete-button";
import ToolbarTitle from "./toolbar-title";

/**
 * Component properties
 */
interface TableToolbarProps {
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
 * @param props TableToolbarProps
 */
const TableToolbar = (props: TableToolbarProps) => {
  const {
    vacationRequests,
    setVacationRequests,
    vacationRequestStatuses,
    setVacationRequestStatuses,
    setFormOpen,
    formOpen,
    selectedRowIds,
    rows
  } = props;
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
    /* TODO: Prompt a confirmation on delete,
    (in case pressing delete was accidental),
    perhaps can make use of the generic-dialog component for this */
    await deleteVacationRequestStatuses();
    await deleteVacationRequests();
  };

  /**
   * FormOpen Toggle Button component properties
   */
  interface FormOpenToggleButtonProps {
    children?: ReactNode;
    buttonVariant?: "text" | "contained" | "outlined";
    ButtonIcon?: ComponentType<ButtonIconProps>;
    title?: string;
  }
  /**
   * FormOpen Toggle Button component
   *
   * @param props FormOpenToggleButtonProps
   */
  const FormOpenToggleButton = (props: FormOpenToggleButtonProps) => {
    const { ButtonIcon, title, buttonVariant } = props;
    return (
      <GenericToggleButton
        value={formOpen}
        setValue={setFormOpen}
        title={title}
        ButtonIcon={ButtonIcon}
        buttonVariant={buttonVariant}
      />
    );
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
      {toolbarOpen && !formOpen && selectedRowIds?.length ? (
        <ToolbarGridContainer container>
          {selectedRowIds?.length === 1 ? (
            <ToolbarGridItem item xs={6}>
              <FormOpenToggleButton title="Edit" ButtonIcon={Edit} />
            </ToolbarGridItem>
          ) : null}
          <ToolbarGridItem item xs={selectedRowIds?.length === 1 ? 6 : 12}>
            <ToolbarDeleteButton deleteVacationsData={deleteVacationsData} />
          </ToolbarGridItem>
        </ToolbarGridContainer>
      ) : (
        <ToolbarGridContainer container>
          <ToolbarGridItem item xs={6}>
            <ToolbarTitle toolbarFormMode={toolbarFormMode} />
          </ToolbarGridItem>
          <ToolbarGridItem item xs={6}>
            {formOpen ? (
              <FormOpenToggleButton title="Cancel" ButtonIcon={Cancel} buttonVariant="outlined" />
            ) : (
              <FormOpenToggleButton title="Create" ButtonIcon={Add} />
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
    </Box>
  );
};

export default TableToolbar;
