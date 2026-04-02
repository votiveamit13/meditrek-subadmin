import { Card, Form, Button } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Base_Url, APP_PREFIX_PATH } from '../../config';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function ManageContact() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState([]);

  const handleSubmitReply = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${Base_Url}send_message_admin `, {
        name: values.name,
        email: values.email,
        reply: values.message,
        doctor_id: userDetails.doctor_id
      });
      console.log(response.data);

      if (response.data.success) {
        setSubmitting(false);
        values.message = '';
        Swal.fire({
          title: '',
          text: 'Message send successfully',
          icon: 'success',
          timer: 2000
        });
        setTimeout(() => {
          navigate(APP_PREFIX_PATH + `/manage-contact-us`);
        }, 2000);
      } else {
        setSubmitting(false);
        console.log('Failed to send reply:', response.data);
      }
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    message: Yup.string().max(500, 'Message cannot be more than 500 characters').required('Message is required')
  });

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

  return (
    <div className="p-2">
      {/* Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          padding: "16px"
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h6 style={{ fontWeight: 600, marginBottom: 2 }}>
              Contact Us
            </h6>
            <small style={{ color: "#64748b" }}>
              Send message or reply to user queries
            </small>
          </div>
        </div>
        <Card.Body className="mt-4">

          <Formik
            initialValues={{
              name: userDetails?.doctor_name || '',
              email: userDetails?.email || '',
              message: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitReply}
            enableReinitialize={true}
          >
            {({ handleSubmit, errors, touched, isSubmitting }) => (
              <FormikForm noValidate onSubmit={handleSubmit}>

                {/* User Info Section */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>
                    User Information
                  </h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <Form.Group controlId="formName">
                        <Form.Label className="small text-muted">Name</Form.Label>
                        <Field
                          name="name"
                          type="text"
                          disabled
                          className={`form-control rounded-3 ${errors.name && touched.name ? 'is-invalid' : ''
                            }`}
                        />
                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                      </Form.Group>
                    </div>

                    <div className="col-md-6">
                      <Form.Group controlId="formEmail">
                        <Form.Label className="small text-muted">Email</Form.Label>
                        <Field
                          name="email"
                          type="email"
                          disabled
                          className={`form-control rounded-3 ${errors.email && touched.email ? 'is-invalid' : ''
                            }`}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </Form.Group>
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3" style={{ fontSize: "14px" }}>
                    Message
                  </h6>

                  <Form.Group controlId="formMessage">
                    <Field
                      as="textarea"
                      name="message"
                      rows="5"
                      placeholder="Write your message here..."
                      className={`form-control rounded-3 ${errors.message && touched.message ? 'is-invalid' : ''
                        }`}
                    />
                    <ErrorMessage name="message" component="div" className="invalid-feedback" />
                  </Form.Group>
                </div>

                {/* Action */}
                <div className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: "#1ddec4",
                      border: "none",
                      borderRadius: "10px",
                      padding: "8px 20px",
                      fontWeight: 500
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>

              </FormikForm>
            )}
          </Formik>

        </Card.Body>
      </div>
    </div>
  );
}

export default ManageContact;
