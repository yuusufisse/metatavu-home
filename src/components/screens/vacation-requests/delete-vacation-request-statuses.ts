import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { vacationRequestStatusesAtom } from "../../../atoms/vacationRequestStatuses";
import { errorAtom } from "../../../atoms/error";
import { selectedRowIdsAtom } from "../../../atoms/selectedRowIds";
import { rowsAtom } from "../../../atoms/rows";
import { VacationRequestStatus } from "../../../generated/client";

/**
 * Delete vacation requests, a functional component for deleting a vacation request
 *
 * @returns deleteVacationRequests, function to delete vacation requests
 */
const DeleteVacationRequestStatuses = () => {
  const { vacationRequestStatusApi } = useApi();
  const [vacationRequestStatuses, setVacationRequestStatuses] = useAtom(
    vacationRequestStatusesAtom
  );
  const setError = useSetAtom(errorAtom);
  const selectedRowIds = useAtomValue(selectedRowIdsAtom);
  const rows = useAtomValue(rowsAtom);

  /**
   * Delete selected vacation requests from vacation requests statuses atom
   */
  const deleteVacationRequestStatusRows = () => {
    if (rows.length && vacationRequestStatuses) {
      let tempVacationRequestStatuses: VacationRequestStatus[] = vacationRequestStatuses;

      selectedRowIds.forEach((selectedRow) => {
        rows.forEach((row) => {
          if (row.id === selectedRow) {
            tempVacationRequestStatuses = tempVacationRequestStatuses.filter(
              (vacationRequestStatus) => vacationRequestStatus.vacationRequestId !== row.id
            );
          }
        });
      });
      setVacationRequestStatuses(tempVacationRequestStatuses);
    }
  };

  /**
   * Delete vacation request statuses
   */
  const deleteVacationRequestStatuses = async () => {
    if (vacationRequestStatuses.length && selectedRowIds.length) {
      await Promise.all(
        vacationRequestStatuses.map(async (vacationRequestStatus) => {
          await Promise.all(
            selectedRowIds.map(async (selectedRow) => {
              if (
                selectedRow === vacationRequestStatus.vacationRequestId &&
                vacationRequestStatus.id
              ) {
                try {
                  await vacationRequestStatusApi.deleteVacationRequestStatus({
                    id: vacationRequestStatus.id,
                    statusId: vacationRequestStatus.id
                  });
                  deleteVacationRequestStatusRows();
                } catch (error) {
                  setError(`${"Deleting vacation request statuses has failed"}, ${error}`);
                }
              }
            })
          );
        })
      );
    }
  };
  return { deleteVacationRequestStatuses };
};

export default DeleteVacationRequestStatuses;
