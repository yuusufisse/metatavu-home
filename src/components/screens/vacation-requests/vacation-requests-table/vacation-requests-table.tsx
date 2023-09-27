import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { columns } from "./vacation-requests-table-columns";
import VacationRequestsSkeletonTable from "./skeleton-table/skeleton-table";
import TableToolbar from "./vacation-requests-table-toolbar/vacation-requests-table-toolbar";
import VacationRequestsTableRows from "./vacation-requests-table-rows";
import { VacationRequest, VacationRequestStatus } from "../../../../generated/client";
import { DataGridRow } from "../../../../types";

/**
 * Component properties
 */
interface VacationRequestsTableProps {
  vacationRequests: VacationRequest[];
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
  setVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
}
/**
 * Vacation requests table component
 *
 * @props VacationRequestsTableProps
 */
const VacationRequestsTable = (props: VacationRequestsTableProps) => {
  const {
    vacationRequests,
    vacationRequestStatuses,
    setVacationRequests,
    setVacationRequestStatuses
  } = props;
  const containerRef = useRef(null);
  const [rows, setRows] = useState<DataGridRow[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const { createDataGridRows } = VacationRequestsTableRows();

  /**
   * Set data grid rows
   */
  useEffect(() => {
    if (vacationRequests.length) {
      const createdRows = createDataGridRows(vacationRequests, vacationRequestStatuses);
      if (createdRows) {
        setRows(createdRows);
      }
    }
  }, [vacationRequests, vacationRequestStatuses, formOpen]);

  return (
    <Box
      sx={{
        height: "631px",
        width: "100%"
      }}
      ref={containerRef}
    >
      {rows.length ? (
        <>
          <TableToolbar
            vacationRequests={vacationRequests}
            setVacationRequests={setVacationRequests}
            setVacationRequestStatuses={setVacationRequestStatuses}
            vacationRequestStatuses={vacationRequestStatuses}
            setFormOpen={setFormOpen}
            formOpen={formOpen}
            selectedRowIds={selectedRowIds}
            rows={rows}
          />
          <DataGrid
            autoPageSize
            sx={{ height: "100%" }}
            onRowSelectionModelChange={(index) => {
              setSelectedRowIds(index);
            }}
            rows={rows}
            columns={columns}
            checkboxSelection
            rowSelectionModel={selectedRowIds}
            isRowSelectable={() => (formOpen ? false : true)}
          />
        </>
      ) : (
        <VacationRequestsSkeletonTable />
      )}
    </Box>
  );
};

export default VacationRequestsTable;
