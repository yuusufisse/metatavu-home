import { Box, Grid, Skeleton } from "@mui/material";
import { rowItems } from "./skeleton-table-row-items";

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
              {rowItems.map((rowItem, idx) => {
                return (
                  <Skeleton
                    variant={rowItem.variant}
                    key={`skeleton-row-${idx}`}
                    sx={{
                      height: rowItem.height,
                      width: rowItem.width,
                      margin: rowItem.margin
                    }}
                  />
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </>
  );
};

export default SkeletonTableRows;
