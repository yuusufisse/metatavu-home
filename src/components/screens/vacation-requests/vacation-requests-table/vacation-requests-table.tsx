import { DataGrid } from "@mui/x-data-grid";
import { vacationRequestStatusesAtom } from "../../../../atoms/vacationRequestStatuses";
import { vacationRequestsAtom } from "../../../../atoms/vacationRequests";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { columns } from "./table-columns";
import { selectedRowIdsAtom } from "../../../../atoms/selectedRowIds";
import { rowsAtom } from "../../../../atoms/rows";
import VacationRequestsSkeletonTable from "./skeleton-table/skeleton-table";
import TableToolbar from "./table-toolbar";
import { DataGridRow } from "../../../../types";

/**
 * Vacation requests table root component, display a table of vacation requests
 *
 */
const VacationRequestsTable = () => {
  const vacationRequests = useAtomValue(vacationRequestsAtom);
  const vacationRequestStatuses = useAtomValue(vacationRequestStatusesAtom);
  const [rows, setRows] = useAtom(rowsAtom);
  const setSelectedRowIds = useSetAtom(selectedRowIdsAtom);
  const [pageSize] = useState<number>(10);
  const containerRef = useRef(null);

  useEffect(() => {
    createRows();
  }, [vacationRequests, vacationRequestStatuses]);

  /**
   * Create vacation requests table rows
   */
  const createRows = () => {
    if (vacationRequests && vacationRequestStatuses) {
      const tempRows: DataGridRow[] = [];
      vacationRequests.forEach((vacationRequest) => {
        const row: DataGridRow = {
          id: vacationRequest.id,
          type: vacationRequest.type,
          startDate: vacationRequest.startDate.toDateString(),
          endDate: vacationRequest.endDate.toDateString(),
          days: vacationRequest.days,
          message: "No message",
          status: "No Status"
        };
        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            row.status = vacationRequestStatus.status;
          }
          if (vacationRequest.message.length) {
            row.message = vacationRequest.message;
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
      {rows.length ? (
        <>
          <TableToolbar />
          <DataGrid
            onRowSelectionModelChange={(index) => {
              setSelectedRowIds(index);
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
        </>
      ) : (
        <VacationRequestsSkeletonTable />
      )}
    </Box>
  );
};

export default VacationRequestsTable;
