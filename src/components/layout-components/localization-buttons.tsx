import { useAtom } from "jotai";
import strings from "../../localization/strings";
import { ToggleButton, Tooltip } from "@mui/material";
import { languageAtom } from "../../atoms/languageAtom";
import { Language } from "../../types";
import { useEffect, useState } from "react";
import { LanguageButtons } from "../../theme";

/**
 * LocalizationButton component
 */
const LocalizationButton = () => {
  const [selected, setSelected] = useState(false);
  const [language, setLanguage] = useAtom(languageAtom);
  const availableLanguages = strings.getAvailableLanguages();

  useEffect(() => {
    setLanguage(availableLanguages[selected ? 1 : 0] as Language);
  }, [selected]);

  return (
    <LanguageButtons
      value={language}
      exclusive
      aria-label="localization"
    >
      <Tooltip title={strings.header.changeLanguage}>
        <ToggleButton
          value={language}
          selected={selected}
          onChange={() => {
            setSelected(!selected);
          }}
        >
          {language}
        </ToggleButton>
      </Tooltip>
    </LanguageButtons>
  );
};

export default LocalizationButton;
