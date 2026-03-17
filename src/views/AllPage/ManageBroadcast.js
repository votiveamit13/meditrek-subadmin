import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import './managecontent.css';

function Managebroadcast() {
  const [content, setContent] = useState(0);
  const [activeButton, setActiveButton] = useState('all');

  const contentTypes = {
    all: 0,
    specific: 1
  };

  const handleButtonClick = (contentType) => {
    setContent(contentTypes[contentType]);
    setActiveButton(contentType);
  };

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Broadcast
      </Typography>
      <Card>
        <Card.Body>
          <Form>
            <nav className="">
              <div className="container" id="container-div">
                <button
                  className={`btn me-2 mb-2 btn-content ${activeButton === 'all' ? 'active' : ''}`}
                  style={{ width: '11rem', fontSize: '16px' }}
                  type="button"
                  onClick={() => handleButtonClick('all')}
                >
                  All Customer
                </button>
                <button
                  className={`btn me-2 mb-2 btn-content ${activeButton === 'specific' ? 'active' : ''}`}
                  style={{ width: '13rem', fontSize: '16px' }}
                  type="button"
                  onClick={() => handleButtonClick('specific')}
                >
                  Select Customer
                </button>
              </div>
            </nav>

            {content === 0 && (
              <div className="container">
                <div className="mt-3">
                  <Form.Group className="mb-3" as={Row} controlId="formHorizontalEmail">
                    <div>Title</div>
                    <Col sm={12}>
                      <Form.Control type="text" placeholder="Title" />
                    </Col>
                  </Form.Group>

                  <Form.Group className="mb-3" as={Row} controlId="formHorizontalMessage">
                    <div>Message</div>
                    <Col sm={12}>
                      <Form.Control as="textarea" placeholder="Enter your message" rows={3} />
                    </Col>
                  </Form.Group>

                  <Form.Group className="mb-3" as={Row}>
                    <Col sm={{ span: 10 }}>
                      <Button type="submit" className="mt-2 submit-btn">
                        Submit
                      </Button>
                    </Col>
                  </Form.Group>
                </div>
              </div>
            )}

            {content === 1 && (
              <div className="container">
                <div className="mt-3">
                  <Form.Group className="mb-3" as={Row} controlId="formHorizontalEmail">
                    <Col sm={6}>
                      <div>Select Customers</div>
                      <Form.Control as="select">
                      <option>Lisa</option>
                      <option>John</option>
                      <option>Mark</option>
                      <option>Arika</option>
                      <option>Andrew</option>
                    </Form.Control>
                    </Col>

                    
                    <Col sm={6}>
                      <div>Title</div>
                      <Form.Control type="text" placeholder="Title" />
                    </Col>
                  </Form.Group>

                  <Form.Group className="mb-3" as={Row} controlId="formHorizontalMessage">
                    <div>Message</div>
                    <Col sm={12}>
                      <Form.Control as="textarea" placeholder="Enter your message" rows={3} />
                    </Col>
                  </Form.Group>

                  <Form.Group className="mb-3" as={Row}>
                    <Col sm={{ span: 10 }}>
                      <Button type="submit" className="mt-2 submit-btn">
                        Submit
                      </Button>
                    </Col>
                  </Form.Group>
                </div>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default Managebroadcast;
