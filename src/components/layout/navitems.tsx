import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import Logo from "../../../resources/img/Metatavu-icon.svg";
import Button from "@mui/material/Button";
import { MouseEvent, useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import strings from "../../localization/strings";

const NavItems = () => {
  const [currentPage, setCurrentPage] = useState<string>("");
  const pageRoutes = ["/", "/timebank", "/vacations", "/oncall", "/admin"];

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavItemClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLLinkElement;
    setCurrentPage(target.innerText);
  };

  return (
    <>
      <Link to="/">
        <Button sx={{ marginLeft: -1, height: 48 }} onClick={() => setCurrentPage("Home")}>
          <img src={Logo} alt="Metatavu logo" style={{ height: 40, filter: "invert(100%)" }} />
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
              onClick={handleNavItemClick}
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
            onClick={handleNavItemClick}
          >
            <Button>{page}</Button>
          </Link>
        ))}
      </Box>
    </>
  );
};

export default NavItems;
