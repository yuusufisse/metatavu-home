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
}

/**
 * Initialized localized strings
 */
const strings: Localized = new LocalizedStrings({ en: en, fi: fi });

export default strings;
