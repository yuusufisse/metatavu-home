import { useAtom } from "jotai";
import { authAtom } from "../../../atoms/auth";

/**
 * Dashboard screen component
 * 
 */
const DashboardScreen = () => {
  const [auth] = useAtom(authAtom);

  return (
    <div>
      <div>This is where we would put our dashboard! IF WE HAD ONE!</div>
      <button type="button" onClick={ auth?.logout }>Log out</button>
    </div>
  );
}

export default DashboardScreen;