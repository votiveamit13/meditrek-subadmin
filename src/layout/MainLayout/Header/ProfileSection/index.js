import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Fade,
  Avatar,
  ListItemAvatar,
  ClickAwayListener,
  Paper,
  Popper,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton
} from '@mui/material';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import MeetingRoomTwoToneIcon from '@mui/icons-material/MeetingRoomTwoTone';
import User4 from 'assets/images/users/avatar-4.jpg';
import { APP_PREFIX_PATH, Base_Url, IMAGE_PATH } from "../../../../config";
import axios from 'axios';
import Swal from 'sweetalert2';

const ProfileSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleProfileClick = () => {
    navigate(APP_PREFIX_PATH + '/profile');
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Are you sure you want to logout`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('token');
        localStorage.removeItem('doctor_id');
        navigate(APP_PREFIX_PATH + '/login');
      }
    });

  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const [userDetails, setUserDetails] = useState([])

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate(APP_PREFIX_PATH + '/login');
      }
      let response;
      response = await axios.get(`${Base_Url}get_profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUserDetails(response.data.info);
        console.log(response.data.info)
      } else {
        console.log("Profile Details fetch Error")
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  useEffect(() => {

    fetchUserDetails();
    // Listen for changes in sessionStorage across different tabs/windows
    const handleStorageChange = (event) => {
      if (event.key === 'user_details') {
        // If 'user_details' changes in sessionStorage, fetch the latest details
        fetchUserDetails();
      }
    };

    window.addEventListener('storage', handleStorageChange);



  }, []);

  return (
    <>
      <ListItemAvatar>
        <Avatar alt="Sepha Wilon" src={userDetails?.image ? `${IMAGE_PATH}${userDetails.image}?${new Date().getTime()}` : User4} onClick={handleToggle} ref={anchorRef} />
      </ListItemAvatar>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 10]
            }
          },
          {
            name: 'preventOverflow',
            options: {
              altAxis: true
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    minWidth: 250,
                    backgroundColor: theme.palette.background.paper,
                    pb: 0,
                    borderRadius: '10px'
                  }}
                >
                  <ListItemButton onClick={handleProfileClick}>
                    <ListItemIcon>
                      <PersonTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>

                  <ListItemButton onClick={handleLogoutClick}>
                    <ListItemIcon>
                      <MeetingRoomTwoToneIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
