import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { userProfileAtom } from "../../../atoms/auth";
import { NewVacation } from "../../../types/data-types";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { vacationRequestsAtom } from "../../../atoms/vacationRequests";

/**
 * Functional component for creating a new vacation request
 *
 */
const CreateVacationRequest = () => {
  const { vacationRequestsApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const setError = useSetAtom(errorAtom);

  /**
   * Handle vacation apply button
   * Sends vacation request to database
   */
  const createVacationRequest = async (newVacation: NewVacation) => {
    if (!userProfile || !userProfile.id) return;

    try {
      const createdRequest = await vacationRequestsApi.createVacationRequest({
        vacationRequest: {
          personId: userProfile.id,
          createdBy: userProfile.id,
          startDate: newVacation.startDate,
          endDate: newVacation.endDate,
          type: newVacation.type,
          message: newVacation.message,
          createdAt: new Date(),
          updatedAt: new Date(),
          days: newVacation.days
        }
      });

      setVacationRequests([...vacationRequests, createdRequest]);
      // createVacationRequestStatus(createdRequest.id);
    } catch (error) {
      setError(`${"Creating vacation request has failed."}, ${error}`);
    }
  };
  return { createVacationRequest };
};

export default CreateVacationRequest;
