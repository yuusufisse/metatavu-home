import { useAtom } from "jotai";
import strings from "../../localization/strings";
import { ToggleButton, ToggleButtonGroup, Tooltip, styled } from "@mui/material";
import { languageAtom } from "../../atoms/languageAtom";
import { Language } from "../../types";
import { MouseEvent, useEffect, useState } from "react";

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
const LocalizationButton = () => {
  const [selected, setSelected] = useState(false);
  const [language, setLanguage] = useAtom(languageAtom);
  const availableLanguages = strings.getAvailableLanguages();
  /**
   * Method to handle locale change
   */
  const handleLocaleChange = (_event: MouseEvent<HTMLElement>, newLanguage: Language) => {
    if (newLanguage) {
      setLanguage(newLanguage as Language);
    }
  };

  useEffect(() => {
    setLanguage(availableLanguages[selected?1:0] as Language);
  }, [selected]);

  return (
    <LanguageButtons
      value={language}
      exclusive
      onChange={handleLocaleChange}
      aria-label="localization"
    >
      <Tooltip title={strings.header.changeLanguage}>
        <ToggleButton 
          value={language} 
          selected={selected}
          onChange={() => {
            setSelected(!selected)
          }}
        >
          {language}
        </ToggleButton>
      </Tooltip>
    </LanguageButtons>
  );
};

export default LocalizationButton;
