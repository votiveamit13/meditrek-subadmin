import React from "react";
import { Outlet } from "react-router-dom";

import { styled } from "@mui/material/styles";
import { AppBar, Box, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/material/styles';

import Header from "./Header";
import Sidebar from "./Sidebar";

const drawerWidth = 232;
const collapsedWidth = 72;

const Main = styled("main")(({ theme, open }) => ({
  flexGrow: 1,
  background: "#f5f7fa",
  minHeight: "100vh",
  transition: "margin 0.25s ease",
  [theme.breakpoints.up('md')]: {
    marginLeft: open ? drawerWidth : collapsedWidth
  },
  [theme.breakpoints.down('md')]: {
    marginLeft: 0 // No margin on mobile
  }
}));

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Close drawer on mobile when navigating (optional but recommended)
  React.useEffect(() => {
    if (isMobile && drawerOpen) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* HEADER */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "#fff",
          borderBottom: "1px solid #e9ecef",
          zIndex: 1201
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important", px: 3 }}>
          <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />

      {/* CONTENT */}
      <Main open={drawerOpen}>
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default MainLayout;