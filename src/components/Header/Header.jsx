    // import { NavLink } from "react-router-dom";
    // import { Dropdown } from "react-bootstrap";
    // import logo from "../../assets/general-electric.svg";
    // import "../Header/Header.css"

    // export default function Header() {
    //     return (
    //         <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-2">
    //             {/* Container for left and right sections */}
    //             <div className="container-fluid d-flex justify-content-between align-items-center ms-n1 me-1">

    //                 {/* Left section: Logo + Name + Menu */}
    //                 <div className="d-flex align-items-center">
    //                     {/* Logo + Name */}
    //                     <div className="logo-name-wrapper">
    //                         <img src={logo} alt="company Logo" height="40" className="me-2" />
    //                         <span className="fw-bold fs-5">GE Aerospace</span>
    //                     </div>

    //                     {/* Menu items */}
    //                     <NavLink 
    //                         to="/" 
    //                         className={({ isActive }) => `nav-link fw-semibold menu-item ${isActive ? 'active-tab' : ''}`}
    //                     >
    //                         Home
    //                     </NavLink>

    //                     <Dropdown className="menu-item">
    //                         <Dropdown.Toggle variant="link" className="nav-link fw-semibold">
    //                             Self Service
    //                         </Dropdown.Toggle>
    //                         <Dropdown.Menu>
    //                             <Dropdown.Item href="/my/dns-request">DNS Management</Dropdown.Item>
    //                             <Dropdown.Item href="#">IPAM</Dropdown.Item>
    //                         </Dropdown.Menu>
    //                     </Dropdown>

    //                     <NavLink 
    //                         to="/tools" 
    //                         className={({ isActive }) => `nav-link fw-semibold menu-item ${isActive ? 'active-tab' : ''}`}
    //                     >
    //                         Tools
    //                     </NavLink>

    //                     <NavLink 
    //                         to="/faqs" 
    //                         className={({ isActive }) => `nav-link fw-semibold menu-item ${isActive ? 'active-tab' : ''}`}
    //                     >
    //                         FAQ
    //                     </NavLink>
    //                 </div>

    //                 {/* Right section: Sign-in */}
    //                 <div className="d-flex align-items-center">
    //                     <span className="me-2 fw-semibold">Hello, Aditya</span>
    //                     <i className="bi bi-person-circle fs-4"></i>
    //                 </div>

    //             </div>
    //         </nav>
    //     );
    // }

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import logo from "../../assets/general-electric.svg";

export default function Header() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const open = Boolean(anchorEl);
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (path) => {
    setAnchorEl(null);
    if (path) navigate(path);
  };

  const navLinks = [
    { label: "Home", path: "/" },
    {
      label: "Self Service",
      submenu: [
        { label: "DNS Management", path: "/my/dns-request" },
        { label: "IPAM", path: "/ipam/requests" },
      ],
    },
    { label: "Tools", path: "/tools" },
    { label: "FAQ", path: "/faqs" },
  ];

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: "none",
    marginLeft: "16px",
    fontWeight: 600,
    color: isActive ? "#1976d2" : "#000",
    borderBottom: isActive ? "3px solid #1976d2" : "none",
    paddingBottom: "4px",
  });

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: "#fff", borderBottom: "1px solid #ddd" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* ===== Left Section ===== */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <img src={logo} alt="GE Logo" height={40} />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold", color: "#000" }}>
              GE Aerospace
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile &&
            navLinks.map((link) =>
              link.submenu ? (
                <Box key={link.label} sx={{ ml: 2 }}>
                  <Typography
                    onClick={handleMenuOpen}
                    sx={{
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: "#000",
                    }}
                  >
                    {link.label} <KeyboardArrowDownIcon />
                  </Typography>

                  <Menu anchorEl={anchorEl} open={open} onClose={() => handleMenuClose()}>
                    {link.submenu.map((sublink) => (
                      <MenuItem key={sublink.label} onClick={() => handleMenuClose(sublink.path)}>
                        {sublink.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                <NavLink key={link.label} to={link.path} style={navLinkStyle}>
                  {link.label}
                </NavLink>
              )
            )}
        </Box>

        {/* ===== Right Section ===== */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!isMobile && (
            <Typography sx={{ mr: 1, fontWeight: 600, color: "#000" }}>
              Hello, Aditya
            </Typography>
          )}
          <IconButton sx={{ color: "#000" }}>
            <AccountCircleIcon fontSize="large" />
          </IconButton>

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        {/* ===== Mobile Drawer ===== */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
          >
            <List sx={{ textAlign: "left", p: 0 }}>
              {navLinks.map((link) =>
                link.submenu ? (
                  <Box key={link.label} sx={{ mb: 1 }}>
                    <ListItem sx={{ px: 2 }}>
                      <ListItemText
                        primary={link.label}
                        sx={{ fontWeight: "bold", textAlign: "left", fontSize: 16 }}
                      />
                    </ListItem>
                    {link.submenu.map((sublink) => (
                      <ListItem key={sublink.label} disablePadding sx={{ pl: 4 }}>
                        <ListItemButton onClick={() => navigate(sublink.path)}>
                          <ListItemText
                            primary={sublink.label}
                            sx={{ textAlign: "left", fontSize: 14 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </Box>
                ) : (
                  <ListItem key={link.label} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton onClick={() => navigate(link.path)} sx={{ px: 2 }}>
                      <ListItemText
                        primary={link.label}
                        sx={{ fontWeight: "bold", textAlign: "left", fontSize: 16 }}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </List>
          </Box>
        </Drawer>
        
      </Toolbar>
    </AppBar>
  );
}


