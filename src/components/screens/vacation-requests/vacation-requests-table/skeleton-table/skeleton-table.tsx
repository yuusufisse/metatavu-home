import { Grid, Skeleton } from "@mui/material";
import VacationRequestsTableToolbar from "../vacation-requests-table-toolbar";
import SkeletonTableColumns from "./skeleton-table-columns";
import SkeletonTableRows from "./skeleton-table-rows";

const VacationRequestsSkeletonTable = () => {
  return (
    <>
      <VacationRequestsTableToolbar skeleton={true} />
      <SkeletonTableColumns />
      <SkeletonTableRows />
      <Grid
        container
        sx={{
          justifyContent: "flex-end",
          alignItems: "center",
          border: "1px solid lightgrey",
          height: "56px"
        }}
      >
        <Skeleton variant="rounded" sx={{ width: "60px", margin: "0 30px 0 0" }} />
        <Skeleton variant="rounded" sx={{ width: "60px", margin: "0 20px 0 0" }} />
      </Grid>
    </>
  );
};

export default VacationRequestsSkeletonTable;
