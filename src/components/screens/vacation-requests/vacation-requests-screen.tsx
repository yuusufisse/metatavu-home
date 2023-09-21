import { Container } from "@mui/material";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { vacationRequestsAtom } from "../../../atoms/vacationRequests";
import getVacationRequests from "./get-vacation-requests";
import { vacationRequestStatusesAtom } from "../../../atoms/vacationRequestStatuses";
import getVacationRequestStatuses from "./get-vacation-request-statuses";
import VacationRequestsTable from "./vacation-requests-table/vacation-requests-table";

/**
 * Vacation requests screen
 *
 */
const VacationRequestsScreen = () => {
  const { vacationRequests, vacationRequestsLoading } = getVacationRequests();
  const { latestVacationRequestStatuses } = getVacationRequestStatuses();
  const setVacationRequests = useSetAtom(vacationRequestsAtom);
  const setVacationRequestStatuses = useSetAtom(vacationRequestStatusesAtom);

  /**
   * Set vacation requests to atom when fetched
   */
  useEffect(() => {
    setVacationRequests(vacationRequests);
  }, [vacationRequests]);

  /**
   * Set vacation request statuses to atom when vacation requests are fetched
   */
  useEffect(() => {
    if (!vacationRequestsLoading) {
      setVacationRequestStatuses(latestVacationRequestStatuses);
    }
  }, [latestVacationRequestStatuses, vacationRequestsLoading]);

  return (
    <Container>
      <VacationRequestsTable />
    </Container>
  );
};

export default VacationRequestsScreen;
