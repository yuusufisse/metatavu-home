import { Container } from "@mui/material";
import { useEffect } from "react";
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

/**
 * Vacation requests screen
 */
const VacationRequestsScreen = () => {
  const { vacationRequestsApi, vacationRequestStatusApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const [vacationRequestStatuses, setVacationRequestStatuses] = useAtom(
    vacationRequestStatusesAtom
  );

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
      setVacationRequestStatuses(selectedLatestVacationRequestStatuses);
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
      if (setVacationRequests) {
        setVacationRequests(fetchedVacationRequests);
      }
    } catch (error) {
      setError(`${"Fetching vacation requests has failed."}, ${error}`);
    }
  };

  /**
   * Delete selected vacation requests status from rows
   */
  const deleteVacationRequestStatusRow = (
    foundVacationRequestStatus: VacationRequestStatus | undefined
  ) => {
    if (foundVacationRequestStatus?.id) {
      const filteredVacationRequestStatuses = vacationRequestStatuses.filter(
        (vacationRequestStatus) => vacationRequestStatus.id === foundVacationRequestStatus.id
      );
      setVacationRequestStatuses(filteredVacationRequestStatuses);
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
          deleteVacationRequestStatusRow(foundVacationRequestStatus);
        }
      } catch (error) {
        setError(`${"Deleting vacation request status has failed"}, ${error}`);
      }
    }
  };

  /**
   * Delete vacation requests from data grid rows
   */
  const deleteVacationRequestRows = (selectedRowId: GridRowId | undefined) => {
    if (vacationRequests && vacationRequestStatuses && selectedRowId) {
      let tempVacationRequests: VacationRequest[] = vacationRequests;
      tempVacationRequests = tempVacationRequests.filter(
        (vacationRequest) => vacationRequest.id !== selectedRowId
      );
      setVacationRequests(tempVacationRequests);
    }
  };

  /**
   * Delete vacation requests
   */
  const deleteVacationRequests = async (selectedRowIds: GridRowId[] | undefined) => {
    if (vacationRequests && selectedRowIds) {
      await Promise.all(
        selectedRowIds.map(async (selectedRowId) => {
          try {
            await deleteVacationRequestStatus(selectedRowId);
            await vacationRequestsApi.deleteVacationRequest({
              id: String(selectedRowId)
            });
            deleteVacationRequestRows(selectedRowId);
          } catch (error) {
            setError(`${"Deleting vacation request has failed."}, ${error}`);
          }
        })
      );
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
      setError(`${"Creating vacation request status has failed."}, ${error}`);
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
      setError(`${"Creating vacation request has failed."}, ${error}`);
    }
  };

  /**
   * Create a vacation request
   *
   * @param vacationData vacation data, data for vacation request
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
      setError(`${"Updating vacation request has failed."}, ${error}`);
    }
  };

  return (
    <Container>
      <VacationRequestsTable
        deleteVacationRequests={deleteVacationRequests}
        createVacationRequest={createVacationRequest}
        updateVacationRequest={updateVacationRequest}
      />
    </Container>
  );
};

export default VacationRequestsScreen;
