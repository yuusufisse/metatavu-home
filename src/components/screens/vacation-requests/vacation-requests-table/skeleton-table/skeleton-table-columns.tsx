import { Grid, Skeleton } from "@mui/material";
import { SkeletonTableColumn } from "../../../../../types/data-types";

const SkeletonTableColumns = () => {
  const columns: SkeletonTableColumn[] = [
    {
      variant: "rounded",
      height: "25px",
      width: "25px",
      margin: "15px 35px 15px 15px"
    },
    {
      variant: "text",
      height: "20px",
      width: "110px",
      margin: "0 40px 0 0px"
    },
    {
      variant: "text",
      height: "20px",
      width: "70px",
      margin: "0 80px 0 0px"
    },
    {
      variant: "text",
      height: "20px",
      width: "70px",
      margin: "0 80px 0 0px"
    },
    {
      variant: "text",
      height: "20px",
      width: "90px",
      margin: "0 60px 0 0px"
    },
    {
      variant: "text",
      height: "20px",
      width: "70px",
      margin: "0 80px 0 0px"
    }
  ];
  return (
    <Grid
      container
      sx={{
        alignItems: "center",
        border: "1px solid lightgrey"
      }}
    >
      {columns.map((column) => {
        return (
          <Skeleton
            variant={column.variant}
            sx={{
              height: column.height,
              width: column.width,
              m: column.margin
            }}
          />
        );
      })}
    </Grid>
  );
};

export default SkeletonTableColumns;
