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

  const [users, setUsers] = useState([]);

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
      response = await axios.get(`${Base_Url}get_all_patient`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        if (response.data.patient != 'NA') {
          setUsers(response.data.patient);
        }
      } else {
        console.log('Profile Details fetch Error');
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
      <Typography style={{ marginTop: '0px', marginBottom: '20px', fontSize: '13px', paddingRight:'24px' }} className='d-flex justify-content-end align-items-center' variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / Patients List
      </Typography>
      <Card className="border-0 shadow-sm rounded-3 table-space">
        <Card.Header className="bg-white d-flex  align-items-center border-bottom-0 px-4  w-100">
          <div className="d-flex justify-content-between align-items-center pt-3 w-100 gap-2 flex-wrap">
            {/* <label htmlFor="search-input"  className="me-2 fw-medium">
              Search
            </label> */}
           <p style={{ marginTop: '0px', marginBottom: '0px', fontSize: '16px' }}>Patients List</p>
            <input
              className="search-input form-control"
              type="text"
              placeholder="Search..."
              onChange={handleSearchChange}
              // style={{ marginTop: '8px', marginBottom: '5px', padding: '5px', width: '200px', border: '1px solid #f2f2f2' }}
              style={{ width: '220px', fontSize: '13px' }}
            />
          </div>
        </Card.Header>
        <Card.Body className="px-4 py-3">
         
            {filteredUsers.length > 0 ? (
              <>
               <div className="table-container">
                <Table responsive hover className="align-middle text-center table" style={{ borderRadius: '12px !important' }}>
                  <thead className="py-3 table-head">
                    <tr>
                      <th style={{ textAlign: 'center', fontWeight: '500', padding: '14px 8px', whiteSpace: 'nowrap' }}> S. No</th>
                    
                      <th style={{ textAlign: 'center', fontWeight: '500', padding: '14px 8px' }}>Image</th>
                      <th style={{ textAlign: 'center', fontWeight: '500', padding: '14px 8px' }}> User Id</th>
                      <th style={{ textAlign: 'center', fontWeight: '500', padding: '14px 8px' }}> Name</th>
                      <th style={{ textAlign: 'center', fontWeight: '500', padding: '14px 8px' }}> Mobile No.</th>
                      <th style={{ textAlign: 'center', fontWeight: '500', padding: '14px 8px' }}> Email</th>
                      <th style={{ textAlign: 'center', fontWeight: '500', padding: '14px 8px', whiteSpace: 'nowrap' }}>
                        Shared Date & Time
                      </th>
                        <th style={{ textAlign: 'center', fontWeight: '500', padding: '14px 8px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="small">
                    {currentUsers.map((user, index) => (
                      <tr key={index}>
                        <th scope="row" style={{ textAlign: 'center' }}>
                          {indexOfFirstUser + index + 1}
                        </th>
                       
                        <td style={{ textAlign: 'center' }}>
                          <img
                            src={user.image ? `${IMAGE_PATH}${user.image}?${new Date().getTime()}` : `${IMAGE_PATH}placeholder.jpg`}
                            alt="Logo"
                            style={{
                              width: '35px',
                              height: '35px',
                              borderRadius: '100%',
                              objectFit: 'cover'
                            }}
                          ></img>
                        </td>
                        <td style={{ textAlign: 'center' }}>#{user.user_unique_id || 'NA'}</td>
                        <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>{user.name || 'NA'}</td>
                        <td style={{ textAlign: 'center' }}>{user.mobile || 'NA'}</td>
                        <td style={{ textAlign: 'center' }}>{user.email || 'NA'}</td>

                        <td style={{ textAlign: 'center' }}>{user.createtime || 'NA'}</td>
                         <td>
                          <div className="dropdown text-center">
                            <button className="btn btn-sm btn-primary btn-outline-light  action-btn" type="button" aria-expanded="false">
                              <Link
                                to={APP_PREFIX_PATH + `/manage-user/userlist/view_user/${user.user_id}`}
                                className="dropdown-item d-flex align-items-center"
                              >
                                <VisibilityIcon style={{fontSize:"16px"}}  />
                              </Link>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                 </div>
                <div className="d-flex justify-content-between align-items-center mt-3 center-flex">
                  <p style={{ fontWeight: '500',fontSize:'13px' }} className="pagination mb-0 text-muted">
                    {filteredUsers.length > 0
                      ? `Showing ${indexOfFirstUser + 1} to ${filteredUsers.length} of ${filteredUsers.length} entries`
                      : 'No entries to show'}
                  </p>
                  <Stack spacing={2} alignItems="right" fontSize="13px">
                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                  </Stack>
                </div>
                
              </>
            ) : (
              <>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', fontWeight: '500',whiteSpace:"nowrap" }}> S. No</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}>Action</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}>Image</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}> Name</th>
                      <th style={{ textAlign: 'center', fontWeight: '500',whiteSpace:"nowrap"  }}> Mobile No.</th>
                      <th style={{ textAlign: 'center', fontWeight: '500' }}> Email</th>
                      <th style={{ textAlign: 'center', fontWeight: '500',whiteSpace:"nowrap"  }}>Shared Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={7} className="text-center py-5 text-muted">
                        <p style={{ marginBottom: '0px', textAlign: 'center',whiteSpace:"nowrap"  }}> No Data Found</p>
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
