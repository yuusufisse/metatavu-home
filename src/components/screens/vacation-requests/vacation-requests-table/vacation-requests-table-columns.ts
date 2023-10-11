import { GridColDef } from "@mui/x-data-grid";
import strings from "../../../../localization/strings";

const VacationRequestsTableColumns = () => {
  /**
   * Define columns for data grid
   */
  const columns: GridColDef[] = [
    {
      field: "type",
      headerName: strings.vacationRequest.type,
      width: 150,
      editable: false
    },
    {
      field: "updatedAt",
      headerName: strings.vacationRequest.updatedAt,
      width: 150,
      editable: false
    },
    {
      field: "startDate",
      headerName: strings.vacationRequest.startDate,
      width: 150,
      editable: false
    },
    {
      field: "endDate",
      headerName: strings.vacationRequest.endDate,
      width: 150,
      editable: false
    },
    {
      field: "days",
      headerName: strings.vacationRequest.days,
      width: 80,
      editable: false
    },
    {
      field: "message",
      headerName: strings.vacationRequest.message,
      width: 180,
      editable: false
    },
    {
      field: "status",
      headerName: strings.vacationRequest.status,
      width: 150,
      editable: false
    }
  ];
  return { columns };
};

export default VacationRequestsTableColumns;
