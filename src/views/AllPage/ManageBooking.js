import React, { useState } from 'react';
import { Card, Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
import Perfume from 'assets/images/perfume-img.jfif';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';

function ManageBooking() {
  const [selectedActions, setSelectedActions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);



  const usersPerPage = 5; // Show 5 rows per page

  const users = [
    { id: 1, bookingid: '#649514', name: 'henri', category: 'Beauty', createDate: '14-05-2024 05:30:55' },
    { id: 2, bookingid: '#649914', name: 'john', category: 'Cloth', createDate: '14-05-2024 05:30:55' },
    { id: 3, bookingid: '#649998', name: 'Andrew', category: 'Store', createDate: '14-05-2024 05:30:55' },
    { id: 4, bookingid: '#649852', name: 'Arika', category: 'Health Care', createDate: '14-05-2024 05:30:55' },
    { id: 5, bookingid: '#645652', name: 'Sam', category: 'Car Repairing', createDate: '14-05-2024 05:30:55' },
    { id: 6, bookingid: '#855652', name: 'Lucy', category: 'Furniture', createDate: '14-05-2024 05:30:55' },
    { id: 7, bookingid: '#986652', name: 'Mark', category: 'Footwear', createDate: '14-05-2024 05:30:55' },
    { id: 8, bookingid: '#856652', name: 'Ross', category: 'Cosmetic', createDate: '14-05-2024 05:30:55' },
    { id: 9, bookingid: '#859872', name: 'Mark', category: 'Furniture', createDate: '14-05-2024 05:30:55' },
    { id: 10, bookingid: '#9562652', name: 'Lisa', category: 'Cloth', createDate: '14-05-2024 05:30:55' }
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
        <span style={{ color: '#1ddec4' }}>Dashboard</span> /   Manage Bookings
      </Typography>
      <Card>
        <Card.Header className="d-flex justify-content-between bg-white">
          {/* <Card.Title className="mt-2" as="h5">
            {' '}
            Manage Bookings
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
                <th style={{ textAlign: 'center', fontWeight: '500' }}>Booking Id</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}>Customer Name</th>
                <th style={{ textAlign: 'center', fontWeight: '500' }}>Transaction ID</th>
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
                          <Link to="/manage-booking/view-booking" className="dropdown-item">
                            <VisibilityIcon style={{ marginRight: '8px' }} /> View
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
                  <td style={{ textAlign: 'center' }}>{user.bookingid}</td>

                  <td style={{ textAlign: 'center' }}>{user.name}</td>
                  <td style={{ textAlign: 'center' }}> #4519644165</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={Perfume} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}></img>
                  </td>
                  <td style={{ textAlign: 'center' }}>{user.category}</td>

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

export default ManageBooking;
