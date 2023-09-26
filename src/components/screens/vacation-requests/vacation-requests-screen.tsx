import { Container } from "@mui/material";
import { useState } from "react";
import GetVacationRequests from "./get-vacation-requests";
import getVacationRequestStatuses from "./get-vacation-request-statuses";
import VacationRequestsTable from "./vacation-requests-table/vacation-requests-table";
import { VacationRequest, VacationRequestStatus } from "../../../generated/client";

/**
 * Vacation requests screen
 *
 */
const VacationRequestsScreen = () => {
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [vacationRequestStatuses, setVacationRequestStatuses] = useState<VacationRequestStatus[]>(
    []
  );
  const [latestVacationRequestStatuses, setLatestVacationRequestStatuses] = useState<
    VacationRequestStatus[]
  >([]);
  const { vacationRequestsLoading } = GetVacationRequests({
    setVacationRequests: setVacationRequests
  });
  const { vacationRequestStatusesLoading } = getVacationRequestStatuses({
    vacationRequests: vacationRequests,
    vacationRequestStatuses: vacationRequestStatuses,
    setVacationRequestStatuses: setVacationRequestStatuses,
    setLatestVacationRequestStatuses: setLatestVacationRequestStatuses
  });

  return (
    <Container>
      <VacationRequestsTable
        vacationRequests={vacationRequests}
        vacationRequestStatuses={latestVacationRequestStatuses}
        setVacationRequests={setVacationRequests}
        setVacationRequestStatuses={setVacationRequestStatuses}
      />
    </Container>
  );
};

export default VacationRequestsScreen;
