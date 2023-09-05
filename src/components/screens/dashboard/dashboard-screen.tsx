import React from "react";
import strings from "../../../localization/strings";
import { useLocale } from "../../../localization/LanguageSwitcher";

/**
 * Dashboard screen component
 */
const DashboardScreen = () => {
  const { locale } = useLocale();
  const [auth] = useAtom(authAtom);
  React.useEffect(() => {
    strings.setLanguage(locale);
  }, [locale]);

  return (
    <>
      <div>{strings.notYetImplemented}</div>
      <button type="button" onClick={ auth?.logout }>Log out</button>
    </>
  );
}
export default DashboardScreen;