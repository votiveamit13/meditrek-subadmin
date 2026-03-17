import React, { useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Image from 'assets/images/img.jfif';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';

function DeleteUser() {
  const [selectedActions, setSelectedActions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Show 5 rows per page

  const users = [
    { id: 1, email: 'test@gmail.com', name: 'Henri', mobile: '+260 7828451525', createDate: '19-05-2024 05:30:55' },
    { id: 2, email: 'demo@gmail.com', name: 'John', mobile: '+260 7828451525', createDate: '18-05-2024 05:30:55' },
    { id: 3, email: 'try@gmail.com', name: 'Maria', mobile: '+260 7828451581', createDate: '20-05-2024 05:40:55' },
    { id: 4, email: 'maria@gmail.com', name: 'Ross', mobile: '+260 7828459851', createDate: '10-05-2024 03:30:55' },
    { id: 5, email: 'alex@gmail.com', name: 'Alex', mobile: '+260 7828451526', createDate: '11-05-2024 03:30:55' },
    { id: 6, email: 'jane@gmail.com', name: 'Jane', mobile: '+260 7828451527', createDate: '05-05-2024 05:30:55' },
    { id: 7, email: 'mark@gmail.com', name: 'Mark', mobile: '+260 7828451528', createDate: '14-05-2024 05:30:55' },
    { id: 8, email: 'lucy@gmail.com', name: 'Lucy', mobile: '+260 7828451529', createDate: '14-05-2024 05:30:55' },
    { id: 9, email: 'sam@gmail.com', name: 'Sam', mobile: '+260 7828451530', createDate: '14-05-2024 05:30:55' },
    { id: 10, email: 'lisa@gmail.com', name: 'Lisa', mobile: '+260 7828451531', createDate: '14-05-2024 05:30:55' }
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

  return (
    <>
     <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / User List / Deleted User
      </Typography>
      <Card>
        <Card.Header className="d-flex justify-content-between bg-white">
          {/* <Card.Title className="mt-2 " as="h5">
            Deleted Users
          </Card.Title> */}
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
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}> Name</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}> Mobile No.</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}> Email</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}> Delete Reason </th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}>Deleted On</th>
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
                          <Link
                            to="/manage-user/userlist/view_user"
                            className="dropdown-item"
                            onClick={() => handleActionChange(index, 'View', user.id)}
                          >
                            <VisibilityIcon style={{ marginRight: '8px' }} /> View
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={Image} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}></img>
                  </td>
                  <td style={{ textAlign: 'center' }}>{user.name}</td>
                  <td style={{ textAlign: 'center' }}>{user.mobile}</td>
                  <td style={{ textAlign: 'center' }}>{user.email}</td>
                  <td style={{ textAlign: 'center' }}>Misconduct</td>
                  <td style={{ textAlign: 'center' }}>{user.createDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }}>Showing 1 to 5 of 10 entries</p>
            <Stack spacing={2} alignItems="right" className='pagination'>
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default DeleteUser;
