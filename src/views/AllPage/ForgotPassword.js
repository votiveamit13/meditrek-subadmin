import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, TextField, Box, FormHelperText } from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Link} from 'react-router-dom';
import { APP_PREFIX_PATH, Base_Url } from '../../config';
// import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Logo from 'assets/images/logo.png';
import axios from 'axios';
import Swal from 'sweetalert2'


const ForgotPassword = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ backgroundColor: '#fff', height: '100vh', minHeight: '100vh' }}
        >

          
            <Grid item xs={11} sm={7} md={6} lg={4} >
                <Card
                    sx={{
                        overflow: 'visible',
                        display: 'flex',
                        position: 'relative',
                        '& .MuiCardContent-root': {
                            flexGrow: 1,
                            flexBasis: '50%',
                            width: '60%'
                        },
                        maxWidth: '575px',
                        margin: '24px auto',


                    }}
                >
                    <CardContent sx={{ p: theme.spacing(5, 4, 3, 4) }}>
                        <Grid container direction="column" spacing={4} justifyContent="center">
                            <Grid item xs={12}>
                                <Grid container justifyContent="center">
                                    <Grid item style={{ textAlign: 'center' }}>
                                        <div className='d-flex justify-content-center'><img src={Logo} alt="Logo" style={{ width: '180px' }} /></div>


                                        <Typography color="textPrimary" gutterBottom variant="h3">
                                            Forgot Password
                                        </Typography>
                                        <Typography variant="body1" gutterBottom>
                                            Enter your email to reset your password
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Formik
                                    initialValues={{
                                        email: '',
                                        submit: null
                                    }}
                                    validationSchema={Yup.object().shape({
                                        email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                                    })}
                                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                        try {
                                            const response = await axios.post(`${Base_Url}forgot_sub_password`, {
                                                email: values.email,
                                              })
                                              if (response.data.success) {
                                                setStatus({ success: true });
                                                
                                                // toast.success(response.data.message);
                                                Swal.fire({
                                                    title: '',
                                                    text: 'Reset Link Sent Successfully',
                                                    icon: 'success',
                                                    timer: 2000
                                                  });
                                                setSubmitting(false);
                                                setTimeout(() => {
                                                  navigate(APP_PREFIX_PATH+`/login`);
                                                }, 2000);
                                              } else {
                                                setStatus({ success: false });
                                                // Swal.fire({
                                                //     title: '',
                                                //     text: response.data.msg,
                                                //     icon: 'success',
                                                //     timer: 2000
                                                //   });
                                                // setSubmitting(false);
                                                setErrors({ submit: response.data.message });
                                              }
                                        } catch (error) {
                                            setStatus({ success: false });
                                            setErrors({ submit: error.message });
                                            setSubmitting(false);
                                        }
                                    }}
                                >
                                    {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
                                        <form noValidate onSubmit={handleSubmit}>
                                            <TextField
                                                error={Boolean(touched.email && errors.email)}
                                                fullWidth
                                                helperText={touched.email && errors.email}
                                                label="Email "
                                                margin="normal"
                                                name="email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                type="email"
                                                value={values.email}
                                                variant="outlined"
                                            />
                                            {errors.submit && (
                                                <Box mt={3}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}
                                            <Box mt={2} className="d-flex justify-content-center">
                                                <button   className="btn btn-primary" style={{ color: '#fff' }}  size="large" type="submit" >
                                                    Reset Password
                                                </button>

                                            </Box>

                                            <Box mt={2} className="d-flex justify-content-center">
                                                <Link to={`${APP_PREFIX_PATH}/login`} style={{ textDecoration: 'none', color: '#1ddec4', textAlign: 'center' }}>Back to login</Link>
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

export default ForgotPassword;
