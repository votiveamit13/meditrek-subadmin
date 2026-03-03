import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './managecontent.css';
// import Image from 'assets/images/img.jfif';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
// import ToggleOffIcon from '@mui/icons-material/ToggleOff';
// import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { APP_PREFIX_PATH, Base_Url, IMAGE_PATH } from '../../config';
import axios from 'axios';

function ManagePatient() {
  // const [selectedActions, setSelectedActions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Show 5 rows per page

  const [users, setUsers] = useState([])



  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  const filteredUsers = users.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.mobile && user.mobile.toString().includes(searchQuery)) ||
      (searchQuery.toLowerCase().includes('active') && user.active_flag === 1) ||
      (searchQuery.toLowerCase().includes('deactive') && user.active_flag === 0) ||
      (user.createtime && user.createtime.includes(searchQuery))
  );


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}get_all_patient`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

      if (response.data.success) {
        if (response.data.patient != "NA") {
          setUsers(response.data.patient);
        }

      } else {
        console.log("Profile Details fetch Error")
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Patients List
      </Typography>
      <Card>
        <Card.Header className="bg-white ">

          <div className=''>
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
        </Card.Header>
        <Card.Body>
          {filteredUsers.length > 0 ? (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}> User Id</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}> Name</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}> Mobile No.</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}> Email</th>
                    <th style={{ textAlign: 'center', fontWeight: '500' }}>Shared Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={index}>
                      <th scope="row" style={{ textAlign: 'center' }}>
                        {indexOfFirstUser + index + 1}
                      </th>
                      <td>

                        <div className="dropdown text-center">
                          <button
                            className="btn btn-primary  action-btn"
                            type="button"
                            aria-expanded="false"
                          >
                            <Link to={APP_PREFIX_PATH + `/manage-user/userlist/view_user/${user.user_id}`} className="dropdown-item">
                              <VisibilityIcon style={{ marginRight: '8px' }} /> View
                            </Link>
                          </button>

                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <img src={user.image ? `${IMAGE_PATH}${user.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`} alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}></img>
                      </td>
                      <td style={{ textAlign: 'center' }}>#{user.user_unique_id || 'NA'}</td>
                      <td style={{ textAlign: 'center' }}>{user.name || 'NA'}</td>
                      <td style={{ textAlign: 'center' }}>{user.mobile || 'NA'}</td>
                      <td style={{ textAlign: 'center' }}>{user.email || 'NA'}</td>

                      <td style={{ textAlign: 'center' }}>{user.createtime || 'NA'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-between">
                <p style={{ fontWeight: '500' }} className='pagination'>{filteredUsers.length > 0
                  ? `Showing ${indexOfFirstUser + 1} to ${filteredUsers.length} of ${filteredUsers.length} entries`
                  : 'No entries to show'}</p>
                <Stack spacing={2} alignItems="right">
                  <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                </Stack>
              </div></>
          )
            : (
              <>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}> S. No</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}> Name</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}> Mobile No.</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}> Email</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}>Shared Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={7}>
                        <p style={{ marginBottom: '0px', textAlign: 'center' }}> No Data Found</p>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </>
            )}
        </Card.Body>
      </Card>
    </>
  );
}

export default ManagePatient;
