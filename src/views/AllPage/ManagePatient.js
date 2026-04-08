import { Card, Stack, Table, Button, Form } from 'react-bootstrap';
import Pagination from '@mui/material/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Typography from '@mui/material/Typography';
// import { useNavigate } from 'react-router';
import axios from 'axios';
import { Base_Url, IMAGE_PATH } from '../../config';
import React, { useEffect, useRef } from 'react';
import { FadeLoader } from 'react-spinners';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import './managecontent.css';
import { useState } from 'react';
import { RiFileExcel2Line } from "react-icons/ri";
import CustomTable from 'component/common/CustomTable';
import CustomModal from 'component/common/CustomModal';
import MeasurementChart from 'component/my-patient/MeasurementChart';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AdverseCardView from 'component/my-patient/ReportHealth';
import DocumentCardView from 'component/my-patient/DocumentCardView';
import { useSelector } from 'react-redux';
import dayjs from 'utils/dayjs';

function ViewPatient() {
  const [user_data, setUserDetails] = React.useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patients, setPatients] = React.useState([]);
  // const [show, setShow] = React.useState(false);
  // const [enlargedImage, setEnlargedImage] = React.useState(null);
  // const [showImagePopup, setShowImagePopup] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQueryGroup, setSearchQuerygroup] = React.useState('');
  // const [loading, setLoading] = React.useState(true);
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [patientPage, setPatientPage] = useState(1);
  const patientsPerPage = 10;
  const [measurementType, setMeasurementType] = useState("bp");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationTab, setNotificationTab] = useState("all");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const dropdownRef = useRef(null);
  const [sortConfig, setSortConfig] = useState(null);
  const timezone = useSelector((state) => state.timezone.value);

const handleSort = (key) => {
  setSortConfig((prev) => {
    if (!prev) {
      return { key, direction: "asc" };
    }
    return {
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    };
  });
};


// const parseDateTime = (str) => {
//   if (!str) return 0;

//   const [date, time, modifier] = str.split(" ");
//   const [day, month, year] = date.split("-");

//   let [hours, minutes] = time.split(":").map(Number);

//   if (modifier === "PM" && hours !== 12) hours += 12;
//   if (modifier === "AM" && hours === 12) hours = 0;

//   return new Date(year, month - 1, day, hours, minutes).getTime();
// };

  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const { user_id } = useParams();
  // const navigate = useNavigate();
  const token = sessionStorage.getItem('token');
  const doctor_id = sessionStorage.getItem('doctor_id');
  const [expandedNotes, setExpandedNotes] = useState({});

  const toggleReadMore = (id) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const selectedId = sessionStorage.getItem("selectedPatientId");

    if (selectedId) {
      setSelectedPatientId(selectedId);

      sessionStorage.removeItem("selectedPatientId");
    }
  }, []);

  useEffect(() => {
    const handlePatientChange = () => {
      const selectedId = sessionStorage.getItem("selectedPatientId");

      if (selectedId) {
        setSelectedPatientId(selectedId);
      }
    };

    window.addEventListener("patientChanged", handlePatientChange);

    return () => {
      window.removeEventListener("patientChanged", handlePatientChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const filtered = patients.filter((p) =>
      p.name.toLowerCase().includes(patientSearch.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [patientSearch, patients]);


  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
    setShowDropdown(false);
  };

  const sendToAll = async () => {
    try {
      const res = await axios.post(
        `${Base_Url}send_notification_all`,
        {
          title: notificationTitle,
          message: notificationMessage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire("Success", res.data.msg, "success");
      setShowNotificationModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const sendToUsers = async () => {
    try {
      const res = await axios.post(
        `${Base_Url}send_notification_users`,
        {
          title: notificationTitle,
          message: notificationMessage,
          user_ids: selectedUsers
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire("Success", res.data.msg, "success");
      setShowNotificationModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 1:
        return "Male";
      case 2:
        return "Female";
      case 3:
        return "Other";
      default:
        return "-";
    }
  };

  const getDiseaseNames = (diseaseString) => {
    if (!diseaseString) return "-";

    const matches = diseaseString.match(/name:\s*([^,}]+)/g);
    if (!matches) return "-";

    return matches.map(m => m.replace("name:", "").trim()).join(", ");
  };
  // const doctor_id = sessionStorage.getItem('doctor_id');
  // console.log("safiu", doctor_id)
  // useEffect(() => {
  //   if (selectedPatientId) {
  //     setLoading(true);
  //   }
  // }, [selectedPatientId]);
  useEffect(() => {
    if (patients.length > 0 && doctor_id) {
      setSelectedPatientId((prev) => prev || patients[0].user_id);
    }
  }, [patients, doctor_id]);

  const contentTypes = {
    medication: 1,
    labReports: 2,
    measurement: 3,
    adverse: 4,
    note: 5,
    compliance: 6
  };
  const [content, setContent] = React.useState(contentTypes.note);
  // Add this function before your useEffect hooks
  const fetchNotes = async () => {
    if (!selectedPatientId) return;

    try {
      const response = await axios.get(`${Base_Url}get_notes?user_id=${selectedPatientId}&doctor_id=${doctor_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.key === 'authenticateFailed') {
        sessionStorage.clear();
        // navigate(APP_PREFIX_PATH + '/login'); // Uncomment if you have navigate
      }
      if (response.data.success && response.data.list !== "NA") {
        setNotes(response.data.notes.map((note, index) => ({
          id: note.note_id,
          sr_no: index + 1,
          description: note.description,
          createtime: note.createtime
        })));
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    }
  };

  // Update your main useEffect to include sr_no for all data types
  useEffect(() => {
    if (!selectedPatientId || !doctor_id) return;

    if (initialLoading) {
      setInitialLoading(true);
    } else {
      setSwitchLoading(true);
    }

    Promise.all([
      axios.get(`${Base_Url}get_patient_details?user_id=${selectedPatientId}&doctor_id=${doctor_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${Base_Url}fetchadverseof_patient?user_id=${selectedPatientId}&doctor_id=${doctor_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${Base_Url}get_patient_reports?user_id=${selectedPatientId}&doctor_id=${doctor_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${Base_Url}get_patient_medications_list?user_id=${selectedPatientId}&doctor_id=${doctor_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${Base_Url}get_patient_measurements?user_id=${selectedPatientId}&doctor_id=${doctor_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${Base_Url}view_compliance?user_id=${selectedPatientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get(`${Base_Url}get_notes?user_id=${selectedPatientId}&doctor_id=${doctor_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
      .then(([
        detailsRes,
        adverseRes,
        reportsRes,
        medsRes,
        measurementRes,
        complianceRes,
        notesRes
      ]) => {
        // Handle authentication failure for each response
        const responses = [detailsRes, adverseRes, reportsRes, medsRes, measurementRes, complianceRes, notesRes];
        for (const res of responses) {
          if (res.data.key === 'authenticateFailed') {
            sessionStorage.clear();
            // navigate(APP_PREFIX_PATH + '/login'); // Uncomment if you have navigate
            return;
          }
        }

        if (detailsRes.data.success) setUserDetails(detailsRes.data.patienDetails);

        // Add sr_no to adverse data
        if (adverseRes.data.success && adverseRes.data.adverse_arr) {
          setAdversedata(adverseRes.data.adverse_arr.map((item, index) => ({
            ...item,
            sr_no: index + 1
          })));
        } else {
          setAdversedata([]);
        }

        // Add sr_no to reports
        if (reportsRes.data.success && reportsRes.data.list !== 'NA') {
          setReport(reportsRes.data.list.map((item, index) => ({
            ...item,
            sr_no: index + 1
          })));
        } else {
          setReport([]);
        }

        // Add sr_no to medication
        if (medsRes.data.success && medsRes.data.list !== 'NA') {
          setMedication(medsRes.data.list.map((item, index) => ({
            ...item,
            sr_no: index + 1
          })));
        } else {
          setMedication([]);
        }

        // Add sr_no to measurements
        if (measurementRes.data.success && measurementRes.data.measurements !== 'NA') {
          setMeasurement(measurementRes.data.measurements.map((item, index) => ({
            ...item,
            sr_no: index + 1
          })));
        } else {
          setMeasurement([]);
        }

        // Add sr_no to compliance data
        if (complianceRes.data.success && complianceRes.data.list !== 'NA') {
          setComplianceData(complianceRes.data.list.map((item, index) => ({
            ...item,
            sr_no: index + 1
          })));
        } else {
          setComplianceData([]);
        }

        // Handle notes with sr_no
        if (notesRes.data.success && notesRes.data.list !== 'NA') {
          setNotes(notesRes.data.notes.map((note, index) => ({
            id: note.note_id,
            sr_no: index + 1,
            description: note.description,
            createtime: note.createtime
          })));
        } else {
          setNotes([]);
        }

        setInitialLoading(false);
        setSwitchLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setInitialLoading(false);
        setSwitchLoading(false);
      });
  }, [selectedPatientId, token, doctor_id]); // Add dependencies

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // const handleCloseImage = () => {
  //   setEnlargedImage(null);
  //   setShowImagePopup(false);
  // };

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
  }

  try {
    const response = await axios.post(
      `${Base_Url}add_note`,
      {
        user_id: selectedPatientId,
        doctor_id: doctor_id,
        description: noteDescription
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.msg || 'Failed to add note');
    }

    const newNote = {
      id: Date.now(),
      sr_no: notes.length + 1,
      description: noteDescription
    };
    setNotes((prev) => [newNote, ...prev]);

    await fetchNotes();

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Note added successfully',
      confirmButtonText: 'OK'
    });

    setShowNoteModal(false);
    setNoteDescription('');

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Something went wrong',
      confirmButtonText: 'OK'
    });
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
          doctor_id: doctor_id,
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

  // const getFilteredMeasurement = () => {
  //   switch (measurementType) {
  //     case "bp":
  //       return measurement.filter((m) => m.type === 0);
  //     case "fasting":
  //       return measurement.filter((m) => m.type === 1);
  //     case "ppbgs":
  //       return measurement.filter((m) => m.type === 2);
  //     case "weight":
  //       return measurement.filter((m) => m.type === 3);
  //     case "temp":
  //       return measurement.filter((m) => m.type === 4);
  //     default:
  //       return [];
  //   }
  // };
  // const filteredMeasurement = getFilteredMeasurement();

  const groupedMedication = Object.values(
    medication.reduce((acc, item) => {
      const key = item.medicine_id;

      if (!acc[key]) {
        acc[key] = {
          ...item,
          reminder_time: [item.reminder_time]
        };
      } else {
        acc[key].reminder_time.push(item.reminder_time);
      }

      return acc;
    }, {})
  );

  const filterMedicationData =
    groupedMedication?.filter((item) => {
      const lowercasedTerm = searchQueryGroup.toLowerCase();
      return Object.values(item).some(
        (val) => val && String(val).toLowerCase().includes(lowercasedTerm)
      );
    }) || [];

    const sortedMedication = [...filterMedicationData].sort(
  (a, b) => new Date(b.updatetime) - new Date(a.updatetime)
);

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

  // const filterMeasurementData =
  //   measurement?.filter((item) => {
  //     const lowercasedTerm = searchQueryGroup.toLowerCase();
  //     return Object.values(item).some((val) => val && String(val).toLowerCase().includes(lowercasedTerm));
  //   }) || [];

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

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;

  // const sortedMedication = [...filterMedicationData].sort((a, b) => {
  //   if (!sortConfig.key) return 0;

  //   const aVal = a[sortConfig.key] || "";
  //   const bVal = b[sortConfig.key] || "";

  //   if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
  //   if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
  //   return 0;
  // });

  // const currentMedication = sortedMedication.slice(indexOfFirstItem, indexOfLastItem);
  // const currentAdverse = filterAdverseData.slice(indexOfFirstItem, indexOfLastItem);
  // const currentLabReports = filterLabReportsData.slice(indexOfFirstItem, indexOfLastItem);
  // const currentMeasurement = filterMeasurementData.slice(indexOfFirstItem, indexOfLastItem);
  // const currentNotes = filterNotesData.slice(indexOfFirstItem, indexOfLastItem);
  const currentCompliance = filterComplianceData.slice(indexOfFirstItem, indexOfLastItem);

  // const totalMedicationPages = Math.ceil(filterMedicationData.length / rowsPerPage);
  // const totalAdversePages = Math.ceil(filterAdverseData.length / rowsPerPage);
  // const totalLabReportsPages = Math.ceil(filterLabReportsData.length / rowsPerPage);
  // const totalMeasurementPages = Math.ceil(filterMeasurementData.length / rowsPerPage);
  // const totalNotesPages = Math.ceil(filterNotesData.length / rowsPerPage);
  const totalCompliancePages = Math.ceil(filterComplianceData.length / rowsPerPage);

  // 16/03

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
        Date: item.date,
        Time: item.time,
        'Systolic BP': item.systolic_bp,
        'Diastolic BP': item.diastolic_bp,
        Pulse: item.pulse,
        'Fasting Glucose': item.fasting_glucose,
        PPBGS: item.ppbgs,
        Weight: item.weight,
        Temperature: item.temperature
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Measurement');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'Measurement.xlsx');
  };

  const exportNotesToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      notes.map((item, index) => ({
        'S. No.': index + 1,
        Description: item.description,
        Date: item.createtime
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Notes');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'Notes.xlsx');
  };

const exportReportsToExcel = () => {
  const data = filterLabReportsData.map((item, index) => ({
    'S. No.': index + 1,
    Name: item.category_name || "-",
    Date: item.createtime || "-",
    Link: item.file
      ? {
          t: "s",
          v: "View File",
          l: { Target: `${IMAGE_PATH}${item.file}` }
        }
      : "-"
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reports');

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buffer]), 'Reports.xlsx');
};

  const exportAdverseToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      adverse_data.map((item, index) => ({
        'S. No.': index + 1,
        Title: item.title,
        Description: item.description,
        Date: item.date
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Adverse');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'Adverse.xlsx');
  };

  const handleExport = () => {
    switch (content) {
      case contentTypes.medication:
        exportMedicationToExcel();
        break;
      case contentTypes.measurement:
        exportMeasurementToExcel();
        break;
      case contentTypes.note:
        exportNotesToExcel();
        break;
      case contentTypes.labReports:
        exportReportsToExcel();
        break;
      case contentTypes.adverse:
        exportAdverseToExcel();
        break;
      default:
        break;
    }
  };

  const indexOfLastPatient = patientPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;

  const currentPatients = patients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const totalPatientPages = Math.ceil(patients.length / patientsPerPage);
  const renderTable = (data, columns, currentData, totalPages = false) => {
    return (
      <>
        {data.length > 0 ? (
          <>
            <div style={{ maxHeight: '300px' }}>
              <div className='table-container'>
                <Table
                  responsive
                  hover
                  className="align-middle"
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden"
                  }}
                >
                  <thead style={{ background: "#f8fafc" }}>
                    <tr>
                      {columns.map((col, index) => (
                        <th
                          key={index}
                          style={{
                            fontWeight: 600,
                            fontSize: "13px",
                            padding: "12px"
                          }}
                        >
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

  const weekMap = {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat"
  };

  const medicationColumns = [
    {
      label: "S. No",
      key: "sr_no",
      sortable: true,
      render: (_, index) => index + 1
    },
    {
      label: "Medicine Name",
      key: "medicine_name",
      sortable: true
    },
    {
      label: "Schedule",
      key: "schedule",
      sortable: true,
      render: (row) => {
        if (row.schedule === "Weekly" && row.weekday) {
          const days = row.weekday
            .split(",")
            .map((d) => weekMap[d])
            .join(", ");

          return `Weekly (${days})`;
        }

        if (
  row.schedule === "Monthly" &&
  row.schedule_date &&
  row.schedule_date !== "NA" &&
  row.schedule_date !== "Invalid date"
) {
  const day = row.schedule_date.split("-")[0];
  return `Monthly (Day ${day})`;
}
        return row.schedule;
      }
    },
    {
      label: "Dosage",
      key: "dosage",
      sortable: true
    },
    {
      label: "Reminder Time",
      key: "reminder_time",
      render: (row) => {
        const times = Array.isArray(row.reminder_time)
          ? row.reminder_time
          : [row.reminder_time];

        // 🔥 sort ascending (AM → PM)
        const sortedTimes = times.sort((a, b) => {
          const toMinutes = (time) => {
            const [t, period] = time.split(" ");
            let [hours, minutes] = t.split(":").map(Number);

            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            return hours * 60 + minutes;
          };

          return toMinutes(a) - toMinutes(b);
        });

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {sortedTimes.map((time, index) => (
              <span
                key={index}
                style={{
                  background: "#ecfeff",
                  color: "#0891b2",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  width: "fit-content"
                }}
              >
                {time}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      label: "Pause Status",
      key: "pause_status",
      render: (row) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "11px",
            background: row.pause_status === 1 ? "#fee2e2" : "#dcfce7",
            color: row.pause_status === 1 ? "#dc2626" : "#16a34a",
            fontWeight: 600
          }}
        >
          {row.pause_status === 1 ? "Paused" : "Active"}
        </span>
      )
    },
    {
      label: "Instruction",
      key: "instruction"
    },
    {
      label: "Date of Registry",
      key: "updatetime",
      sortable: true,
  render: (row) =>
    row.updatetime
      ? dayjs.utc(row.updatetime).tz(timezone).format("DD-MM-YYYY hh:mm A")
      : "-"
    }
  ];
  const tableProps = {
    sortConfig,
    onSort: handleSort,
    currentPage,
    rowsPerPage,
    onPageChange: (page) => setCurrentPage(page),
    hideRowsPerPage: true
  };

  const parseMeasurementDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 0;
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day} ${timeStr}`).getTime();
  };

const baseMeasurement = [...measurement]
  .filter((m) => {
    switch (measurementType) {
      case "bp": return m.type === 0;
      case "fasting": return m.type === 1;
      case "ppbgs": return m.type === 2;
      case "weight": return m.type === 3;
      case "temp": return m.type === 4;
      case "symptom": return m.type === 5;
      default: return false;
    }
  })
  .sort(
    (a, b) =>
      parseMeasurementDateTime(b.date, b.time) -
      parseMeasurementDateTime(a.date, a.time)
  );

const paginatedData = baseMeasurement.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);

const chartPageData = [...paginatedData].reverse();

  const renderTabContent = () => {
    switch (content) {
      case contentTypes.medication:
        return (
          <div
            className="table-animate"
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              position: "relative"
            }}
          >

            <CustomTable
              columns={medicationColumns}
              data={sortedMedication}
              sortConfig={sortConfig}
              onSort={handleSort}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
              onRowsPerPageChange={(size) => {
                setRowsPerPage(size);
                setCurrentPage(1);
              }}
            />
          </div>
        );
      case contentTypes.adverse:
        return <AdverseCardView data={filterAdverseData} />;
      case contentTypes.labReports:
        return <DocumentCardView data={filterLabReportsData} />;

      case contentTypes.measurement:

        return (
          <div className="p-3">
            <div className="row">

              {/* LEFT MENU */}
              <div className="col-md-3">
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                  }}
                >
                  {[
                    { label: "Blood Pressure", value: "bp" },
                    { label: "Fasting Glucose", value: "fasting" },
                    { label: "PPBGS", value: "ppbgs" },
                    { label: "Weight", value: "weight" },
                    { label: "Temp", value: "temp" },
                    { label: "Symptom", value: "symptom" }
                  ].map((item) => {
                    const active = measurementType === item.value;

                    return (
                      <button
                        key={item.value}
                        onClick={() => { setMeasurementType(item.value); setCurrentPage(1); }}
                        style={{
                          padding: "10px 14px",
                          fontSize: "13px",
                          cursor: "pointer",
                          background: active ? "#1ddec4" : "transparent",
                          color: active ? "#fff" : "#374151",
                          border: "none",
                          width: "100%",
                          textAlign: "left",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="col-md-9">
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    // padding: "16px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                    marginBottom: "12px"
                  }}
                >
                  <div className='chart-animate' style={{ width: "100%", height: "240px" }}>
                    <MeasurementChart
                      key={`${measurementType}-${currentPage}`}
                      data={chartPageData}
                      type={measurementType}
                    />
                  </div>
                </div>

                {/* TABLE CARD */}
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                  }}
                >
                  {measurementType === "bp" && (
                    <CustomTable
                      columns={[
                        { label: "Date", key: "date" },
                        { label: "Time", key: "time" },
                        { label: "Systolic BP", key: "systolic_bp" },
                        { label: "Diastolic BP", key: "diastolic_bp" },
                        { label: "Pulse", key: "pulse" }
                      ]}
                      data={baseMeasurement} 
                      {...tableProps}
                    />
                  )}

                  {measurementType === "fasting" && (
                    <CustomTable
                      columns={[
                        { label: "Date", key: "date" },
                        { label: "Time", key: "time" },
                        { label: "Fasting Glucose", key: "fasting_glucose" }
                      ]}
                     data={baseMeasurement} 
                      {...tableProps}
                    />
                  )}

                  {measurementType === "ppbgs" && (
                    <CustomTable
                      columns={[
                        { label: "Date", key: "date" },
                        { label: "Time", key: "time" },
                        { label: "PPBGS", key: "ppbgs" }
                      ]}
                      data={baseMeasurement} 
                      {...tableProps}
                    />
                  )}

                  {measurementType === "weight" && (
                    <CustomTable
                      columns={[
                        { label: "Date", key: "date" },
                        { label: "Time", key: "time" },
                        { label: "Weight", key: "weight" }
                      ]}
                      data={baseMeasurement} 
                      {...tableProps}
                    />
                  )}

                  {measurementType === "temp" && (
                    <CustomTable
                      columns={[
                        { label: "Date", key: "date" },
                        { label: "Time", key: "time" },
                        { label: "Temperature", key: "temperature" }
                      ]}
                      data={baseMeasurement} 
                      {...tableProps}
                    />
                  )}

                  {measurementType === "symptom" && (
                    <CustomTable
                      columns={[
                        { label: "Date", key: "date" },
                        { label: "Time", key: "time" },
                        { label: "Symptom Name", key: "symptomname" },
                        { label: "Symptom Score", key: "symptom" },
                        { label: "Severity", key: "symptom_range" }
                      ]}
                      data={baseMeasurement}
                      {...tableProps}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case contentTypes.note:

        return (
          <>
            <div className="p-3">
              <div className="d-flex justify-content-between mb-3">
                <input
                  className="custom-search form-control"
                  placeholder="Search notes..."
                  style={{ width: "250px", fontSize: "13px" }}
                  onChange={handleSearchgroup}
                />

                <Button onClick={() => setShowNoteModal(true)}>
                  <AddIcon /> Add Note
                </Button>
              </div>

              {filterNotesData.length > 0 ? (
                <div className="d-flex flex-column gap-3">

                  {filterNotesData.map((note, index) => {
                    const isExpanded = expandedNotes[note.id];
                    const isLong = note.description.length > 120;

                    return (
                      <Card
                        key={note.id}
                        className="note-card shadow-sm rounded-3"
                        style={{
                          borderLeft: "4px solid #1ddec4",
                          animationDelay: `${index * 0.05}s`
                        }}
                      >
                        <Card.Body style={{ padding: "14px 16px" }}>
                          <p
                            style={{
                              fontSize: "14px",
                              marginBottom: "6px",
                              color: "#374151",
                              lineHeight: "1.5"
                            }}
                          >
                            {isExpanded
                              ? note.description
                              : note.description.slice(0, 220)}

                            {isLong && (
                              <button
                                onClick={() => toggleReadMore(note.id)}
                                className="read-more-btn"
                                style={{
                                  color: "#1ddec4",
                                  fontWeight: 500,
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer"
                                }}
                              >
                                {isExpanded ? "Show Less" : "... Read More"}
                              </button>
                            )}
                          </p>

                          <div className="d-flex justify-content-between align-items-center mt-2">
                            <small style={{ color: "#9ca3af", fontSize: "12px" }}>
                             {dayjs.utc(note.createtime).tz(timezone).format("DD-MM-YYYY hh:mm A")}
                            </small>

                            <div className="d-flex gap-2">
                              <button
                                className="note-icon-btn edit"
                                onClick={() => handleEditNote(note)}
                              >
                                <EditIcon fontSize="small" />
                              </button>

                              <button
                                className="note-icon-btn delete"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })}

                </div>
              ) : (
                <p className="text-center text-muted">No notes available</p>
              )}
            </div>
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
      {initialLoading ? (
        <div style={{ marginLeft: '25rem', marginTop: '10rem' }}>
          <FadeLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          {/* <Typography
            style={{ marginTop: '0px', marginBottom: '20px', fontSize: '13px', paddingRight: '24px' }}
            className="d-flex justify-content-end align-items-center"
            variant="h4"
            gutterBottom
          >
            <span style={{ color: '#1ddec4' }}>Dashboard</span> / View Patient
          </Typography> */}
          <Card className="border-0 shadow-lg rounded-4 mb-4" style={{ position: "relative" }}>
            {switchLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.6)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                  borderRadius: "16px"
                }}
              >
                <FadeLoader color="#1ddec4" height={10} width={3} radius={2} margin={-2} />
              </div>
            )}
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-4">

                {/* Avatar */}
                <div>
                  <img
                    src={user_data?.image ? `${IMAGE_PATH}${user_data.image}` : `${IMAGE_PATH}placeholder.jpg`}
                    alt="User"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #1ddec4"
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-1">{user_data.name}</h5>
                  <div className="d-flex gap-2">
                    <small className="text-muted">
                      Email ID:{" "}
                      <a
                        href={`mailto:${user_data.email}`}
                        style={{ color: "#1ddec4", textDecoration: "underline" }}
                      >
                        {user_data.email}
                      </a>
                    </small>

                    <small className="text-muted">
                      Mobile: {user_data.mobile}
                    </small>
                  </div>

                  <div className="d-flex gap-4 mt-3 flex-wrap">
                    {[
                      { label: "Age", value: user_data.age ? `${user_data.age} yrs` : "-" },
                      { label: "Height", value: user_data.height ? `${user_data.height} cm` : "-" },
                      { label: "Weight", value: user_data.weight ? `${user_data.weight} kg` : "-" },
                      { label: "Sex", value: getGenderLabel(user_data.gender) },
                      { label: "Diseases", value: getDiseaseNames(user_data.diseaseName) },
                      // { label: "Mobile", value: user_data.mobile }
                    ].map((item, i) => (
                      <div key={i}>
                        <small className="text-muted">{item.label}</small>
                        <div className="fw-semibold">{item.value || "-"}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      background: "#e6f9f6",
                      color: "#1ddec4",
                      fontWeight: 600
                    }}
                  >
                    Active
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <div className="row g-2 d-flex align-items-stretch" style={{ position: "relative" }}>
            {switchLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255,255,255,0.6)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                  borderRadius: "16px"
                }}
              >
                <FadeLoader color="#1ddec4" height={10} width={3} radius={2} margin={-2} />
              </div>
            )}
            <div className="col-md-3 d-flex" style={{ maxHeight: "620px" }}>
              <div className="bg-white rounded-4 shadow-sm p-3 h-100" style={{ display: "flex", flexDirection: "column", width: "calc(100% - 20px)" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">My Patients</h6>
                  <button
                    title="Send Notification"
                    onClick={() => setShowNotificationModal(true)}
                    style={{
                      background: 'none',
                      border: 'none'
                    }}
                  >
                    <NotificationsNoneIcon />
                  </button>
                </div>
                <div style={{
                  height: "calc(100vh - 150px)",
                  width: "100%",
                  overflowY: "auto !important"
                }}>
                  {currentPatients.map((patient) => {
                    const isActive = patient.user_id == selectedPatientId;

                    return (
                      <button
                        key={patient.user_id}
                        type="button"
                        onClick={() => setSelectedPatientId(patient.user_id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "5px",
                          marginBottom: "8px",
                          cursor: "pointer",
                          background: isActive ? "#1ddec4" : "#f8fafc",
                          color: isActive ? "#fff" : "#333",
                          transition: "all 0.25s ease",
                          transform: isActive ? "scale(1.02)" : "scale(1)",
                          border: "none",
                          width: "100%",
                          textAlign: "left"
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "#e6fffb";
                            e.currentTarget.style.transform = "translateX(4px)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = "#f8fafc";
                            e.currentTarget.style.transform = "translateX(0)";
                          }
                        }}
                      >
                        <div

                        >
                          <img
                            src={patient?.image ? `${IMAGE_PATH}${patient.image}` : `${IMAGE_PATH}placeholder.jpg`}
                            alt={patient.name}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              background: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 600,
                              color: "#1ddec4"
                            }}
                          />
                        </div>

                        <span style={{ fontSize: "13px" }}>
                          {patient.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="d-flex justify-content-center mt-4">
                  <Pagination
                    size="sm"
                    count={totalPatientPages}
                    page={patientPage}
                    onChange={(e, value) => setPatientPage(value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-9 d-flex flex-column" >

              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">

                <div className="d-flex gap-2 flex-wrap">
                  {[
                    { label: "Notes", value: contentTypes.note },
                    { label: "Medication", value: contentTypes.medication },
                    { label: "Measurement", value: contentTypes.measurement },
                    { label: "Report Health", value: contentTypes.adverse },
                    { label: "Documents", value: contentTypes.labReports },
                  ].map((tab) => {
                    const active = content === tab.value;

                    return (
                      <button
                        key={tab.value}
                        onClick={() => setContent(tab.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setContent(tab.value);
                          }
                        }}
                        style={{
                          borderRadius: "999px",
                          padding: "6px 16px",
                          fontSize: "13px",
                          background: active ? "#1ddec4" : "#eef2f7",
                          color: active ? "#fff" : "#64748b",
                          cursor: "pointer",
                          border: 0
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {(
                  (content === contentTypes.medication && medication.length > 0) ||
                  (content === contentTypes.measurement && measurement.length > 0) ||
                  (content === contentTypes.note && notes.length > 0) ||
                  (content === contentTypes.labReports && report.length > 0) ||
                  (content === contentTypes.adverse && adverse_data.length > 0)
                ) && (
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: "13px", color: "#64748b" }}>
                        Export:
                      </span>

                      <button
                        onClick={handleExport}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "8px",
                          background: "#e6f9f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          border: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#1ddec4";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#e6f9f6";
                          e.currentTarget.style.color = "#1ddec4";
                        }}
                      >
                        <RiFileExcel2Line size={18} />
                      </button>
                    </div>
                  )}
              </div>

              <Card className="border-0 shadow-lg rounded-4 flex-grow-1">
                <Card.Body className="p-0">

                  {/* Header */}
                  {/* <div
                    style={{
                      padding: "14px 20px",
                      borderBottom: "1px solid #eee",
                      fontWeight: 600,
                      fontSize: "14px"
                    }}
                  >
                    {[
                      // "Notes",
                      "Medication",
                      "Measurement",
                      "Report Health",
                      "Documents",
                    ][content - 1]}
                  </div> */}

                  {/* Content */}
                  <div>
                    {renderTabContent()}
                  </div>

                </Card.Body>
              </Card>

            </div>
          </div>

          <CustomModal
            show={showNoteModal}
            onHide={() => {
              setShowNoteModal(false);
              setDescriptionError('');
            }}
            title="Add New Note"
            onSubmit={handleAddNote}
            submitText="Save Note"
          >
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                className="custom-textarea"
                value={noteDescription}
                onChange={(e) => {
                  setNoteDescription(e.target.value);
                  if (descriptionError) setDescriptionError('');
                }}
                isInvalid={!!descriptionError}
              />
              <Form.Control.Feedback type="invalid">
                {descriptionError}
              </Form.Control.Feedback>
            </Form.Group>
          </CustomModal>

          <CustomModal
            show={editingNoteId !== null}
            onHide={() => {
              setEditingNoteId(null);
              setEditDescriptionError('');
            }}
            title="Edit Note"
            onSubmit={handleUpdateNote}
            submitText="Update Note"
          >
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                className="custom-textarea"
                value={editNoteDescription}
                onChange={(e) => {
                  setEditNoteDescription(e.target.value);
                  if (editDescriptionError) setEditDescriptionError('');
                }}
                isInvalid={!!editDescriptionError}
              />
              <Form.Control.Feedback type="invalid">
                {editDescriptionError}
              </Form.Control.Feedback>
            </Form.Group>
          </CustomModal>

          <CustomModal
            show={showNotificationModal}
            onHide={() => setShowNotificationModal(false)}
            title="Send Notification"
            onSubmit={notificationTab === "all" ? sendToAll : sendToUsers}
            submitText="Send"
          >
            <div className="d-flex gap-2 mb-3">
              {["all", "specific"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setNotificationTab(tab)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    border: "none",
                    background: notificationTab === tab ? "#1ddec4" : "#eef2f7",
                    color: notificationTab === tab ? "#fff" : "#64748b"
                  }}
                >
                  {tab === "all" ? "All Patients" : "Specific Patients"}
                </button>
              ))}
            </div>

            {notificationTab === "specific" && (
              <div ref={dropdownRef} className="mb-3" style={{ position: "relative" }}>

                <button
                  type="button"
                  onClick={() => setShowDropdown(true)}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "10px",
                    padding: "6px",
                    minHeight: "42px",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "text",
                    background: "#fff",
                    width: "100%",
                    textAlign: "left"
                  }}
                >

                  {selectedUsers.map((id) => {
                    const user = patients.find((p) => p.user_id === id);
                    return (
                      <div
                        key={id}
                        style={{
                          background: "#1ddec4",
                          color: "#fff",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        {user?.name}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectUser(id);
                          }}
                          style={{ border: 'none', background: 'none', color: 'white', cursor: "pointer", fontWeight: "bold" }}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}

                  <input
                    type="text"
                    placeholder="Search patient..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      flex: 1,
                      fontSize: "13px",
                      minWidth: "120px"
                    }}
                  />
                </button>

                {showDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "105%",
                      left: 0,
                      right: 0,
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      marginTop: "4px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 1000,
                      boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
                    }}
                  >
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((p) => {

                        return (
                          <button
                            key={p.user_id}
                            onClick={() => handleSelectUser(p.user_id)}
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              fontSize: "13px",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              background: selectedUsers.includes(p.user_id)
                                ? "#e6f9f6"
                                : "#fff",
                              border: "none",
                              borderBottom: "1px solid #f1f5f9",
                              textAlign: "left"
                            }}
                          >
                            <span>{p.name}</span>

                            {selectedUsers.includes(p.user_id) && (
                              <span style={{ color: "#1ddec4", fontSize: "12px" }}>
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <p style={{ fontSize: "12px", padding: "10px", color: "#9ca3af" }}>
                        No patients found
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                className='custom-search'
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Message</Form.Label>
              <Form.Control
                className='custom-search'
                as="textarea"
                rows={3}
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
            </Form.Group>
          </CustomModal>
        </>
      )}
    </>
  );
}

export default ViewPatient;
