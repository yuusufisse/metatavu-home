import LocalizedStrings, { type LocalizedStringsMethods } from "localized-strings";
import en from "./en.json";
import fi from "./fi.json";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {

}
const strings: IStrings = new LocalizedStrings({ en: en, fi: fi });

export default strings;