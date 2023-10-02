import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Logo from "../../../resources/img/Metatavu-icon.svg";
import LocalizationButtons from "../layout-components/localization-buttons";
import strings from "../../localization/strings";
import { authAtom } from "../../atoms/auth";
import { Link } from "react-router-dom";
import { useAtomValue } from "jotai";

/**
 * NavBar component
 */
const NavBar = () => {
  const auth = useAtomValue(authAtom);
  
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState<string>("Home");

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const pageRoutes = ["/", "/timebank", "/vacations", "/oncall", "/admin"];

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
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="mobile menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" }
                }}
              >
                {strings.header.pages.slice(1).map((page, index) => (
                  <MenuItem
                    component={Link}
                    to={pageRoutes.slice(1)[index]}
                    key={strings.header.pages[index]}
                    onClick={() => {
                      handleCloseNavMenu();
                      setCurrentPage(page);
                    }}
                  >
                    {page}
                  </MenuItem>
                ))}
              </Menu>
              <Typography variant="button" marginTop={1.5}>
                {currentPage}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {strings.header.pages.slice(1).map((page, index) => (
                <Link
                  key={page}
                  to={pageRoutes.slice(1)[index]}
                  style={{ margin: 2, display: "block" }}
                  onClick={() => {
                    handleCloseNavMenu();
                    setCurrentPage(page);
                  }}
                >
                  <Button>{page}</Button>
                </Link>
              ))}
            </Box>
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
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    auth?.logout();
                  }}
                >
                  <Typography textAlign="center">{strings.header.logout}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
export default NavBar;
