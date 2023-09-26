import { useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { VacationRequest, VacationRequestStatus } from "../../../generated/client";
import { Dispatch, SetStateAction } from "react";
import { GridRowId } from "@mui/x-data-grid";
import { DataGridRow } from "../../../types";

/**
 * Interface describing Delete Vacation Requests Props
 */
interface DeleteVacationRequestsProps {
  vacationRequests: VacationRequest[];
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
  selectedRowIds: GridRowId[] | undefined;
  rows: DataGridRow[];
}
/**
 * Delete vacation requests, a functional component for deleting a vacation request
 *
 * @props DeleteVacationRequestsProps
 * @returns deleteVacationRequests, function to delete vacation requests
 */
const DeleteVacationRequests = (props: DeleteVacationRequestsProps) => {
  const { vacationRequests, setVacationRequests, vacationRequestStatuses, selectedRowIds, rows } =
    props;
  const { vacationRequestsApi } = useApi();
  const setError = useSetAtom(errorAtom);

  /**
   * Delete selected vacation requests from vacation requests atom
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
