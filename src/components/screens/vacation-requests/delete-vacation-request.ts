import { useAtom, useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { useEffect } from "react";
import { vacationRequestsAtom } from "../../../atoms/vacationRequests";

interface DeleteVacationRequestProps {
  id: string;
  index: number;
}

/**
 * Functional component for a deleting vacation request
 */
function DeleteVacationRequest(props: DeleteVacationRequestProps) {
  const { id, index } = props;
  const { vacationRequestsApi } = useApi();
  const [vacationRequests, setVacationsRequests] = useAtom(vacationRequestsAtom);
  const setError = useSetAtom(errorAtom);

  useEffect(() => {
    if (vacationRequests) {
      deleteRequest();
    }
  }, [id && index]);

  /**
   * Method to delete vacation request
   *
   * @param id id updated vacation request
   * @param index index of request in list
   */
  const deleteRequest = async () => {
    try {
      await vacationRequestsApi.deleteVacationRequest({ id: id });
    } catch (error) {
      setError(`${"Deleting vacation request has failed."}, ${error}`);
    }

    if (vacationRequests) {
      setVacationsRequests(vacationRequests.filter((request) => request.id !== id));

      handleEdit(index);
    }
  };
  return {};
}

export default DeleteVacationRequest;
