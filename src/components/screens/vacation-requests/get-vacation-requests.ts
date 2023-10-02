import { useAtomValue, useSetAtom } from "jotai";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VacationRequest } from "../../../generated/client";
import { userProfileAtom } from "../../../atoms/auth";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";

/**
 * Component properties
 */
interface GetVacationRequestsProps {
  setVacationRequests?: Dispatch<SetStateAction<VacationRequest[]>>;
}

/**
 * Get vacation requests functional component
 *
 * @param props component properties
 * @returns vacationRequestsLoading
 */
const GetVacationRequests = ({ setVacationRequests }: GetVacationRequestsProps) => {
  const { vacationRequestsApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [vacationRequestsLoading, setVacationRequestsLoading] = useState(true);

  /**
   * Fetch vacation requests
   */
  const fetchVacationsRequests = async () => {
    try {
      const fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({
        personId: userProfile?.id
      });
      if (setVacationRequests) {
        setVacationRequests(fetchedVacationRequests);
      }
      setVacationRequestsLoading(false);
    } catch (error) {
      setError(`${"Person fetch has failed."}, ${error}`);
    }
  };

  useEffect(() => {
    fetchVacationsRequests();
  }, [userProfile]);

  return { vacationRequestsLoading };
};

export default GetVacationRequests;
