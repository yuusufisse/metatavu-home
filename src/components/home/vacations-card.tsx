import { Grid, Card, CardContent, Skeleton, Typography, Box } from "@mui/material";
import strings from "../../localization/strings";
import { Link, useLocation } from "react-router-dom";
import LuggageIcon from "@mui/icons-material/Luggage";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { useState, useMemo } from "react";
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
import { validateValueIsNotUndefinedNorNull } from "../../utils/check-utils";
import { VacationInfoListItem } from "../../types";

/**
 * Vacations card component
 */
const VacationsCard = () => {
  const { vacationRequestsApi, vacationRequestStatusApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const initialVacationRequestStatuses = useAtomValue(vacationRequestStatusesAtom);
  const [vacationRequestStatuses, _setVacationRequestStatuses] = useState<VacationRequestStatus[]>(
    initialVacationRequestStatuses
  );
  const setLatestVacationRequestStatuses = useSetAtom(vacationRequestStatusesAtom);
  const language = useAtomValue(languageAtom);
  const [loading, setLoading] = useState(false);
  const adminMode = UserRoleUtils.adminMode();
  const persons = useAtomValue(personsAtom);
  const location = useLocation();
  const keepVacationsData = location.state?.keepVacationsData;

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
        return vacationRequestStatuses;
      } catch (error) {
        setError(`${strings.vacationRequestError.fetchStatusError}, ${error}`);
      }
    }
  };

  useMemo(() => {
    fetchVacationRequestStatuses().then((vacationRequestStatuses) =>
      filterLatestVacationRequestStatuses(vacationRequestStatuses)
    );
  }, [vacationRequests]);

  /**
   * Filter latest vacation request statuses, so there would be only one status(the latest one) for each request showed on the UI
   */
  const filterLatestVacationRequestStatuses = async (
    vacationRequestStatuses: VacationRequestStatus[] | undefined
  ) => {
    if (
      vacationRequests.length &&
      vacationRequestStatuses &&
      vacationRequestStatuses.length &&
      !keepVacationsData
    ) {
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
      setLoading(false);
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
    const pendingVacationRequests = vacationRequestStatuses.map((vacationRequestStatus) =>
      vacationRequests.find(
        (vacationRequest) =>
          vacationRequest.id === vacationRequestStatus.vacationRequestId &&
          vacationRequestStatus.status === VacationRequestStatuses.PENDING
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
   * @param vacationInfoListItem vacation info list item
   * @param index index
   */
  const renderVacationInfoItem = (vacationInfoListItem: VacationInfoListItem, index: number) => (
    <Grid item xs={12} key={`vacations-info-list-item-${index}`}>
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ flex: 1 }}>{vacationInfoListItem.name}</Typography>
        <Typography sx={{ flex: 1 }}>{vacationInfoListItem.value}</Typography>
      </Box>
    </Grid>
  );

  /**
   * Render the earliest upcoming vacation request
   * Render the earliest upcoming pending vacation request if in admin mode
   */
  const renderEarliestUpcomingVacationRequest = () => {
    let earliestUpcomingVacationRequestStatus: VacationRequestStatuses | undefined;

    if (!vacationRequests?.length && !vacationRequestStatuses?.length && !loading) {
      return <Typography>{strings.vacationRequestError.noVacationRequestsFound}</Typography>;
    }

    let earliestUpcomingVacationRequest: VacationRequest | undefined = undefined;
    const upcomingPendingVacationRequests = adminMode
      ? getUpcomingPendingVacationRequests()
      : getUpcomingVacationRequests();

    if (upcomingPendingVacationRequests.length) {
      const filteredUpcomingPendingVacationRequests = upcomingPendingVacationRequests.filter(
        validateValueIsNotUndefinedNorNull
      );

      earliestUpcomingVacationRequest = filteredUpcomingPendingVacationRequests.reduce(
        (vacationA, vacationB) =>
          DateTime.fromJSDate(vacationA.startDate) > DateTime.fromJSDate(vacationB.startDate)
            ? vacationB
            : vacationA
      );

      earliestUpcomingVacationRequestStatus = vacationRequestStatuses.find(
        (vacationRequestStatus) =>
          earliestUpcomingVacationRequest &&
          earliestUpcomingVacationRequest.id === vacationRequestStatus.vacationRequestId
      )?.status;

      const vacationInfoListItems: VacationInfoListItem[] = [
        {
          name: strings.vacationsCard.vacationType,
          value: LocalizationUtils.getLocalizedVacationRequestType(
            earliestUpcomingVacationRequest.type
          )
        },
        {
          name: strings.vacationsCard.applicant,
          value: getVacationRequestPersonFullName(
            earliestUpcomingVacationRequest,
            persons,
            userProfile
          )
        },
        {
          name: strings.vacationsCard.timeOfVacation,
          value: `${formatDate(
            DateTime.fromJSDate(earliestUpcomingVacationRequest.startDate)
          )} - ${formatDate(DateTime.fromJSDate(earliestUpcomingVacationRequest.endDate))}`
        },
        {
          name: strings.vacationsCard.status,
          value: earliestUpcomingVacationRequestStatus ? (
            <span
              style={{
                color: getVacationRequestStatusColor(earliestUpcomingVacationRequestStatus)
              }}
            >
              {LocalizationUtils.getLocalizedVacationRequestStatus(
                earliestUpcomingVacationRequestStatus
              )}
            </span>
          ) : (
            strings.vacationRequest.noStatus
          )
        }
      ];

      return (
        <>
          <Grid item xs={1}>
            <LuggageIcon />
          </Grid>
          <Grid item xs={11}>
            <Box>
              {earliestUpcomingVacationRequest &&
                DateTime.fromJSDate(earliestUpcomingVacationRequest.startDate) > DateTime.now() && (
                  <>
                    <Typography fontWeight={"bold"}>
                      {`${strings.vacationsCard.nextUpcomingVacation}:`}
                    </Typography>
                    <Grid container>
                      {vacationInfoListItems.map((vacationInfoListItem, index) =>
                        renderVacationInfoItem(vacationInfoListItem, index)
                      )}
                    </Grid>
                  </>
                )}
            </Box>
          </Grid>
        </>
      );
    }

    if (!earliestUpcomingVacationRequest && !loading) {
      return;
    }

    return;
  };

  /**
   * Render upcoming vacation requests count
   */
  const renderUpcomingVacationRequestsCount = () => {
    const upcomingVacationRequestsCount = adminMode
      ? getUpcomingPendingVacationRequests().length
      : getUpcomingVacationRequests().length;

    if (upcomingVacationRequestsCount && !loading) {
      return (
        <>
          <Grid item xs={1}>
            {upcomingVacationRequestsCount > 0 ? <Pending /> : <Check />}
          </Grid>
          <Grid item xs={11}>
            {adminMode
              ? upcomingVacationRequestsCount > 0
                ? strings.formatString(
                    strings.vacationsCard.upComingPendingVacations,
                    upcomingVacationRequestsCount
                  )
                : strings.vacationsCard.noUpcomingPendingVacations
              : upcomingVacationRequestsCount > 0
              ? strings.formatString(
                  strings.vacationsCard.upComingVacations,
                  upcomingVacationRequestsCount
                )
              : strings.vacationsCard.noUpcomingVacations}
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
            {renderEarliestUpcomingVacationRequest()}
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VacationsCard;
