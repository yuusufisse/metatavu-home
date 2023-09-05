import React from "react";
import strings from "../../../localization/strings";
import { useLocale } from "../../../localization/LanguageSwitcher";

/**
 * Dashboard screen component
 */
function DashboardScreen () {
  const { locale } = useLocale();

  React.useEffect(() => {
    strings.setLanguage(locale);
  }, [locale]);

  return <div>{strings.notYetImplemented}</div>;
}

export default DashboardScreen;