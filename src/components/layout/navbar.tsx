import { MouseEvent, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LocalizationButtons from "../layout-components/localization-buttons";
import strings from "../../localization/strings";
import { authAtom } from "../../atoms/auth";
import { useAtomValue } from "jotai";
import Logo from "../../../resources/img/Metatavu-icon.svg";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
//import NavItems from "./navitems";

/**
 * NavBar component
 */
const NavBar = () => {
  const auth = useAtomValue(authAtom);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState<string>("Home");
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickLogOut = () => {
    auth?.logout();
  };

  return (
    <>
      <AppBar position="relative">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Link to="/">
              <Button sx={{ marginLeft: -1, height: 48 }} onClick={() => setCurrentPage("Home")}>
                <img
                  src={Logo}
                  alt="Metatavu logo"
                  style={{ height: 40, filter: "invert(100%)" }}
                />
              </Button>
            </Link>
            <Box sx={{ flexGrow: 1 }} /> {/* Remove when showing navitems */}
            {/* <NavItems /> */}
            <LocalizationButtons />
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={strings.header.openUserMenu}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleClickLogOut}>{strings.header.logout}</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default NavBar;
