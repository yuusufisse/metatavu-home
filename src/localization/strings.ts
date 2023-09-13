import en from "./en.json";
import fi from "./fi.json";
import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
* Language names interface
*/
interface Localizations {
  en: string;
  fi: string;
}

/**
* Translations interface
*/
interface Translations {
  notYetImplemented: string;
  currentLocaleLabel: string;
  localization: Localizations;
}

/**
* Localized strings
*/
export interface Localized extends LocalizedStringsMethods, Translations {}

/**
* Initialized localized strings
*/
const strings: Localized = new LocalizedStrings({
  en: en,
  fi: fi
});

export default strings;
