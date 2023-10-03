import { useAtomValue, useSetAtom } from "jotai";
import { userProfileAtom } from "../../../atoms/auth";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import {
  VacationRequest,
  VacationRequestStatus,
  VacationRequestStatuses
} from "../../../generated/client";
import { Dispatch, SetStateAction } from "react";

/**
 * Component properties
 */
interface Props {
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
}

/**
 * Create vacation request status
 *
 * @param props component properties
 * @returns createVacationRequestStatus
 */
const CreateVacationRequestStatus = ({
  vacationRequestStatuses,
  setVacationRequestStatuses
}: Props) => {
  const { vacationRequestStatusApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);

  const createVacationRequestStatus = async (createdRequest: VacationRequest) => {
    if (!userProfile || !userProfile.id) return;

    try {
      if (createdRequest.id) {
        const createdStatus = await vacationRequestStatusApi.createVacationRequestStatus({
          id: createdRequest.id,
          vacationRequestStatus: {
            vacationRequestId: createdRequest.id,
            status: VacationRequestStatuses.PENDING,
            message: createdRequest.message,
            createdAt: new Date(),
            createdBy: userProfile.id,
            updatedAt: new Date(),
            updatedBy: userProfile.id
          }
        });

        setVacationRequestStatuses([createdStatus, ...vacationRequestStatuses]);
      }
    } catch (error) {
      setError(`${"Creating vacation request status has failed."}, ${error}`);
    }
  };
  return { createVacationRequestStatus };
};

export default CreateVacationRequestStatus;
