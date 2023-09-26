import { useAtomValue, useSetAtom } from "jotai";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VacationRequest } from "../../../generated/client";
import { userProfileAtom } from "../../../atoms/auth";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";

/**
 * Interface describing get Vacation Requests Props
 */
interface getVacationRequestsProps {
  setVacationRequests: Dispatch<SetStateAction<VacationRequest[]>>;
}
/**
 * Get vacation requests, a functional component for fetching vacation requests
 *
 * @returns vacationRequests array of vacation requests,
 * vacationRequestsLoading boolean to indicate is vacation requests are loading
 */
const GetVacationRequests = (props: getVacationRequestsProps) => {
  const { setVacationRequests } = props;
  const { personsApi, vacationRequestsApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [vacationRequestsLoading, setVacationRequestsLoading] = useState(true);

  /**
   * Fetch vacation requests using the API
   */
  const fetchVacationsRequests = async () => {
    try {
      const fetchedPersons = await personsApi.listPersons({ active: true });
      // const fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({personId: userProfile?.id}); // STAGING
      const fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({
        personId: fetchedPersons[0].keycloakId
      }); // TESTING
      setVacationRequests(fetchedVacationRequests);
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
