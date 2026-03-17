import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import CustomerList from 'views/AllPage/CustomerList';

function Report() {
  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / User Report
      </Typography>
      <Card className="mb-4">
        <Card.Header className="bg-white">
          <Card.Title as="h5" className="mt-2">
            User Report{' '}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <div className="container">
              <div className="mt-3">
                <Form.Group className="mb-3" as={Row}>
                  <Col sm={5}>
                    <div className="mb-2">From Date</div>
                    <Form.Control type="date" placeholder="Enter Subject" />
                  </Col>
                  <Col sm={5}>
                    <div className="mb-2">To Date</div>
                    <Form.Control type="date" placeholder="Enter Subject" />
                  </Col>
                  <Col sm={2}>
                    <Button type="submit" className=" submit-btn" style={{marginTop:'29px'}}>
                      Send
                    </Button>
                  </Col>
                </Form.Group>

               
              </div>
            </div>
          </Form>
         
        </Card.Body>

      </Card>
      <CustomerList/>
    </>
  );
}

export default Report;
