import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

//project import
import ReportCard from './ReportCard';
// import { APP_PREFIX_PATH } from 'config.js';
import { Base_Url } from '../../config';

// assets
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import PersonPinIcon from '@mui/icons-material/PersonPin';
// import MonetizationOnTwoTone from '@mui/icons-material/MonetizationOnTwoTone';
// import PermPhoneMsgIcon from '@mui/icons-material/PermPhoneMsg';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import PatientGrowthChart from './Graph/PatientGrowthChart';
import GenderChart from './Graph/GenderChart';
import AgeChart from './Graph/AgeChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import MedicationIcon from '@mui/icons-material/Medication';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ScienceIcon from '@mui/icons-material/Science';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Box } from '@mui/material';
import LazyChartWrapper from 'component/LazyChartWrapper';
// import { Card, CardContent } from '@mui/material';

// import RestoreFromTrash from '@mui/icons-material/RestoreFromTrash';

// ==============================|| DASHBOARD DEFAULT ||============================== //

const Default = () => {
  const theme = useTheme();
  const [patient, setPatient] = useState(null);
const [medication, setMedication] = useState(null);
const [adverse, setAdverse] = useState(null);
const [lab, setLab] = useState(null);
const [measurement, setMeasurement] = useState(null);
const [graphData, setGraphData] = useState(null);
const [patientGrowth, setPatientGrowth] = useState(null);
const [medicationGrowth, setMedicationGrowth] = useState(null);
const [adverseGrowth, setAdverseGrowth] = useState(null);
const [labGrowth, setLabGrowth] = useState(null);
const [measurementGrowth, setMeasurementGrowth] = useState(null);
const [selectedYear, setSelectedYear] = useState("");
const [graphLoading, setGraphLoading] = useState(false);

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
        setPatientGrowth(response.data.patientGrowth);
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
        setMedicationGrowth(response.data.medicationGrowth);
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
        setAdverseGrowth(response.data.adverseGrowth);
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
        setLabGrowth(response.data.labReportGrowth);
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
        setMeasurementGrowth(response.data.measurementGrowth);
      } else {
        console.log('Profile Details fetch Error');
      }
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

const fetchGraphData = async (year) => {
  try {
    setGraphLoading(true);

    const token = sessionStorage.getItem("token");

    const response = await axios.get(
      `${Base_Url}dashboard_graphs${year ? `?year=${year}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.data.status) {
      setGraphData(response.data);

      // auto set latest year
      const currentYear = new Date().getFullYear();

if (!selectedYear && response.data.availableYears?.length) {
  const matchedYear = response.data.availableYears.find(
    y => y === currentYear
  );

  setSelectedYear(matchedYear || response.data.availableYears[0]);
}
    }
  }  catch (error) {
    console.error("Graph API error:", error);
  } finally {
    setGraphLoading(false);
  }
};

  useEffect(() => {
    fetchUserDetails();
    fetchMedicationDetails();
    fetchAdverseDetails();
    fetchLabreportsDetails();
    fetchmeasurementDetails();
  }, []);

  useEffect(() => {
  fetchGraphData(selectedYear);
}, [selectedYear]);

  return (
    <>
      <Grid container sx={{ width: "100%" }}>
        {/* <Typography style={{ marginBottom: '15px' }} variant="h4" gutterBottom>
          <span style={{ color: '#1DDEC4' }}>Dashboard</span>
        </Typography> */}

        <Grid
          container
          spacing={3}
          sx={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap"
          }}
        >
          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            {/* <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}> */}
              <ReportCard primary={patient} secondary="Total Patients" growth={`${patientGrowth}%`} color={theme.palette.success.main} iconPrimary={PeopleAltIcon} loading={!patient} />
            {/* </Link> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            {/* <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}> */}
              <ReportCard
                primary={medication}
                secondary="Total Medications"
                growth={`${medicationGrowth}%`}
                color={theme.palette.primary.main}
                iconPrimary={MedicationIcon}
                loading={!patient} 
              />
            {/* </Link> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            {/* <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}> */}
              <ReportCard primary={adverse} secondary="Adverse Reactions" growth={`${adverseGrowth}%`} color={theme.palette.warning.main} iconPrimary={WarningAmberIcon} loading={!patient} />
            {/* </Link> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            {/* <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}> */}
              <ReportCard primary={lab} secondary="Files" growth={`${labGrowth}%`} color={theme.palette.warning.main} iconPrimary={ScienceIcon} loading={!patient} />
            {/* </Link> */}
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4}>
            {/* <Link to={APP_PREFIX_PATH + '/manage-patients'} style={{ textDecoration: 'none' }}> */}
              <ReportCard
                primary={measurement}
                secondary="Total Measurements"
                growth={`${measurementGrowth}%`}
                color={theme.palette.info.main}
                iconPrimary={MonitorHeartIcon}
                loading={!patient} 
              />
            {/* </Link> */}
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
        <Grid
          container
          spacing={3}
          sx={{
            mt: 1,
            width: "100%"
          }}
        >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Box
              sx={{
                background: "#fff",
                p: 2,
                borderRadius: 3,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                width: "100%",
                minHeight: 320
              }}
            >
              <PatientGrowthChart 
                 data={graphData?.monthlyPatients}
  availableYears={graphData?.availableYears}
  selectedYear={selectedYear}
  setSelectedYear={setSelectedYear}
  loading={graphLoading} 
              />
            </Box>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Box
              sx={{
                background: "#fff",
                p: 2,
                borderRadius: 3,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                width: "100%",
                minHeight: 320
              }}
            >
              <LazyChartWrapper>
                <GenderChart data={graphData?.genderPercentage} />
              </LazyChartWrapper>
            </Box>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Box
              sx={{
                background: "#fff",
                p: 2,
                borderRadius: 3,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                width: "100%",
                minHeight: 320
              }}
            >
              <LazyChartWrapper>
                <AgeChart data={graphData?.ageGroups} />
              </LazyChartWrapper>
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
