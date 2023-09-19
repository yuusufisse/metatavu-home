import { useAtom } from "jotai";
import strings from "../../localization/strings";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { languageAtom } from "../../atoms/languageAtom";
import { Language } from "../../types";
import { MouseEvent } from "react";

/**
 * LocalizationButtons component
 */
const LocalizationButtons = () => {
  const [language, setLanguage] = useAtom(languageAtom);

  /**
   * Method to handle locale change
   */
  const handleLocaleChange = (_event: MouseEvent<HTMLElement>, newLanguage: Language) => {
    if (newLanguage) {
      setLanguage(newLanguage as Language);
    }
  };

  /**
   * Renders localization buttons
   */
  const renderLocalizationButtons = () => (
    <ToggleButtonGroup
      value={language}
      exclusive
      onChange={handleLocaleChange}
      aria-label="localization"
    >
      {strings.getAvailableLanguages().map((availableLanguage, idx) => {
        const value = strings.getString(`localization.${availableLanguage}`, language);

        return (
          <ToggleButton value={availableLanguage} key={`${idx}`}>
            {value}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );

  return <div>{renderLocalizationButtons()}</div>;
};

export default LocalizationButtons;
