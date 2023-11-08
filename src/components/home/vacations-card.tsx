import { Grid, Card, CardContent, Skeleton, Typography, Box } from "@mui/material";
import strings from "../../localization/strings";
import { Link } from "react-router-dom";
import LuggageIcon from "@mui/icons-material/Luggage";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { useState, useEffect, useMemo } from "react";
import { userProfileAtom } from "../../atoms/auth";
import { errorAtom } from "../../atoms/error";
import { Person, VacationRequestStatus, VacationRequestStatuses } from "../../generated/client";
import { useApi } from "../../hooks/use-api";
import { DateTime } from "luxon";
import { languageAtom } from "../../atoms/language";
import LocalizationUtils from "../../utils/localization-utils";
import { vacationRequestsAtom, vacationRequestStatusesAtom } from "../../atoms/vacation";
import { getVacationRequestStatusColor } from "../../utils/vacation-status-utils";
import UserRoleUtils from "../../utils/user-role-utils";
import { Check, Pending } from "@mui/icons-material";
import { personsAtom } from "../../atoms/person";

/**
 * Vacations card component
 */
const VacationsCard = () => {
  const { vacationRequestsApi, vacationRequestStatusApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const [vacationRequestStatuses, setVacationRequestStatuses] = useState<VacationRequestStatus[]>(
    []
  );
  const setLatestVacationRequestStatuses = useSetAtom(vacationRequestStatusesAtom);
  const language = useAtomValue(languageAtom);
  const [loading, setLoading] = useState(false);
  const adminMode = UserRoleUtils.adminMode();
  const [pendingVacationRequestsCount, setPendingVacationRequestsCount] = useState(0);
  const [upcomingPendingVacationRequestsCount, setUpcomingPendingVacationRequestsCount] =
    useState(0);
  const persons = useAtomValue(personsAtom);

  useEffect(() => {
    filterLatestVacationRequestStatuses();
  }, [vacationRequestStatuses]);

  /**
   * Fetch vacation request statuses
   */
  const fetchVacationRequestStatuses = async () => {
    if (vacationRequests.length) {
      try {
        setLoading(true);
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
        setLoading(false);
      } catch (error) {
        setError(`${strings.vacationRequestError.fetchStatusError}, ${error}`);
      }
    }
  };

  useMemo(() => {
    fetchVacationRequestStatuses();
  }, [vacationRequests]);

  /**
   * Filter latest vacation request statuses, so there would be only one status(the latest one) for each request showed on the UI
   */
  const filterLatestVacationRequestStatuses = async () => {
    if (vacationRequests.length && vacationRequestStatuses.length) {
      const selectedLatestVacationRequestStatuses: VacationRequestStatus[] = [];
      let pendingVacationRequestsCount = 0;

      vacationRequests.forEach((vacationRequest) => {
        const selectedVacationRequestStatuses: VacationRequestStatus[] = [];

        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            selectedVacationRequestStatuses.push(vacationRequestStatus);
            if (vacationRequestStatus.status === VacationRequestStatuses.PENDING) {
              pendingVacationRequestsCount += 1;
            }
          }
        });

        if (selectedVacationRequestStatuses.length) {
          const latestStatus = selectedVacationRequestStatuses.reduce((a, b) => {
            if (a.updatedAt && b.updatedAt) {
              return a.updatedAt > b.updatedAt ? a : b;
            } else if (a.updatedAt) {
              return a;
            }
            return b;
          });
          selectedLatestVacationRequestStatuses.push(latestStatus);
        }
      });
      setLatestVacationRequestStatuses(selectedLatestVacationRequestStatuses);
      setPendingVacationRequestsCount(pendingVacationRequestsCount);
    }
  };

  /**
   * Fetch vacation requests
   */
  const fetchVacationsRequests = async () => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);
      const fetchedVacationRequests = await vacationRequestsApi.listVacationRequests(
        adminMode
          ? {}
          : {
              personId: userProfile?.id
            }
      );
      setVacationRequests(fetchedVacationRequests);
      setLoading(false);
    } catch (error) {
      setError(`${strings.vacationRequestError.fetchRequestError}, ${error}`);
    }
  };

  useMemo(() => {
    fetchVacationsRequests();
  }, [userProfile]);

  /**
   * Format date
   *
   * @param date datetime object
   * @param dateWithTime datetime object with time
   * @returns formatted date time
   */
  function formatDate(date: DateTime, dateWithTime?: boolean) {
    if (!date) return "";
    return date
      .setLocale(language)
      .toLocaleString(dateWithTime ? DateTime.DATETIME_SHORT : undefined);
  }

  /**
   * Earliest upcoming vacation request component
   * If user is admin, get the earliest upcoming pending vacation request
   */
  const EarliestUpcomingVacationRequest = () => {
    if (!vacationRequests?.length && !loading) {
      return <Typography>{strings.error.fetchFailedNoEntriesGeneral}</Typography>;
    }
    if (vacationRequests?.length && vacationRequestStatuses?.length && !loading) {
      const pendingVacationRequests = vacationRequestStatuses
        .filter(
          (vacationRequestStatus) =>
            vacationRequestStatus.status === VacationRequestStatuses.PENDING
        )
        .map((pendingVacationRequestStatus) =>
          vacationRequests.find(
            (vacationRequest) =>
              vacationRequest.id === pendingVacationRequestStatus.vacationRequestId
          )
        );

      const upcomingPendingVacationRequests = pendingVacationRequests.filter(
        (pendingVacationRequest) =>
          pendingVacationRequest &&
          DateTime.fromJSDate(pendingVacationRequest.startDate) > DateTime.now()
      );

      const earliestUpcomingPendingVacationRequest = upcomingPendingVacationRequests.reduce(
        (a, b) =>
          a && b && DateTime.fromJSDate(a.startDate) > DateTime.fromJSDate(b.startDate) ? b : a
      );

      const earliestUpcomingPendingVacationRequestStatus = vacationRequestStatuses.find(
        (vacationRequestStatus) =>
          earliestUpcomingPendingVacationRequest &&
          earliestUpcomingPendingVacationRequest.id === vacationRequestStatus.vacationRequestId
      )?.status;

      setUpcomingPendingVacationRequestsCount(upcomingPendingVacationRequests.length);

      const getVacationRequestCreatorFullName = () => {
        let foundPerson: Person | undefined;
        if (earliestUpcomingPendingVacationRequest) {
          foundPerson = persons.find(
            (person) => person.keycloakId === earliestUpcomingPendingVacationRequest.personId
          );
        }
        let personFullName = "";
        if (foundPerson) {
          personFullName = `${foundPerson.firstName} ${foundPerson.lastName}`;
        }
        if (personFullName === "" && userProfile && earliestUpcomingPendingVacationRequest) {
          if (userProfile.id === earliestUpcomingPendingVacationRequest.personId) {
            personFullName = `${userProfile.firstName} ${userProfile.lastName}`;
          }
        }
        return personFullName;
      };

      return (
        <Box>
          {earliestUpcomingPendingVacationRequest &&
          DateTime.fromJSDate(earliestUpcomingPendingVacationRequest.startDate) > DateTime.now() ? (
            <Typography>
              {`Next upcoming vacation: ${LocalizationUtils.getLocalizedVacationRequestType(
                earliestUpcomingPendingVacationRequest.type
              )} - ${getVacationRequestCreatorFullName()} - ${
                earliestUpcomingPendingVacationRequest.message
              } - ${formatDate(
                DateTime.fromJSDate(earliestUpcomingPendingVacationRequest.startDate)
              )} - ${formatDate(
                DateTime.fromJSDate(earliestUpcomingPendingVacationRequest.endDate)
              )} - `}
              {earliestUpcomingPendingVacationRequestStatus && (
                <span
                  style={{
                    color: getVacationRequestStatusColor(
                      earliestUpcomingPendingVacationRequestStatus
                    )
                  }}
                >
                  {LocalizationUtils.getLocalizedVacationRequestStatus(
                    earliestUpcomingPendingVacationRequestStatus
                  )}
                </span>
              )}
            </Typography>
          ) : (
            <Typography>{strings.vacationsCard.noUpcomingVacations}</Typography>
          )}
        </Box>
      );
    }
    return <Skeleton />;
  };

  const PendingVacationRequests = () => {
    if (!loading) {
      return (
        <>
          <Grid item xs={1}>
            {pendingVacationRequestsCount > 0 ? <Pending /> : <Check />}
          </Grid>
          <Grid item xs={11}>
            {pendingVacationRequestsCount > 0
              ? `${strings.vacationsCard.youHave} ${pendingVacationRequestsCount} ${strings.vacationsCard.pendingRequests}`
              : strings.vacationsCard.noPendingRequests}
            {` ${strings.vacationsCard.ofWhich} ${upcomingPendingVacationRequestsCount} ${strings.vacationsCard.areUpcoming}`}
          </Grid>
        </>
      );
    }
    return (
      <>
        <Grid item xs={1}>
          <Pending />
        </Grid>
        <Grid item xs={11}>
          <Skeleton />
        </Grid>
      </>
    );
  };

  return (
    <Link to={adminMode ? "/admin/vacations" : "/vacations"} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          "&:hover": {
            background: "#efefef"
          }
        }}
      >
        <CardContent>
          <h3 style={{ marginTop: 6 }}>
            {adminMode ? strings.tableToolbar.manageRequests : strings.tableToolbar.myRequests}
          </h3>
          <Grid container>
            <PendingVacationRequests />
            <Grid item xs={1}>
              <LuggageIcon />
            </Grid>
            <Grid item xs={11}>
              <EarliestUpcomingVacationRequest />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VacationsCard;
