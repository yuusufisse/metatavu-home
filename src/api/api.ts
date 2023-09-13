import config from "../app/config";
import {
  Configuration,
  ConfigurationParameters,
  DailyEntriesApi,
  PersonsApi,
  SynchronizeApi,
  VacationRequestsApi,
  VacationRequestStatusApi
} from "../generated/client";

// rome-ignore lint/correctness/noUnusedVariables: <explanation>
type  ConfigConstructor<T> = new (_params: ConfigurationParameters) => T;

const getConfigurationFactory =
  <T>(ConfigConstructor: ConfigConstructor<T>, basePath: string, accessToken?: string) =>
  () => {
    return new ConfigConstructor({
      basePath: basePath,
      accessToken: accessToken
    });
  };

export const getApiClient = (accessToken?: string) => {
  const getConfiguration = getConfigurationFactory(Configuration, config.api.baseUrl, accessToken);

  return {
    dailyEntriesApi: new DailyEntriesApi(getConfiguration()),
    personsApi: new PersonsApi(getConfiguration()),
    synchronizeApi: new SynchronizeApi(getConfiguration()),
    vacationRequestsApi: new VacationRequestsApi(getConfiguration()),
    vacationRequestStatusApi: new VacationRequestStatusApi(getConfiguration())
  };
};
