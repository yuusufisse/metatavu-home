import LocalizedStrings, { type LocalizedStringsMethods } from "localized-strings";
import en from "./en.json";
import fi from "./fi.json";

/**
 * Type representing the shape of your translation strings
 */
interface TranslationStrings {
  notYetImplemented: string
}

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods, TranslationStrings {
    
}

const strings: IStrings = new LocalizedStrings({
  en: en,
  fi: fi
});

export default strings;