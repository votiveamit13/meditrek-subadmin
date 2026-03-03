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

function AdverseReport() {
    const [currentPage, setCurrentPage] = useState(1);
    const [adverseReactions, setAdverseReactionData] = useState([]);
    const [from_date, setFromDate] = useState('');
    const [to_date, setToDate] = useState('');
    const [from_date_error, setFromDateError] = useState('');
    const [to_date_error, setToDateError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const itemsPerPage = 10;

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredReactions = adverseReactions.filter((reaction) => {
        const lowercasedTerm = searchQuery.toLowerCase();
        return (
            reaction.patient_name?.toLowerCase().includes(lowercasedTerm) ||
            reaction.medicine_name?.toLowerCase().includes(lowercasedTerm) ||
            reaction.symptom_name?.toLowerCase().includes(lowercasedTerm) ||
            reaction.instruction?.toLowerCase().includes(lowercasedTerm)
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredReactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReactions.length / itemsPerPage);

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

        axios.get(`${Base_Url}get_adverse_tabular?from_date=${from_date}&to_date=${to_date}`)
            .then((response) => {
                if (response.data.success && Array.isArray(response.data.adverse_arr)) {
                    setAdverseReactionData(response.data.adverse_arr);
                } else {
                    setAdverseReactionData([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching adverse reaction data:', error);
                setAdverseReactionData([]);
            });
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(
            adverseReactions.map((reaction, index) => ({
                'S. No.': index + 1,
                'Patient Name': reaction.patient_name,
                'Medicine Name': reaction.medicine_name,
                'Dosage': reaction.dosage,
                'Medicine Category': reaction.medicine_category,
                'Symptom': reaction.symptom_name,
                'Medication Start Date': reaction.medication_start_date,
                'Reaction Date': reaction.reaction_date,
                'Instruction': reaction.instruction,
                'Created Date': reaction.createtime
            }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'AdverseReactionReport');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'AdverseReactionReport.xlsx');
    };

    return (
        <>
            <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
                <Link to={'/'} style={{ textDecoration: 'none' }}>
                    <span style={{ color: '#0ccfb5' }}>Dashboard</span>
                </Link> / Adverse Reaction Report
            </Typography>

            <Card className="mb-4">
                <Card.Header className="bg-white">
                    <Card.Title as="h5" className="mt-2">
                        Adverse Reaction Report
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

            {adverseReactions.length > 0 && (
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
                        <span style={{ color: '#000' }}>Adverse Reaction List</span>
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
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Name</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Dosage</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Medicine Category</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Symptom</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Medication Start Date</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Reaction Date</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Instruction</th>
                                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((reaction, index) => (
                                        <tr key={reaction.adverse_reaction_id}>
                                            <td style={{ textAlign: 'center' }}>{indexOfFirstItem + index + 1}</td>
                                            <td style={{ textAlign: 'center' }}>{reaction.patient_name}</td>
                                            <td style={{ textAlign: 'center' }}>{reaction.medicine_name}</td>
                                            <td style={{ textAlign: 'center' }}>{reaction.dosage}</td>
                                            <td style={{ textAlign: 'center' }}>{reaction.medicine_category}</td>
                                            <td style={{ textAlign: 'center' }}>{reaction.symptom_name}</td>
                                            <td style={{ textAlign: 'center' }}>{reaction.medication_start_date}</td>
                                            <td style={{ textAlign: 'center' }}>{reaction.reaction_date}</td>
                                            <td style={{ textAlign: 'center' }}>{reaction.instruction}</td>
                                            <td style={{ textAlign: 'center' }}>{reaction.createtime}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="text-center">
                                            No Data Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <p style={{ fontWeight: '500' }}>
                            {filteredReactions.length > 0
                                ? `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, filteredReactions.length)} of ${filteredReactions.length} entries`
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

export default AdverseReport;