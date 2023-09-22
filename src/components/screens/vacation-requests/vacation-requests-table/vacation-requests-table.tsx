import { DataGrid } from "@mui/x-data-grid";
import { vacationRequestStatusesAtom } from "../../../../atoms/vacationRequestStatuses";
import { vacationRequestsAtom } from "../../../../atoms/vacationRequests";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { columns } from "./table-columns";
import { selectedRowIdsAtom } from "../../../../atoms/selectedRowIds";
import { rowsAtom } from "../../../../atoms/rows";
import VacationRequestsSkeletonTable from "./skeleton-table/skeleton-table";
import TableToolbar from "./table-toolbar";
import { DataGridRow } from "../../../../types";
import { DateTime } from "luxon";
import { languageAtom } from "../../../../atoms/languageAtom";

/**
 * Vacation requests table root component, display a table of vacation requests
 *
 */
const VacationRequestsTable = () => {
  const vacationRequests = useAtomValue(vacationRequestsAtom);
  const vacationRequestStatuses = useAtomValue(vacationRequestStatusesAtom);
  const [rows, setRows] = useAtom(rowsAtom);
  const setSelectedRowIds = useSetAtom(selectedRowIdsAtom);
  const containerRef = useRef(null);
  const language = useAtomValue(languageAtom);

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
          updatedAt: DateTime.fromJSDate(vacationRequest.updatedAt)
            .setLocale(language)
            .toLocaleString(),
          startDate: DateTime.fromJSDate(vacationRequest.startDate)
            .setLocale(language)
            .toLocaleString(),
          endDate: DateTime.fromJSDate(vacationRequest.endDate)
            .setLocale(language)
            .toLocaleString(),
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
        height: "631px",
        width: "100%"
      }}
      ref={containerRef}
    >
      {rows.length ? (
        <>
          <TableToolbar />
          <DataGrid
            autoPageSize
            sx={{ height: "100%" }}
            onRowSelectionModelChange={(index) => {
              setSelectedRowIds(index);
            }}
            rows={rows}
            columns={columns}
            checkboxSelection
          />
        </>
      ) : (
        <VacationRequestsSkeletonTable />
      )}
    </Box>
  );
};

export default VacationRequestsTable;
