import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { vacationRequestsAtom } from "../../../atoms/vacationRequests";
import { rowsAtom } from "../../../atoms/rows";
import { selectedRowIdsAtom } from "../../../atoms/selectedRowIds";
import { vacationRequestStatusesAtom } from "../../../atoms/vacationRequestStatuses";
import { VacationRequest } from "../../../generated/client";

/**
 * Delete vacation requests, a functional component for deleting a vacation request
 *
 * @returns deleteVacationRequests, function to delete vacation requests
 */
const DeleteVacationRequests = () => {
  const { vacationRequestsApi } = useApi();
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const [vacationRequestStatuses] = useAtom(vacationRequestStatusesAtom);
  const setError = useSetAtom(errorAtom);
  const rows = useAtomValue(rowsAtom);
  const selectedRowIds = useAtomValue(selectedRowIdsAtom);

  /**
   * Delete selected vacation requests from vacation requests atom
   */
  const deleteVacationRequestRows = () => {
    if (rows.length && vacationRequests && vacationRequestStatuses) {
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
    if (vacationRequests && selectedRowIds.length) {
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
