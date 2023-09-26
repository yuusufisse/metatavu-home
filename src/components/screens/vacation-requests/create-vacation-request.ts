import { useAtomValue, useSetAtom } from "jotai";
import { userProfileAtom } from "../../../atoms/auth";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { VacationData } from "../../../types";
import { VacationRequest, VacationRequestStatus } from "../../../generated/client";
import { hasAllPropsDefined } from "../../../utils/check-utils";
import CreateVacationRequestStatus from "./create-vacation-request-status";
import { Dispatch, SetStateAction } from "react";

/**
 * Interface describing Create Vacation Request Props
 */
interface CreateVacationRequestProps {
  vacationRequests: VacationRequest[];
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
  setVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
}
/**
 * Functional component for creating a new vacation request
 *
 * @props CreateVacationRequestProps
 * @returns createVacationRequest, function to create a new vacation request
 */
const CreateVacationRequest = (props: CreateVacationRequestProps) => {
  const {
    vacationRequestStatuses,
    setVacationRequestStatuses,
    vacationRequests,
    setVacationRequests
  } = props;
  const { vacationRequestsApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const { createVacationRequestStatus } = CreateVacationRequestStatus({
    vacationRequestStatuses: vacationRequestStatuses,
    setVacationRequestStatuses: setVacationRequestStatuses
  });

  /**
   * Create a vacation request
   *
   * @param vacationData vacation data, data for vacation request
   */
  const createVacationRequest = async (vacationData: VacationData) => {
    if (!userProfile || !userProfile.id) return;

    try {
      const tempVacationRequest = {
        personId: userProfile.id,
        createdBy: userProfile.id,
        startDate: vacationData.startDate?.toJSDate(),
        endDate: vacationData.endDate?.toJSDate(),
        type: vacationData.type,
        message: vacationData.message,
        createdAt: new Date(),
        updatedAt: new Date(),
        days: vacationData.days
      };

      if (hasAllPropsDefined(tempVacationRequest)) {
        const vacationRequest = <VacationRequest>tempVacationRequest;
        const createdRequest = await vacationRequestsApi.createVacationRequest({
          vacationRequest: vacationRequest
        });

        createVacationRequestStatus(createdRequest);
        setVacationRequests([createdRequest, ...vacationRequests]);
      }
    } catch (error) {
      setError(`${"Creating vacation request has failed."}, ${error}`);
    }
  };
  return { createVacationRequest };
};

export default CreateVacationRequest;
