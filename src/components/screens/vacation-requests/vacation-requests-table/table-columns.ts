import { GridColDef } from "@mui/x-data-grid";

export const columns: GridColDef[] = [
  {
    field: "type",
    headerName: "Vacation Type",
    width: 150,
    editable: false
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 150,
    editable: false
  },
  {
    field: "endDate",
    headerName: "End Date",
    width: 150,
    editable: false
  },
  {
    field: "days",
    headerName: "Duration(days)",
    width: 150,
    editable: false
  },
  {
    field: "message",
    headerName: "Message",
    width: 150,
    editable: false
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    editable: false
  }
];
