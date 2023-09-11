import { useAtomValue, useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { useEffect, useState } from "react";
import { userProfileAtom } from "../../../atoms/auth";
import { VacationRequest } from "../../../generated/client";

const fetchVacationRequests = () => {

  const { personsApi, vacationRequestsApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const [ vacations, setVacations ] = useState<VacationRequest[]>([]);
  const setError = useSetAtom(errorAtom);
  const [isLoading, setIsLoading] = useState(true);

  const getVacationsRequests = async () => {
    try {
      const fetchedPersons = await personsApi.listPersons({ active: true });
      // const fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({personId: userProfile?.id}); // STAGING
      const fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({personId: fetchedPersons[0].keycloakId}); // TESTING
      setVacations(fetchedVacationRequests);
      setIsLoading(false);
    } catch (error) {
      setError(`${ "Person fetch has failed." }, ${ error }`);
    }
  }

  useEffect(() => {
    getVacationsRequests();
  },[ userProfile ]);

  return { vacations, isLoading };
}

export default fetchVacationRequests;