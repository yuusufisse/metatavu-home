import { DataGrid, GridRowId, GridRowSelectionModel } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";
import { Box, styled } from "@mui/material";
import TableToolbar from "./vacation-requests-table-toolbar/vacation-requests-table-toolbar";
import { VacationsDataGridRow, VacationData } from "src/types";
import SkeletonTableRows from "./skeleton-table-rows/skeleton-table-rows";
import { languageAtom } from "src/atoms/language";
import { useAtomValue } from "jotai";
import VacationRequestsTableColumns from "./vacation-requests-table-columns";
import strings from "src/localization/strings";
import { Inventory } from "@mui/icons-material";
import {
  allVacationRequestsAtom,
  allVacationRequestStatusesAtom,
  vacationRequestsAtom,
  vacationRequestStatusesAtom
} from "src/atoms/vacation";
import {
  VacationRequest,
  VacationRequestStatus,
  VacationRequestStatuses
} from "src/generated/client";
import { getVacationRequestStatusColor } from "src/utils/vacation-status-utils";
import UserRoleUtils from "src/utils/user-role-utils";
import { DateTime } from "luxon";
import LocalizationUtils from "src/utils/localization-utils";
import { getVacationRequestPersonFullName } from "src/utils/vacation-request-utils";
import { personsAtom } from "src/atoms/person";
import { userProfileAtom } from "src/atoms/auth";

/**
 * Component properties
 */
interface Props {
  deleteVacationRequests: (
    selectedRowIds: GridRowId[],
    rows: VacationsDataGridRow[]
  ) => Promise<void>;
  createVacationRequest: (vacationData: VacationData) => Promise<void>;
  updateVacationRequest: (vacationData: VacationData, vacationRequestId: string) => Promise<void>;
  loading: boolean;
  updateVacationRequestStatuses: (
    buttonType: VacationRequestStatuses,
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
  const adminMode = UserRoleUtils.adminMode();
  const vacationRequests = useAtomValue(adminMode ? allVacationRequestsAtom : vacationRequestsAtom);
  const vacationRequestStatuses = useAtomValue(
    adminMode ? allVacationRequestStatusesAtom : vacationRequestStatusesAtom
  );
  const containerRef = useRef(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [rows, setRows] = useState<VacationsDataGridRow[]>([]);
  const language = useAtomValue(languageAtom);
  const columns = VacationRequestsTableColumns();
  const persons = useAtomValue(personsAtom);
  const userProfile = useAtomValue(userProfileAtom);
  const dataGridHeight = 700;
  const dataGridRowHeight = 52;
  const dataGridColumnHeaderHeight = 56;

  /**
   * Create a single vacation request data grid row
   *
   * @param vacationRequest vacation request
   * @returns dataGridRow
   */
  const createDataGridRow = (vacationRequest: VacationRequest) => {
    const row: VacationsDataGridRow = {
      id: vacationRequest.id,
      type: LocalizationUtils.getLocalizedVacationRequestType(vacationRequest.type),
      personFullName: vacationRequest.personId ?? strings.vacationRequest.noPersonFullName,
      updatedAt: DateTime.fromJSDate(vacationRequest.updatedAt),
      startDate: DateTime.fromJSDate(vacationRequest.startDate),
      endDate: DateTime.fromJSDate(vacationRequest.endDate),
      days: vacationRequest.days,
      message: strings.vacationRequest.noMessage,
      status: VacationRequestStatuses.PENDING
    };

    return row;
  };

  /**
   * Create vacation requests data grid rows
   *
   * @param vacationRequest vacation request
   * @param vacationRequestStatuses vacation request statuses
   */
  const createDataGridRows = (
    vacationRequests: VacationRequest[],
    vacationRequestStatuses: VacationRequestStatus[]
  ) => {
    const rows: VacationsDataGridRow[] = [];
    if (vacationRequests.length) {
      vacationRequests.forEach((vacationRequest) => {
        const row = createDataGridRow(vacationRequest);

        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            row.status = vacationRequestStatus.status;
          }
        });

        if (vacationRequest.message.length) {
          row.message = vacationRequest.message;
        }

        if (vacationRequest.personId) {
          row.personFullName = getVacationRequestPersonFullName(
            vacationRequest,
            persons,
            userProfile
          );
        }

        rows.push(row);
      });
    }
    return rows;
  };

  useMemo(() => {
    setSelectedRowIds([]);
  }, [updateVacationRequestStatuses, deleteVacationRequests]);

  /**
   * Set data grid rows
   */
  useMemo(() => {
    setRows(createDataGridRows(vacationRequests, vacationRequestStatuses));
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
            sortModel: [{ field: "updatedAt", sort: "asc" }]
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
