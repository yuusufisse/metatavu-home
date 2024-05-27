import { MouseEvent, useState } from "react";
import {MenuItem, AppBar, Box, Toolbar, IconButton, Menu, Container, Tooltip, Avatar } from "@mui/material";
import LocalizationButtons from "../layout-components/localization-buttons";
import strings from "src/localization/strings";
import { authAtom } from "src/atoms/auth";
import { useAtomValue } from "jotai";
import NavItems from "./navitems";
import SyncButton from "./sync-button";

/**
 * NavBar component
 */
const NavBar = () => {
  const auth = useAtomValue(authAtom);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  /**
   * Handles opening user menu
   *
   * @param event mouse event
   */
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  /**
   * Handles closing user menu
   */
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  /**
   * Handles logging out
   */
  const handleClickLogOut = () => {
    auth?.logout();
  };

  return (
    <>
      <AppBar position="relative">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <NavItems />
            {import.meta.env.DEV && <SyncButton />}
            <LocalizationButtons />
            <Box>
              <Tooltip title={strings.header.openUserMenu}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar />
                </IconButton>
              </Tooltip>
              <Menu
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
