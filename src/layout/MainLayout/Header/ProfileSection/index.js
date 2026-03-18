import React, { useEffect, useState } from "react";
// import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

import {
  Fade,
  Avatar,
  ClickAwayListener,
  Paper,
  Popper,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Typography,
  Box
} from "@mui/material";

import PersonTwoToneIcon from "@mui/icons-material/PersonTwoTone";
import MeetingRoomTwoToneIcon from "@mui/icons-material/MeetingRoomTwoTone";

import User4 from "assets/images/users/avatar-4.jpg";
import { APP_PREFIX_PATH, Base_Url, IMAGE_PATH } from "../../../../config";

import axios from "axios";
import Swal from "sweetalert2";

const ProfileSection = () => {
  // const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const [userDetails, setUserDetails] = useState({});

  const handleProfileClick = () => {
    navigate(APP_PREFIX_PATH + "/profile");
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to logout`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("token");
        localStorage.removeItem("doctor_id");
        navigate(APP_PREFIX_PATH + "/login");
      }
    });
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        navigate(APP_PREFIX_PATH + "/login");
      }

      const response = await axios.get(`${Base_Url}get_profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUserDetails(response.data.info);
      }
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();

    const handleStorageChange = (event) => {
      if (event.key === "user_details") {
        fetchUserDetails();
      }
    };

    window.addEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      {/* USER AREA */}
      <Box
        ref={anchorRef}
        onClick={handleToggle}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: 1.5,
          px: 1,
          py: 0.5,
          borderRadius: "8px",
          "&:hover": {
            background: "#f5f7fa"
          }
        }}
      >
        <Avatar
          src={
            userDetails?.image
              ? `${IMAGE_PATH}${userDetails.image}?${new Date().getTime()}`
              : User4
          }
          sx={{ width: 36, height: 36 }}
        />

        <Box>
          <Typography sx={{ fontSize: "14px", fontWeight: 600 }}>
            {userDetails?.doctor_name || "Doctor"}
          </Typography>

          {/* <Typography sx={{ fontSize: "12px", color: "#6c757d" }}>
            Doctor
          </Typography> */}
        </Box>
      </Box>

      {/* DROPDOWN */}
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        modifiers={[
          {
            name: "offset",
            options: { offset: [0, 12] }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Paper
              elevation={0}
              sx={{
                width: 260,
                borderRadius: "12px",
                border: "1px solid #e9ecef"
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  {/* USER HEADER */}
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: "1px solid #f1f3f5",
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center"
                    }}
                  >
                    <Avatar
                      src={
                        userDetails?.image
                          ? `${IMAGE_PATH}${userDetails.image}`
                          : User4
                      }
                      sx={{ width: 42, height: 42 }}
                    />

                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>
                        {userDetails?.doctor_name || "Doctor"}
                      </Typography>

                      <Typography sx={{ fontSize: "12px", color: "#6c757d" }}>
                        {userDetails?.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* MENU */}
                  <List sx={{ py: 1 }}>
                    <ListItemButton onClick={handleProfileClick}>
                      <ListItemIcon>
                        <PersonTwoToneIcon sx={{ color: "#1ddec4" }} />
                      </ListItemIcon>
                      <ListItemText primary="Profile" />
                    </ListItemButton>

                    <ListItemButton onClick={handleLogoutClick}>
                      <ListItemIcon>
                        <MeetingRoomTwoToneIcon sx={{ color: "#ff6b6b" }} />
                      </ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;