import { Box, Link } from "@mui/material";
import { Auth } from "../../atoms/auth";
import { NavButton } from "./navbutton";
import strings from "../../localization/strings";

/**
 * Component properties
 */
interface Props {
  auth: Auth | undefined;
}

/**
 * HomeNav component
 * @param props component properties
 */
const HomeNav = ({ auth }: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        "paddingTop": "16px",
        "paddingRight": "22px",
        "paddingBottom": "14px",
        "paddingLeft": "0px"
      }}
    >
      <Box>
        <NavButton
          text={strings.header.home}
          selected={true}
          sx_props={{
            "borderTopLeftRadius": "15px",
            "borderBottomLeftRadius": "15px"
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
