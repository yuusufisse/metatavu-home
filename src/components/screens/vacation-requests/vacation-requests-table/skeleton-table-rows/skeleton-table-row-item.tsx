import { Skeleton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";

interface SkeletonTableItemProps {
  idx: number;
  column: GridColDef;
}

const SkeletonTableItem = ({ idx, column }: SkeletonTableItemProps) => {
  const marginRight = 20;
  return (
    <Skeleton
      variant={"text"}
      key={`skeleton-text${idx}`}
      sx={{
        height: "20px",
        width: `${column.width ? column.width - marginRight : column.width}px`,
        marginRight: `${marginRight}px`
      }}
    />
  );
};

export default SkeletonTableItem;
