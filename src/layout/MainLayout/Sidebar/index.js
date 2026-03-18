import React from "react";
import { Drawer, Box, Divider, Grid } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

import MenuList from "./MenuList";
import logo from 'assets/images/logo.png';

const drawerWidth = 235;
const collapsedWidth = 72;

const Sidebar = ({ drawerOpen, drawerToggle }) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Drawer
      variant={matchUpMd ? 'permanent' : 'temporary'}
      open={drawerOpen}
      onClose={drawerToggle}
      sx={{
        "& .MuiDrawer-paper": {
          width: matchUpMd ? (drawerOpen ? drawerWidth : collapsedWidth) : drawerWidth,
          transition: "width 0.25s ease",
          overflowX: "hidden",
          borderRight: "1px solid #e9ecef",
          top: { md: 64, xs: 0 },
          boxShadow: matchUpMd ? 'none' : '0 0.15rem 1.75rem 0 rgba(33, 40, 50, 0.15)'
        }
      }}
      ModalProps={{ keepMounted: true }}
    >
      {/* Logo section - visible only on mobile or when drawer is open */}
      {(!matchUpMd || (matchUpMd && drawerOpen)) && (
        <Box sx={{ display: { md: 'none', xs: 'block' } }}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: 64,
              background: theme.palette.primary.main,
              boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2)'
            }}
          >
            <Grid item style={{ display: 'flex', alignItems: 'center' }}>
              <img src={logo} alt="Logo" style={{ width: '40px' }} />
              <span style={{ color: '#fff', fontSize: '22px', fontWeight: '500', marginLeft: '10px' }}>
                Meditrek
              </span>
            </Grid>
          </Grid>
          <Divider />
        </Box>
      )}

      {/* Menu section */}
      <Box sx={{ mt: matchUpMd ? 2 : 0 }}>
        <MenuList 
          collapsed={!drawerOpen} 
          drawerOpen={drawerOpen}
        />
      </Box>
    </Drawer>
  );
};

export default Sidebar;