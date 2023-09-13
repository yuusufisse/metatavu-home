import { DataGrid } from '@mui/x-data-grid';
import { vacationRequestStatusesAtom } from '../../../../atoms/vacationRequestStatuses';
import { vacationRequestsAtom } from '../../../../atoms/vacationRequests';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { columns } from './vacation-requests-table-columns';

/**
 * Table to display vacation requests
 */
function VacationRequestsTable() {
  const vacationRequests = useAtomValue(vacationRequestsAtom);
  const vacationRequestStatuses = useAtomValue(vacationRequestStatusesAtom);
  const [ rows, setRows ] = useState<object[]>([]);
  const [ pageSize ] = useState<number>(10);

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
        }
        vacationRequestStatuses.forEach(vacationRequestStatus => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            row.status = vacationRequestStatus.status;
          }
        });
        tempRows.push(row);
      });
      setRows(tempRows);
    }
  }

  useEffect(() => {
    createRows();
  },[ vacationRequests, vacationRequestStatuses ])

  return (
    <Box sx={{ minHeight: 370, width: '100%' }}>
      <DataGrid
        rows={ rows }
        columns={ columns }
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
            },
          },
        }}
        pageSizeOptions={[ pageSize ]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default VacationRequestsTable;