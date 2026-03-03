// import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

// import User1 from 'assets/images/users/avatar-1.jpg';
// import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { InputGroup } from '@testing-library/user-event/dist/types/event';
import 'bootstrap/dist/css/bootstrap.min.css';
import Typography from '@mui/material/Typography';

function ViewBooking() {
  //   const [passwordVisible, setPasswordVisible] = useState(false);

  //   const togglePasswordVisibility = () => {
  //     setPasswordVisible(!passwordVisible);
  //   };
  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Booking / Booking Details
      </Typography>
      <Card className="mb-5">
        <Card.Header className="bg-white">
          <Card.Title as="h5" className="mt-2">
            Booking Details
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="view-user-content row">
            <div className="col-lg-9">
              <div className="mobile-view ms-3 ">
                {/* <h5>User Detail</h5> */}
                <div className="user-detail row ">
                  <div className="col-lg-12">
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Booking ID :</p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>#649514</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>User Name :</p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>Lisa</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Transaction Id :</p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>#4519644165</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Price : </p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>$ 0.00</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Wallet Paid :</p>
                      </div>
                      <div className="col-lg-6">
                        <p
                          className="action-btn"
                          style={{
                            borderRadius: '25px',
                            background: 'red',
                            padding: '0px 15px',
                            width: '80px',
                            color: '#fff',
                            fontWeight: '500',
                            textAlign: 'center',
                            fontSize: '13px'
                          }}
                        >
                          NO
                        </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Wallet Amount :</p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>$ 0.00 </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Total Amount :</p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>$ 0.00 </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Payment Type :</p>
                      </div>
                      <div className="col-lg-6">
                        <p
                          className="action-btn"
                          style={{
                            borderRadius: '25px',
                            background: '#28c76f',
                            padding: '0px 15px',
                            width: '80px',
                            color: '#fff',
                            fontWeight: '500',
                            fontSize: '13px',
                            textAlign: 'center'
                          }}
                        >
                          Online
                        </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Address Type :</p>
                      </div>
                      <div className="col-lg-6">
                        <p
                          className="action-btn"
                          style={{
                            borderRadius: '25px',
                            background: '#fd5903',
                            padding: '0px 15px',
                            width: '80px',
                            color: '#fff',
                            fontWeight: '500',
                            fontSize: '13px',
                            textAlign: 'center'
                          }}
                        >
                          Other
                        </p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6 col-sm-6">
                        <p style={{}}>Address :</p>
                      </div>
                      <div className="col-lg-6 col-sm-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>Burundi Star Coffee, Saint John Street, Portland, ME, USA</p>
                      </div>
                    </div>
                    <div className="row address">
                      <div className="col-lg-6">
                        <p style={{}}>Create Date & Time :</p>
                      </div>
                      <div className="col-lg-6">
                        <p style={{ fontWeight: '500', marginLeft: '50px;' }}>12-06-2024 05:12 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default ViewBooking;
