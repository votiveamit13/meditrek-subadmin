import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { APP_PREFIX_PATH, Base_Url } from '../../config';
import axios from 'axios';

const FirebaseLogin = ({ ...rest }) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [initialValues, setInitialValues] = useState({ email: '', password: '', submit: null });
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      setInitialValues({ email: savedEmail, password: savedPassword, submit: null });
      setKeepMeSignedIn(true);
    }
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

  const handleKeepMeSignedInChange = (event) => {
    setKeepMeSignedIn(event.target.checked);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const response = await axios.post(`${Base_Url}sub_login`, {
              email: values.email,
              password: values.password
            });
            if (response.data.success) {
              localStorage.setItem('doctor_id', response.data.info[0].doctor_id);
              setStatus({ success: true });
              sessionStorage.setItem('token', response.data.token);
              sessionStorage.setItem('doctor_id', response.data.info[0].doctor_id);
              if (keepMeSignedIn) {
                localStorage.setItem('email', values.email);
                localStorage.setItem('password', values.password);

              } else {
                localStorage.removeItem('email');
                localStorage.removeItem('password');
              }
              navigate(APP_PREFIX_PATH + `/dashboard`);
              setSubmitting(false);
            } else {
              setStatus({ success: false });
              setSubmitting(false);
              setErrors({ submit: response.data.msg });
            }
          } catch (error) {
            setStatus({ success: false });
            setErrors({ submit: error.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit} {...rest}>
            <TextField
              error={Boolean(touched.email && errors.email)}
              fullWidth
              helperText={touched.email && errors.email}
              label="Email Address / Username"
              margin="normal"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              value={values.email}
              variant="outlined"
            />

            <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}>
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text">
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Box display="flex" alignItems="center">
                  <Checkbox {...label} checked={keepMeSignedIn} onChange={handleKeepMeSignedInChange} />
                  <Typography variant="subtitle2" sx={{ textDecoration: 'none' }}>
                    Keep me signed in
                  </Typography>
                </Box>
              </Grid>
              <Grid item>

                <Link to={APP_PREFIX_PATH + `/forgot-password`} style={{ textDecoration: 'none', color: '#1ddec4' }}>Forgot Password?</Link>

              </Grid>
            </Grid>

            {errors.submit && (
              <Box mt={3}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box mt={2}>
              <Button style={{ color: '#fff' }} disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Log In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
