import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, TextField,  Box, FormHelperText, InputAdornment, IconButton } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate,useSearchParams  } from 'react-router-dom';
import {APP_PREFIX_PATH, Base_Url } from '../../config';
// import toast from 'react-hot-toast';
import axios from 'axios';
import Logo from 'assets/images/logo.png';
import Swal from 'sweetalert2'

const ResetPassword = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ backgroundColor: '#fff', height: '100vh', minHeight: '100vh' }}
        >
           
            <Grid item xs={11} sm={7} md={6} lg={4}>
                <Card
                    sx={{
                        overflow: 'visible',
                        display: 'flex',
                        position: 'relative',
                        '& .MuiCardContent-root': {
                            flexGrow: 1,
                            flexBasis: '50%',
                            width: '60%',
                        },
                        maxWidth: '575px',
                        margin: '24px auto',
                    }}
                >
                    <CardContent sx={{ p: theme.spacing(5, 4, 3, 4) }}>
                        <Grid container direction="column" spacing={4} justifyContent="center">
                            <Grid item xs={12}>
                                <Grid container justifyContent="center">
                                <div className='d-flex justify-content-center'><img src={Logo} alt="Logo" style={{ width: '200px' }} /></div>
                                    <Grid item style={{ textAlign: 'center' }}>
                                        <Typography color="textPrimary" gutterBottom variant="h3">
                                            Reset Password
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Formik
                                    initialValues={{
                                        password: '',
                                        confirmPassword: '',
                                        submit: null,
                                    }}
                                    validationSchema={Yup.object().shape({
                                        password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
                                        confirmPassword: Yup.string()
                                            .oneOf([Yup.ref('password'), null], 'Passwords must match')
                                            .required('Confirm Password is required'),
                                    })}
                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                        try {
                                            const doctor_id = searchParams.get('doctor_id')
                                            let api = `${Base_Url}reset_sub_password`
                                            const response = await axios.post(api, {
                                                newPassword: values.password,
                                                doctor_id : doctor_id
                                              })
                                              if (response.data.success) {
                                                setStatus({ success: true });
                                                
                                                // toast.success(response.data.message);
                                                Swal.fire({
                                                    title: '',
                                                    text: 'Password reset successfully',
                                                    icon: 'success',
                                                    timer: 2000
                                                  });
                                                setSubmitting(false);
                                                setTimeout(() => {
                                                  navigate(APP_PREFIX_PATH+'/login');
                                                }, 2000);
                                              } else {
                                                setStatus({ success: false });
                                                setSubmitting(false);
                                                setErrors({ submit: response.data.message });
                                              }
                                        } catch (error) {
                                            setStatus({ success: false });
                                            setErrors({ submit: error.message });
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {({ errors, handleBlur, handleChange, handleSubmit,  touched, values }) => (
                                        <form noValidate onSubmit={handleSubmit}>
                                            <TextField
                                                error={Boolean(touched.password && errors.password)}
                                                fullWidth
                                                helperText={touched.password && errors.password}
                                                label="New Password"
                                                margin="normal"
                                                name="password"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type={showPassword ? 'text' : 'password'}
                                                value={values.password}
                                                variant="outlined"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <TextField
                                                error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                                                fullWidth
                                                helperText={touched.confirmPassword && errors.confirmPassword}
                                                label="Confirm New Password"
                                                margin="normal"
                                                name="confirmPassword"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={values.confirmPassword}
                                                variant="outlined"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle confirm password visibility"
                                                                onClick={handleClickShowConfirmPassword}
                                                                edge="end"
                                                            >
                                                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            {errors.submit && (
                                                <Box mt={3}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}
                                            <Box mt={2} className="d-flex justify-content-center">
                                            <button  className="btn btn-primary" style={{ color: '#fff' }}   size="large" type="submit" >
                                                    Reset Password
                                                </button>
                                               
                                            </Box>
                                        </form>
                                    )}
                                </Formik>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default ResetPassword;
