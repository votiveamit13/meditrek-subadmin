import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

//project import
import ReportCard from './ReportCard';
import { APP_PREFIX_PATH, gridSpacing } from 'config.js';
import { Base_Url } from "../../config"

// assets
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import PersonPinIcon from '@mui/icons-material/PersonPin';
// import MonetizationOnTwoTone from '@mui/icons-material/MonetizationOnTwoTone';
// import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import axios from 'axios';
import { Link } from 'react-router-dom';

// import RestoreFromTrash from '@mui/icons-material/RestoreFromTrash';

// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();
  const [patient, setPatient] = useState([]);
  const [medication, setMedication] = useState([]);
  const [adverse, setAdverse] = useState([]);
  const [lab, setLab] = useState([])
  const [measurement, setMeasurement] = useState([])

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}sub_dashboard`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

      if (response.data.success) {
        setPatient(response.data.totalPatients);

      } else {
        console.log("Profile Details fetch Error")
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const fetchMedicationDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}medication_dashboard`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

      if (response.data.success) {
        setMedication(response.data.totalMedication);

      } else {
        console.log("Profile Details fetch Error")
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const fetchAdverseDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}adverse_dashboard`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

      if (response.data.success) {
        setAdverse(response.data.totalAdverseReaction);

      } else {
        console.log("Profile Details fetch Error")
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const fetchLabreportsDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}lab_report_dashboard`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

      if (response.data.success) {
        setLab(response.data.totalLabReports);

      } else {
        console.log("Profile Details fetch Error")
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const fetchmeasurementDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}measurement_dashboard`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

      if (response.data.success) {
        setMeasurement(response.data.totalmeasurement);

      } else {
        console.log("Profile Details fetch Error")
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchMedicationDetails()
    fetchAdverseDetails()
    fetchLabreportsDetails()
    fetchmeasurementDetails()
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Typography style={{ marginTop: '15px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span>
      </Typography>

      <Grid item xs={12} style={{ marginTop: '25px' }}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} sm={6} xs={12}>
            <Link to={APP_PREFIX_PATH + "/manage-patients"} style={{ textDecoration: 'none' }}>
              <ReportCard
                primary={patient}
                secondary="Total Patients"
                color={theme.palette.success.main}
                footerData=""
                iconPrimary={VerifiedUserIcon}
              />
            </Link>
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <Link to={APP_PREFIX_PATH + "//manage-patients"} style={{ textDecoration: 'none' }}>
              <ReportCard
                primary={medication}
                secondary="Total Medications"
                color={theme.palette.success.main}
                footerData=""
                iconPrimary={VerifiedUserIcon}
              />
            </Link>
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <Link to={APP_PREFIX_PATH + "//manage-patients"} style={{ textDecoration: 'none' }}>
              <ReportCard
                primary={adverse}
                secondary="Adverse Reactions"
                color={theme.palette.success.main}
                footerData=""
                iconPrimary={VerifiedUserIcon}
              />
            </Link>
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <Link to={APP_PREFIX_PATH + "/manage-patients"} style={{ textDecoration: 'none' }}>
              <ReportCard
                primary={lab}
                secondary="Lab Reports"
                color={theme.palette.success.main}
                footerData=""
                iconPrimary={VerifiedUserIcon}
              />
            </Link>
          </Grid>

          <Grid item lg={3} sm={6} xs={12}>
            <Link to={APP_PREFIX_PATH + "/manage-patients"} style={{ textDecoration: 'none' }}>
              <ReportCard
                primary={measurement}
                secondary="Total Measurements"
                color={theme.palette.success.main}
                footerData=""
                iconPrimary={VerifiedUserIcon}
              />
            </Link>
          </Grid>

               {/* <Grid item lg={3} sm={6} xs={12}>
            <Link to={APP_PREFIX_PATH + "/manage-patients"} style={{ textDecoration: 'none' }}>
              <ReportCard
                primary={'0'}
                secondary="Under Care Patient"
                color={theme.palette.success.main}
                footerData=""
                iconPrimary={VerifiedUserIcon}
              />
            </Link>
          </Grid> */}

        </Grid>
      </Grid>
    </Grid>
  );
};

export default Default;
