import { Box, Grid } from "@mui/material";
import VacationRequestsTableColumns from "../vacation-requests-table-columns";
import SkeletonTableRowCheckbox from "./skeleton-table-row-checkbox";
import SkeletonTableItem from "./skeleton-table-row-item";

/**
 * Skeleton table rows component
 */
const SkeletonTableRows = () => {
  const { columns } = VacationRequestsTableColumns();
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
            <Grid container alignItems="center" key={`skeleton-row-grid-container${idx}`}>
              {columns.map((column, idx) => (
                <Box
                  key={`skeleton-row-grid-item-box${idx}`}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {idx === 0 ? <SkeletonTableRowCheckbox idx={idx} /> : null}
                  <SkeletonTableItem idx={idx} column={column} />
                </Box>
              ))}
            </Grid>
          </Box>
        );
      })}
    </>
  );
};

export default SkeletonTableRows;
