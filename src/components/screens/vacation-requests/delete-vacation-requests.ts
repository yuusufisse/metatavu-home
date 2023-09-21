import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { vacationRequestsAtom } from "../../../atoms/vacationRequests";
import { rowsAtom } from "../../../atoms/rows";
import { selectedRowIdsAtom } from "../../../atoms/selectedRowIds";
import { vacationRequestStatusesAtom } from "../../../atoms/vacationRequestStatuses";
import { VacationRequest, VacationRequestStatus } from "../../../generated/client";

/**
 * Delete vacation requests, a functional component for deleting a vacation request
 *
 * @returns deleteVacationRequests, function to delete vacation requests
 */
const DeleteVacationRequests = () => {
  const { vacationRequestsApi } = useApi();
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const [vacationRequestStatuses, setVacationRequestStatuses] = useAtom(
    vacationRequestStatusesAtom
  );
  const setError = useSetAtom(errorAtom);
  const rows = useAtomValue(rowsAtom);
  const selectedRowIds = useAtomValue(selectedRowIdsAtom);

  /**
   * Delete selected rows containing vacation requests and statuses
   */
  const deleteRows = () => {
    if (rows.length && vacationRequests && vacationRequestStatuses) {
      let tempVacationRequests: VacationRequest[] = vacationRequests;
      let tempVacationRequestStatuses: VacationRequestStatus[] = vacationRequestStatuses;

      selectedRowIds.forEach((selectedRow) => {
        rows.forEach((row) => {
          if (row.id === selectedRow) {
            tempVacationRequests = tempVacationRequests.filter(
              (vacationRequest) => vacationRequest.id !== row.id
            );
            tempVacationRequestStatuses = tempVacationRequestStatuses.filter(
              (vacationRequestStatus) => vacationRequestStatus.vacationRequestId !== row.id
            );
          }
        });
      });
      setVacationRequests(tempVacationRequests);
      setVacationRequestStatuses(tempVacationRequestStatuses);
    }
  };

  /**
   * Delete vacation requests
   *
   * @param id id updated vacation request
   * @param index index of request in list
   */
  const deleteVacationRequests = async () => {
    if (vacationRequests && selectedRowIds.length) {
      await Promise.all(
        selectedRowIds.map(async (selectedRow) => {
          try {
            await vacationRequestsApi.deleteVacationRequest({
              id: String(selectedRow)
            });
            deleteRows();
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
