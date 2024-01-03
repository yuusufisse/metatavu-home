import { useEffect } from "react";
import { useNavigate } from "react-router";
import strings from "../../localization/strings";
import ErrorScreen from "./error-screen";

/**
 * Admin route error screen component
 */
const AdminRouteErrorScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorScreen
      message={strings.adminRouteAccess.notAdmin}
      title={strings.adminRouteAccess.noAccess}
    />
  );
};

export default AdminRouteErrorScreen;
