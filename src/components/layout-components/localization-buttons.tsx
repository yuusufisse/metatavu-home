import { useAtom } from "jotai";
import strings from "../../localization/strings";
import { ToggleButton, ToggleButtonGroup, Tooltip, styled } from "@mui/material";
import { languageAtom } from "../../atoms/languageAtom";
import { Language } from "../../types";
import { MouseEvent } from "react";

/**
 * Styled toggle button group component
 */
const LanguageButtons = styled(ToggleButtonGroup)(({ theme }) => ({
  "& .MuiToggleButtonGroup-grouped": {
    margin: theme.spacing(1),
    border: 0,
    width: 48,
    height: 48,
    "&.Mui-disabled": {
      border: 0
    },
    "&:not(:first-of-type)": {
      borderRadius: "50%"
    },
    "&:first-of-type": {
      borderRadius: "50%"
    }
  }
}));

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

  return (
    <LanguageButtons
      value={language}
      exclusive
      onChange={handleLocaleChange}
      aria-label="localization"
    >
      {strings.getAvailableLanguages().map((availableLanguage, idx) => {
        const value = strings.getString(`localization.${availableLanguage}`, language);

        return (
          <Tooltip title="Switch language">
            <ToggleButton value={availableLanguage} key={`${idx}`} selected>
              {value}
            </ToggleButton>
          </Tooltip>
        );
      })}
    </LanguageButtons>
  );
};

export default LocalizationButtons;
