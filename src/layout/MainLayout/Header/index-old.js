import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, InputBase, Paper } from '@mui/material';

// project import
// import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
// import NotificationSection from './NotificationSection';
// import { drawerWidth } from 'config.js';

// assets
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import logo from 'assets/images/logo1.png';
// import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';

// ==============================|| HEADER ||============================== //

const Header = ({ drawerToggle }) => {
  const theme = useTheme();

  return (
    <>
      {/* <Box width={drawerWidth}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Grid item>
              <Box
                mt={0.5}
                sx={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <img src={logo} alt="Logo" style={{ width: '35px' }} />
                <span style={{ color: '#fff', fontSize: '22px', fontWeight: 600 }}>Meditrek</span>
               
              </Box>
            </Grid>
          </Box>
          <Grid item>
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(1.25) }}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem', color: '#fff' }} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
     

      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: 350,
            px: 1,
            borderRadius: '10px'
          }}
        >
          <SearchIcon sx={{ color: 'gray' }} />
          <InputBase placeholder="Search..." sx={{ ml: 1, flex: 1 }} />
        </Paper>
      </Grid>
    
      <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={toggleColorMode} color="inherit">
          {mode === 'dark' ? <LightModeIcon sx={{ color: '#fff' }} /> : <DarkModeIcon sx={{ color: '#fff' }} />}
        </IconButton>

        <ProfileSection />
      </Grid> */}
        <Grid container alignItems="center" justifyContent="space-between" >

      {/* LEFT SIDE */}
      <Grid item sx={{ display: "flex", alignItems: "center" }}>
       

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Logo" style={{ width: "35px" }} />
          <span
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 600,
              marginLeft: "8px"
            }}
          >
            Meditrek
          </span>
        </Box>
        <Grid item>
            <IconButton
              edge="start"
              sx={{ mr: theme.spacing(1.25), marginLeft:"50px"}}
              color="inherit"
              aria-label="open drawer"
              onClick={drawerToggle}
              size="large"
            >
              <MenuTwoToneIcon sx={{ fontSize: '1.5rem', color: '#fff' }} />
            </IconButton>
          </Grid>
      </Grid>


      {/* CENTER SEARCH */}
      <Grid item xs={4} sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 350,
            px: 1,
            borderRadius: "10px"
          }}
        >
          <SearchIcon sx={{ color: "gray", }} />
          <InputBase
            placeholder="Search..."
            sx={{ ml: 1, flex: 1,fontSize:"13px" }}
          />
        </Paper>
      </Grid>


      {/* RIGHT SIDE */}
      <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>

        {/* <IconButton onClick={toggleColorMode} color="inherit">
          {mode === "dark" ? (
            <LightModeIcon sx={{ color: "#fff" }} />
          ) : (
            <DarkModeIcon sx={{ color: "#fff" }} />
          )}
        </IconButton> */}

        <ProfileSection />

      </Grid>

    </Grid>
    </>
  );
};

Header.propTypes = {
  drawerToggle: PropTypes.func,
  toggleColorMode: PropTypes.func,
  mode: PropTypes.string
};

export default Header;
