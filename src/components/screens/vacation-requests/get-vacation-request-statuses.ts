import { useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VacationRequest, VacationRequestStatus } from "../../../generated/client";

/**
 * Interface describing Get Vacation Request Statuses Props
 */
interface GetVacationRequestStatusesProps {
  vacationRequests: VacationRequest[];
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
  setLatestVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
}
/**
 * Get vacation requests statuses,
 * a functional component for fetching vacation request statuses
 *
 * @props GetVacationRequestStatusesProps
 * @returns latestVacationRequestStatuses array of filtered vacation request statuses,
 * vacationRequestStatusesLoading boolean to indicate if vacation request statuses are loading
 */
const GetVacationRequestStatuses = (props: GetVacationRequestStatusesProps) => {
  const {
    vacationRequests,
    vacationRequestStatuses,
    setVacationRequestStatuses,
    setLatestVacationRequestStatuses
  } = props;
  const { vacationRequestStatusApi } = useApi();
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
          const latestStatus = tempVacationRequestStatuses.reduce((a, b) => {
            if (a.updatedAt && b.updatedAt) {
              return a.updatedAt > b.updatedAt ? a : b;
            } else if (a.updatedAt) {
              return a;
            } else {
              return b;
            }
          });
          tempLatestVacationRequestStatuses.push(latestStatus);
        }
      });

      setLatestVacationRequestStatuses(tempLatestVacationRequestStatuses);
      setVacationRequestStatusesLoading(false);
    }
  };

  return {
    vacationRequestStatusesLoading
  };
};

export default GetVacationRequestStatuses;
