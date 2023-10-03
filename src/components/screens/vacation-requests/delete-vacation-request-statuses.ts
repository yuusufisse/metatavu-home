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
   * Delete selected vacation requests from vacation requests statuses atom
   */
  const deleteVacationRequestStatusRows = () => {
    if (rows.length && vacationRequestStatuses && selectedRowIds) {
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
    if (vacationRequestStatuses.length && selectedRowIds) {
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
