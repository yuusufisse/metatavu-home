import { Link } from "@mui/material";

/**
 * NavButton Props
 */
export interface Props {
  text: string;
  selected: boolean;
  route?: string;
  sx_props?: object;
}

/**
 * NavButton component
 */
export const NavButton = ({ text, selected, route, sx_props }: Props) => (
  <Link
    href={route}
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
