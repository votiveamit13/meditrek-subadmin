import React, { useState } from 'react';
import { Card, Table, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Product from 'assets/images/product.jpg';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';

function ManageCategory() {
  const [selectedActions, setSelectedActions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const usersPerPage = 5; // Show 5 rows per page

  const users = [
    { id: 1, category: 'Beauty', createDate: '14-05-2024 05:30:55' },
    { id: 2, category: 'Cloth', createDate: '14-05-2024 05:30:55' },
    { id: 3, category: 'Store', createDate: '14-05-2024 05:30:55' },
    { id: 4, category: 'Health Care', createDate: '14-05-2024 05:30:55' },
    { id: 5, category: 'Car Repairing', createDate: '14-05-2024 05:30:55' },
    { id: 6, category: 'Furniture', createDate: '14-05-2024 05:30:55' },
    { id: 7, category: 'Footwear', createDate: '14-05-2024 05:30:55' },
    { id: 8, category: 'Cosmetic', createDate: '14-05-2024 05:30:55' },
    { id: 9, category: 'Furniture', createDate: '14-05-2024 05:30:55' },
    { id: 10, category: 'Cloth', createDate: '14-05-2024 05:30:55' }
  ];

  const deleteUser = (user_id) => {
    console.log(`Delete user with ID: ${user_id}`);
    // Add your delete logic here
  };

  const handleActionChange = (index, action, user_id) => {
    setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'Delete') {
      deleteUser(user_id);
      setSelectedActions({ ...selectedActions, [index]: null });
    } else if (action === 'View') {
      // Add your view logic here, e.g., navigate to the user's profile page
      setSelectedActions({ ...selectedActions, [index]: null });
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);
  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Manage Categories
      </Typography>
      <Card>
        <Card.Header className=" bg-white">
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              <Button className="btn btn-primary mt-2 mb-2" onClick={handleShowModal}>
                <AddIcon style={{ marginRight: '2px', fontWeight: '500' }} /> Add Category
              </Button>
            </div>

            <div>
              <label htmlFor="search-input" style={{ marginRight: '5px' }}>
                Search
              </label>
              <input
                className="search-input"
                type="text"
                placeholder="Search..."
                style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
              />
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}> Category</th>

                <th style={{ textAlign: 'center', fontWeight: '500' }}>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <th scope="row" style={{ textAlign: 'center' }}>
                    {indexOfFirstUser + index + 1}
                  </th>
                  <td>
                    <div className="dropdown text-center">
                      <button
                        className="btn btn-primary dropdown-toggle action-btn"
                        type="button"
                        id={`dropdownMenuButton${user.id}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Action
                      </button>
                      <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${user.id}`}>
                        <li>
                          <Link className="dropdown-item" onClick={() => handleShowModal2()}>
                            <EditIcon style={{ marginRight: '8px' }} /> Edit
                          </Link>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={() => handleActionChange(index, 'Delete', user.id)}>
                            <DeleteIcon style={{ marginRight: '8px' }} /> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={Product} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}></img>
                  </td>
                  <td style={{ textAlign: 'center' }}>{user.category}</td>

                  <td style={{ textAlign: 'center' }}>{user.createDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }}  className='pagination'>Showing 1 to 5 of 10 entries</p>
            <Stack spacing={2} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>
        {/* Modal Component */}
        <Modal show={showModal} onHide={handleCloseModal} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Add Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Add your form fields here */}
            <form>
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label">
                  Category Name
                </label>
                <input type="text" className="form-control" id="categoryName" placeholder="Enter Category Name" />
              </div>
              <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">
                  Image
                </label>

                <Form.Control type="file" />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCloseModal}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* edit modal */}
        <Modal show={showModal2} onHide={handleCloseModal2} style={{ zIndex: '99999' }}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: '17px' }}>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Add your form fields here */}
            <form>
              <div className="mb-3">
                <label htmlFor="categoryName" className="form-label">
                  Category Name
                </label>
                <input type="text" className="form-control" id="categoryName" placeholder="Enter Category Name" />
              </div>
              <div className="mb-3">
                <label htmlFor="categoryDescription" className="form-label">
                  Image
                </label>

                <Form.Control type="file" />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCloseModal}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Card>
    </>
  );
}

export default ManageCategory;
