import { GridColDef } from "@mui/x-data-grid";
import strings from "../../localization/strings";
import { DateTime } from "luxon";
import { useAtomValue } from "jotai";
import { languageAtom } from "../../atoms/language";

/**
 * Vacation requests table columns component
 */
const VacationRequestsTableColumns = () => {
  const language = useAtomValue(languageAtom);

  /**
   * Format date
   *
   * @param date datetime object
   * @param dateWithTime datetime object with time
   * @returns formatted date time
   */
  function formatDate(date: DateTime, dateWithTime?: boolean) {
    if (!date) return "";
    return date
      .setLocale(language)
      .toLocaleString(dateWithTime ? DateTime.DATETIME_SHORT : undefined);
  }

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
      renderCell: (params) => formatDate(params.row?.updatedAt, true),
      width: 180,
      editable: false
    },
    {
      field: "startDate",
      headerName: strings.vacationRequest.startDate,
      renderCell: (params) => formatDate(params.row?.startDate),
      width: 150,
      editable: false
    },
    {
      field: "endDate",
      headerName: strings.vacationRequest.endDate,
      renderCell: (params) => formatDate(params.row?.endDate),
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
  return columns;
};

export default VacationRequestsTableColumns;
