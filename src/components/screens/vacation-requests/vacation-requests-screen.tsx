import { Card } from "@mui/material";
import { useEffect, useState } from "react";
import VacationRequestsTable from "./vacation-requests-table/vacation-requests-table";
import {
  VacationRequest,
  VacationRequestStatus,
  VacationRequestStatuses
} from "../../../generated/client";
import { useApi } from "../../../hooks/use-api";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { userProfileAtom } from "../../../atoms/auth";
import { errorAtom } from "../../../atoms/error";
import { GridRowId } from "@mui/x-data-grid";
import { VacationData } from "../../../types";
import { vacationRequestsAtom } from "../../../atoms/vacationRequests";
import { vacationRequestStatusesAtom } from "../../../atoms/vacationRequestStatuses";
import strings from "../../../localization/strings";

/**
 * Vacation requests screen
 */
const VacationRequestsScreen = () => {
  const { vacationRequestsApi, vacationRequestStatusApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const [vacationRequestStatuses, setVacationRequestStatuses] = useState<VacationRequestStatus[]>(
    []
  );
  const setLatestVacationRequestStatuses = useSetAtom(vacationRequestStatusesAtom);

  /**
   * Fetch vacations when userProfile exists
   */
  useEffect(() => {
    fetchVacationsRequests();
  }, [userProfile]);

  /**
   * Filter vacation requests when vacation request statuses exist
   */
  useEffect(() => {
    if (vacationRequestStatuses) {
      filterLatestVacationRequestStatuses();
    }
  }, [vacationRequestStatuses]);

  /**
   * Fetch vacation requests statuses
   */
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
        setError(`${strings.vacationRequestError.fetchStatusError}, ${error}`);
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
    }
  };

  /**
   * Fetch vacation requests
   */
  const fetchVacationsRequests = async () => {
    try {
      const fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({
        personId: userProfile?.id
      });
      setVacationRequests(fetchedVacationRequests);
    } catch (error) {
      setError(`${strings.vacationRequestError.fetchRequestError}, ${error}`);
    }
  };

  /**
   * Delete vacation request status
   */
  const deleteVacationRequestStatus = async (selectedRow: GridRowId | undefined) => {
    if (vacationRequestStatuses.length && selectedRow) {
      try {
        const foundVacationRequestStatus = vacationRequestStatuses.find(
          (vacationRequestStatus) => vacationRequestStatus.vacationRequestId === selectedRow
        );
        if (foundVacationRequestStatus?.id) {
          await vacationRequestStatusApi.deleteVacationRequestStatus({
            id: foundVacationRequestStatus.id,
            statusId: foundVacationRequestStatus.id
          });
          const filteredVacationRequestStatuses = vacationRequestStatuses.filter(
            (vacationRequestStatus) => vacationRequestStatus.id === foundVacationRequestStatus.id
          );
          setVacationRequestStatuses(filteredVacationRequestStatuses);
        }
      } catch (error) {
        setError(`${strings.vacationRequestError.deleteStatusError}, ${error}`);
      }
    }
  };

  /**
   * Delete vacation requests
   */
  const deleteVacationRequests = async (selectedRowIds: GridRowId[] | undefined) => {
    if (vacationRequests && selectedRowIds) {
      let newVacationRequests: VacationRequest[] = vacationRequests;
      await Promise.all(
        selectedRowIds.map(async (selectedRowId) => {
          try {
            await deleteVacationRequestStatus(selectedRowId);
            await vacationRequestsApi.deleteVacationRequest({
              id: String(selectedRowId)
            });
            newVacationRequests = newVacationRequests.filter(
              (vacationRequest) => vacationRequest.id !== selectedRowId
            );
          } catch (error) {
            setError(`${strings.vacationRequestError.deleteRequestError}, ${error}`);
          }
        })
      );
      setVacationRequests(newVacationRequests);
    }
  };

  /**
   * Create a vacation request status
   *
   * @param createdRequest created vacation request
   */
  const createVacationRequestStatus = async (createdRequest: VacationRequest) => {
    if (!userProfile || !userProfile.id) return;

    try {
      if (createdRequest.id) {
        const createdStatus = await vacationRequestStatusApi.createVacationRequestStatus({
          id: createdRequest.id,
          vacationRequestStatus: {
            vacationRequestId: createdRequest.id,
            status: VacationRequestStatuses.PENDING,
            message: createdRequest.message,
            createdAt: new Date(),
            createdBy: userProfile.id,
            updatedAt: new Date(),
            updatedBy: userProfile.id
          }
        });

        setVacationRequestStatuses([createdStatus, ...vacationRequestStatuses]);
      }
    } catch (error) {
      setError(`${strings.vacationRequestError.createStatusError}, ${error}`);
    }
  };

  /**
   * Create a vacation request
   *
   * @param vacationData vacation data, data for vacation request
   */
  const createVacationRequest = async (vacationData: VacationData) => {
    if (!userProfile || !userProfile.id) return;

    try {
      if (
        vacationData.startDate &&
        vacationData.endDate &&
        vacationData.type &&
        vacationData.message &&
        vacationData.days
      ) {
        const createdRequest = await vacationRequestsApi.createVacationRequest({
          vacationRequest: {
            personId: userProfile.id,
            createdBy: userProfile.id,
            startDate: vacationData.startDate?.toJSDate(),
            endDate: vacationData.endDate?.toJSDate(),
            type: vacationData.type,
            message: vacationData.message,
            createdAt: new Date(),
            updatedAt: new Date(),
            days: vacationData.days
          }
        });

        createVacationRequestStatus(createdRequest);
        setVacationRequests([createdRequest, ...vacationRequests]);
      }
    } catch (error) {
      setError(`${strings.vacationRequestError.createRequestError}, ${error}`);
    }
  };

  /**
   * Update a vacation request
   *
   * @param vacationData vacation request data
   * @param vacationRequestId vacation request id
   */
  const updateVacationRequest = async (
    vacationData: VacationData,
    vacationRequestId: string | undefined
  ) => {
    if (!userProfile || !userProfile.id) return;

    try {
      const vacationRequest = vacationRequests.find(
        (vacationRequest) => vacationRequest.id === vacationRequestId
      );
      if (
        vacationRequest &&
        vacationRequestId &&
        vacationData.startDate &&
        vacationData.endDate &&
        vacationData.type &&
        vacationData.message &&
        vacationData.days
      ) {
        const updatedRequest = await vacationRequestsApi.updateVacationRequest({
          id: vacationRequestId,
          vacationRequest: {
            ...vacationRequest,
            startDate: vacationData.startDate.toJSDate(),
            endDate: vacationData.endDate.toJSDate(),
            type: vacationData.type,
            message: vacationData.message,
            updatedAt: new Date(),
            days: vacationData.days
          }
        });
        const tempVacationRequests = vacationRequests.map((vacationRequest) => {
          if (vacationRequest.id === updatedRequest.id) {
            return updatedRequest;
          } else {
            return vacationRequest;
          }
        });
        setVacationRequests(tempVacationRequests);
      }
    } catch (error) {
      setError(`${strings.vacationRequestError.updateRequestError}, ${error}`);
    }
  };

  /**
   * Update a vacation request status
   *
   * @param newStatus vacation data, data for vacation request
   * @param vacationRequestStatusId vacation request status id
   */
  const updateVacationRequestStatuses = async (
    newStatus: VacationRequestStatuses,
    selectedRowIds: GridRowId[]
  ) => {
    if (!userProfile || !userProfile.id) return;

    if (selectedRowIds && newStatus) {
      const updatedStatuses: VacationRequestStatus[] = [];
      await Promise.all(
        selectedRowIds.map(async (selectedRowId) => {
          const vacationRequestStatus = vacationRequestStatuses.find(
            (vacationRequestStatus) => vacationRequestStatus.vacationRequestId === selectedRowId
          );
          try {
            if (vacationRequestStatus?.id) {
              const updatedStatus = await vacationRequestStatusApi.updateVacationRequestStatus({
                id: vacationRequestStatus.id,
                statusId: vacationRequestStatus.id,
                vacationRequestStatus: {
                  ...vacationRequestStatus,
                  status: newStatus
                }
              });
              updatedStatuses.push(updatedStatus);
            }
          } catch (error) {
            setError(`${strings.vacationRequestError.updateStatusError}, ${error}`);
          }
        })
      );
      const newVacationRequestStatuses = vacationRequestStatuses.map((vacationRequestStatus) => {
        const foundUpdatedStatus = updatedStatuses.find(
          (updatedStatus) => updatedStatus.id === vacationRequestStatus.id
        );
        if (foundUpdatedStatus && vacationRequestStatus.id === foundUpdatedStatus.id) {
          return foundUpdatedStatus;
        } else {
          return vacationRequestStatus;
        }
      });
      setVacationRequestStatuses(newVacationRequestStatuses);
    }
  };

  return (
    <Card sx={{ margin: 0, padding: "10px", width: "100%", height: "100" }}>
      <VacationRequestsTable
        deleteVacationRequests={deleteVacationRequests}
        createVacationRequest={createVacationRequest}
        updateVacationRequest={updateVacationRequest}
        updateVacationRequestStatuses={updateVacationRequestStatuses}
      />
    </Card>
  );
};

export default VacationRequestsScreen;
