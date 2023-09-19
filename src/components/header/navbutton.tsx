import { Link } from "@mui/material";
import { NavButtonProps } from "../../types";

/**
 * NavButton component
 */
export const NavButton = ({ text, selected, sx_props }: NavButtonProps) => (
  <Link
    href="#"
    underline="none"
    sx={Object.assign(
      {
        "background-color": selected ? "#dee2e5" : "",
        height: "100%",
        padding: "15px"
      },
      sx_props
    )}
  >
    {text}
  </Link>
);
