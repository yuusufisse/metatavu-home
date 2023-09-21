import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { userProfileAtom } from "../../../atoms/auth";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { vacationRequestsAtom } from "../../../atoms/vacationRequests";
import { VacationData } from "../../../types";
import { VacationRequest } from "../../../generated/client";
import { nullCheckObjectProps } from "../../../utils/null-check-utils";

/**
 * Functional component for creating a new vacation request
 *
 * @returns createVacationRequest, function to create a new vacation request
 */
const CreateVacationRequest = () => {
  const { vacationRequestsApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const setError = useSetAtom(errorAtom);
  // const { createVacationRequestStatus } = CreateVacationRequestStatus();

  /**
   * Create vacation request
   *
   * @param vacationData vacation data, data for vacation request
   */
  const createVacationRequest = async (vacationData: VacationData) => {
    if (!userProfile || !userProfile.id) return;

    try {
      const tempVacationRequest = {
        personId: userProfile.id,
        createdBy: userProfile.id,
        startDate: vacationData.startDate,
        endDate: vacationData.endDate,
        type: vacationData.type,
        message: vacationData.message,
        createdAt: new Date(),
        updatedAt: new Date(),
        days: vacationData.days
      };

      const propsAreValid = nullCheckObjectProps(tempVacationRequest);

      if (propsAreValid) {
        const vacationRequest = <VacationRequest>tempVacationRequest;
        const createdRequest = await vacationRequestsApi.createVacationRequest({
          vacationRequest: vacationRequest
        });

        setVacationRequests([...vacationRequests, createdRequest]);
        // createVacationRequestStatus(createdRequest.id);
      }
    } catch (error) {
      setError(`${"Creating vacation request has failed."}, ${error}`);
    }
  };
  return { createVacationRequest };
};

export default CreateVacationRequest;
