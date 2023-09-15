import { Grid, Skeleton } from "@mui/material";
import { SkeletonTableRow } from "../../../../../types/data-types";

const SkeletonTableRows = () => {
  const rows: SkeletonTableRow[] = [
    {
      variant: "rounded",
      height: "25px",
      width: "25px",
      margin: "15px 35px 15px 15px"
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
      width: "90px",
      margin: "0 60px 0 0px"
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
      width: "20px",
      margin: "0 130px 0 0px"
    },
    {
      variant: "text",
      height: "20px",
      width: "90px",
      margin: "0 60px 0 0px"
    }
  ];

  return (
    <>
      {[...Array(10)].map(() => {
        return (
          <Grid
            container
            xs={12}
            sx={{
              alignItems: "center",
              border: "1px solid lightgrey"
            }}
          >
            {rows.map((row) => {
              return (
                <Skeleton
                  variant={row.variant}
                  sx={{
                    height: row.height,
                    width: row.width,
                    margin: row.margin
                  }}
                />
              );
            })}
          </Grid>
        );
      })}
    </>
  );
};

export default SkeletonTableRows;
