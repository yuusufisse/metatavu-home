import { Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import strings from "../../localization/strings";
import UserRoleUtils from "../../utils/user-role-utils";
import UserSprintViewCard from "./sprint-view-card-content.tsx/user-sprint-view-card";
import AdminSprintViewCard from "./sprint-view-card-content.tsx/admin-sprint-view-card";

/**
 * SprintView card component
 */
const SprintViewCard = () => {
  const adminMode = UserRoleUtils.adminMode();
  
  return (
    <Link to={adminMode ? "/admin/sprintview" : "/sprintview"} style={{ textDecoration: "none" }}>
      <Card sx={{"&:hover": {background: "#efefef"}}}>
        <CardContent>
          <Typography variant="h6" fontWeight={"bold"} style={{ marginTop: 6, marginBottom: 3 }}>
            {strings.sprint.sprintview}
          </Typography>
          {adminMode ? (
            <AdminSprintViewCard/>
          ) : (
            <UserSprintViewCard/>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default SprintViewCard;