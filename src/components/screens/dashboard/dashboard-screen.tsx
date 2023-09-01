import { type Auth } from "../../../App";

interface Props {
  auth: Auth
}

/**
 * Dashboard screen component
 * 
 */
function DashboardScreen (props: Props) {
  const { auth } = props;
  return (
    <div>
      <div>This is where we would put our dashboard! IF WE HAD ONE!</div>
      <button onClick={() => { auth.logout(); } }>Log out</button>
    </div>
  );
}

export default DashboardScreen;