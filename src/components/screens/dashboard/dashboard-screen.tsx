import strings from "../../../localization/strings";
import { languageAtom } from "../../../atoms/languageAtom";
import { authAtom } from "../../../atoms/auth";
import { useAtom } from "jotai";

/**
 * Dashboard screen component
 */
const DashboardScreen = () => {
  const [_language] = useAtom(languageAtom);
  const [auth] = useAtom(authAtom);


  return (
    <>
      <div>{strings.notYetImplemented}</div>
      <button type="button" onClick={auth?.logout}>
        {strings.logout}
      </button>
    </>
  );
}

export default DashboardScreen;
