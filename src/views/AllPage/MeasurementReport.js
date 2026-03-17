import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { Base_Url } from '../../config';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

function MeasurementReport() {
    const [currentPage, setCurrentPage] = useState(1);
    const [measurements, setMeasurementData] = useState([]);
    const [from_date, setFromDate] = useState('');
    const [to_date, setToDate] = useState('');
    const [from_date_error, setFromDateError] = useState('');
    const [to_date_error, setToDateError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const itemsPerPage = 10;

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMeasurements = measurements.filter((measurement) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        return (
            measurement.patient_name?.toLowerCase().includes(lowercasedTerm) ||
            measurement.systolic_bp?.toString().includes(lowercasedTerm) ||
            measurement.diastolic_bp?.toString().includes(lowercasedTerm) ||
            measurement.type?.toString().includes(lowercasedTerm)
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMeasurements.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMeasurements.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

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
            setToDateError('To Date Must Be Greater Than from date');
            hasError = true;
        } else {
            setToDateError('');
        }

        if (hasError) return;

        axios.get(`${Base_Url}get_measurement_tabular?from_date=${from_date}&to_date=${to_date}`)
            .then((response) => {
                if (response.data.success && Array.isArray(response.data.measurement_arr)) {
                    setMeasurementData(response.data.measurement_arr);
                } else {
                    setMeasurementData([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching measurement data:', error);
                setMeasurementData([]);
            });
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            measurements.map((measurement, index) => ({
                'S. No.': index + 1,
                'Patient Name': measurement.patient_name,
                'Type': measurement.type === 0 ? 'Blood Pressure' : measurement.type === 1 ? 'Glucose' : 'Weight',
                'Systolic BP': measurement.systolic_bp,
                'Diastolic BP': measurement.diastolic_bp,
                'Pulse': measurement.pulse,
                'Weight': measurement.weight,
                'Fasting Glucose': measurement.fasting_glucose,
                'Temperature': measurement.temperature,
                'PPBGS': measurement.ppbgs,
                'Date': measurement.date,
                'Time': measurement.time,
                'Created Date': measurement.createtime
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'MeasurementReport');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'MeasurementReport.xlsx');
    };

    return (
        <>
            <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
                <Link to={'/'} style={{ textDecoration: 'none' }}>
                    <span style={{ color: '#f68519' }}>Dashboard</span>
                </Link> / Measurement Report
            </Typography>

            <Card className="mb-4">
                <Card.Header className="bg-white">
                    <Card.Title as="h5" className="mt-2">
                        Measurement Report
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col sm={5}>
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
                            <Col sm={5}>
                                <Form.Group className="mb-3">
                                    <Form.Label>To Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        max={new Date().toISOString().split("T")[0]}
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
                            <Col sm={2} className="d-flex align-items-end">
                                <Button type="submit" className="submit-btn">
                                    View
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {measurements.length > 0 && (
                <div className="mb-3 text-end">
                    <Button
                        variant="success"
                        onClick={exportToExcel}
                        style={{ backgroundColor: '#f68519', border: 'none' }}
                    >
                        Export to Excel
                    </Button>
                </div>
            )}

            <Card>
                <Card.Header className="bg-white d-flex justify-content-between flex-wrap">
                    <Typography variant="h5" gutterBottom>
                        <span style={{ color: '#000' }}>Measurement List</span>
                    </Typography>
                    <div>
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            onChange={handleSearch}
                            style={{ width: '200px' }}
                        />
                    </div>
                </Card.Header>
                <Card.Body>
                    <div style={{ overflowX: 'auto' }}>
                        <Table responsive hover style={{ whiteSpace: 'nowrap' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Patient Name</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Type</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Systolic BP</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Diastolic BP</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Pulse</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Weight</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Fasting Glucose</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>PPBGS</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Temperature</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Date</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Time</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((measurement, index) => (
                                        <tr key={measurement.measurement_id}>
                                            <td style={{ textAlign: 'center' }}>{indexOfFirstItem + index + 1}</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.patient_name}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                {measurement.type === 0 ? 'Blood Pressure' :
                                                    measurement.type === 1 ? 'Glucose' : 'Weight'}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{measurement.systolic_bp}</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.diastolic_bp}</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.pulse}</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.weight}KG</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.fasting_glucose} mg/dl</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.ppbgs} mg/dl</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.temperature}°C</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.date}</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.time}</td>
                                            <td style={{ textAlign: 'center' }}>{measurement.createtime}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={13} className="text-center">
                                            No Data Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <p style={{ fontWeight: '500' }}>
                            {filteredMeasurements.length > 0
                                ? `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredMeasurements.length)} of ${filteredMeasurements.length} entries`
                                : "Showing 0 to 0 of 0 entries"}
                        </p>
                        <Stack spacing={2}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Stack>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
}

export default MeasurementReport;