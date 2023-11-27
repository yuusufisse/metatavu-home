import { ReactNode, useEffect, useState } from "react";
import UserRoleUtils from "../../utils/user-role-utils";
import ErrorScreen from "../screens/error-screen";
import strings from "../../localization/strings";
import { useNavigate } from "react-router";

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

/**
 * Component properties
 */
interface Props {
  children: ReactNode;
}

/**
 * Restricted content provider component
 */
const RestrictedContentProvider = ({ children }: Props) => {
  const admin = UserRoleUtils.isAdmin();
  const [restricted, setRestricted] = useState(!admin);

  useEffect(() => {
    if (admin) {
      setRestricted(false);
    } else {
      setRestricted(true);
    }
  }, [admin]);

  if (restricted) {
    return <AdminRouteErrorScreen />;
  }

  return <>{children}</>;
};

export default RestrictedContentProvider;
