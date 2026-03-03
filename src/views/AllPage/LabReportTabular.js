import { Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { Base_Url, IMAGE_PATH } from '../../config';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import VisibilityIcon from '@mui/icons-material/Visibility';

function LabReportTabular() {
    const [currentPage, setCurrentPage] = useState(1);
    const [reports, setReportData] = useState([]);
    const [from_date, setFromDate] = useState('');
    const [to_date, setToDate] = useState('');
    const [from_date_error, setFromDateError] = useState('');
    const [to_date_error, setToDateError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [currentPdf, setCurrentPdf] = useState('');

    const itemsPerPage = 10;

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredReports = reports.filter((report) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        return (
            report.patient_name?.toLowerCase().includes(lowercasedTerm) ||
            report.category_name?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

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

        axios.get(`${Base_Url}get_lab_report_tabular?from_date=${from_date}&to_date=${to_date}`)
            .then((response) => {
                if (response.data.success && Array.isArray(response.data.report_arr)) {
                    setReportData(response.data.report_arr);
                } else {
                    setReportData([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching lab report data:', error);
                setReportData([]);
            });
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            reports.map((report, index) => ({
                'S. No.': index + 1,
                'Patient Name': report.patient_name,
                'Category': report.category_name,
                'Created Date': report.createtime
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'LabReports');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'LabReports.xlsx');
    };

    const handleViewPdf = (pdfFile) => {
        setCurrentPdf(pdfFile);
        setShowPdfModal(true);
    };

    return (
        <>
            <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
                <Link to={'/'} style={{ textDecoration: 'none' }}>
                    <span style={{ color: '#0ccfb5' }}>Dashboard</span>
                </Link> / Lab Reports
            </Typography>

            <Card className="mb-4">
                <Card.Header className="bg-white">
                    <Card.Title as="h5" className="mt-2">
                        Lab Reports
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

            {reports.length > 0 && (
                <div className="mb-3 text-end">
                    <Button
                        variant="success"
                        onClick={exportToExcel}
                        style={{ backgroundColor: '#0ccfb5', border: 'none' }}
                    >
                        Export to Excel
                    </Button>
                </div>
            )}

            <Card>
                <Card.Header className="bg-white d-flex justify-content-between flex-wrap">
                    <Typography variant="h5" gutterBottom>
                        <span style={{ color: '#000' }}>Lab Report List</span>
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
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Category</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Patient Name</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Report</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((report, index) => (
                                        <tr key={report.medical_report_id}>
                                            <td style={{ textAlign: 'center' }}>{indexOfFirstItem + index + 1}</td>
                                            <td style={{ textAlign: 'center' }}>{report.category_name}</td>
                                            <td style={{ textAlign: 'center' }}>{report.patient_name}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <Button
                                                    variant="link"
                                                    onClick={() => handleViewPdf(report.file)}
                                                    style={{ padding: 0 }}
                                                >
                                                    <VisibilityIcon style={{ color: '#0ccfb5' }} /> View
                                                </Button>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{report.createtime}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center">
                                            No Data Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <p style={{ fontWeight: '500' }}>
                            {filteredReports.length > 0
                                ? `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredReports.length)} of ${filteredReports.length} entries`
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

            {/* PDF Viewer Modal */}
            <Modal
                show={showPdfModal}
                onHide={() => setShowPdfModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Report Viewer</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '70vh' }}>
                    <iframe
                        src={`${IMAGE_PATH}${currentPdf.trim()}`}
                        title="PDF Viewer"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowPdfModal(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LabReportTabular;