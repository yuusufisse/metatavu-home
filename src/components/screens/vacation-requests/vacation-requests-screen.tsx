import { Container } from "@mui/material";
import { useApi } from "../../../hooks/use-api";
import LoaderWrapper from "../../generics/loader-wrapper";
import { useAtomValue, useSetAtom } from "jotai";
import { userProfileAtom } from "../../../atoms/auth";
import { errorAtom } from "../../../atoms/error";
import { useEffect, useState } from "react";
import { VacationRequest } from "../../../generated/client";

const VacationRequestsScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { personsApi, vacationRequestsApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [ vacationRequests, setVacationRequests ] = useState<VacationRequest[]>([]);

  const getVacationRequests = async () => {
    try {
      const fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({personId: userProfile?.id});
      setVacationRequests(fetchedVacationRequests);
    } catch (error) {
      setError(`${ "Person fetch has failed." }, ${ error }`);
    }
  }

  useEffect(() => {
    getVacationRequests();
  },[userProfile])

  const ListVacationRequests = () => {
    return (
      <>
      </>
    );
  }

  return (
    <Container>
      <LoaderWrapper loading={isLoading}>
        <div>VacationRequestsScreen</div>
      </LoaderWrapper>
    </Container>
  );
}

export default VacationRequestsScreen;