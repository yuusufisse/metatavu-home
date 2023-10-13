import { DataGrid, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";
import { Box } from "@mui/material";
import TableToolbar from "./vacation-requests-table-toolbar/vacation-requests-table-toolbar";
import VacationRequestsTableRows from "./vacation-requests-table-rows";
import { DataGridRow, VacationData } from "../../../../types";
import SkeletonTableRows from "./skeleton-table-rows/skeleton-table-rows";
import { languageAtom } from "../../../../atoms/languageAtom";
import { useAtomValue } from "jotai";
import { vacationRequestsAtom } from "../../../../atoms/vacationRequests";
import { vacationRequestStatusesAtom } from "../../../../atoms/vacationRequestStatuses";
import VacationRequestsTableColumns from "./vacation-requests-table-columns";
import { VacationRequestStatuses } from "../../../../generated/client";

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
  updateVacationRequestStatuses
}: Props) => {
  const vacationRequests = useAtomValue(vacationRequestsAtom);
  const vacationRequestStatuses = useAtomValue(vacationRequestStatusesAtom);
  const containerRef = useRef(null);
  const [rows, setRows] = useState<DataGridRow[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const { createDataGridRows } = VacationRequestsTableRows();
  const language = useAtomValue(languageAtom);
  const { columns } = VacationRequestsTableColumns();

  /**
   * Set data grid rows
   */
  useMemo(() => {
    if (vacationRequests.length) {
      const createdRows = createDataGridRows(vacationRequests, vacationRequestStatuses);
      if (createdRows) {
        setRows(createdRows);
      }
    }
  }, [vacationRequests, vacationRequestStatuses, formOpen, language]);

  return (
    <Box ref={containerRef}>
      <TableToolbar
        deleteVacationRequests={deleteVacationRequests}
        createVacationRequest={createVacationRequest}
        updateVacationRequest={updateVacationRequest}
        updateVacationRequestStatuses={updateVacationRequestStatuses}
        setFormOpen={setFormOpen}
        formOpen={formOpen}
        selectedRowIds={selectedRowIds}
        rows={rows}
      />
      <DataGrid
        sx={{ height: "700px" }}
        autoPageSize
        onRowSelectionModelChange={(index: GridRowSelectionModel) => {
          setSelectedRowIds(index);
        }}
        rows={rows}
        columns={columns}
        checkboxSelection
        rowSelectionModel={selectedRowIds}
        isRowSelectable={() => (formOpen ? false : true)}
        slots={{
          loadingOverlay: SkeletonTableRows
        }}
        loading={rows.length ? false : true}
      />
    </Box>
  );
};

export default VacationRequestsTable;
