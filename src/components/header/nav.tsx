import { Box, Link } from "@mui/material";
import { Auth } from "../../atoms/auth";
import { NavButton } from "./navbutton";

/**
 * Props for HomeNav component
 */
interface Props {
  auth: Auth | undefined;
}

/**
 * HomeNav component
 */
const HomeNav = ({ auth }: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        "padding-top": "16px",
        "padding-right": "22px",
        "padding-bottom": "14px",
        "padding-left": "0px"
      }}
    >
      <Box>
        <NavButton
          text="Home"
          selected={true}
          sx_props={{
            "border-top-left-radius": "15px",
            "border-bottom-left-radius": "15px"
          }}
        />
        <NavButton text="Admin" selected={false} />
        <NavButton text="On call" selected={false} />
      </Box>
      <Box>
        <Link
          href="#"
          type="button"
          onClick={() => auth?.logout()}
          sx={{
            display: "flex",
            justifyContent: "right"
          }}
        >
          Log out
        </Link>
      </Box>
    </Box>
  );
};

export default HomeNav;
