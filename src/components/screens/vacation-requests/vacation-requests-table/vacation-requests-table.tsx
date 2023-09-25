import { DataGrid } from "@mui/x-data-grid";
import { useSetAtom } from "jotai";
import { useRef } from "react";
import { Box } from "@mui/material";
import { columns } from "./vacation-requests-table-columns";
import { selectedRowIdsAtom } from "../../../../atoms/selectedRowIds";
import VacationRequestsSkeletonTable from "./skeleton-table/skeleton-table";
import TableToolbar from "./vacation-requests-table-toolbar";
import VacationRequestsTableRows from "./vacation-requests-table-rows";

/**
 * Vacation requests table root component, display a table of vacation requests
 *
 */
const VacationRequestsTable = () => {
  const setSelectedRowIds = useSetAtom(selectedRowIdsAtom);
  const containerRef = useRef(null);
  const rows = VacationRequestsTableRows();

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
