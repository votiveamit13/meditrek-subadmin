import React from 'react';
import { useTheme } from '@mui/material/styles';
import { CardContent, Typography, Grid, Box } from '@mui/material';

// project import
import AuthLogin from './FirebaseLogin';

// assets
import Logo from 'assets/images/logo.png';
import LoginBG from 'assets/images/login_bg.png';

// ==============================|| LOGIN ||============================== //

const Login = () => {
  const theme = useTheme();

  return (
    <Box sx={{ height: '100vh', width: '100vw', overflow: 'hidden' , backgroundColor:'#FFF' }}>
      <Grid container sx={{ height: '100%' }}>
        {/* Left Side */}
        <Grid
          item
          xs={12}
          md={12}
          lg={6}
          sx={{
            backgroundImage: `url(${LoginBG})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            position: 'relative',
            marginTop:'50px'
          }}
          className="loginLeft_bg"
        >
          <Typography
            variant="h4"
            sx={{
              color: '#666',
              fontWeight: 600,
              position: 'absolute',
              top: -30,
              left: 0,
              backgroundColor: 'rgba(255,255,255,0.7)',
              px: 2,
              py: 1,
              borderRadius: 1
            }}
          >
            Meditrek Access
          </Typography>
        </Grid>

        {/* Right Side */}
        <Grid
          item
          xs={12}
          md={12}
          lg={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
          className="loginForm_box"
        >
          <CardContent sx={{ p: theme.spacing(5, 4, 3, 4), width: '100%', maxWidth: 500 }}>
            <Grid container direction="column" spacing={4} justifyContent="center">
              <Grid item xs={12}>
                <Grid container justifyContent="center">
                  <Grid item textAlign="center">
                    <Box display="flex" justifyContent="center">
                      <img src={Logo} alt="Logo" style={{ width: '120px' }} />
                    </Box>
                    <Typography color="textPrimary" gutterBottom variant="h3">
                      Login
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Access to our dashboard
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <AuthLogin />
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
