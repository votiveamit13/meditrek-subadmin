import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Table, Modal, } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Base_Url, IMAGE_PATH } from '../../config';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import VisibilityIcon from '@mui/icons-material/Visibility';

function SharedTabularData() {
  // State for form inputs
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');
  // const [doctor_id, setDoctorId] = useState('');

  // State for validation errors
  const [from_date_error, setFromDateError] = useState('');
  const [to_date_error, setToDateError] = useState('');
  // const [doctor_error, setDoctorError] = useState('');

  // State for data
  const [doctors, setDoctors] = useState([]);
  console.log(doctors);
  const [medicationData, setMedicationData] = useState([]);
  const [adverseReactionData, setAdverseReactionData] = useState([]);
  const [labReportData, setLabReportData] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [complianceData, setComplianceData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('medication');

  let doctorId = localStorage.getItem('doctor_id');

  const calculateAge = (dob) => {
    if (!dob) return 'NA';

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // State for pagination
  const [currentPage, setCurrentPage] = useState({
    medication: 1,
    adverseReaction: 1,
    labReport: 1,
    measurement: 1,
    compliance: 1
  });

  // State for search
  const [searchQuery, setSearchQuery] = useState({
    medication: '',
    adverseReaction: '',
    labReport: '',
    measurement: '',
    compliance: ''
  });

  // State for PDF modal
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdf, setCurrentPdf] = useState('');

  const itemsPerPage = 10;

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios
      .get(`${Base_Url}get_all_doctor`)
      .then((response) => {
        if (response.data.success && Array.isArray(response.data.data)) {
          setDoctors(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
      });
  };

  // Handle search for each tab
  const handleSearch = (tab, value) => {
    setSearchQuery({
      ...searchQuery,
      [tab]: value
    });
  };

   console.log(handleSearch);

  // Filter data based on search query
  const filterData = (data, tab) => {
    const query = searchQuery[tab].toLowerCase();
    if (!query) return data;

    return data.filter((item) => {
      return item.patient_name?.toLowerCase().includes(query);
    });
  };

  // Handle page change for each tab
  const handlePageChange = (tab, value) => {
    setCurrentPage({
      ...currentPage,
      [tab]: value
    });
  };

  // Pagination logic for each tab
  const getPaginatedData = (data, tab) => {
    const filteredData = filterData(data, tab);
    const currentPageValue = currentPage[tab];
    const indexOfLastItem = currentPageValue * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return {
      currentItems: filteredData.slice(indexOfFirstItem, indexOfLastItem),
      totalPages: Math.ceil(filteredData.length / itemsPerPage),
      totalItems: filteredData.length,
      indexOfFirstItem,
      indexOfLastItem: Math.min(indexOfLastItem, filteredData.length)
    };
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    let hasError = false;

    if (!from_date) {
      setFromDateError('Please Enter From Date.');
      hasError = true;
    } else {
      setFromDateError('');
    }

    if (!to_date) {
      setToDateError('Please Enter To Date');
      hasError = true;
    } else if (to_date < from_date) {
      setToDateError('To Date Must Be Greater Than From Date');
      hasError = true;
    } else {
      setToDateError('');
    }

    // if (!doctor_id) {
    //     setDoctorError('Please Select a Doctor');
    //     hasError = true;
    // } else {
    //     setDoctorError('');
    // }

    if (hasError) return;

    // Fetch data from API
    axios
      .get(`${Base_Url}get_shared_tabular?from_date=${from_date}&to_date=${to_date}&doctor_id=${doctorId}`)
      .then((response) => {
        if (response.data.success) {
          setMedicationData(response.data.medication || []);
          setAdverseReactionData(response.data.adverseReaction || []);
          setLabReportData(response.data.labReport || []);
          setMeasurementData(response.data.measurement || []);
          setComplianceData(response.data.compliance || []);
          setDataLoaded(true);
        } else {
          setMedicationData([]);
          setAdverseReactionData([]);
          setLabReportData([]);
          setMeasurementData([]);
          setComplianceData([]);
          setDataLoaded(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching shared tabular data:', error);
        setMedicationData([]);
        setAdverseReactionData([]);
        setLabReportData([]);
        setMeasurementData([]);
        setComplianceData([]);
        setDataLoaded(true);
      });
  };

  // Export to Excel functions for each tab
  const exportToExcel = (data, filename) => {
    let exportData = [];

    switch (filename) {
      case 'Medication':
        exportData = data.map((item, index) => ({
          'S. No.': index + 1,
          // 'Patient Name': item.patient_name || '-',
          Age: calculateAge(item.dob) + ' years' || '-',
          Medicine: item.medicine_name || '-',
          Dosage: item.dosage || '-',
          Schedule: item.schedule == 0 ? 'Daily' : 'Weekly',
          'Remaining Quantity': item.remaing_quantity || '1',
          'Remind me when': item.remind_quantity || '1',
          'Reminder Time': item.reminder_time || '-',
          Instruction: item.instruction || '-',
          'Created Date': new Date(item.createtime).toLocaleDateString()
        }));
        break;
      case 'AdverseReaction':
        exportData = data.map((item, index) => ({
          'S. No.': index + 1,
          // 'Patient Name': item.patient_name || '-',
          Medicine: item.medicine_name || '-',
          Symptom: item.symptom_name || '-',
          Dosage: item.dosage || '-',
          'Medicine Type': item.category_name || '-',
          Description: item.instruction || '-',
          'Medication Start Date': new Date(item.medication_start_date).toLocaleDateString(),
          'Reaction Date': new Date(item.reaction_date).toLocaleDateString(),

          'Created Date': new Date(item.createtime).toLocaleDateString()
        }));
        break;
      case 'LabReports':
        exportData = data.map((item, index) => ({
          'S. No.': index + 1,
          // 'Patient Name': item.patient_name || '-',
          Category: item.category_name || '-',
          'Created Date': new Date(item.createtime).toLocaleDateString()
        }));
        break;
      case 'Measurements':
        exportData = data.map((item, index) => ({
          'S. No.': index + 1,
          // 'Patient Name': item.patient_name || '-',
          BP: item.systolic_bp + '/' + item.diastolic_bp || '-',
          Pulse: item.pulse || '-',
          Weight: item.weight || '-',
          Temperature: item.temperature || '-',
          Glucose: item.fasting_glucose || '-',
          ppbgs: item.ppbgs || '-',
          symptoms: item.symptom || '-',
          range: item.symptom_range || '-',
          'Created Date': new Date(item.createtime).toLocaleDateString()
        }));
        break;
      case 'Compliance':
        exportData = data.map((item, index) => ({
          'S. No.': index + 1,
          // 'Patient Name': item.name || '-',
          Medicine: item.medicine_name || '-',
          Status: item.taken_status === 1 ? 'Taken' : 'Not Taken',
          'Created Date': new Date(item.updatetime).toLocaleDateString()
        }));
        break;
      default:
        break;
    }

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, filename);
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${filename}.xlsx`);
  };

  // Handle PDF view
  const handleViewPdf = (pdfFile) => {
    setCurrentPdf(pdfFile);
    setShowPdfModal(true);
  };

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <Link to={'/'} style={{ textDecoration: 'none' }}>
          <span style={{ color: '#0ccfb5' }}>Dashboard</span>
        </Link>{' '}
        / Shared Information
      </Typography>

      <Card className="mb-4" style={{ border: '1px solid #dee2e6', boxShadow: 'none' }}>
        <Card.Header style={{ borderBottom: '1px solid #dee2e6', backgroundColor: 'transparent' }}>
          <Card.Title as="h5" className="mt-2">
            Shared Information
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              {/* <Col sm={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Doctor</Form.Label>
                                    <Form.Select
                                        onChange={(e) => {
                                            setDoctorId(e.target.value);
                                            setDoctorError('');
                                        }}
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.doctor_id} value={doctor.doctor_id}>
                                                {doctor.doctor_name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <p style={{ color: 'red' }}>{doctor_error}</p>
                                </Form.Group>
                            </Col> */}

              <Col sm={3}>
                <Form.Group className="mb-3">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control
                    type="date"
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setFromDateError('');
                    }}
                  />
                  <p style={{ color: 'red' }}>{from_date_error}</p>
                </Form.Group>
              </Col>
              <Col sm={3}>
                <Form.Group className="mb-3">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      if (!from_date) {
                        setToDateError('Please Select From Date first');
                      } else {
                        setToDate(e.target.value);
                        setToDateError('');
                      }
                    }}
                  />
                  <p style={{ color: 'red' }}>{to_date_error}</p>
                </Form.Group>
              </Col>
              <Col sm={3} className="mb-3 d-flex align-items-end justify-content-start">
                <Button type="submit" className="submit-btn">
                  View
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {dataLoaded && (
        <>
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid tabs justify-content-start" style={{ marginBottom: '41px' }}>
              <button
                style={{
                  border: '1px solid #238BF0',
                  borderRadius: '0px',
                  height: '38px',
                  backgroundColor: activeTab === 'medication' ? '#238BF0' : 'transparent',
                  color: activeTab === 'medication' ? 'white' : '#238BF0'
                }}
                className="btn"
                type="button"
                onClick={() => setActiveTab('medication')}
              >
                Medication
              </button>
              <button
                style={{
                  border: '1px solid #238BF0',
                  borderRadius: '0px',
                  height: '38px',
                  backgroundColor: activeTab === 'adverseReaction' ? '#238BF0' : 'transparent',
                  color: activeTab === 'adverseReaction' ? 'white' : '#238BF0'
                }}
                className="btn"
                type="button"
                onClick={() => setActiveTab('adverseReaction')}
              >
                Adverse Reaction
              </button>
              {/* <button
                                style={{
                                    border: '1px solid #238BF0',
                                    borderRadius: '0px',
                                    height: '38px',
                                    backgroundColor: activeTab === 'labReport' ? '#238BF0' : 'transparent',
                                    color: activeTab === 'labReport' ? 'white' : '#238BF0'
                                }}
                                className="btn"
                                type="button"
                                onClick={() => setActiveTab('labReport')}
                            >
                                Lab Reports
                            </button> */}
              <button
                style={{
                  border: '1px solid #238BF0',
                  borderRadius: '0px',
                  height: '38px',
                  backgroundColor: activeTab === 'measurement' ? '#238BF0' : 'transparent',
                  color: activeTab === 'measurement' ? 'white' : '#238BF0'
                }}
                className="btn"
                type="button"
                onClick={() => setActiveTab('measurement')}
              >
                Measurements
              </button>
              <button
                style={{
                  border: '1px solid #238BF0',
                  borderRadius: '0px',
                  height: '38px',
                  backgroundColor: activeTab === 'compliance' ? '#238BF0' : 'transparent',
                  color: activeTab === 'compliance' ? 'white' : '#238BF0'
                }}
                className="btn"
                type="button"
                onClick={() => setActiveTab('compliance')}
              >
                Compliance
              </button>
            </div>
          </nav>

          {/* Medication Tab */}
          {activeTab === 'medication' && (
            <Card>
              {medicationData.length > 0 && (
                <div className="mb-3 pt-3 px-3 text-end">
                  <Button
                    variant="success"
                    onClick={() => exportToExcel(medicationData, 'Medication')}
                    style={{ backgroundColor: '#0ccfb5', border: 'none' }}
                  >
                    Export to Excel
                  </Button>
                </div>
              )}

              <Card.Body>
                {/* <div className="d-flex justify-content-between flex-wrap mb-3">
                                    <Typography variant="h5" gutterBottom>
                                        <span style={{ color: '#000' }}>Medication List</span>
                                    </Typography>
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search..."
                                            onChange={(e) => handleSearch('medication', e.target.value)}
                                            style={{ width: '200px' }}
                                        />
                                    </div>
                                </div> */}

                <div style={{ overflowX: 'auto' }}>
                  <Table responsive style={{ border: '1px solid #dee2e6' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center', fontWeight: '500', width: '100px', borderBottom: '1px solid #dee2e6' }}>S. No</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', width: '300px', borderBottom: '1px solid #dee2e6' }}>
                          Patient Name
                        </th>
                        <th style={{ textAlign: 'center', fontWeight: '500', width: '200px', borderBottom: '1px solid #dee2e6' }}>Age</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', width: '500px', borderBottom: '1px solid #dee2e6' }}>
                          Medicine
                        </th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Dosage</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Schedule</th>
                        {/* <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Remaining Quantity</th> */}
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Remind me when</th>
                        {/* <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Reminder Time</th> */}
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Instruction</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicationData.length > 0 ? (
                        getPaginatedData(medicationData, 'medication').currentItems.map((item, index) => (
                          <tr key={item.medication_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ textAlign: 'center', width: '120px', borderBottom: '1px solid #dee2e6' }}>
                              {getPaginatedData(medicationData, 'medication').indexOfFirstItem + index + 1}
                            </td>
                            <td style={{ textAlign: 'center', width: '300px', borderBottom: '1px solid #dee2e6' }}>{item.patient_name || '-'}</td>
                            <td style={{ textAlign: 'center', width: '200px', borderBottom: '1px solid #dee2e6' }}>
                              {calculateAge(item.dob) + ' years'}
                            </td>
                            <td
                              style={{
                                textAlign: 'center',
                                borderBottom: '1px solid #dee2e6',
                                textWrap: 'wrap',
                                width: '100px !important' // Optional: Limit column width
                              }}
                            >
                              {item.medicine_name || '-'}
                            </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6', width: '250px' }}>{item.dosage || '-'}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {item.schedule == 0 ? 'Daily' : 'Weekly' || '-'}
                            </td>
                            {/* <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.remaing_quantity || "1"}</td> */}
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.remind_quantity || '1'}</td>
                            {/* <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.reminder_time}</td> */}
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.instruction || '-'}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {new Date(item.createtime).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center" style={{ borderBottom: '1px solid #dee2e6' }}>
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {medicationData.length > 0 && (
                  <div className="d-flex justify-content-between mt-3">
                    <p style={{ fontWeight: '500' }}>
                      {`Showing ${getPaginatedData(medicationData, 'medication').indexOfFirstItem + 1} to ${getPaginatedData(medicationData, 'medication').indexOfLastItem} of ${getPaginatedData(medicationData, 'medication').totalItems} entries`}
                    </p>
                    <Stack spacing={2}>
                      <Pagination
                        count={getPaginatedData(medicationData, 'medication').totalPages}
                        page={currentPage.medication}
                        onChange={(e, value) => handlePageChange('medication', value)}
                        color="primary"
                      />
                    </Stack>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Adverse Reaction Tab */}
          {activeTab === 'adverseReaction' && (
            <Card>
              {adverseReactionData.length > 0 && (
                <div className="mb-3 pt-3 px-3 text-end">
                  <Button
                    variant="success"
                    onClick={() => exportToExcel(adverseReactionData, 'AdverseReaction')}
                    style={{ backgroundColor: '#0ccfb5', border: 'none' }}
                  >
                    Export to Excel
                  </Button>
                </div>
              )}

              <Card.Body>
                {/* <div className="d-flex justify-content-between flex-wrap mb-3">
                                    <Typography variant="h5" gutterBottom>
                                        <span style={{ color: '#000' }}>Adverse Reaction List</span>
                                    </Typography>
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search..."
                                            onChange={(e) => handleSearch('adverseReaction', e.target.value)}
                                            style={{ width: '200px' }}
                                        />
                                    </div>
                                </div> */}

                <div style={{ overflowX: 'auto' }}>
                  <Table responsive style={{ whiteSpace: 'nowrap', border: '1px solid #dee2e6' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>S. No</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Patient Name</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Medicine Name</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Dosage</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Medicine Type</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Symptom</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Description</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Medication start date</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Reaction Date</th>
                        {/* <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Created Date</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {adverseReactionData.length > 0 ? (
                        getPaginatedData(adverseReactionData, 'adverseReaction').currentItems.map((item, index) => (
                          <tr key={item.adverse_reaction_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {getPaginatedData(adverseReactionData, 'adverseReaction').indexOfFirstItem + index + 1}
                            </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.patient_name}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.medicine_name}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.dosage}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.category_name}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.symptom_name}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.instruction}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {new Date(item.medication_start_date).toLocaleDateString()}
                            </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {new Date(item.reaction_date).toLocaleDateString()}
                            </td>
                            {/* <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                                                            {new Date(item.createtime).toLocaleDateString()}
                                                        </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center" style={{ borderBottom: '1px solid #dee2e6' }}>
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {adverseReactionData.length > 0 && (
                  <div className="d-flex justify-content-between mt-3">
                    <p style={{ fontWeight: '500' }}>
                      {`Showing ${getPaginatedData(adverseReactionData, 'adverseReaction').indexOfFirstItem + 1} to ${getPaginatedData(adverseReactionData, 'adverseReaction').indexOfLastItem} of ${getPaginatedData(adverseReactionData, 'adverseReaction').totalItems} entries`}
                    </p>
                    <Stack spacing={2}>
                      <Pagination
                        count={getPaginatedData(adverseReactionData, 'adverseReaction').totalPages}
                        page={currentPage.adverseReaction}
                        onChange={(e, value) => handlePageChange('adverseReaction', value)}
                        color="primary"
                      />
                    </Stack>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Lab Reports Tab */}
          {activeTab === 'labReport' && (
            <Card>
              {labReportData.length > 0 && (
                <div className="mb-3 pt-3 px-3 text-end">
                  <Button
                    variant="success"
                    onClick={() => exportToExcel(labReportData, 'LabReports')}
                    style={{ backgroundColor: '#0ccfb5', border: 'none' }}
                  >
                    Export to Excel
                  </Button>
                </div>
              )}

              <Card.Body>
                {/* <div className="d-flex justify-content-between flex-wrap mb-3">
                                    <Typography variant="h5" gutterBottom>
                                        <span style={{ color: '#000' }}>Lab Report List</span>
                                    </Typography>
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search..."
                                            onChange={(e) => handleSearch('labReport', e.target.value)}
                                            style={{ width: '200px' }}
                                        />
                                    </div>
                                </div> */}

                <div style={{ overflowX: 'auto' }}>
                  <Table responsive style={{ whiteSpace: 'nowrap', border: '1px solid #dee2e6' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>S. No</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Patient Name</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Category</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Report</th>
                        {/* <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Created Date</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {labReportData.length > 0 ? (
                        getPaginatedData(labReportData, 'labReport').currentItems.map((report, index) => (
                          <tr key={report.medical_report_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {getPaginatedData(labReportData, 'labReport').indexOfFirstItem + index + 1}
                            </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{report.patient_name}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{report.category_name}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              <Button
                                variant="link"
                                onClick={() => handleViewPdf(report.file)}
                                style={{ padding: 0, textDecoration: 'none' }}
                              >
                                <VisibilityIcon style={{ color: '#0ccfb5' }} /> View
                              </Button>
                            </td>
                            {/* <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                                                            {new Date(report.createtime).toLocaleDateString()}
                                                        </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center" style={{ borderBottom: '1px solid #dee2e6' }}>
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {labReportData.length > 0 && (
                  <div className="d-flex justify-content-between mt-3">
                    <p style={{ fontWeight: '500' }}>
                      {`Showing ${getPaginatedData(labReportData, 'labReport').indexOfFirstItem + 1} to ${getPaginatedData(labReportData, 'labReport').indexOfLastItem} of ${getPaginatedData(labReportData, 'labReport').totalItems} entries`}
                    </p>
                    <Stack spacing={2}>
                      <Pagination
                        count={getPaginatedData(labReportData, 'labReport').totalPages}
                        page={currentPage.labReport}
                        onChange={(e, value) => handlePageChange('labReport', value)}
                        color="primary"
                      />
                    </Stack>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Measurements Tab */}
          {activeTab === 'measurement' && (
            <Card>
              {measurementData.length > 0 && (
                <div className="mb-3 pt-3 px-3 text-end">
                  <Button
                    variant="success"
                    onClick={() => exportToExcel(measurementData, 'Measurements')}
                    style={{ backgroundColor: '#0ccfb5', border: 'none' }}
                  >
                    Export to Excel
                  </Button>
                </div>
              )}

              <Card.Body>
                {/* <div className="d-flex justify-content-between flex-wrap mb-3">
                                    <Typography variant="h5" gutterBottom>
                                        <span style={{ color: '#000' }}>Measurements List</span>
                                    </Typography>
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search..."
                                            onChange={(e) => handleSearch('measurement', e.target.value)}
                                            style={{ width: '200px' }}
                                        />
                                    </div>
                                </div> */}

                <div style={{ overflowX: 'auto' }}>
                  <Table responsive style={{ whiteSpace: 'nowrap', border: '1px solid #dee2e6' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>S. No</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Patient Name</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Systolic BP</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Diastolic BP</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Pulse</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Weight</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>PPBGS</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Glucose</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Temperature</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Symptom</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Range</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Time</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurementData.length > 0 ? (
                        getPaginatedData(measurementData, 'measurement').currentItems.map((item, index) => (
                          <tr key={item.measurement_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {getPaginatedData(measurementData, 'measurement').indexOfFirstItem + index + 1}
                            </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.patient_name || '-'}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.systolic_bp|| '-'}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.diastolic_bp|| '-'}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.pulse|| '-'}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.weight ? `${item.weight} KG` : '-'} </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.ppbgs ? `${item.ppbgs} mg/dl` : '-'} </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.fasting_glucose ? `${item.fasting_glucose} mg/dl` : '-'} </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.temperature ? `${item.temperature} °C` : '-'} </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.symptom || '-'}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.symptom_range || '-'}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.time|| '-'}</td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {new Date(item.date).toLocaleDateString()}
                            </td>
                            {/* <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                                                            {new Date(item.createtime).toLocaleDateString()}
                                                        </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="text-center" style={{ borderBottom: '1px solid #dee2e6' }}>
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {measurementData.length > 0 && (
                  <div className="d-flex justify-content-between mt-3">
                    <p style={{ fontWeight: '500' }}>
                      {`Showing ${getPaginatedData(measurementData, 'measurement').indexOfFirstItem + 1} to ${getPaginatedData(measurementData, 'measurement').indexOfLastItem} of ${getPaginatedData(measurementData, 'measurement').totalItems} entries`}
                    </p>
                    <Stack spacing={2}>
                      <Pagination
                        count={getPaginatedData(measurementData, 'measurement').totalPages}
                        page={currentPage.measurement}
                        onChange={(e, value) => handlePageChange('measurement', value)}
                        color="primary"
                      />
                    </Stack>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <Card>
              {complianceData.length > 0 && (
                <div className="mb-3 pt-3 px-3 text-end">
                  <Button
                    variant="success"
                    onClick={() => exportToExcel(complianceData, 'Compliance')}
                    style={{ backgroundColor: '#0ccfb5', border: 'none' }}
                  >
                    Export to Excel
                  </Button>
                </div>
              )}

              <Card.Body>
                {/* <div className="d-flex justify-content-between flex-wrap mb-3">
                                    <Typography variant="h5" gutterBottom>
                                        <span style={{ color: '#000' }}>Medication List</span>
                                    </Typography>
                                    <div>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search..."
                                            onChange={(e) => handleSearch('medication', e.target.value)}
                                            style={{ width: '200px' }}
                                        />
                                    </div>
                                </div> */}

                <div style={{ overflowX: 'auto' }}>
                  <Table responsive style={{ border: '1px solid #dee2e6' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>S. No</th>
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Medicine Name</th>
                        {/* <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Patient Name</th> */}
                        <th style={{ textAlign: 'center', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Taken Status</th>
                    </tr>
                    </thead>
                    <tbody>
                      {complianceData.length > 0 ? (
                        getPaginatedData(complianceData, 'medication').currentItems.map((item, index) => (
                          <tr key={item.medication_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {getPaginatedData(complianceData, 'medication').indexOfFirstItem + index + 1}
                            </td>
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6', textWrap: 'wrap', width: '200px' }}>
                              {item.medicine_name}
                            </td>
                            {/* <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.name}</td> */}
                            <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                              {item.taken_status == 0 ? 'Not taken' : item.taken_status == 1 ? 'Taken' : 'NA'}
                            </td>
                            {/* <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.dosage}</td>
                                                        <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.schedule == 0 ? "Daily" : "Weekly"}</td>
                                                        <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.remaing_quantity || "1"}</td>
                                                        <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.remind_quantity || "1"}</td>
                                                        <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.reminder_time}</td>
                                                        <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>{item.instruction}</td> */}
                            {/* <td style={{ textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>
                                                            {new Date(item.createtime).toLocaleDateString()}
                                                        </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center" style={{ borderBottom: '1px solid #dee2e6' }}>
                            No Data Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {complianceData.length > 0 && (
                  <div className="d-flex justify-content-between mt-3">
                    <p style={{ fontWeight: '500' }}>
                      {`Showing ${getPaginatedData(complianceData, 'medication').indexOfFirstItem + 1} to ${getPaginatedData(complianceData, 'medication').indexOfLastItem} of ${getPaginatedData(complianceData, 'medication').totalItems} entries`}
                    </p>
                    <Stack spacing={2}>
                      <Pagination
                        count={getPaginatedData(complianceData, 'medication').totalPages}
                        page={currentPage.medication}
                        onChange={(e, value) => handlePageChange('medication', value)}
                        color="primary"
                      />
                    </Stack>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </>
      )}

      {/* PDF Modal */}
      <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>View Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={`${IMAGE_PATH}${currentPdf}`}
            style={{ width: '100%', height: '320px' }}
            // frameBorder="0"
            title="PDF Viewer"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPdfModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SharedTabularData;
