import { Card, Form, Button } from 'react-bootstrap';
import User4 from 'assets/images/users/avatar-4.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './managecontent.css';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Base_Url, IMAGE_PATH } from '../../config';
import { IconButton } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { useEffect, useState } from 'react';

const Profile = () => {
  // const theme = useTheme();
  const navigate = useNavigate();
  const [content, setContent] = useState(0);
  const [activeButton, setActiveButton] = useState('profile');
  const [userDetails, setUserDetails] = useState([]);
  const [preview, setPreview] = useState(User4);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
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
    } finally {
      setLoading(false);
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

  // ✅ ADD BACK THESE (YOU REMOVED THEM)
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
            sessionStorage.clear();
            navigate('/meditrek/sub_admin/login');
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <FadeLoader color="#1ddec4" />
      </div>
    );
  }

  return (
    <>
      {/* Profile Header Card - Similar to ViewPatient */}
      <Card className="border-0 shadow-lg rounded-4 mb-4">
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-4 flex-wrap">
            {/* Avatar with Edit Option */}
            <div style={{ position: 'relative' }}>
              <img
                src={preview}
                alt="Profile"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #1ddec4"
                }}
              />
              {userDetails?.image && (
                <IconButton
                  aria-label="delete"
                  onClick={deleteProfileImage}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: '#dc2626',
                    color: 'white',
                    padding: '4px',
                    fontSize: '1rem',
                    borderRadius: '50%',
                    width: 28,
                    height: 28
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </div>

            {/* Info */}
            <div className="flex-grow-1">
              <h5 className="fw-bold mb-1">{userDetails?.doctor_name}</h5>
              <div className="d-flex gap-3 flex-wrap">
                <small className="text-muted">
                  Email:{" "}
                  <a
                    href={`mailto:${userDetails?.email}`}
                    style={{ color: "#1ddec4", textDecoration: "underline" }}
                  >
                    {userDetails?.email}
                  </a>
                </small>
                <small className="text-muted">
                  Mobile: {userDetails?.mobile}
                </small>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: "#e6f9f6",
                  color: "#1ddec4",
                  fontWeight: 600,
                  fontSize: "13px"
                }}
              >
                Active
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tab Buttons - Modern Style like ViewPatient */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <button
          className={`btn ${activeButton === 'profile' ? 'btn-content-active' : ''}`}
          style={{
            borderRadius: "999px",
            padding: "8px 24px",
            fontSize: "13px",
            background: activeButton === 'profile' ? "#1ddec4" : "#eef2f7",
            color: activeButton === 'profile' ? "#fff" : "#64748b",
            cursor: "pointer",
            border: 0,
            fontWeight: 500
          }}
          type="button"
          onClick={() => handleButtonClick('profile')}
        >
          Edit Profile
        </button>
        <button
          className={`btn ${activeButton === 'password' ? 'btn-content-active' : ''}`}
          style={{
            borderRadius: "999px",
            padding: "8px 24px",
            fontSize: "13px",
            background: activeButton === 'password' ? "#1ddec4" : "#eef2f7",
            color: activeButton === 'password' ? "#fff" : "#64748b",
            cursor: "pointer",
            border: 0,
            fontWeight: 500
          }}
          type="button"
          onClick={() => handleButtonClick('password')}
        >
          Change Password
        </button>
      </div>

      {/* Form Card */}
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
              <Card className="border-0 shadow-lg rounded-4">
                <Card.Body className="p-4">
                  {content === 0 && (
                    <div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <Form.Group>
                            <Form.Label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                              Full Name <span style={{ color: '#dc2626' }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Name"
                              name="name"
                              value={values.name}
                              disabled
                              readOnly
                              onFocus={(e) => {
                                e.target.style.border = '1.5px solid #1ddec4';
                                e.target.style.boxShadow = 'none';
                                e.target.style.outline = 'none';
                              }}
                              style={{
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb',
                                padding: '10px 14px',
                                fontSize: '13px',
                                backgroundColor: '#f5f5f5',
                                cursor: 'not-allowed'
                              }}
                            />
                          </Form.Group>
                        </div>

                        <div className="col-md-6">
                          <Form.Group>
                            <Form.Label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                              Email Address <span style={{ color: '#dc2626' }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="Enter Email"
                              name="email"
                              value={values.email}
                              disabled
                              readOnly
                              onFocus={(e) => {
                                e.target.style.border = '1.5px solid #1ddec4';
                                e.target.style.boxShadow = 'none';
                                e.target.style.outline = 'none';
                              }}
                              style={{
                                borderRadius: '10px',
                                border: '1px solid #e5e7eb',
                                padding: '10px 14px',
                                fontSize: '13px',
                                backgroundColor: '#f5f5f5',
                                cursor: 'not-allowed'
                              }}
                            />
                          </Form.Group>
                        </div>

                        <div className="col-md-6">
                          <Form.Group>
                            <Form.Label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                              Mobile Number <span style={{ color: '#dc2626' }}>*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter Mobile Number"
                              name="mobile"
                              value={values.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              onFocus={(e) => {
                                e.target.style.border = '1.5px solid #1ddec4';
                                e.target.style.boxShadow = 'none';
                                e.target.style.outline = 'none';
                              }}
                              style={{
                                borderRadius: '10px',
                                border: errors.mobile && touched.mobile ? '1px solid #dc2626' : '1px solid #e5e7eb',
                                padding: '10px 14px',
                                fontSize: '13px'
                              }}
                            />
                            {errors.mobile && touched.mobile && (
                              <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                                {errors.mobile}
                              </div>
                            )}
                          </Form.Group>
                        </div>

                        <div className="col-md-6">
                          <Form.Group>
                            <Form.Label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                              Profile Image
                            </Form.Label>
                            <Form.Control
                              type="file"
                              name="image"
                              accept="image/*"
                              onChange={(event) => handleImageUpload(event, setFieldValue)}
                              onBlur={handleBlur}
                              style={{
                                borderRadius: '10px',
                                border: errors.image && touched.image ? '1px solid #dc2626' : '1px solid #e5e7eb',
                                padding: '8px 14px',
                                fontSize: '13px'
                              }}
                            />
                            {errors.image && touched.image && (
                              <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                                {errors.image}
                              </div>
                            )}
                            <small className="text-muted" style={{ fontSize: '11px' }}>
                              Supported formats: JPG, JPEG, GIF, PNG. Max size: 50MB
                            </small>
                          </Form.Group>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          type="submit"
                          style={{
                            background: "#1ddec4",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 28px",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#fff"
                          }}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}

                  {content === 1 && (
                    <div>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <Form.Group>
                            <Form.Label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                              Current Password <span style={{ color: '#dc2626' }}>*</span>
                            </Form.Label>
                            <div style={{ position: 'relative' }}>
                              <Form.Control
                                type={showOldPassword ? 'text' : 'password'}
                                placeholder="Enter Current Password"
                                name="oldPassword"
                                value={values.oldPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={(e) => {
                                  e.target.style.border = '1.5px solid #1ddec4';
                                  e.target.style.boxShadow = 'none';
                                  e.target.style.outline = 'none';
                                }}
                                style={{
                                  borderRadius: '10px',
                                  border: errors.oldPassword && touched.oldPassword ? '1px solid #dc2626' : '1px solid #e5e7eb',
                                  padding: '10px 14px',
                                  fontSize: '13px',
                                  paddingRight: '45px'
                                }}
                              />
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowOldPassword}
                                onMouseDown={handleMouseDownPassword}
                                style={{
                                  position: 'absolute',
                                  right: '8px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  padding: '4px'
                                }}
                                size="small"
                              >
                                {showOldPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </div>
                            {errors.oldPassword && touched.oldPassword && (
                              <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                                {errors.oldPassword}
                              </div>
                            )}
                          </Form.Group>
                        </div>

                        <div className="col-md-6">
                          <Form.Group>
                            <Form.Label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                              New Password <span style={{ color: '#dc2626' }}>*</span>
                            </Form.Label>
                            <div style={{ position: 'relative' }}>
                              <Form.Control
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter New Password"
                                name="newPassword"
                                value={values.newPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={(e) => {
                                  e.target.style.border = '1.5px solid #1ddec4';
                                  e.target.style.boxShadow = 'none';
                                  e.target.style.outline = 'none';
                                }}
                                style={{
                                  borderRadius: '10px',
                                  border: errors.newPassword && touched.newPassword ? '1px solid #dc2626' : '1px solid #e5e7eb',
                                  padding: '10px 14px',
                                  fontSize: '13px',
                                  paddingRight: '45px'
                                }}
                              />
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowNewPassword}
                                onMouseDown={handleMouseDownPassword}
                                style={{
                                  position: 'absolute',
                                  right: '8px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  padding: '4px'
                                }}
                                size="small"
                              >
                                {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </div>
                            {errors.newPassword && touched.newPassword && (
                              <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                                {errors.newPassword}
                              </div>
                            )}
                          </Form.Group>
                        </div>

                        <div className="col-md-6">
                          <Form.Group>
                            <Form.Label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>
                              Confirm Password <span style={{ color: '#dc2626' }}>*</span>
                            </Form.Label>
                            <div style={{ position: 'relative' }}>
                              <Form.Control
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Enter Confirm Password"
                                name="confirmPassword"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onFocus={(e) => {
                                  e.target.style.border = '1.5px solid #1ddec4';
                                  e.target.style.boxShadow = 'none';
                                  e.target.style.outline = 'none';
                                }}
                                style={{
                                  borderRadius: '10px',
                                  border: errors.confirmPassword && touched.confirmPassword ? '1px solid #dc2626' : '1px solid #e5e7eb',
                                  padding: '10px 14px',
                                  fontSize: '13px',
                                  paddingRight: '45px'
                                }}
                              />
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConfirmPassword}
                                onMouseDown={handleMouseDownPassword}
                                style={{
                                  position: 'absolute',
                                  right: '8px',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  padding: '4px'
                                }}
                                size="small"
                              >
                                {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </div>
                            {errors.confirmPassword && touched.confirmPassword && (
                              <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                                {errors.confirmPassword}
                              </div>
                            )}
                          </Form.Group>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button
                          type="submit"
                          style={{
                            background: "#1ddec4",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 28px",
                            fontSize: "13px",
                            fontWeight: 500,
                            color: "#fff"
                          }}
                        >
                          Change Password
                        </Button>
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Form>
          )}
        </Formik>
      )}

      {/* Delete Account Card */}
      <Card className="border-0 shadow-lg rounded-4 mt-4">
        <Card.Body className="p-4 text-center">
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            style={{
              borderRadius: "10px",
              padding: "10px 28px",
              fontSize: "13px",
              fontWeight: 500,
              background: "#dc2626",
              border: "none"
            }}
          >
            Delete My Account
          </Button>
          <p className="text-muted mt-3 mb-0" style={{ fontSize: "12px" }}>
            ⚠️ Warning: This action cannot be undone. All your data will be permanently deleted.
          </p>
        </Card.Body>
      </Card>
    </>
  );
};

export default Profile;