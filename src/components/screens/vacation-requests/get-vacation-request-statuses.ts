import { useSetAtom } from "jotai";
import { useApi } from "../../../hooks/use-api";
import { errorAtom } from "../../../atoms/error";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VacationRequest, VacationRequestStatus } from "../../../generated/client";

/**
 * Component properties
 */
interface Props {
  vacationRequests: VacationRequest[];
  vacationRequestStatuses: VacationRequestStatus[];
  setVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
  setLatestVacationRequestStatuses: Dispatch<SetStateAction<VacationRequestStatus[]>>;
}

/**
 * Get vacation request statuses functional component
 *
 * @param props component properties
 * @returns vacationRequestStatusesLoading
 */
const GetVacationRequestStatuses = ({
  vacationRequests,
  vacationRequestStatuses,
  setVacationRequestStatuses,
  setLatestVacationRequestStatuses
}: Props) => {
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
   * Filter latest vacation request statuses, so there would be only one status(the latest one) for each request showed on the UI
   */
  const filterLatestVacationRequestStatuses = async () => {
    if (vacationRequests) {
      const selectedLatestVacationRequestStatuses: VacationRequestStatus[] = [];

      vacationRequests.forEach((vacationRequest) => {
        const selectedVacationRequestStatuses: VacationRequestStatus[] = [];

        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            selectedVacationRequestStatuses.push(vacationRequestStatus);
          }
        });

        if (selectedVacationRequestStatuses.length > 0) {
          const latestStatus = selectedVacationRequestStatuses.reduce((a, b) => {
            if (a.updatedAt && b.updatedAt) {
              return a.updatedAt > b.updatedAt ? a : b;
            } else if (a.updatedAt) {
              return a;
            } else {
              return b;
            }
          });
          selectedLatestVacationRequestStatuses.push(latestStatus);
        }
      });
      setLatestVacationRequestStatuses(selectedLatestVacationRequestStatuses);
      setVacationRequestStatusesLoading(false);
    }
  };

  return {
    vacationRequestStatusesLoading
  };
};

export default GetVacationRequestStatuses;
