import { Container } from "@mui/material";
import LoaderWrapper from "../../generics/loader-wrapper";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { vacationRequestsAtom } from "../../../atoms/vacationRequests";
import getVacationRequests from "./get-vacation-requests";
import { vacationRequestStatusesAtom } from "../../../atoms/vacationRequestStatuses";
import getVacationRequestStatuses from "./get-vacation-request-statuses";
import VacationRequestsTable from "./vacation-requests-table/vacation-requests-table";

const VacationRequestsScreen = () => {
  const { vacationRequests, vacationRequestsLoading } = getVacationRequests();
  const { latestVacationRequestStatuses, vacationRequestStatusesLoading } = getVacationRequestStatuses();
  const setVacationRequests = useSetAtom(vacationRequestsAtom);
  const setVacationRequestStatuses = useSetAtom(vacationRequestStatusesAtom);
  const [ isLoading, setIsLoading ] = useState(true);

  /**
   * Set vacation requests to atom when fetched
   */
  useEffect(() => {
    setVacationRequests(vacationRequests);
  },[ vacationRequests ]);

  /**
   * Set vacation request statuses to atom when vacation requests are fetched
   */
  useEffect(() => {
    if (!vacationRequestsLoading) {
      setVacationRequestStatuses(latestVacationRequestStatuses);
    }
  },[ latestVacationRequestStatuses, vacationRequestsLoading ])

  /**
   * Set loading to false, when both requests and their statuses are loaded
   */
  useEffect(() => {
    if (!vacationRequestsLoading && !vacationRequestStatusesLoading) {
      setIsLoading(false);
    }
  },[ vacationRequestsLoading, vacationRequestStatusesLoading ]);

  return (
    <Container>
      <LoaderWrapper loading={isLoading}>
        <VacationRequestsTable />
      </LoaderWrapper>
    </Container>
  );
}

export default VacationRequestsScreen;