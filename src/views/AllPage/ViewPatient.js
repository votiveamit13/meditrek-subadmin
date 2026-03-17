import { Card, Modal, Pagination, Stack, Table, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Typography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { Base_Url, APP_PREFIX_PATH, IMAGE_PATH } from '../../config';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React from 'react';
import { FadeLoader } from 'react-spinners';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import './managecontent.css';

function ViewPatient() {
  const [user_data, setUserDetails] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const [enlargedImage, setEnlargedImage] = React.useState(null);
  const [showImagePopup, setShowImagePopup] = React.useState(false);
  const [content, setContent] = React.useState(5);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQueryGroup, setSearchQuerygroup] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [adverse_data, setAdversedata] = React.useState([]);
  const [report, setReport] = React.useState([]);
  const [medication, setMedication] = React.useState([]);
  const [measurement, setMeasurement] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [showNoteModal, setShowNoteModal] = React.useState(false);
  const [noteDescription, setNoteDescription] = React.useState('');
  const [descriptionError, setDescriptionError] = React.useState('');
  const [editingNoteId, setEditingNoteId] = React.useState(null);
  const [editNoteDescription, setEditNoteDescription] = React.useState('');
  const [editDescriptionError, setEditDescriptionError] = React.useState('');
  const [complianceData, setComplianceData] = React.useState([]);

  const usersPerPage = 50;
  const { user_id } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const doctor_id = localStorage.getItem('doctor_id');
  // const doctor_id = sessionStorage.getItem('doctor_id');
  // console.log("safiu", doctor_id)

  const contentTypes = {
    medication: 1,
    labReports: 2,
    measurement: 3,
    adverse: 4,
    note: 5,
    compliance: 6
  };

  React.useEffect(() => {
    axios
      .get(`${Base_Url}get_patient_details?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
          setLoading(false);
        }
        if (response.data.success) {
          setUserDetails(response.data.patienDetails);
          setLoading(false);
        } else {
          console.error('Error fetching user details:', response.data.msg);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
        setLoading(false);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${Base_Url}fetchadverseof_patient?user_id=${user_id}&doctor_id=${doctor_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          setAdversedata(response.data.adverse_arr);
        } else {
          console.error('Error fetching adverse details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching adverse details:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${Base_Url}get_patient_reports?user_id=${user_id}&doctor_id=${doctor_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success && response.data.list !== 'NA') {
          setReport(response.data.list);
        } else {
          console.error('Error fetching reports:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching reports:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${Base_Url}get_patient_medications_list?user_id=${user_id}&doctor_id=${doctor_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success && response.data.list !== 'NA') {
          setMedication(response.data.list);
        } else {
          console.error('Error fetching medication:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching medication:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${Base_Url}get_patient_measurements?user_id=${user_id}&doctor_id=${doctor_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key === 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success && response.data.list !== 'NA') {
          setMeasurement(response.data.measurements);
        } else {
          console.error('Error fetching measurements:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching measurements:', error);
      });
  }, [user_id]);

  React.useEffect(() => {
    axios
      .get(`${Base_Url}view_compliance?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.key == 'authenticateFailed') {
          sessionStorage.clear();
          navigate(APP_PREFIX_PATH + '/login');
        }
        if (response.data.success) {
          if (response.data.list != 'NA') {
            setComplianceData(response.data.list);
          }
        } else {
          console.error('Error fetching medication list details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.error('Error fetching medication list details:', error);
      });
  }, [user_id]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${Base_Url}get_notes?user_id=${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.key === 'authenticateFailed') {
        sessionStorage.clear();
        navigate(APP_PREFIX_PATH + '/login');
      }
      if (response.data.success && response.data.list !== 'NA') {
        setNotes(
          response.data.notes.map((note, index) => ({
            id: note.note_id,
            sr_no: index + 1,
            description: note.description,
            createtime: note.createtime
          }))
        );
      } else {
        console.error('Error fetching notes:', response.data.msg);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  React.useEffect(() => {
    fetchNotes();
  }, [user_id]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCloseImage = () => {
    setEnlargedImage(null);
    setShowImagePopup(false);
  };

  const handleSearchgroup = (event) => {
    setSearchQuerygroup(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddNote = async () => {
    if (!noteDescription.trim()) {
      setDescriptionError('Description is required');
      return;
    } else if (noteDescription.length > 500) {
      setDescriptionError('Description must be less than 500 characters');
      return;
    }

    setDescriptionError('');

    try {
      const response = await axios.post(
        `${Base_Url}add_note`,
        {
          user_id: user_id,
          description: noteDescription
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to add note');
      }

      await fetchNotes();
      setShowNoteModal(false);
      setNoteDescription('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setEditNoteDescription(note.description);
  };

  const handleUpdateNote = async () => {
    if (!editNoteDescription.trim()) {
      setEditDescriptionError('Please enter Description');
      return;
    } else if (editNoteDescription.length > 500) {
      setEditDescriptionError('Description must be less than 500 characters');
      return;
    }

    setEditDescriptionError('');

    try {
      const response = await axios.post(
        `${Base_Url}update_note`,
        {
          note_id: editingNoteId,
          description: editNoteDescription
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.msg || 'Failed to update note');
      }

      Swal.fire({
        title: '',
        text: 'Note Updated Successfully',
        icon: 'success',
        timer: 2000
      });

      await fetchNotes();
      setEditingNoteId(null);
      setEditNoteDescription('');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const result = await Swal.fire({
      title: 'Are you sure',
      text: 'You want to delete this Note?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          `${Base_Url}delete_note`,
          {
            note_id: noteId
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!response.data.success) {
          throw new Error(response.data.msg || 'Failed to delete note');
        }

        await fetchNotes();

        Swal.fire('Deleted!', 'Your note has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting note:', error);
        Swal.fire('Error!', 'Failed to delete note.', 'error');
      }
    }
  };

  const filterMedicationData =
    medication?.filter((item) => {
      const lowercasedTerm = searchQueryGroup.toLowerCase();
      return Object.values(item).some((val) => val && String(val).toLowerCase().includes(lowercasedTerm));
    }) || [];

  const filterAdverseData =
    adverse_data?.filter((item) => {
      const lowercasedTerm = searchQueryGroup.toLowerCase();
      return Object.values(item).some((val) => val && String(val).toLowerCase().includes(lowercasedTerm));
    }) || [];

  const filterLabReportsData =
    report?.filter((item) => {
      const lowercasedTerm = searchQueryGroup.toLowerCase();
      return Object.values(item).some((val) => val && String(val).toLowerCase().includes(lowercasedTerm));
    }) || [];

  const filterMeasurementData =
    measurement?.filter((item) => {
      const lowercasedTerm = searchQueryGroup.toLowerCase();
      return Object.values(item).some((val) => val && String(val).toLowerCase().includes(lowercasedTerm));
    }) || [];

  const filterNotesData =
    notes?.filter((item) => {
      const lowercasedTerm = searchQueryGroup.toLowerCase();
      return Object.values(item).some((val) => val && String(val).toLowerCase().includes(lowercasedTerm));
    }) || [];

  const filterComplianceData =
    complianceData?.filter((item) => {
      const lowercasedTerm = searchQueryGroup.toLowerCase();
      return Object.values(item).some((val) => val && String(val).toLowerCase().includes(lowercasedTerm));
    }) || [];

  const indexOfLastItem = currentPage * usersPerPage;
  const indexOfFirstItem = indexOfLastItem - usersPerPage;

  const currentMedication = filterMedicationData.slice(indexOfFirstItem, indexOfLastItem);
  const currentAdverse = filterAdverseData.slice(indexOfFirstItem, indexOfLastItem);
  const currentLabReports = filterLabReportsData.slice(indexOfFirstItem, indexOfLastItem);
  const currentMeasurement = filterMeasurementData.slice(indexOfFirstItem, indexOfLastItem);
  const currentNotes = filterNotesData.slice(indexOfFirstItem, indexOfLastItem);
  const currentCompliance = filterComplianceData.slice(indexOfFirstItem, indexOfLastItem);

  const totalMedicationPages = Math.ceil(filterMedicationData.length / usersPerPage);
  const totalAdversePages = Math.ceil(filterAdverseData.length / usersPerPage);
  const totalLabReportsPages = Math.ceil(filterLabReportsData.length / usersPerPage);
  const totalMeasurementPages = Math.ceil(filterMeasurementData.length / usersPerPage);
  const totalNotesPages = Math.ceil(filterNotesData.length / usersPerPage);
  const totalCompliancePages = Math.ceil(filterComplianceData.length / usersPerPage);

  // 16/03
  const [patients, setPatients] = React.useState([]);
  React.useEffect(() => {
    axios
      .get(`${Base_Url}get_all_patient`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data.success && response.data.patient !== 'NA') {
          setPatients(response.data.patient);
        }
      })
      .catch((error) => {
        console.error('Error fetching patient list:', error);
      });
  }, []);

  // ========================

  const exportMedicationToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      medication.map((item, index) => ({
        'S. No.': index + 1,
        'Medicine Name': item.medicine_name,
        'Medicine Type': item.type,
        Schedule: item.schedule,
        Dosage: item.dosage,
        'Current Quantity': item.current_quantity,
        'Reminder Time': item.reminder_time,
        Instruction: item.instruction,
        Description: item.description,
        Status: item.taken_status ? 'Taken' : 'Not Taken',
        Date: item.schedule_date,
        'Create Date & Time': item.updatetime
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MedicationReport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'MedicationReport.xlsx');
  };

  const exportMeasurementToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      measurement.map((item, index) => ({
        'S. No.': index + 1,
        'Systolic BP': item.systolic_bp,
        'Diastolic BP': item.diastolic_bp,
        Pulse: item.pulse,
        'Fasting Glucose': item.fasting_glucose ? `${item.fasting_glucose} mg/dl` : '-',
        PPBGS: item.ppbgs ? `${item.ppbgs} mg/dl` : '-',
        'Weight Measurement': item.weight ? `${item.weight} kg` : '-',
        Temperature: item.temperature ? `${item.temperature} °C` : '-',
        Symptom: item.symptom,
        Range: item.symptom_range,
        Time: item.time,
        Date: item.date,
        'Create Date & Time': item.createtime
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MeasurementReport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'MeasurementReport.xlsx');
  };

  const renderTable = (data, columns, currentData, totalPages = false) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'auto' }}>
              <div className='table-container'>
              <Table responsive hover className="align-middle text-center table" style={{ borderRadius: '12px !important' }}>
                <thead className="py-3 table-head">
                  <tr>
                    {columns.map((col, index) => (
                      <th key={index} style={{ textAlign: 'center', fontWeight: '500', padding: '14px 8px', whiteSpace: 'nowrap' }}>
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((item, index) => (
                    <tr key={index}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex} style={{ textAlign: 'center', whiteSpace: 'wrap' }}>
                          {col.key === 'taken_status'
                            ? item.taken_status
                              ? 'Taken'
                              : 'Not Taken'
                            : col.render
                              ? col.render(item)
                              : item[col.key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <p style={{ fontWeight: '500' }} className="pagination">
                {data.length > 0
                  ? `Showing ${indexOfFirstItem + 1} to ${Math.min(indexOfLastItem, data.length)} of ${data.length} entries`
                  : 'No entries to show'}
              </p>
              <Stack spacing={2} alignItems="right">
                <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
              </Stack>
            </div>
          </>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} style={{ textAlign: 'center', fontWeight: '500' }}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length}>
                  <p style={{ marginBottom: '0px', textAlign: 'center' }}>No Data Available</p>
                </td>
              </tr>
            </tbody>
          </Table>
        )}
      </>
    );
  };

  const renderTabContent = () => {
    switch (content) {
      case contentTypes.medication:
        return (
          <>
            {medication.length > 0 && (
              <div className="mb-3 text-end">
                <Button variant="success" onClick={exportMedicationToExcel} style={{ backgroundColor: '#1DDEC4', border: 'none' }}>
                  Export to Excel
                </Button>
              </div>
            )}
            {renderTable(
              filterMedicationData,
              [
                { header: 'S. No', key: 'sr_no' },
                { header: 'Medicine Name', key: 'medicine_name' },
                { header: 'Schedule', key: 'schedule' },
                { header: 'Dosage', key: 'dosage' },
                { header: 'Status', key: 'taken_status' },
                { header: 'Reminder Time', key: 'reminder_time' },
                { header: 'Instruction', key: 'instruction', width: '150px' },
                { header: 'Description', key: 'description', width: '150px' },
                { header: 'Create Date & Time', key: 'updatetime', width: '170px' }
              ],
              currentMedication,
              totalMedicationPages
            )}
          </>
        );
      case contentTypes.adverse:
        return renderTable(
          filterAdverseData,
          [
            { header: 'S. No', key: 'sr_no' },
            { header: 'Medicine', key: 'medicine_name' },
            { header: 'Dosage', key: 'dosage' },
            { header: 'Status', key: 'taken_status' },
            { header: 'Medicine Type', key: 'category_name' },
            { header: 'Symptom', key: 'symptom_name' },
            { header: 'Description', key: 'instruction' },
            { header: 'Medication Start Date', key: 'medication_start_date' },
            { header: 'Reaction Date', key: 'reaction_date' }
          ],
          currentAdverse,
          totalAdversePages
        );
      case contentTypes.labReports:
        return (
          <>
            <div style={{ maxHeight: '300px', overflowY: 'auto', overflowX: 'auto' }}>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>S. No</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Report Type</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>View</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLabReports.length > 0 ? (
                    currentLabReports.map((item, index) => (
                      <tr key={item.medical_report_id}>
                        <td style={{ textAlign: 'center' }}>{indexOfFirstItem + index + 1}</td>
                        <td style={{ textAlign: 'center' }}>{item.category_name || '-'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              window.open(
                                item.file ? `${IMAGE_PATH}${item.file}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`,
                                '_blank'
                              )
                            }
                          >
                            <VisibilityIcon style={{ marginRight: '5px', fontSize: '16px' }} />
                            View
                          </Button>
                        </td>
                        <td style={{ textAlign: 'center' }}>{item.createtime || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center' }}>
                        No Data Available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            {filterLabReportsData.length > 0 && (
              <div className="d-flex justify-content-between">
                <p style={{ fontWeight: '500' }} className="pagination">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filterLabReportsData.length)} of{' '}
                  {filterLabReportsData.length} entries
                </p>
                <Stack spacing={2} alignItems="right">
                  <Pagination count={totalLabReportsPages} page={currentPage} onChange={handlePageChange} />
                </Stack>
              </div>
            )}
          </>
        );
      case contentTypes.measurement:
        return (
          <>
            {measurement.length > 0 && (
              <div className="mb-3 text-end">
                <Button variant="success" onClick={exportMeasurementToExcel} style={{ backgroundColor: '#1DDEC4', border: 'none' }}>
                  Export to Excel
                </Button>
              </div>
            )}
            {/* <div style={{ width: '100%', overflowX: 'auto' }}>
            {renderTable(
              filterMeasurementData,
              [
                { header: 'S. No', key: 'sr_no' },
                { header: 'Systolic BP', key: 'systolic_bp' },
                { header: 'Diastolic BP', key: 'diastolic_bp' },
                { header: 'Pulse', key: 'pulse' },
                { header: 'Fasting Glucose', key: 'fasting_glucose', render: (item) => item.fasting_glucose ? `${item.fasting_glucose} mg/dl` : '-' },
                { header: 'PPBGS', key: 'ppbgs', render: (item) => item.ppbgs ? `${item.ppbgs} mg/dl` : '-' },
                { header: 'Weight Measurement', key: 'weight', render: (item) => item.weight ? `${item.weight} kg` : '-' },
                { header: 'Temperature', key: 'temperature', render: (item) => item.temperature ? `${item.temperature} °C` : '-' },
                { header: 'Symptom', key: 'symptom' },
                { header: 'Range', key: 'symptom_range' },
                { header: 'Time', key: 'time' },
                { header: 'Date', key: 'date' }
              ],
              currentMeasurement,
              totalMeasurementPages
            )}
            </div> */}

            <div style={{ width: '100%', overflowX: 'auto' }}>
              {renderTable(
                filterMeasurementData,
                [
                  { header: 'S. No', key: 'sr_no' },
                  { header: 'Systolic BP', key: 'systolic_bp' },
                  { header: 'Diastolic BP', key: 'diastolic_bp' },
                  { header: 'Pulse', key: 'pulse' },
                  {
                    header: 'Fasting Glucose',
                    key: 'fasting_glucose',
                    render: (item) => (item.fasting_glucose ? `${item.fasting_glucose} mg/dl` : '-')
                  },
                  { header: 'PPBGS', key: 'ppbgs', render: (item) => (item.ppbgs ? `${item.ppbgs} mg/dl` : '-') },
                  { header: 'Weight Measurement', key: 'weight', render: (item) => (item.weight ? `${item.weight} kg` : '-') },
                  { header: 'Temperature', key: 'temperature', render: (item) => (item.temperature ? `${item.temperature} °C` : '-') },
                  { header: 'Symptom', key: 'symptom' },
                  { header: 'Range', key: 'symptom_range' },
                  {
                    header: 'Time',
                    key: 'time',
                    render: (item) => <span style={{ whiteSpace: 'nowrap' }}>{item.time || '-'}</span>
                  },
                  {
                    header: 'Date',
                    key: 'date',
                    render: (item) => <span style={{ whiteSpace: 'nowrap' }}>{item.date || '-'}</span>
                  }
                ],
                currentMeasurement,
                totalMeasurementPages
              )}
            </div>
          </>
        );
      case contentTypes.note:
        return (
          <>
            <div className="d-flex justify-content-between mb-3 p-4">
              <div className="d-flex justify-content-end">
                {/* <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                      Search
                    </label> */}
                <input
                  className="search-input form-control"
                  type="text"
                  onChange={handleSearchgroup}
                  placeholder="Search..."
                  style={{ width: '220px', fontSize: '13px' }}
                />
              </div>
              <Button variant="primary" onClick={() => setShowNoteModal(true)}>
                <AddIcon /> Add Note
              </Button>
            </div>
            {renderTable(
              filterNotesData,
              [
                { header: 'S. No', key: 'sr_no' },
                {
                  header: 'Actions',
                  key: 'actions',
                  render: (item) => (
                    <div className="d-flex justify-content-center">
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditNote(item)}>
                        <EditIcon fontSize="small" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteNote(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </div>
                  )
                },
                { header: 'Description', key: 'description' },
                { header: 'Create Date & Time', key: 'createtime' }
              ],
              currentNotes,
              totalNotesPages
            )}
          </>
        );
      case contentTypes.compliance:
        return renderTable(
          filterComplianceData,
          [
            { header: 'S. No', key: 'sr_no' },
            { header: 'Medicine Name', key: 'medicine_name' },
            { header: 'Schedule', key: 'schedule' },
            { header: 'Dosage', key: 'dosage' },
            { header: 'Status', key: 'taken_status' },
            { header: 'Reminder Time', key: 'time' },
            { header: 'Instruction', key: 'instruction', width: '150px' },
            { header: 'Pause Status', key: 'pause_status_label', width: '150px' },

            { header: 'Date', key: 'schedule_date' },
            { header: 'Medicine Taken Date & Time', key: 'updatetime', width: '170px' }
          ],
          currentCompliance,
          totalCompliancePages
        );
      default:
        return null;
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ marginLeft: '25rem', marginTop: '10rem' }}>
          <FadeLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          <Typography
            style={{ marginTop: '0px', marginBottom: '20px', fontSize: '13px', paddingRight: '24px' }}
            className="d-flex justify-content-end align-items-center"
            variant="h4"
            gutterBottom
          >
            <span style={{ color: '#1ddec4' }}>Dashboard</span> / View Patient
          </Typography>
          <Card className="mb-3 border-0 shadow-sm rounded-3">
            <Card.Body>
              <div className="view-user-content row mt-2">
                <div className="col-lg-3 col-md-4 col-sm-12 text-center">
                  <div>
                    <p style={{ fontWeight: '600', marginLeft: '50px;', textAlign: 'center', fontSize: '16px', marginBottom: 0 }}>
                      {user_data.name || '-'}
                    </p>
                  </div>
                  <div className="d-flex flex-column flex-wrap justify-content-center text-center">
                    <span
                      onClick={handleShow}
                      onKeyDown={(e) => e.key === 'Enter' && handleShow()}
                      className="profile-div"
                      role="button"
                      tabIndex={0}
                    >
                      <img
                        src={user_data?.image ? `${IMAGE_PATH}${user_data.image}` : `${IMAGE_PATH}placeholder.jpg`}
                        alt="User"
                        className="user-image"
                      />
                    </span>
                  </div>
                </div>
                <div className="col-lg-9 col-md-8 col-sm-12">
                  <div className="mobile-view ms-3 ">
                    <h6 style={{ fontWeight: '600' }}>Patient Details</h6>
                    <div className="user-detail row " style={{ marginTop: '10px' }}>
                      <div className="col-lg-12">
                        {/* <div className="row">
                          <div className="col-lg-4">
                            <p style={{}}>User Name :</p>
                          </div>
                          <div className="col-lg-8">
                            <p style={{ fontWeight: '500', marginLeft: '50px;' }}>{user_data.name || '-'}</p>
                          </div>
                        </div> */}

                        <div className="d-flex gap-2">
                          <div className="patient-details">
                            <p style={{ marginBottom: '3px', fontWeight: '500' }}>Mobile Number : </p>
                          </div>
                          <div className="">
                            <p style={{ fontWeight: '500', marginBottom: '3px', fontSize: '12px' }}>{user_data?.mobile || '-'}</p>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <div className="patient-details">
                            <p style={{ marginBottom: '3px', fontWeight: '500' }}>Email : </p>
                          </div>
                          <div className="">
                            <p style={{ fontWeight: '500', marginLeft: '50px;', marginBottom: '3px', fontSize: '12px' }}>
                              {user_data?.email || '-'}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <div className="patient-details">
                            <p style={{ marginBottom: '3px', fontWeight: '500' }}>Age : </p>
                          </div>
                          <div className="">
                            <p style={{ fontWeight: '500', marginBottom: '3px', fontSize: '12px' }}>{user_data?.age + ' years' || '-'}</p>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <div className="patient-details">
                            <p style={{ marginBottom: '3px', fontWeight: '500' }}>Height : </p>
                          </div>
                          <div>
                            <p style={{ fontWeight: '500', marginBottom: '3px', fontSize: '12px' }}>{user_data?.height + ' cm' || '-'}</p>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <div className="patient-details">
                            <p style={{ marginBottom: '3px', fontWeight: '500' }}>Weight : </p>
                          </div>
                          <div>
                            <p style={{ fontWeight: '500', marginBottom: '3px', fontSize: '12px' }}>{user_data?.weight + ' Kg' || '-'}</p>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <div className="patient-details">
                            <p style={{ marginBottom: '3px', fontWeight: '500' }}>Disease : </p>
                          </div>
                          <div>
                            <p style={{ fontWeight: '500', marginBottom: '3px', fontSize: '12px' }}>
                              {(() => {
                                const rawString = user_data?.diseaseName || '';
                                const matches = [...rawString.matchAll(/name:\s*([\w\s]+)/g)];
                                const names = matches.map((m) => m[1].trim());
                                return names.length > 0 ? names.join(', ') : '-';
                              })()}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <div className="patient-details">
                            <p style={{ marginBottom: '3px', fontWeight: '500' }}>Status :</p>
                          </div>
                          <div className="responsive-btn">
                            <p
                              style={{
                                borderRadius: '8px',
                                backgroundColor: user_data.active_flag === 1 ? '#0096403d' : '#FF2222',
                                padding: '0px 10px',
                                width: 'fit-content',
                                color: '#009640',
                                fontWeight: '500',
                                textAlign: 'center',
                                marginBottom: '3px',
                                fontSize: '12px'
                              }}
                            >
                              {user_data?.active_flag === 1 ? 'Activate' : 'Deactivate' || '-'}
                            </p>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <div className="patient-details">
                            <p style={{ fontWeight: '500', marginBottom: '3px' }}>Create Date & Time :</p>
                          </div>
                          <div>
                            <p style={{ fontWeight: '500', fontSize: '12px', marginBottom: '3px' }}>{user_data?.createtime || '-'} </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {showImagePopup && (
                <div
                  className="enlarged-image-overlay"
                  onClick={handleCloseImage}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleCloseImage();
                  }}
                >
                  <span
                    className="close-button"
                    onClick={handleCloseImage}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleCloseImage();
                    }}
                  >
                    &times;
                  </span>
                  <img
                    src={enlargedImage}
                    alt="Enlarged view"
                    className="enlarged-image"
                    style={{ width: '20rem', height: '20rem', objectFit: 'cover' }}
                  />
                </div>
              )}
            </Card.Body>
            <Modal show={show} onHide={handleClose} className="d-flex justify-content-center align-items-center mt-5">
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <img
                  src={user_data.image ? `${IMAGE_PATH}${user_data.image}` : `${IMAGE_PATH}placeholder.png`}
                  alt="Preview"
                  style={{ width: '100%', height: '356px', margin: 'auto', display: 'flex', objectFit: 'cover' }}
                />
              </Modal.Body>
            </Modal>
          </Card>

          <div className="row d-flex align-items-stretch">
            <div className="col-md-2 pt-2 d-flex">
              <div className='bg-white p-4 rounded w-100'>
              <h6 className="mb-3">My Patients</h6>
              <div className="patient-scroll">
                {patients.map((patient) => (
                  <div key={patient.user_id} className="patient-item">
                    <div to={`${APP_PREFIX_PATH}/manage-user/userlist/view_user/${patient.user_id}`} className="text-decoration-none">
                      {patient.name || 'NA'}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            </div>
            <div className="col-md-10 d-flex flex-column">
              <nav className="col-xl-10 navbar navbar-expand-lg navbar-light flex-nowrap ">
                <div className="tabs justify-content-start tabs-container" style={{ marginBottom: '16px' }}>
                  <button
                    className={`btn ${content === contentTypes.note ? 'active-button' : 'non-active-btn'}`}
                    type="button"
                    onClick={() => setContent(contentTypes.note)}
                  >
                    Note
                  </button>

                  <button
                    className={`btn ${content === contentTypes.medication ? 'btn-primary' : 'non-active-btn'}`}
                    type="button"
                    onClick={() => setContent(contentTypes.medication)}
                  >
                    Medication
                  </button>

                  <button
                    className={`btn ${content === contentTypes.labReports ? 'btn-primary' : 'non-active-btn'}`}
                    type="button"
                    onClick={() => setContent(contentTypes.labReports)}
                  >
                    Lab Reports
                  </button>

                  <button
                    className={`btn ${content === contentTypes.measurement ? 'btn-primary' : 'non-active-btn'}`}
                    type="button"
                    onClick={() => setContent(contentTypes.measurement)}
                  >
                    Measurement
                  </button>

                  <button
                    className={`btn ${content === contentTypes.adverse ? 'btn-primary' : 'non-active-btn'}`}
                    type="button"
                    onClick={() => setContent(contentTypes.adverse)}
                  >
                    Report Health
                  </button>

                  {/* <button
                style={{ border: '1px solid #238BF0', borderRadius: '0px', height: '38px' }}
                className={`btn ${content === contentTypes.compliance ? 'btn-primary' : 'btn-light'}`}
                type="button"
                onClick={() => setContent(contentTypes.compliance)}
              >
                Compliance
              </button> */}
                </div>
              </nav>

              <Card className="border-0 shadow-sm rounded-3 flex-grow-1" style={{ overflow: 'hidden' }}>
                <Card.Body className="p-0">{renderTabContent()}</Card.Body>
              </Card>
            </div>
          </div>

          <Modal
            show={showNoteModal}
            onHide={() => {
              setShowNoteModal(false);
              setDescriptionError('');
            }}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Add New Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="noteDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={noteDescription}
                  onChange={(e) => {
                    setNoteDescription(e.target.value);
                    if (descriptionError) setDescriptionError('');
                  }}
                  isInvalid={!!descriptionError}
                />
                <Form.Control.Feedback type="invalid">{descriptionError}</Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowNoteModal(false);
                  setDescriptionError('');
                }}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleAddNote}>
                Save Note
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={editingNoteId !== null}
            onHide={() => {
              setEditingNoteId(null);
              setEditDescriptionError('');
            }}
            centered
          >
            <Modal.Header>
              <Modal.Title>Edit Note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="editNoteDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editNoteDescription}
                  onChange={(e) => {
                    setEditNoteDescription(e.target.value);
                    if (editDescriptionError) setEditDescriptionError('');
                  }}
                  isInvalid={!!editDescriptionError}
                />
                <Form.Control.Feedback type="invalid">{editDescriptionError}</Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingNoteId(null);
                  setEditDescriptionError('');
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateNote}>
                Update Note
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}

export default ViewPatient;
