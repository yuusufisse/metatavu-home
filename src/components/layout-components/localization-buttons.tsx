import { useAtom } from "jotai";
import strings from "../../localization/strings";
import { ToggleButton, ToggleButtonGroup, Tooltip, styled } from "@mui/material";
import { languageAtom } from "../../atoms/languageAtom";
import { Language } from "../../types";
/**
 * Styled toggle button group component for language switching
 */
export const LanguageButtons = styled(ToggleButtonGroup)(({ theme }) => ({
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
 * LocalizationButton component
 */
const LocalizationButton = () => {
  const [language, setLanguage] = useAtom(languageAtom);

  /**
   * Handles localization change
   *
   * @param locale locale to change to
   */
  const handleLocaleChange = (locale: string) => {
    const newLocale: Language = locale === "en-gb" ? "fi" : "en-gb";
    setLanguage(newLocale as Language);
  };

  return (
    <LanguageButtons value={language} exclusive aria-label="localization">
      <Tooltip title={strings.header.changeLanguage}>
        <ToggleButton value={language} onChange={() => handleLocaleChange(language)}>
          {language === "fi" ? "FI" : "EN"}
        </ToggleButton>
      </Tooltip>
    </LanguageButtons>
  );
};

export default LocalizationButton;
