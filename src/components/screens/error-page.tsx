import { type ReactElement } from "react";
import { useRouteError } from "react-router-dom";

/**
 * Error page for displaying error status text and message
 * 
 * @returns ReactElement
 */
export default function ErrorPage (): ReactElement {
  const error: unknown || something else? = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {error.statusText}
          {error.message}
        </i>
      </p>
    </div>
  );
}