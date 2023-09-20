import { Link } from "@mui/material";

/**
 * NavButton Props
 */
export interface Props {
  text: string;
  selected: boolean;
  sx_props?: object;
}

/**
 * NavButton component
 */
export const NavButton = ({ text, selected, sx_props }: Props) => (
  <Link
    href="#"
    underline="none"
    sx={Object.assign(
      {
        "backgroundColor": selected ? "#dee2e5" : "",
        height: "100%",
        padding: "15px"
      },
      sx_props
    )}
  >
    {text}
  </Link>
);
