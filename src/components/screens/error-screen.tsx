import { useRouteError } from "react-router-dom";

/**
 * Error page for displaying error status text and message
 *
 * @returns ReactElement
 */
const ErrorScreen = () => {
  const error: unknown = useRouteError();

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{(error as Error)?.message || (error as { statusText?: string })?.statusText}</i>
      </p>
    </div>
  );
};

export default ErrorScreen;
