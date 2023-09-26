import { Box, Grid, Skeleton, Typography } from "@mui/material";
import SkeletonTableColumns from "./skeleton-table-columns";
import SkeletonTableRows from "./skeleton-table-rows";

const VacationRequestsSkeletonTable = () => {
  return (
    <>
      <Box
        sx={{
          border: "1px solid lightgrey",
          margin: "0"
        }}
      >
        <Grid container alignContent="space-around" alignItems="center">
          <Grid
            item
            xs={6}
            sx={{
              p: "10px"
            }}
          >
            <Typography variant="h5">My Vacation Requests</Typography>
          </Grid>
        </Grid>
      </Box>
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
        <Skeleton
          variant="rounded"
          sx={{
            width: "60px",
            margin: "0 30px 0 0"
          }}
        />
        <Skeleton
          variant="rounded"
          sx={{
            width: "60px",
            margin: "0 20px 0 0"
          }}
        />
      </Grid>
    </>
  );
};

export default VacationRequestsSkeletonTable;
