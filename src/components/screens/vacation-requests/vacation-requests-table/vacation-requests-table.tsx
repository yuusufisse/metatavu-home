import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { vacationRequestStatusesAtom } from "../../../../atoms/vacationRequestStatuses";
import { vacationRequestsAtom } from "../../../../atoms/vacationRequests";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { columns } from "./vacation-requests-table-columns";
import VacationRequestsTableToolbar from "./vacation-requests-table-toolbar";

/**
 * Table to display vacation requests
 */
function VacationRequestsTable() {
  const vacationRequests = useAtomValue(vacationRequestsAtom);
  const vacationRequestStatuses = useAtomValue(vacationRequestStatusesAtom);
  const [rows, setRows] = useState<object[]>([]);
  const [pageSize] = useState<number>(10);
  const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
  const containerRef = useRef(null);

  useEffect(() => {
    createRows();
  }, [vacationRequests, vacationRequestStatuses]);

  /**
   * Create vacation requests table rows
   */
  const createRows = () => {
    if (vacationRequests && vacationRequestStatuses) {
      const tempRows: object[] = [];
      vacationRequests.forEach((vacationRequest, index) => {
        const row = {
          id: index,
          type: vacationRequest.type,
          startDate: vacationRequest.startDate.toDateString(),
          endDate: vacationRequest.endDate.toDateString(),
          days: vacationRequest.days,
          status: "No Status"
        };
        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            row.status = vacationRequestStatus.status;
          }
        });
        tempRows.push(row);
      });
      setRows(tempRows);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 370,
        width: "100%"
      }}
      ref={containerRef}
    >
      <VacationRequestsTableToolbar selectedRows={selectedRows} />
      <DataGrid
        onRowSelectionModelChange={(id) => {
          setSelectedRows(id);
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize
            }
          }
        }}
        pageSizeOptions={[pageSize]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default VacationRequestsTable;
