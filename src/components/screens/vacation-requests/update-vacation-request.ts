import { useAtomValue, useSetAtom } from "jotai";
import { userProfileAtom } from "../../../atoms/auth";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { VacationData } from "../../../types";
import { VacationRequest } from "../../../generated/client";
import { Dispatch, SetStateAction } from "react";

/**
 * Component properties
 */
interface Props {
  vacationRequests: VacationRequest[];
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
}

/**
 * Update vacation request functional component
 *
 * @param props component properties
 * @returns updateVacationRequest
 */
const UpdateVacationRequest = ({ vacationRequests, setVacationRequests }: Props) => {
  const { vacationRequestsApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);

  /**
   * Create a vacation request
   *
   * @param vacationData vacation data, data for vacation request
   */
  const updateVacationRequest = async (
    vacationData: VacationData,
    vacationRequestId: string | undefined
  ) => {
    if (!userProfile || !userProfile.id) return;

    try {
      const vacationRequest = vacationRequests.find(
        (vacationRequest) => vacationRequest.id === vacationRequestId
      );
      if (
        vacationRequest &&
        vacationRequestId &&
        vacationData.startDate &&
        vacationData.endDate &&
        vacationData.type &&
        vacationData.message &&
        vacationData.days
      ) {
        const updatedRequest = await vacationRequestsApi.updateVacationRequest({
          id: vacationRequestId,
          vacationRequest: {
            ...vacationRequest,
            startDate: vacationData.startDate.toJSDate(),
            endDate: vacationData.endDate.toJSDate(),
            type: vacationData.type,
            message: vacationData.message,
            updatedAt: new Date(),
            days: vacationData.days
          }
        });
        const tempVacationRequests = vacationRequests.map((vacationRequest) => {
          if (vacationRequest.id === updatedRequest.id) {
            return updatedRequest;
          } else {
            return vacationRequest;
          }
        });
        setVacationRequests(tempVacationRequests);
      }
    } catch (error) {
      setError(`${"Updating vacation request has failed."}, ${error}`);
    }
  };
  return { updateVacationRequest };
};

export default UpdateVacationRequest;
