import { Card, Form, Button } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup'
// import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
// import { Base_Url } from '../../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Base_Url, APP_PREFIX_PATH } from '../../config';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Reply() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const contact_id = queryParams.get('contact_id');
  const [contact, setContact] = useState([]);

  let email;
  contact?.map((item) => {
    if (item.user_id == contact_id) {
      email = item.email
      console.log(email)
    }
  })


  const fetchData = async () => {
    try {
      // const token = sessionStorage.getItem('token');

      const response = await axios.get(`${Base_Url}get_help_and_support`,
      );

      if (response.data.success) {
        if (response?.data?.ContactUs == 'NA') {
          return;
        } else {
          setContact(response.data.data);
        }

      } else {
        console.log('Fetch unsuccessful', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitReply = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${Base_Url}send_reply`, {
        contact_id: contact_id,
        email: email,
        title: values.subject,
        reply: values.message,
      },
      );
      console.log(response.data)

      if (response.data.success) {
        setSubmitting(false);
        values.message = "";
        values.subject = "";
        Swal.fire({
          title: '',
          text: 'Reply send successfully',
          icon: 'success',
          timer: 2000
        });
        // toast.success(response.data.message);
        setTimeout(() => {
          navigate(APP_PREFIX_PATH + `/manage-contact-us`);
        }, 2000);

      } else {
        setSubmitting(false);
        console.log('Failed to send reply:', response.data);
        // toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  }

  const validationSchema = Yup.object().shape({
    subject: Yup.string()
      .max(50, 'Subject cannot be more than 50 characters')
      .required('Subject is required'),
    message: Yup.string()
      .max(500, 'Message cannot be more than 500 characters')
      .required('Message is required'),
  });

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> /  Send Reply
      </Typography>

      <Card>

        <Card.Body>
          <Formik
            initialValues={{ subject: '', message: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitReply}
          >
            {({ handleSubmit, errors, touched, isSubmitting }) => (
              <FormikForm noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formSubject">
                  <Form.Label>Subject</Form.Label>
                  <Field
                    name="subject"
                    type="text"
                    className={`form-control${errors.subject && touched.subject ? ' is-invalid' : ''}`}
                  />
                  <ErrorMessage name="subject" component="div" className="invalid-feedback" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formMessage">
                  <Form.Label>Message</Form.Label>
                  <Field
                    as="textarea"
                    name="message"
                    className={`form-control${errors.message && touched.message ? ' is-invalid' : ''}`}
                    rows="4"
                    placeholder="Enter message"
                  />
                  <ErrorMessage name="message" component="div" className="invalid-feedback" />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </FormikForm>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </>
  );
}

export default Reply;
