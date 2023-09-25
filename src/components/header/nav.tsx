import { Box } from "@mui/material";
import { Auth } from "../../atoms/auth";
import { NavButton } from "./navbutton";
import strings from "../../localization/strings";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

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
  const location = useLocation();
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "16px",
        paddingRight: "22px",
        paddingBottom: "14px",
        paddingLeft: "0px"
      }}
    >
      <Box>
        <NavButton
          text={strings.header.home}
          route={"/"}
          selected={location.pathname === "/"}
          sx_props={{
            borderTopLeftRadius: "15px",
            borderBottomLeftRadius: "15px"
          }}
        />
        <NavButton text={strings.header.admin} route={"#"} selected={false} />
        <NavButton text={strings.header.onCall} route={"#"} selected={false} />
        <NavButton
          text={strings.header.timebank}
          route={"/timebank"}
          selected={location.pathname === "/timebank"}
        />
      </Box>
      <Box>
        <Link
          to="#"
          type="button"
          onClick={() => auth?.logout()}
          style={{
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
