import { useEffect } from 'react';
import strings from "../../../localization/strings";
import { localeAtom } from "../../../atoms/localeAtom";
import { authAtom } from "../../../atoms/auth";
import { useAtom } from "jotai";

/**
 * Dashboard screen component
 */
const DashboardScreen = () => {
  const [locale] = useAtom(localeAtom);
  
  const [auth] = useAtom(authAtom);

  useEffect(() => {
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
