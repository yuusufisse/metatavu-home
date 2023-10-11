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
   * Translations related to place holders
   */
  placeHolder: {
    notYetImplemented: string;
  };
  /**
   * Translations related to localization
   */
  localization: {
    en: string;
    fi: string;
  };
  /**
   * Translations related to timebank
   */
  timebank: {
    balance: string;
    yourBalanceIs: string;
  };
  /**
   * Translations related to errors
   */
  errors: {
    fetchFailedGeneral: string;
    fetchFailedNoEntriesGeneral: string;
  };
  /**
   * Translations related to confirmation handler
   */
  confirmationHandler: {
    confirmButtonText: string;
    cancelButtonText: string;
    title: string;
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
  };
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
  form: {
    submit: string;
  };
  tableToolbar: {
    delete: string;
    myRequests: string;
    edit: string;
    cancel: string;
    create: string;
  };
}

/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;
