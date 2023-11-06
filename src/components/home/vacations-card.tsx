import { Grid, Card, CardContent, Skeleton, Typography, Box } from "@mui/material";
import strings from "../../localization/strings";
import { Link } from "react-router-dom";
import LuggageIcon from "@mui/icons-material/Luggage";
import { useAtomValue, useSetAtom, useAtom } from "jotai";
import { useState, useEffect, useMemo } from "react";
import { userProfileAtom } from "../../atoms/auth";
import { errorAtom } from "../../atoms/error";
import { VacationRequest, VacationRequestStatus } from "../../generated/client";
import { useApi } from "../../hooks/use-api";
import { personsAtom } from "../../atoms/person";
import { DateTime } from "luxon";
import { languageAtom } from "../../atoms/language";
import LocalizationUtils from "../../utils/localization-utils";
import { vacationRequestsAtom, vacationRequestStatusesAtom } from "../../atoms/vacation";
import { getVacationRequestStatusColor } from "../../utils/vacation-status-utils";
import UserRoleUtils from "../../utils/user-role-utils";

/**
 * Vacations card component
 */
const VacationsCard = () => {
  const { vacationRequestsApi, vacationRequestStatusApi } = useApi();
  const userProfile = useAtomValue(userProfileAtom);
  const setError = useSetAtom(errorAtom);
  const persons = useAtomValue(personsAtom);
  const [vacationRequests, setVacationRequests] = useAtom(vacationRequestsAtom);
  const [vacationRequestStatuses, setVacationRequestStatuses] = useState<VacationRequestStatus[]>(
    []
  );
  const setLatestVacationRequestStatuses = useSetAtom(vacationRequestStatusesAtom);
  const language = useAtomValue(languageAtom);
  const [loading, setLoading] = useState(false);
  const adminMode = UserRoleUtils.adminMode();

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

    try {
      setLoading(true);
      const fetchedVacationRequests = await vacationRequestsApi.listVacationRequests({
        personId: userProfile?.id
      });
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
   * Render the latest vacation request
   *
   * @param vacationRequests vacation requests
   * @param vacationRequestStatuses vacation request statuses
   */
  const renderVacationRequest = (
    vacationRequests: VacationRequest[] | undefined,
    vacationRequestStatuses: VacationRequestStatus[] | undefined
  ) => {
    if (!vacationRequests?.length && !loading && persons.length) {
      return <Typography>{strings.error.fetchFailedNoEntriesGeneral}</Typography>;
    }
    if (vacationRequests?.length && vacationRequestStatuses?.length) {
      const latestVacationRequest = vacationRequests.reduce((a, b) =>
        DateTime.fromJSDate(a.updatedAt) > DateTime.fromJSDate(b.updatedAt) ? a : b
      );

      const vacationRequestStatus = vacationRequestStatuses.find(
        (vacationRequestStatus) =>
          latestVacationRequest.id === vacationRequestStatus.vacationRequestId
      )?.status;

      return (
        <Box>
          {DateTime.fromJSDate(latestVacationRequest.startDate) > DateTime.now() ? (
            <Typography>
              {`${LocalizationUtils.getLocalizedVacationRequestType(
                latestVacationRequest.type
              )} - ${latestVacationRequest.message} - ${formatDate(
                DateTime.fromJSDate(latestVacationRequest.startDate)
              )} - ${formatDate(DateTime.fromJSDate(latestVacationRequest.endDate))} - `}
              {vacationRequestStatus && (
                <span
                  style={{
                    color: getVacationRequestStatusColor(vacationRequestStatus)
                  }}
                >
                  {LocalizationUtils.getLocalizedVacationRequestStatus(vacationRequestStatus)}
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
            <Grid item xs={1}>
              <LuggageIcon />
            </Grid>
            <Grid item xs={11}>
              {renderVacationRequest(vacationRequests, vacationRequestStatuses)}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};

export default VacationsCard;
