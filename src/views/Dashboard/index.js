import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

//project import
import ReportCard from './ReportCard';
import { APP_PREFIX_PATH } from 'config.js';
import { Base_Url } from '../../config';

// assets
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import PersonPinIcon from '@mui/icons-material/PersonPin';
// import MonetizationOnTwoTone from '@mui/icons-material/MonetizationOnTwoTone';
// import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PatientGrowthChart from './Graph/PatientGrowthChart';
import GenderChart from './Graph/GenderChart';
import AgeChart from './Graph/AgeChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ScienceIcon from '@mui/icons-material/Science';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Box } from '@mui/material';
// import { Card, CardContent } from '@mui/material';

// import RestoreFromTrash from '@mui/icons-material/RestoreFromTrash';

// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();
  const [patient, setPatient] = useState([]);
  const [medication, setMedication] = useState([]);
  const [adverse, setAdverse] = useState([]);
  const [lab, setLab] = useState([]);
  const [measurement, setMeasurement] = useState([]);

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}sub_dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setPatient(response.data.totalPatients);
      } else {
        console.log('Profile Details fetch Error');
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const fetchMedicationDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}medication_dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMedication(response.data.totalMedication);
      } else {
        console.log('Profile Details fetch Error');
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const fetchAdverseDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}adverse_dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setAdverse(response.data.totalAdverseReaction);
      } else {
        console.log('Profile Details fetch Error');
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const fetchLabreportsDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}lab_report_dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setLab(response.data.totalLabReports);
      } else {
        console.log('Profile Details fetch Error');
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const fetchmeasurementDetails = async () => {
    try {
      const token = sessionStorage.getItem('token');
      let response;
      response = await axios.get(`${Base_Url}measurement_dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMeasurement(response.data.totalmeasurement);
      } else {
        console.log('Profile Details fetch Error');
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchMedicationDetails();
    fetchAdverseDetails();
    fetchLabreportsDetails();
    fetchmeasurementDetails();
  }, []);

  return (
    <>
      <Grid container>
        <Typography style={{ marginBottom: '15px' }} variant="h4" gutterBottom>
          <span style={{ color: '#1DDEC4' }}>Dashboard</span>
        </Typography>

        <Grid container rowSpacing={5} columnSpacing={3} sx={{ mt: 0 }}>
          <Grid item lg={4} sm={6} xs={12} sx={{ overflow: 'visible' }}>
            <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}>
              <ReportCard primary={patient} secondary="Total Patients" color={theme.palette.success.main} iconPrimary={PeopleAltIcon} />
            </Link>
          </Grid>

          <Grid item lg={4} sm={6} xs={12} sx={{ overflow: 'visible' }}>
            <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}>
              <ReportCard
                primary={medication}
                secondary="Total Medications"
                color={theme.palette.primary.main}
                iconPrimary={MedicationIcon}
              />
            </Link>
          </Grid>

          <Grid item lg={4} sm={6} xs={12} sx={{ overflow: 'visible' }}>
            <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}>
              <ReportCard primary={adverse} secondary="Adverse Reactions" color={theme.palette.error.main} iconPrimary={WarningAmberIcon} />
            </Link>
          </Grid>

          <Grid item lg={4} sm={6} xs={12} sx={{ overflow: 'visible' }}>
            <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}>
              <ReportCard primary={lab} secondary="Lab Reports" color={theme.palette.warning.main} iconPrimary={ScienceIcon} />
            </Link>
          </Grid>

          <Grid item lg={4} sm={6} xs={12} sx={{ overflow: 'visible' }}>
            <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}>
              <ReportCard
                primary={measurement}
                secondary="Total Measurements"
                color={theme.palette.info.main}
                iconPrimary={MonitorHeartIcon}
              />
            </Link>
          </Grid>
        </Grid>

        {/* <Grid
          item
          xs={12}
          // style={{ background: "#fff", borderRadius: "20px", marginLeft: '24px' }}
          sx={{
            // background: '#fff',
            // borderRadius: 3,
            // ml: { xs: 2, sm: 3 },
            // mx: { xs: 0, sm: 1 },
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            mt: 4
          }}
        > */}
        <Grid container spacing={3} mt={1} alignItems="stretch" sx={{background:'transparent',p:'0'}}>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              sx={{
                background: '#fff',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
              }}
            >
              <PatientGrowthChart />
            </Box>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ display: "flex" }}>
            <Box
              sx={{
                background: '#fff',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                height:'100%',
                 width: "100%",
              }}
            >
              <GenderChart />
            </Box>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ display: "flex" }}>
            <Box
              sx={{
                background: '#fff',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                height:'100%',
                 width: "100%",
              }}
            >
              <AgeChart />
            </Box>
          </Grid>
        </Grid>
        {/* </Grid> */}

        {/* <Grid container rowSpacing={5} columnSpacing={3} mt={0.5}>
          <Grid item lg={12} sm={6} xs={12}  pt={0} sx={{paddingTop:"0 !important"}}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff', width: '100%', height: '100%' }}>
              <CardContent >
                <PatientGrowthChart />
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={6} sm={6} xs={12}  pt={0} sx={{paddingTop:"0 !important"}}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff', width: '100%', height: '100%' }}>
              <CardContent sx={{paddingBottom: "4px !important"}}>
                <GenderChart />
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={6} sm={6} xs={12} sx={{paddingTop:"0 !important"}}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 6px 18px rgba(0,0,0,0.06)', background: '#fff', width: '100%', height: '100%' }}>
              <CardContent sx={{ paddingBottom: "4px !important" }}>
                <AgeChart />
              </CardContent>
            </Card>
          </Grid>
        </Grid> */}
      </Grid>
    </>
  );
};

export default Default;
