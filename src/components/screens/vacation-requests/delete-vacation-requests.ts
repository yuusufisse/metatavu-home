import { useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { VacationRequest, VacationRequestStatus } from "../../../generated/client";
import { Dispatch, SetStateAction } from "react";
import { GridRowId } from "@mui/x-data-grid";
import { DataGridRow } from "../../../types";

/**
 * Component properties
 */
interface DeleteVacationRequestsProps {
  vacationRequests: VacationRequest[];
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
  selectedRowIds: GridRowId[] | undefined;
  rows: DataGridRow[];
}

/**
 * Delete vacation requests functional component
 *
 * @param props DeleteVacationRequestsProps
 * @returns deleteVacationRequests
 */
const DeleteVacationRequests = ({
  vacationRequests,
  setVacationRequests,
  vacationRequestStatuses,
  selectedRowIds,
  rows
}: DeleteVacationRequestsProps) => {
  const { vacationRequestsApi } = useApi();
  const setError = useSetAtom(errorAtom);

  /**
   * Delete vacation requests from data grid rows
   */
  const deleteVacationRequestRows = () => {
    if (rows.length && vacationRequests && vacationRequestStatuses && selectedRowIds) {
      let tempVacationRequests: VacationRequest[] = vacationRequests;

      selectedRowIds.forEach((selectedRow) => {
        rows.forEach((row) => {
          if (row.id === selectedRow) {
            tempVacationRequests = tempVacationRequests.filter(
              (vacationRequest) => vacationRequest.id !== row.id
            );
          }
        });
      });
      setVacationRequests(tempVacationRequests);
    }
  };

  /**
   * Delete vacation requests
   */
  const deleteVacationRequests = async () => {
    if (vacationRequests && selectedRowIds) {
      await Promise.all(
        selectedRowIds.map(async (selectedRow) => {
          try {
            await vacationRequestsApi.deleteVacationRequest({
              id: String(selectedRow)
            });
            deleteVacationRequestRows();
          } catch (error) {
            setError(`${"Deleting vacation request has failed."}, ${error}`);
          }
        })
      );
    }
  };

  return { deleteVacationRequests };
};

export default DeleteVacationRequests;
