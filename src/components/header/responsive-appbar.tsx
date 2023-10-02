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
import { Auth } from "../../atoms/auth";
import { Link } from "react-router-dom";

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
const ResponsiveAppBar = ({ auth }: Props) => {
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

  const pageRoutes = ["/", "/vacations", "/oncall", "/admin"];

  return (
    <AppBar position="relative">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            sx={{ height: 32, filter: "invert(100%)" }} //not dark mode compatible solution
            alt="Metatavu logo"
            src={Logo}
          />
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
              {strings.header.pages.map((page, index) => (
                <MenuItem
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
            <Button disabled>
              <Typography>{currentPage}</Typography>
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {strings.header.pages.map((page, index) => (
              <Link
                key={page}
                to={pageRoutes[index]}
                style={{ margin: 2, display: "block" }}
                onClick={() => {
                  handleCloseNavMenu();
                  setCurrentPage(page);
                }}
              >
                {page}
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
  );
};
export default ResponsiveAppBar;
