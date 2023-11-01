import { useRouteError } from "react-router-dom";
import strings from "../../localization/strings";

/**
 * Error page for displaying error status text and message
 *
 * @returns ReactElement
 */
const ErrorScreen = () => {
  const error: unknown = useRouteError();

  return (
    <div>
      <h1>{strings.error.oops}</h1>
      <p>{strings.error.generic}</p>
      <p>
        <i>{(error as Error)?.message || (error as { statusText?: string })?.statusText}</i>
      </p>
    </div>
  );
};

export default ErrorScreen;
