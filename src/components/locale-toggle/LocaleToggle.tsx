import { useAtom } from 'jotai';
import strings from '../../localization/strings';
import { Button } from '@mui/material';
import { languageAtom } from '../../atoms/languageAtom';
import { Language } from '../../types';

/**
 * Function to change language of the app
 */
function LocaleToggle() {
    const [language, setLanguage] = useAtom(languageAtom);

    const handleLocaleChange = (newLanguage: string) => {
        setLanguage(newLanguage as Language);
        strings.setLanguage(newLanguage);
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
            <p>{strings.currentLocaleLabel} {language}</p>
        </div>
    );
}

export default LocaleToggle;
