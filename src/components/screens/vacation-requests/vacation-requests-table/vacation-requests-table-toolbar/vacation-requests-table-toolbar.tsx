import { Add, Cancel, Edit } from "@mui/icons-material";
import { Box, Collapse, Grid, Typography, styled } from "@mui/material";
import { ComponentType, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import DeleteVacationRequests from "../../delete-vacation-requests";
import TableForm from "../vacation-requests-table-form";
import DeleteVacationRequestStatuses from "../../delete-vacation-request-statuses";
import { VacationRequest, VacationRequestStatus } from "../../../../../generated/client";
import { GridRowId } from "@mui/x-data-grid";
import { ButtonIconProps, DataGridRow } from "../../../../../types";
import GenericToggleButton from "../../../../generics/generic-toggle-button";
import DeleteButton from "./delete-button";

/**
 * Enum describing table form modes
 */
enum tableFormMode {
  CREATE = "CREATE",
  EDIT = "EDIT",
  NONE = "NONE"
}

/**
 * Interface describing Table Toolbar Props
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
 * Table tool bar component, provides functionality to alter vacation requests table
 *
 * @props TableToolbarProps
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
  // const [formEditMode, setFormEditMode] = useState<tableFormMode>(tableFormMode.NONE);
  const { deleteVacationRequests } = DeleteVacationRequests({
    vacationRequests: vacationRequests,
    setVacationRequests: setVacationRequests,
    vacationRequestStatuses: vacationRequestStatuses,
    selectedRowIds: selectedRowIds
  });
  const { deleteVacationRequestStatuses } = DeleteVacationRequestStatuses({
    setVacationRequestStatuses: setVacationRequestStatuses,
    vacationRequestStatuses: vacationRequestStatuses,
    selectedRowIds: selectedRowIds,
    rows: rows
  });

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

  const handleFormMode = (mode: tableFormMode) => {
    if (mode === tableFormMode.CREATE) {
    } else if (mode === tableFormMode.EDIT) {
    } else {
    }
  };

  /**
   * Interface describing FormOpen Toggle Button properties
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

  const ToolbarTitle = () => {
    return <Typography variant="h5">My Vacation Requests</Typography>;
  };

  const ToolbarGridItem = styled(Grid)({
    padding: "10px"
  });

  const ToolbarGridContainer = styled(Grid)({
    alignContent: "space-around",
    alignItems: "center"
  });

  return (
    <Box
      sx={{
        border: "1px solid lightgrey",
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
            <DeleteButton deleteVacationsData={deleteVacationsData} />
          </ToolbarGridItem>
        </ToolbarGridContainer>
      ) : (
        <ToolbarGridContainer container>
          <ToolbarGridItem item xs={6}>
            <ToolbarTitle />
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
        <TableForm
          vacationRequests={vacationRequests}
          setVacationRequests={setVacationRequests}
          setFormOpen={setFormOpen}
          setVacationRequestStatuses={setVacationRequestStatuses}
          vacationRequestStatuses={vacationRequestStatuses}
        />
      </Collapse>
    </Box>
  );
};

export default TableToolbar;
