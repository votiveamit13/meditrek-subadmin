import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

// import DeleteIcon from '@mui/icons-material 
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { Base_Url } from '../../config';
import Swal from 'sweetalert2';

function ManageFaq() {
  const [selectedActions, setSelectedActions] = useState({});
  const [faqData, setFaqData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [faqId, setFaqId] = useState('');
  const [errors, setErrors] = useState({});
  const [viewData, setViewData] = useState({});
  const usersPerPage = 50;

  const deleteFaq = (faq_id) => {
    Swal.fire({
      title: 'Delete FAQ',
      text: 'Are you sure you want to delete this FAQ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        axios
          .post(`${Base_Url}delete_faq`, { faq_id: faq_id })
          .then((response) => {
            if (response.data.success) {
              getFaqs();
              Swal.fire({
                title: '',
                text: 'FAQ deleted successfully',
                icon: 'success',
                timer: 2000
              });
            }
          })
          .catch((error) => {
            console.error('Error deleting FAQ:', error);
          });
      }
    });
  };

  const handleActionChange = (index, action, faq_id, faqItem) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deleteFaq(faq_id);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'Edit') {
      setQuestion(faqItem.question);
      setAnswer(faqItem.answer);
      setFaqId(faq_id);
      handleShowEditModal();
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'View') {
      setViewData(faqItem);
      handleShowViewModal();
      setSelectedActions({ ...selectedActions, [index]: null });
    }
  };
  console.log(handleActionChange);

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredFaqs = faqData.filter(
    (faq) =>
      (faq.question && faq.question.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.answer && faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.createtime && faq.createtime.includes(searchQuery))
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredFaqs.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getFaqs = async () => {
    axios
      .get(`${Base_Url}get_faq_doctor`)
      .then((response) => {
        setFaqData(response.data.data);
      })
      .catch((error) => {
        console.error('Error getting FAQs:', error);
      });
  };

  useEffect(() => {
    getFaqs();
  }, []);

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const formattedDate = date.toLocaleString('en-GB', options).replace(/\//g, '-');
    return formattedDate;
  };

  console.log(formatDate)

  const addFaq = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!question) {
      validationErrors.question = 'Please enter question';
    }
    if (!answer) {
      validationErrors.answer = 'Please enter answer';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    let faqData = {
      question: question,
      answer: answer
    };

    axios
      .post(`${Base_Url}add_faq`, faqData)
      .then((response) => {
        if (response.data.key === 'exists') {
          setErrors({ general: 'Faq already exist' });
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'FAQ added successfully',
            icon: 'success',
            timer: 3000
          });
          handleCloseAddModal();
          setQuestion('');
          setAnswer('');
          getFaqs();
        } else {
          setQuestion('');
          setAnswer('');
          handleCloseAddModal();
        }
      })
      .catch((error) => {
        console.error('Error adding new FAQ', error);
      });
  };

  const editFaq = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!question) {
      validationErrors.question = 'Please enter question';
    }
    if (!answer) {
      validationErrors.answer = 'Please enter answer';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    let faqData = {
      question: question,
      answer: answer,
      faq_id: faqId
    };

    axios
      .post(`${Base_Url}edit_faq`, faqData)
      .then((response) => {
        if (response.data.key) {
          setErrors({ general: response.data.msg });
        } else if (response.data.success) {
          Swal.fire({
            title: '',
            text: 'FAQ updated successfully',
            icon: 'success',
            timer: 2000
          });
          handleCloseEditModal();
          setQuestion('');
          setAnswer('');
          getFaqs();
        } else {
          setQuestion('');
          setAnswer('');
          handleCloseEditModal();
        }
      })
      .catch((error) => {
        console.error('Error updating FAQ', error);
      });
  };

  const handleShowAddModal = () => setShowAddModal(true);
  console.log(handleShowAddModal);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setQuestion('');
    setAnswer('');
    setErrors({});
  };

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setQuestion('');
    setAnswer('');
    setErrors({});
  };

  const handleShowViewModal = () => setShowViewModal(true);
  const handleCloseViewModal = () => setShowViewModal(false);

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage FAQs
      </Typography>
      <Card>
        <Card.Header className=" bg-white">
          <div className="d-flex justify-content-between flex-wrap">
            {/* <div>
              <Button className="btn btn-primary mt-2 mb-2" onClick={handleShowAddModal}>
                <AddIcon style={{ marginRight: '2px', fontWeight: '500' }} /> Add FAQ
              </Button>
            </div> */}

            <div>
              <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                Search
              </label>
              <input
                className="search-input"
                type="text"
                placeholder="Search..."
                onChange={handleSearchChange}
                style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
              />
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="table-container">
            <Table hover className="fixed-header-table">
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                  {/* <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th> */}
                  <th style={{ textAlign: 'center', fontWeight: '500', width: '320px' }}> Question</th>
                  <th style={{ textAlign: 'center', fontWeight: '500', width: '320px' }}> Answer</th>
                  <th style={{ textAlign: 'center', fontWeight: '500'}}>Create Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {currentFaqs.map((faq, index) => (
                  <tr key={faq.id}>
                    <th scope="row" style={{ textAlign: 'center' }}>
                      {indexOfFirstUser + index + 1}
                    </th>
                    {/* <td>
                      <div className="dropdown text-center">
                        <button
                          className="btn btn-primary dropdown-toggle action-btn"
                          type="button"
                          id={`dropdownMenuButton${faq.id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Action
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${faq.id}`}>
                          <li>
                            <Link className="dropdown-item" onClick={() => handleActionChange(index, 'View', faq.faq_id, faq)}>
                              <VisibilityIcon style={{ marginRight: '8px' }} /> View
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item" onClick={() => handleActionChange(index, 'Edit', faq.faq_id, faq)}>
                              <EditIcon style={{ marginRight: '8px' }} /> Edit
                            </Link>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => handleActionChange(index, 'Delete', faq.faq_id)}>
                              <DeleteIcon style={{ marginRight: '8px' }} /> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td> */}
                    <td style={{ textAlign: 'center' }}>{truncateText(faq.question, 55)}</td>
                    <td style={{ textAlign: 'center' }}>{truncateText(faq.answer, 55)}</td>
                    <td style={{ textAlign: 'center' }}>{faq.createtime}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }} className="pagination">
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, currentFaqs.length)} of {currentFaqs.length} entries
            </p>
            <Stack spacing={3} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>

        {/* Add FAQ Modal */}
        <Modal show={showAddModal} onHide={handleCloseAddModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add FAQ</Modal.Title>
          </Modal.Header>
          <form onSubmit={addFaq}>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="question" className="form-label">
                  Question
                </label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter question"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setErrors((prev) => ({ ...prev, question: '' }));
                  }}
                  isInvalid={errors.question}
                />
                <Form.Control.Feedback type="invalid">{errors.question}</Form.Control.Feedback>
              </div>
              <div className="mb-3">
                <label htmlFor="answer" className="form-label">
                  Answer
                </label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setErrors((prev) => ({ ...prev, answer: '' }));
                  }}
                  isInvalid={errors.answer}
                />
                <Form.Control.Feedback type="invalid">{errors.answer}</Form.Control.Feedback>
              </div>
              {errors.general && <span className="text-danger">{errors.general}</span>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        {/* Edit FAQ Modal */}
        <Modal show={showEditModal} onHide={handleCloseEditModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit FAQ</Modal.Title>
          </Modal.Header>
          <form onSubmit={editFaq}>
            <Modal.Body>
              <div className="mb-3">
                <label htmlFor="question" className="form-label">
                  Question
                </label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter question"
                  value={question}
                  onChange={(e) => {
                    setQuestion(e.target.value);
                    setErrors((prev) => ({ ...prev, question: '' }));
                  }}
                  isInvalid={errors.question}
                />
                <Form.Control.Feedback type="invalid">{errors.question}</Form.Control.Feedback>
              </div>
              <div className="mb-3">
                <label htmlFor="answer" className="form-label">
                  Answer
                </label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter answer"
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setErrors((prev) => ({ ...prev, answer: '' }));
                  }}
                  isInvalid={errors.answer}
                />
                <Form.Control.Feedback type="invalid">{errors.answer}</Form.Control.Feedback>
              </div>
              {errors.general && <span className="text-danger">{errors.general}</span>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        {/* View FAQ Modal */}
        <Modal show={showViewModal} onHide={handleCloseViewModal} style={{ zIndex: '99999' }}>
          <Modal.Header>
            <Modal.Title style={{ fontSize: '17px' }}>FAQ Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <h6>Question:</h6>
              <p>{viewData.question}</p>
            </div>
            <div className="mb-3">
              <h6>Answer:</h6>
              <p style={{ whiteSpace: 'pre-line' }}>{viewData.answer}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseViewModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </>
  );
}

export default ManageFaq;
