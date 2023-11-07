import { DataGrid, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";
import { Box, styled } from "@mui/material";
import TableToolbar from "./vacation-requests-table-toolbar/vacation-requests-table-toolbar";
import VacationRequestsTableRows from "./vacation-requests-table-rows";
import { DataGridRow, VacationData } from "../../types";
import SkeletonTableRows from "./skeleton-table-rows/skeleton-table-rows";
import { languageAtom } from "../../atoms/language";
import { useAtomValue } from "jotai";
import VacationRequestsTableColumns from "./vacation-requests-table-columns";
import strings from "../../localization/strings";
import { Inventory } from "@mui/icons-material";
import { vacationRequestsAtom, vacationRequestStatusesAtom } from "../../atoms/vacation";
import { VacationRequestStatuses } from "../../generated/client";
import { getVacationRequestStatusColor } from "../../utils/vacation-status-utils";
import UserRoleUtils from "../../utils/user-role-utils";

/**
 * Component properties
 */
interface Props {
  deleteVacationRequests: (selectedRowIds: GridRowId[], rows: DataGridRow[]) => Promise<void>;
  createVacationRequest: (vacationData: VacationData) => Promise<void>;
  updateVacationRequest: (vacationData: VacationData, vacationRequestId: string) => Promise<void>;
  loading: boolean;
  updateVacationRequestStatuses: (
    newStatus: VacationRequestStatuses,
    selectedRowIds: GridRowId[]
  ) => Promise<void>;
}

/**
 * Vacation requests table component
 *
 * @param props component properties
 */
const VacationRequestsTable = ({
  deleteVacationRequests,
  createVacationRequest,
  updateVacationRequest,
  updateVacationRequestStatuses,
  loading
}: Props) => {
  const vacationRequests = useAtomValue(vacationRequestsAtom);
  const vacationRequestStatuses = useAtomValue(vacationRequestStatusesAtom);
  const containerRef = useRef(null);
  const [rows, setRows] = useState<DataGridRow[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const createDataGridRows = VacationRequestsTableRows();
  const language = useAtomValue(languageAtom);
  const columns = VacationRequestsTableColumns();
  const dataGridHeight = 700;
  const dataGridRowHeight = 52;
  const dataGridColumnHeaderHeight = 56;
  const adminMode = UserRoleUtils.adminMode();

  /**
   * Set data grid rows
   */
  useMemo(() => {
    if (vacationRequests.length && vacationRequestStatuses.length) {
      const createdRows = createDataGridRows(vacationRequests, vacationRequestStatuses);
      if (createdRows) {
        setRows(createdRows);
      }
    }
  }, [vacationRequests, vacationRequestStatuses, formOpen, language]);

  /**
   * Styled grid overlay component
   */
  const StyledGridOverlay = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  }));

  /**
   * Custom no rows overlay component
   */
  const CustomNoRowsOverlay = () => (
    <StyledGridOverlay>
      <Inventory />
      <Box sx={{ mt: 1 }}>{strings.dataGrid.noRows}</Box>
    </StyledGridOverlay>
  );

  /**
   * Custom skeleton table rows component
   */
  const CustomSkeletonTableRows = () => (
    <SkeletonTableRows
      dataGridHeight={dataGridHeight}
      dataGridRowHeight={dataGridRowHeight}
      dataGridColumnHeaderHeight={dataGridColumnHeaderHeight}
    />
  );

  return (
    <Box
      sx={{
        "& .APPROVED": {
          color: `${getVacationRequestStatusColor(VacationRequestStatuses.APPROVED)}`
        },
        "& .DECLINED": {
          color: `${getVacationRequestStatusColor(VacationRequestStatuses.DECLINED)}`
        },
        "& .PENDING": {
          color: `${getVacationRequestStatusColor(VacationRequestStatuses.PENDING)}`
        }
      }}
      ref={containerRef}
    >
      <TableToolbar
        deleteVacationRequests={deleteVacationRequests}
        createVacationRequest={createVacationRequest}
        updateVacationRequest={updateVacationRequest}
        updateVacationRequestStatuses={updateVacationRequestStatuses}
        setFormOpen={setFormOpen}
        formOpen={formOpen}
        selectedRowIds={selectedRowIds}
        rows={rows}
        setSelectedRowIds={setSelectedRowIds}
      />
      <DataGrid
        sx={{ height: dataGridHeight }}
        rowHeight={dataGridRowHeight}
        columnHeaderHeight={dataGridColumnHeaderHeight}
        autoPageSize
        onRowSelectionModelChange={(index: GridRowSelectionModel) => {
          setSelectedRowIds(index);
        }}
        rows={rows}
        loading={loading && !rows.length ? true : false}
        slots={{
          loadingOverlay: CustomSkeletonTableRows,
          noRowsOverlay: CustomNoRowsOverlay
        }}
        columns={columns}
        checkboxSelection
        rowSelectionModel={selectedRowIds}
        isRowSelectable={() => !formOpen}
        initialState={{
          sorting: {
            sortModel: adminMode
              ? [{ field: "updatedAt", sort: "asc" }]
              : [{ field: "updatedAt", sort: "desc" }]
          },
          filter: adminMode
            ? {
                filterModel: {
                  items: [{ field: "status", operator: "contains", value: "pending" }]
                }
              }
            : {}
        }}
      />
    </Box>
  );
};

export default VacationRequestsTable;
