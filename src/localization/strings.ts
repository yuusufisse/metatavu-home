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
  },
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
    totalTimeFetch: string;
    totalTimeNotFound: string;
    dailyEntriesFetch: string;
    dailyEntriesNotFound: string;
    admin: string;
    changeLanguage: string;
    openSettings: string;
    openUserMenu: string;
    logoAlt: string;
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
  };
}

/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;
