import { Grid, Card, CardContent, Skeleton, Typography, Box } from "@mui/material";
import strings from "../../localization/strings";
import { Link, useLocation } from "react-router-dom";
import LuggageIcon from "@mui/icons-material/Luggage";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { useState, useEffect, useMemo, ReactNode } from "react";
import { userProfileAtom } from "../../atoms/auth";
import { errorAtom } from "../../atoms/error";
import {
  VacationRequest,
  VacationRequestStatus,
  VacationRequestStatuses
} from "../../generated/client";
import { useApi } from "../../hooks/use-api";
import { DateTime } from "luxon";
import { languageAtom } from "../../atoms/language";
import LocalizationUtils from "../../utils/localization-utils";
import { vacationRequestsAtom, vacationRequestStatusesAtom } from "../../atoms/vacation";
import { getVacationRequestStatusColor } from "../../utils/vacation-status-utils";
import UserRoleUtils from "../../utils/user-role-utils";
import { Check, Pending } from "@mui/icons-material";
import { personsAtom } from "../../atoms/person";
import { getVacationRequestPersonFullName } from "../../utils/vacation-request-utils";

/**
 * Vacations card component
 */
const VacationsCard = () => {
  const { vacationRequestsApi, vacationRequestStatusApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const initialVacationRequestStatuses = useAtomValue(vacationRequestStatusesAtom);
  const [vacationRequestStatuses, setVacationRequestStatuses] = useState<VacationRequestStatus[]>(
    initialVacationRequestStatuses
  );
  const setLatestVacationRequestStatuses = useSetAtom(vacationRequestStatusesAtom);
  const language = useAtomValue(languageAtom);
  const [loading, setLoading] = useState(false);
  const adminMode = UserRoleUtils.adminMode();
  const persons = useAtomValue(personsAtom);
  const location = useLocation();
  const keepVacationsData = location.state?.keepVacationsData;

  useEffect(() => {
    filterLatestVacationRequestStatuses();
  }, [vacationRequestStatuses]);

  /**
   * Fetch vacation request statuses
   */
  const fetchVacationRequestStatuses = async () => {
    if (vacationRequests.length && !keepVacationsData) {
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
    if (vacationRequests.length && vacationRequestStatuses.length && !keepVacationsData) {
      const selectedLatestVacationRequestStatuses: VacationRequestStatus[] = [];

      vacationRequests.forEach((vacationRequest) => {
        const selectedVacationRequestStatuses: VacationRequestStatus[] = [];

        vacationRequestStatuses.forEach((vacationRequestStatus) => {
          if (vacationRequest.id === vacationRequestStatus.vacationRequestId) {
            selectedVacationRequestStatuses.push(vacationRequestStatus);
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
    }
  };

  /**
   * Fetch vacation requests
   */
  const fetchVacationsRequests = async () => {
    if (!userProfile?.id) return;

    if (!keepVacationsData) {
      try {
        setLoading(true);
        let fetchedVacationRequests: VacationRequest[] = [];
        if (adminMode) {
          fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({});
        } else {
          fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({
            personId: userProfile?.id
          });
        }
        setVacationRequests(fetchedVacationRequests);
        setLoading(false);
      } catch (error) {
        setError(`${strings.vacationRequestError.fetchRequestError}, ${error}`);
      }
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
   * Get upcoming pending vacation requests
   *
   * @returns upcoming pending vacation requests
   */
  const getUpcomingPendingVacationRequests = () => {
    const pendingVacationRequests = vacationRequestStatuses
      .filter(
        (vacationRequestStatus) => vacationRequestStatus.status === VacationRequestStatuses.PENDING
      )
      .map((pendingVacationRequestStatus) =>
        vacationRequests.find(
          (vacationRequest) => vacationRequest.id === pendingVacationRequestStatus.vacationRequestId
        )
      );

    const upcomingPendingVacationRequests = pendingVacationRequests.filter(
      (pendingVacationRequest) =>
        pendingVacationRequest &&
        DateTime.fromJSDate(pendingVacationRequest.startDate) > DateTime.now()
    );

    return upcomingPendingVacationRequests;
  };

  /**
   * Get upcoming vacation requests
   */
  const getUpcomingVacationRequests = () => {
    const upcomingVacationRequests = vacationRequests.filter(
      (vacationRequest) =>
        vacationRequest && DateTime.fromJSDate(vacationRequest.startDate) > DateTime.now()
    );

    return upcomingVacationRequests;
  };

  /**
   * Render vacation info item
   *
   * @param children child components
   */
  const renderVacationInfoItem = (children: ReactNode) => (
    <Grid item xs={6}>
      {children}
    </Grid>
  );

  /**
   * Render the earliest upcoming vacation request
   * Render the earliest upcoming pending vacation request if in admin mode
   */
  const renderEarliestUpcomingVacationRequest = () => {
    let earliestUpcomingVacationRequestStatus: VacationRequestStatuses | undefined;

    if (!vacationRequests?.length && !loading) {
      return <Typography>{strings.vacationRequestError.noVacationRequestsFound}</Typography>;
    }

    if (vacationRequests?.length && vacationRequestStatuses?.length && !loading) {
      let earliestUpcomingVacationRequest: VacationRequest | undefined = undefined;
      const upcomingPendingVacationRequests = adminMode
        ? getUpcomingPendingVacationRequests()
        : getUpcomingVacationRequests();

      if (upcomingPendingVacationRequests.length) {
        earliestUpcomingVacationRequest = upcomingPendingVacationRequests.reduce((a, b) =>
          a && b && DateTime.fromJSDate(a.startDate) > DateTime.fromJSDate(b.startDate) ? b : a
        );
        earliestUpcomingVacationRequestStatus = vacationRequestStatuses.find(
          (vacationRequestStatus) =>
            earliestUpcomingVacationRequest &&
            earliestUpcomingVacationRequest.id === vacationRequestStatus.vacationRequestId
        )?.status;
      }

      return (
        <Box>
          {earliestUpcomingVacationRequest &&
          DateTime.fromJSDate(earliestUpcomingVacationRequest.startDate) > DateTime.now() ? (
            <>
              <Typography fontWeight={"bold"}>
                {`${strings.vacationsCard.nextUpcomingVacation}:`}
              </Typography>
              <Grid container>
                {renderVacationInfoItem(
                  <Typography>{strings.vacationsCard.vacationType}</Typography>
                )}
                {renderVacationInfoItem(
                  LocalizationUtils.getLocalizedVacationRequestType(
                    earliestUpcomingVacationRequest.type
                  )
                )}
                {renderVacationInfoItem(<Typography>{strings.vacationsCard.applicant}</Typography>)}
                {renderVacationInfoItem(
                  <Typography>
                    {`${getVacationRequestPersonFullName(
                      earliestUpcomingVacationRequest,
                      persons,
                      userProfile
                    )}`}
                  </Typography>
                )}
                {renderVacationInfoItem(
                  <Typography>{strings.vacationsCard.timeOfVacation}</Typography>
                )}
                {renderVacationInfoItem(
                  <Typography>
                    {`${formatDate(
                      DateTime.fromJSDate(earliestUpcomingVacationRequest.startDate)
                    )} - ${formatDate(
                      DateTime.fromJSDate(earliestUpcomingVacationRequest.endDate)
                    )}`}
                  </Typography>
                )}
                {renderVacationInfoItem(<Typography>{strings.vacationsCard.status}</Typography>)}
                {renderVacationInfoItem(
                  <Typography>
                    {earliestUpcomingVacationRequestStatus && (
                      <span
                        style={{
                          color: getVacationRequestStatusColor(
                            earliestUpcomingVacationRequestStatus
                          )
                        }}
                      >
                        {LocalizationUtils.getLocalizedVacationRequestStatus(
                          earliestUpcomingVacationRequestStatus
                        )}
                      </span>
                    )}
                  </Typography>
                )}
              </Grid>
            </>
          ) : (
            <Typography>{strings.vacationsCard.noUpcomingVacations}</Typography>
          )}
        </Box>
      );
    }

    return <Skeleton />;
  };

  /**
   * Render upcoming vacation requests count
   */
  const renderUpcomingVacationRequestsCount = () => {
    if (!loading) {
      const upcomingVacationRequestsCount = adminMode
        ? getUpcomingPendingVacationRequests().length
        : getUpcomingVacationRequests().length;

      return (
        <>
          <Grid item xs={1}>
            {upcomingVacationRequestsCount > 0 ? <Pending /> : <Check />}
          </Grid>
          {adminMode ? (
            <Grid item xs={11}>
              {upcomingVacationRequestsCount > 0
                ? strings.formatString(
                    strings.vacationsCard.upComingPendingVacations,
                    upcomingVacationRequestsCount
                  )
                : strings.vacationsCard.noUpcomingPendingVacations}
            </Grid>
          ) : (
            <Grid item xs={11}>
              {upcomingVacationRequestsCount > 0
                ? strings.formatString(
                    strings.vacationsCard.upComingVacations,
                    upcomingVacationRequestsCount
                  )
                : strings.vacationsCard.noUpcomingVacations}
            </Grid>
          )}
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
    <Link
      to={adminMode ? "/admin/vacations" : "/vacations"}
      state={{ keepVacationsData: true }}
      style={{ textDecoration: "none" }}
    >
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
            {renderUpcomingVacationRequestsCount()}
            <Grid item xs={1}>
              <LuggageIcon />
            </Grid>
            <Grid item xs={11}>
              {renderEarliestUpcomingVacationRequest()}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VacationsCard;
