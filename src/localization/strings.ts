import en from "./en.json";
import fi from "./fi.json";
import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
 * Localized strings
 */
export interface Localized extends LocalizedStringsMethods {
  /**
   * Translations related to generic words
   */
  placeHolder: {
    notYetImplemented: string;
  };
  label: {
    currentLocaleLabel: string;
  };
  /**
   * Translations related to header
   */
  header: {
    hello: string;
    logout: string;
    home: string;
    timebank: string;
    vacations: string;
    onCall: string;
    admin: string;
    changeLanguage: string;
    openSettings: string;
    openUserMenu: string;
    logoAlt: string;
  };
  /**
   * Translations related to errors
   */
  error: {
    oops: string;
    generic: string;
    totalTimeFetch: string;
    totalTimeNotFound: string;
    dailyEntriesFetch: string;
    dailyEntriesNotFound: string;
    fetchFailedGeneral: string;
    fetchFailedNoEntriesGeneral: string;
  };
  /**
   * Translations related to localization
   */
  localization: {
    en: string;
    fi: string;
    time: string;
  };
  /**
   * Translations related to timebank
   */
  timebank: {
    balance: string;
    yourBalanceIs: string;
    logged: string;
    expected: string;
    billableProject: string;
    nonBillableProject: string;
    internal: string;
    billableHours: string;
    timeperiod: string;
    noData: string;
    selectEntry: string;
    latestEntry: string;
    barChartDescription: string;
    pieChartDescription: string;
    byrange: string;
  };
  /**
   * General time-related expressions
   */
  timeExpressions: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    day: string;
    week: string;
    month: string;
    year: string;
    allTime: string;
    startDate: string;
    endDate: string;
  };
  /**
   * Translations related to confirmation handler
   */
  confirmationHandler: {
    confirmButtonText: string;
    cancelButtonText: string;
    title: string;
    message: string;
  };
  /**
   * Translations related to error handler
   */
  errorHandler: {
    cancelButtonText: string;
    title: string;
  };
  /**
   * Translations related to vacation request
   */
  vacationRequest: {
    startDate: string;
    endDate: string;
    type: string;
    message: string;
    days: string;
    status: string;
    updatedAt: string;
    pending: string;
    approved: string;
    declined: string;
    vacation: string;
    maternityPaternityLeave: string;
    unpaidTimeOff: string;
    sickness: string;
    personalDays: string;
    childSickness: string;
    noMessage: string;
    noStatus: string;
    person: string;
    noPersonFullName: string;
  };
  /**
   * Translations related to vacation requests errors
   */
  vacationRequestError: {
    fetchRequestError: string;
    fetchStatusError: string;
    createRequestError: string;
    createStatusError: string;
    deleteRequestError: string;
    deleteStatusError: string;
    updateRequestError: string;
    updateStatusError: string;
  };
  /**
   * Translations related to form
   */
  form: {
    submit: string;
    update: string;
  };
  /**
   * Translation related to table toolbar
   */
  tableToolbar: {
    delete: string;
    myRequests: string;
    createRequests: string;
    editRequests: string;
    edit: string;
    cancel: string;
    create: string;
    manageRequests: string;
  };
  /**
   * Translations related to data grid
   */
  dataGrid: {
    noRows: string;
  };
  /**
   * Translations related to vacations card
   */
  vacationsCard: {
    vacations: string;
  };
  /**
   * Translation related to person select dropdown
   */
  personSelectDropdown: {
    label: string;
  };
  /**
   * Translations related to toolbar update status button
   */
  toolbarUpdateStatusButton: {
    approve: string;
    decline: string;
  };
}

/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;
