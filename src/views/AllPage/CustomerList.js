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


function CustomerList() {
  
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Show 5 rows per page

  const users = [
    { id: 1, email: 'test@gmail.com', name: 'Henri', mobile: '+260 7828451525', createDate: '14-05-2024 05:30:55' },
    { id: 2, email: 'demo@gmail.com', name: 'John', mobile: '+260 7828451525', createDate: '14-05-2024 05:30:55' },
    { id: 3, email: 'try@gmail.com', name: 'Maria', mobile: '+260 7828451581', createDate: '14-05-2024 05:30:55' },
    { id: 4, email: 'maria@gmail.com', name: 'Ross', mobile: '+260 7828459851', createDate: '14-05-2024 05:30:55' },
    { id: 5, email: 'alex@gmail.com', name: 'Alex', mobile: '+260 7828451526', createDate: '14-05-2024 05:30:55' },
    { id: 6, email: 'jane@gmail.com', name: 'Jane', mobile: '+260 7828451527', createDate: '14-05-2024 05:30:55' },
    { id: 7, email: 'mark@gmail.com', name: 'Mark', mobile: '+260 7828451528', createDate: '14-05-2024 05:30:55' },
    { id: 8, email: 'lucy@gmail.com', name: 'Lucy', mobile: '+260 7828451529', createDate: '14-05-2024 05:30:55' },
    { id: 9, email: 'sam@gmail.com', name: 'Sam', mobile: '+260 7828451530', createDate: '14-05-2024 05:30:55' },
    { id: 10, email: 'lisa@gmail.com', name: 'Lisa', mobile: '+260 7828451531', createDate: '14-05-2024 05:30:55' }
  ];





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
    
      <Card>
   
        <Card.Header className="bg-white d-flex justify-content-between flex-wrap">
         
         
          <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h5" gutterBottom>
        <span style={{ color: '#000' }}>Customer List</span> 
      </Typography>
           <div className=''>
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
                <th style={{ textAlign: 'center', fontWeight: '500' }}> Status</th>
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
                          <Link to="/manage-user/userlist/view_user" className="dropdown-item">
                            <VisibilityIcon style={{ marginRight: '8px' }} /> View
                          </Link>
                        </li>
                        
                      </ul>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={Image} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}></img>
                  </td>
                  <td style={{ textAlign: 'center' }}>{user.name || '-'}</td>
                  <td style={{ textAlign: 'center' }}>{user.mobile || '-'}</td>
                  <td style={{ textAlign: 'center' }}>{user.email || '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <p
                      style={{
                        borderRadius: '25px',
                        background: '#28c76f',
                        padding: '0px 15px',
                        width: '80px',
                        color: '#fff',
                        margin: 'auto'
                      }}
                    >
                      Active
                    </p>
                  </td>
                  <td style={{ textAlign: 'center' }}>{user.createDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-between">
            <p style={{ fontWeight: '500' }} className='pagination'>Showing 1 to 5 of 10 entries</p>
            <Stack spacing={2} alignItems="right">
              <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
            </Stack>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default CustomerList;
