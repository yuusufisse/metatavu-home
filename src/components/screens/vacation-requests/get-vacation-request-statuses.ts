import { useAtomValue, useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { useEffect, useState } from "react";
import { VacationRequestStatus } from "../../../generated/client";
import { vacationRequestsAtom } from "../../../atoms/vacationRequests";

/**
 * Functional component for fetching vacation request statuses
 */
const getVacationRequestStatuses = () => {
  const { vacationRequestStatusApi } = useApi();
  const vacationRequests = useAtomValue(vacationRequestsAtom);
  const [vacationRequestStatuses, setVacationRequestStatuses] = useState<VacationRequestStatus[]>(
    []
  );
  const [latestVacationRequestStatuses, setLatestVacationRequestStatuses] = useState<
    VacationRequestStatus[]
  >([]);
  const setError = useSetAtom(errorAtom);
  const [vacationRequestStatusesLoading, setVacationRequestStatusesLoading] = useState(true);

  useEffect(() => {
    if (vacationRequestStatuses) {
      filterLatestVacationRequestStatuses();
    }
  }, [vacationRequestStatuses]);

  useEffect(() => {
    if (vacationRequests) {
      fetchVacationRequestStatuses();
    }
  }, [vacationRequests]);

  /**
   * Fetch vacation request statuses using the API
   */
  const fetchVacationRequestStatuses = async () => {
    if (vacationRequests) {
      try {
        const vacationRequestStatuses: VacationRequestStatus[] = [];

        await Promise.all(
          vacationRequests.map(async (vacationRequest) => {
            let createdStatuses: VacationRequestStatus[] = [];
            if (vacationRequest.id) {
              createdStatuses = await vacationRequestStatusApi.listVacationRequestStatuses({
                id: vacationRequest.id
              });
            }
            createdStatuses.forEach((createdStatus) => {
              vacationRequestStatuses.push(createdStatus);
            });
          })
        );

        setVacationRequestStatuses(vacationRequestStatuses);
      } catch (error) {
        setError(`${"Fetching vacation request statuses failed."}, ${error}`);
      }
    }
  };

  /**
   * Filters all the latest vacation request statuses, so there would be only one status for each request showed on the UI
   */
  const filterLatestVacationRequestStatuses = async () => {
    if (vacationRequests) {
      const tempLatestVacationRequestStatuses: VacationRequestStatus[] = [];

      vacationRequests.forEach((vacationRequest) => {
        const tempVacationRequestStatuses: VacationRequestStatus[] = [];

        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            tempVacationRequestStatuses.push(vacationRequestStatus);
          }
        });

        if (tempVacationRequestStatuses.length > 0) {
          const pickedStatus = tempVacationRequestStatuses.reduce((a, b) => {
            if (a.updatedAt && b.updatedAt) {
              return a.updatedAt > b.updatedAt ? a : b;
            } else if (a.updatedAt) {
              return a;
            } else {
              return b;
            }
          });
          tempLatestVacationRequestStatuses.push(pickedStatus);
        }
      });

      setLatestVacationRequestStatuses(tempLatestVacationRequestStatuses);
      setVacationRequestStatusesLoading(false);
    }
  };

  return { latestVacationRequestStatuses, vacationRequestStatusesLoading };
};

export default getVacationRequestStatuses;
