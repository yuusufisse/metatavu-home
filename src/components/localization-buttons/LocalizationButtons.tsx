import { useAtom } from "jotai";
import strings from "../../localization/strings";
import { Button } from "@mui/material";
import { languageAtom } from "../../atoms/languageAtom";
import { Language } from "../../types";

/**
 * LocalizationButtons component
 */
const LocalizationButtons: React.FC = () => {
  const [language, setLanguage] = useAtom(languageAtom);

  /**
   * Method to handle locale change
   */
  const handleLocaleChange = (newLanguage: string) => {
    setLanguage(newLanguage as Language);
  };

  /**
   * Renders localization buttons
   */
  const renderLocalizationButtons = () => (
    <div>
      {strings.getAvailableLanguages().map((lang) => (
        <Button
          key={lang}
          className={lang === language ? "selected" : ""}
          onClick={() => handleLocaleChange(lang)}
        >
          {strings.getString(`localization.${lang}`, language)}
        </Button>
      ))}
    </div>
  );

  return (
    <div>
      {renderLocalizationButtons()}
      <p>
        {strings.label.currentLocaleLabel} {language}
      </p>
    </div>
  );
};

export default LocalizationButtons;
