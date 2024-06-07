import { type ReactNode, useEffect, useState } from "react";
import UserRoleUtils from "src/utils/user-role-utils";
import AdminRouteErrorScreen from "../screens/admin-route-error-screen";

/**
 * Component properties
 */
interface Props {
  children: ReactNode;
}

/**
 * Restricted content provider component
 *
 * @param props component properties
 * @returns admin route screen if restricted, child components otherwise
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
