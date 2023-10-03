import { Box, Grid } from "@mui/material";
import { columns } from "../vacation-requests-table-columns";
import SkeletonTableRowCheckbox from "./skeleton-table-row-checkbox";
import SkeletonTableItem from "./skeleton-table-row-item";

/**
 * Skeleton table rows component
 */
const SkeletonTableRows = () => {
  return (
    <>
      {[...Array(11)].map((_item, idx) => {
        return (
          <Box
            key={`skeleton-row-container${idx}`}
            sx={{
              borderBottom: "1px solid lightgrey"
            }}
          >
            <Grid container alignItems="center">
              {columns.map((column, idx) => {
                if (idx === 0) {
                  return (
                    <>
                      <SkeletonTableRowCheckbox idx={idx} />
                      <SkeletonTableItem idx={idx} column={column} />
                    </>
                  );
                } else {
                  return <SkeletonTableItem idx={idx} column={column} />;
                }
              })}
            </Grid>
          </Box>
        );
      })}
    </>
  );
};

export default SkeletonTableRows;
