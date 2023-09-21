import { Link } from "react-router-dom";

/**
 * NavButton Props
 */
export interface Props {
  text: string;
  selected: boolean;
  route: string;
  sx_props?: object;
}

/**
 * NavButton component
 */
export const NavButton = ({ text, selected, route, sx_props }: Props) => (
  <Link
    to={route}
    style={Object.assign(
      {
        backgroundColor: selected ? "#dee2e5" : "",
        height: "100%",
        padding: "15px",
        textDecoration: "none",
        color: "black"
      },
      sx_props
    )}
  >
    {text}
  </Link>
);
