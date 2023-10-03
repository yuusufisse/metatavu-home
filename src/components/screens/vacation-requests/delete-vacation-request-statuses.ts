import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { VacationRequestStatus } from "../../../generated/client";
import { Dispatch, SetStateAction } from "react";
import { GridRowId } from "@mui/x-data-grid";
import { DataGridRow } from "../../../types";
import { useSetAtom } from "jotai";

/**
 * Component properties
 */
interface Props {
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
  selectedRowIds: GridRowId[] | undefined;
  rows: DataGridRow[];
}

/**
 * Delete vacation requests functional component
 *
 * @param props component properties
 * @returns deleteVacationRequestStatuses
 */
const DeleteVacationRequestStatuses = ({
  vacationRequestStatuses,
  setVacationRequestStatuses,
  selectedRowIds,
  rows
}: Props) => {
  const { vacationRequestStatusApi } = useApi();
  const setError = useSetAtom(errorAtom);

  /**
   * Delete selected vacation requests from vacation requests statuses
   */
  const deleteVacationRequestStatusRows = () => {
    if (rows.length && vacationRequestStatuses && selectedRowIds) {
      let tempVacationRequestStatuses: VacationRequestStatus[] = [];
      selectedRowIds.forEach((selectedRowId) => {
        tempVacationRequestStatuses = vacationRequestStatuses.filter(
          (vacationRequestStatus) => vacationRequestStatus.vacationRequestId !== selectedRowId
        );
      });
      setVacationRequestStatuses(tempVacationRequestStatuses);
    }
  };

  /**
   * Delete vacation request statuses
   */
  const deleteVacationRequestStatuses = async () => {
    if (vacationRequestStatuses.length && selectedRowIds) {
      await Promise.all(
        selectedRowIds.map(async (selectedRowId): Promise<void> => {
          try {
            const foundVacationRequestStatus = vacationRequestStatuses.find(
              (vacationRequestStatus) => vacationRequestStatus.vacationRequestId === selectedRowId
            );
            if (foundVacationRequestStatus?.id) {
              await vacationRequestStatusApi.deleteVacationRequestStatus({
                id: foundVacationRequestStatus.id,
                statusId: foundVacationRequestStatus.id
              });
            }
            deleteVacationRequestStatusRows();
          } catch (error) {
            setError(`${"Deleting vacation request statuses has failed"}, ${error}`);
          }
        })
      );
    }
  };
  return { deleteVacationRequestStatuses };
};

export default DeleteVacationRequestStatuses;
