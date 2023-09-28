import { useAtomValue, useSetAtom } from "jotai";
import { userProfileAtom } from "../../../atoms/auth";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { VacationData } from "../../../types";
import { VacationRequest } from "../../../generated/client";
import { hasAllPropsDefined } from "../../../utils/check-utils";
import { Dispatch, SetStateAction } from "react";

/**
 * Component properties
 */
interface UpdateVacationRequestProps {
  vacationRequests: VacationRequest[];
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
}

/**
 * Update vacation request functional component
 *
 * @param props UpdateVacationRequestProps
 * @returns updateVacationRequest
 */
const UpdateVacationRequest = (props: UpdateVacationRequestProps) => {
  const { vacationRequests, setVacationRequests } = props;
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

      if (hasAllPropsDefined(tempVacationRequest) && vacationRequestId) {
        const updatedRequest = await vacationRequestsApi.updateVacationRequest({
          id: vacationRequestId,
          vacationRequest: tempVacationRequest as VacationRequest
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
