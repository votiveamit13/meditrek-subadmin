import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import User4 from 'assets/images/users/avatar-4.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './managecontent.css';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Base_Url, IMAGE_PATH } from '../../config';
import { FormHelperText, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [content, setContent] = useState(0);
  const [activeButton, setActiveButton] = useState('profile');
  const [userDetails, setUserDetails] = useState([]);
  const [preview, setPreview] = useState(userDetails?.image ? `${IMAGE_PATH}${userDetails.image}?${new Date().getTime()}` : User4);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [deleteReason, setDeleteReason] = useState('');

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const contentTypes = {
    profile: 0,
    password: 1
  };

  const handleButtonClick = (contentType) => {
    setContent(contentTypes[contentType]);
    setActiveButton(contentType);
  };

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}get_profile`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUserDetails(response.data.info);
        sessionStorage.setItem('user_details', response.data.info.doctor_name);
        sessionStorage.setItem('doctor_id', response.data.info.doctor_id);
        setPreview(response.data.info?.image ? `${IMAGE_PATH}${response.data.info.image}?${new Date().getTime()}` : User4);
      } else {
        console.log('Profile Details fetch Error');
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleImageUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    setFieldValue('image', file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(User4);
      setFieldValue('image', null);
    }
  };

  const FILE_SIZE = 50 * 1024 * 1024;
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

  const profileValidationSchema = Yup.object().shape({
    name: Yup.string().required('Please enter Name'),
    email: Yup.string().email('Invalid email').required('Please enter Email'),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
      .required('Please enter Mobile Number'),
    image: Yup.mixed()
      .nullable()
      .notRequired()
      .test('fileSize', 'Image size is too large', (value) => !value || (value && value.size <= FILE_SIZE))
      .test(
        'fileFormat',
        'Unsupported format. Supported formats: jpg, jpeg, gif, png',
        (value) => !value || (value && SUPPORTED_FORMATS.includes(value.type)))
  });

  const passwordValidationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Please enter Current password'),
    newPassword: Yup.string().required('Please enter New password'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Please enter Confirm password')
  });

  const getValidationSchema = (content) => {
    if (content === 0) {
      return profileValidationSchema;
    } else if (content === 1) {
      return passwordValidationSchema;
    }
    return Yup.object();
  };

  const handleSubmit = async (values, { resetForm }) => {
    const token = sessionStorage.getItem('token');

    try {
      let response;
      if (content === 0) {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('mobile', values.mobile);
        if (values.image) {
          formData.append('image', values.image);
        }
        formData.append('doctor_id', userDetails.doctor_id);

        response = await axios.post(`${Base_Url}edit_sub_admin_profile`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          Swal.fire({
            title: '',
            text: response.data.msg,
            icon: 'success',
            timer: 2000
          });
          await fetchUserDetails();
          // Don't reset form for profile update to preserve the values
        } else {
          Swal.fire({
            title: '',
            text: response.data.msg,
            icon: 'error',
            timer: 2000
          });
        }
      } else if (content === 1) {
        response = await axios.post(
          `${Base_Url}update_sub_password`,
          {
            oldpassword: values.oldPassword,
            newPassword: values.newPassword
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          Swal.fire({
            title: '',
            text: response.data.msg,
            icon: 'success',
            timer: 2000
          });
          // Reset only password fields
          resetForm({
            values: {
              ...values,
              oldPassword: '',
              newPassword: '',
              confirmPassword: ''
            }
          });
        } else {
          Swal.fire({
            title: '',
            text: response.data.msg,
            icon: 'error',
            timer: 2000
          });
        }
      }
    } catch (error) {
      console.error('Error updating profile', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while updating',
        icon: 'error',
        timer: 2000
      });
    }
  };

  const deleteProfileImage = async () => {
    const token = sessionStorage.getItem('token');
    const doctorId = userDetails.doctor_id;

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete your profile image?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          `${Base_Url}delete_image`,
          {
            doctor_id: doctorId
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          Swal.fire('Deleted!', 'Your profile image has been deleted.', 'success');
          setPreview(User4);
          fetchUserDetails();
        } else {
          Swal.fire('Error!', response.data.msg || 'Failed to delete image', 'error');
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      Swal.fire('Error!', 'Failed to delete image', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    const token = sessionStorage.getItem('token');
    const doctorId = userDetails.doctor_id;

    try {
      const { value: reason } = await Swal.fire({
        title: 'Delete Your Account?',
        html: `
          <p>This action cannot be undone. All your data will be permanently deleted.</p>
          <textarea 
            id="deleteReason" 
            class="swal2-textarea" 
            placeholder="Please tell us why you're leaving..." 
            style="width: 80%; margin-top: 10px; padding: 5px;"
            required
          ></textarea>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete my account',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
        focusConfirm: false,
        customClass: {
          container: 'swal2-zindex',
          popup: 'swal2-height'
        },
        preConfirm: () => {
          const reason = document.getElementById('deleteReason').value;
          if (!reason) {
            Swal.showValidationMessage('Please provide a reason for deleting your account');
          }
          return reason;
        }
      });

      if (reason) {
        const response = await axios.post(
          `${Base_Url}delete_account`,
          {
            doctor_id: doctorId,
            delete_reason: reason
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          Swal.fire({
            title: 'Account Deleted',
            text: 'Your account has been successfully deleted.',
            icon: 'success'
          }).then(() => {
            // Clear session and redirect to login
            sessionStorage.clear();
            // navigate('/meditrek/sub_admin/login');
            navigate('/meditrek/Access/login/Meditrek_access/login');
          });
        } else {
          Swal.fire('Error!', response.data.msg || 'Failed to delete account', 'error');
        }
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      Swal.fire('Error!', 'Failed to delete account', 'error');
    }
  };

  return (
    <>
      <Card className="mb-5">
        <Card.Header className="bg-white">
          <Card.Title as="h5">Profile</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="view-user-content row">
            <div className="col-lg-5">
              <div className="d-flex flex-wrap">
                <div className="img-div" style={{ position: 'relative' }}>
                  <img
                    alt="Profile"
                    src={preview}
                    className="profile-img2"
                  />
                  {userDetails?.image && (
                    <IconButton
                      aria-label="delete"
                      onClick={deleteProfileImage}
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'rgba(255, 0, 0, 0.7)',
                        color: 'white',
                        padding: '4px',
                        fontSize: '1rem'
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </div>
                <div className="mobile-view ms-3" style={{ marginTop: '30px' }}>
                  <h6>{userDetails?.doctor_name}</h6>
                  <h6>{userDetails?.email}</h6>
                  <h6>{userDetails?.mobile}</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-9 content"></div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          {userDetails && (
            <Formik
              initialValues={{
                name: userDetails?.doctor_name || '',
                email: userDetails?.email || '',
                mobile: userDetails?.mobile || '',
                image: null,
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
              }}
              validationSchema={getValidationSchema(content)}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                  <nav>
                    <div className="container mb-2 mt-2" id="container-div">
                      <button
                        className={`btn me-2 mb-2 btn-content ${activeButton === 'profile' ? 'btn-content-active' : ''}`}
                        style={{ width: '11rem', fontSize: '14px', marginRight: '10px' }}
                        type="button"
                        onClick={() => handleButtonClick('profile')}
                      >
                        Edit Profile
                      </button>
                      <button
                        className={`btn me-2 mb-2 btn-content ${activeButton === 'password' ? 'btn-content-active' : ''}`}
                        style={{ width: '13rem', fontSize: '14px' }}
                        type="button"
                        onClick={() => handleButtonClick('password')}
                      >
                        Change Password
                      </button>
                    </div>
                  </nav>

                  {content === 0 && (
                    <div className="container">
                      <div className="mt-3">
                        <Form.Group className="mb-3" as={Row} controlId="formHorizontalName">
                          <Col sm={6} className="mb-3">
                            <div>Name</div>
                            <Form.Control
                              type="text"
                              placeholder="Enter Name"
                              name="name"
                              value={values.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.name && !!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                          </Col>

                          <Col sm={6} className="mb-3">
                            <div>Email</div>
                            <Form.Control
                              type="text"
                              placeholder="Enter Email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.email && !!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                          </Col>

                          <Col sm={6} className="mb-3">
                            <div>Mobile Number</div>
                            <Form.Control
                              type="text"
                              placeholder="Enter Mobile Number"
                              name="mobile"
                              value={values.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={touched.mobile && !!errors.mobile}
                            />
                            <Form.Control.Feedback type="invalid">{errors.mobile}</Form.Control.Feedback>
                          </Col>

                          <Col sm={12}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              <img src={preview} alt="Profile" className="profile-img mb-2 mt-1" />
                              {userDetails?.image && (
                                <IconButton
                                  aria-label="delete"
                                  onClick={deleteProfileImage}
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                                    color: 'white',
                                    padding: '4px'
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </div>
                          </Col>
                          <Col sm={12}>
                            <div>Upload Image</div>
                            <Form.Control
                              type="file"
                              name="image"
                              onChange={(event) => handleImageUpload(event, setFieldValue)}
                              onBlur={handleBlur}
                              isInvalid={touched.image && !!errors.image}
                            />
                            <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                          </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" as={Row}>
                          <Col sm={{ span: 10 }}>
                            <Button type="submit" className="mt-2 submit-btn">
                              Save Changes
                            </Button>
                          </Col>
                        </Form.Group>
                      </div>
                    </div>
                  )}

                  {content === 1 && (
                    <div className="container">
                      <div className="mt-3">
                        <Form.Group className="mb-3" as={Row} controlId="formHorizontalMessage">
                          <Col sm={6} className="mb-3">
                            <FormControl
                              fullWidth
                              error={Boolean(touched.oldPassword && errors.oldPassword)}
                              sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}
                            >
                              <InputLabel htmlFor="outlined-adornment-old-password">Current Password</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-old-password"
                                type={showOldPassword ? 'text' : 'password'}
                                value={values.oldPassword}
                                name="oldPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Current Password"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle old password visibility"
                                      onClick={handleClickShowOldPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                      size="large"
                                    >
                                      {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                              {touched.oldPassword && errors.oldPassword && (
                                <FormHelperText error id="standard-weight-helper-text">
                                  {errors.oldPassword}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Col>
                          <Col sm={6} className="mb-3">
                            <FormControl
                              fullWidth
                              error={Boolean(touched.newPassword && errors.newPassword)}
                              sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}
                            >
                              <InputLabel htmlFor="outlined-adornment-new-password">New Password</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-new-password"
                                type={showNewPassword ? 'text' : 'password'}
                                value={values.newPassword}
                                name="newPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="New Password"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle new password visibility"
                                      onClick={handleClickShowNewPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                      size="large"
                                    >
                                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                              {touched.newPassword && errors.newPassword && (
                                <FormHelperText error id="standard-weight-helper-text">
                                  {errors.newPassword}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Col>
                          <Col sm={6} className="mb-3">
                            <FormControl
                              fullWidth
                              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                              sx={{ mt: theme.spacing(3), mb: theme.spacing(1) }}
                            >
                              <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                              <OutlinedInput
                                id="outlined-adornment-confirm-password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={values.confirmPassword}
                                name="confirmPassword"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label="Confirm Password"
                                endAdornment={
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle confirm password visibility"
                                      onClick={handleClickShowConfirmPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                      size="large"
                                    >
                                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                              {touched.confirmPassword && errors.confirmPassword && (
                                <FormHelperText error id="standard-weight-helper-text">
                                  {errors.confirmPassword}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Col>
                        </Form.Group>

                        <Form.Group className="mb-3" as={Row}>
                          <Col sm={{ span: 10 }}>
                            <Button type="submit" className="mt-1 submit-btn">
                              Change Password
                            </Button>
                          </Col>
                        </Form.Group>
                      </div>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          )}
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body className="text-center">
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            style={{ width: '200px' }}
          >
            Delete My Account
          </Button>
          <p className="text-muted mt-2">
            Warning: This action cannot be undone. All your data will be permanently deleted.
          </p>
        </Card.Body>
      </Card>
    </>
  );
};

export default Profile;