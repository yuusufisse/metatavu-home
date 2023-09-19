import { Box, Link } from "@mui/material";
import { Auth } from "../../atoms/auth";
import { NavButton } from "./navbutton";
import strings from "../../localization/strings";
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
          text={strings.header.home}
          selected={true}
          sx_props={{
            "border-top-left-radius": "15px",
            "border-bottom-left-radius": "15px"
          }}
        />
        <NavButton text={strings.header.admin} selected={false} />
        <NavButton text={strings.header.onCall} selected={false} />
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
          {strings.header.logout}
        </Link>
      </Box>
    </Box>
  );
};

export default HomeNav;
