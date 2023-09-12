import { useAtom } from 'jotai';
import { localeAtom } from '../../atoms/localeAtom';
import strings from '../../localization/strings';

function LocaleToggle() {
    const [locale, setLocale] = useAtom(localeAtom);

    const handleLocaleChange = (newLocale: string) => {
        setLocale(newLocale);
        strings.setLanguage(newLocale);
    };

    return (
        <div>
            <button onClick={() => handleLocaleChange("fi")}>FI</button>
            <button onClick={() => handleLocaleChange("en")}>EN</button>
            <p>Current Locale: {locale}</p>
        </div>
    );
}

export default LocaleToggle;
