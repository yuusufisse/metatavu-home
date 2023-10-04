import { Skeleton } from "@mui/material";

interface CheckboxSkeletonProps {
  idx: number;
}
const SkeletonTableRowCheckbox = ({ idx }: CheckboxSkeletonProps) => (
  <Skeleton
    variant={"rounded"}
    key={`skeleton-row-checkbox${idx}`}
    sx={{
      height: "20px",
      width: "20px",
      margin: "15px 25px 15px 14px"
    }}
  />
);

export default SkeletonTableRowCheckbox;
