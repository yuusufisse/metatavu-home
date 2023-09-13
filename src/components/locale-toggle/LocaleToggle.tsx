import { useAtom } from 'jotai';
import { localeAtom } from '../../atoms/localeAtom';
import strings from '../../localization/strings';
import { Button } from '@mui/material';


function LocaleToggle() {
    const [locale, setLocale] = useAtom(localeAtom);

        const handleLocaleChange = (newLocale: string) => {
            setLocale(newLocale);
            strings.setLanguage(newLocale);
};

/**
 * Renders localization buttons
 */
const renderLocalizationButtons = () => (
    <div>
      {strings.getAvailableLanguages().map((lang) => (
        <Button
            key={lang}
            className={lang === locale ? "selected" : ""}
            onClick={() => handleLocaleChange(lang)}
        >
            {strings.getString(`localization.${lang}`, locale)}
        </Button>
      ))}
    </div>
);

return (
    <div>
        {renderLocalizationButtons()}
        <p>{strings.currentLocaleLabel} {locale}</p>
    </div>
);
}

export default LocaleToggle;
