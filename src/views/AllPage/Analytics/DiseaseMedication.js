import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import {
  Box,
  Card,
  Typography,
  Select,
  MenuItem,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TableContainer,
  Paper
} from '@mui/material';

/* ---------- MOCK DATA ---------- */
const mockData = {
  Hypertension: [
    {
      name: 'John Smith',
      age: 65,
      gender: 'Male',
      conditions: ['Type 2 Diabetes'],
      meds: ['Lisinopril', 'Metformin']
    },
    {
      name: 'Michael Brown',
      age: 72,
      gender: 'Male',
      conditions: ['CAD'],
      meds: ['Amlodipine', 'Metformin']
    }
  ],
  Diabetes: [
    {
      name: 'Lisa Taylor',
      age: 55,
      gender: 'Female',
      conditions: ['Hypertension'],
      meds: ['Metformin', 'Insulin']
    }
  ]
};

const DiseaseMedicationAnalytics = () => {
  const [disease, setDisease] = useState('Hypertension');

  const patients = mockData[disease] || [];

  /* ---------- MEDICATION STATS ---------- */
  const medicationStats = useMemo(() => {
    const map = {};

    patients.forEach((p) => {
      p.meds.forEach((m) => {
        map[m] = (map[m] || 0) + 1;
      });
    });

    const total = patients.length;

    return Object.entries(map)
      .map(([med, count]) => ({
        med,
        count,
        percentage: total ? ((count / total) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [patients]);

  const topMedication = medicationStats[0];

  /* ---------- STYLES ---------- */
  const cardStyle = {
    background: 'rgba(29, 222, 196, 0.15)',
    p: 2,
    borderRadius: 3,
    height: '100%', // 🔥 equal height fix
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  };

  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Disease → Medication Analytics
      </Typography>

      {/* ===== FILTER + STATS ===== */}
      <Grid container spacing={2} alignItems="stretch" mb={3}>
        {/* STATS */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {/* TOTAL */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={cardStyle}>
                <Typography fontSize={12} fontWeight={500}>
                  Total Patients
                </Typography>
                <Typography fontWeight="bold">{patients.length}</Typography>
              </Box>
            </Grid>

            {/* TOP MED */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={cardStyle}>
                <Typography fontSize={12} fontWeight={500}>
                  Top Medication
                </Typography>

                <Chip
                  label={topMedication?.med || '-'}
                  size="small"
                  sx={{
                    mt: 1,
                    background: 'rgba(29, 222, 196, 0.15)',
                    color: '#1ddec4',
                    width: 'fit-content',
                    fontSize: '11px'
                  }}
                />

                <Typography mt={1} fontWeight="bold">
                  {topMedication?.percentage || 0}%
                </Typography>
              </Box>
            </Grid>

            {/* TOTAL MEDS */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={cardStyle}>
                <Typography fontSize={12} fontWeight={500}>
                  Unique Medications
                </Typography>
                <Typography fontWeight="bold">{medicationStats.length}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* SELECT */}
        <Grid item xs={12} md={3}>
          <Typography fontSize={13} mb={1}>
            Select Disease
          </Typography>

          <Select
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            size="small"
            fullWidth
            sx={{
              borderRadius: 2,
              background: '#F5F7FA',
              fontSize: '12px'
            }}
          >
            {Object.keys(mockData).map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="stretch">
         <Grid item xs={12} md={6}>
          {/* <Box>
            <Typography fontWeight="bold" mb={1}>
              Medication Distribution
            </Typography>

            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: 'none',
                overflowX: 'auto',
                border: '1px solid #d3d5d9',
                maxHeight: 300,
                overflow: 'auto'
              }}
            >
              <Table>
                <TableHead sx={{ p: 2, background: '#f0f2f8' }}>
                  <TableRow>
                    <TableCell sx={{ p: 1 }}>Medication</TableCell>
                    <TableCell sx={{ p: 1 }}>Patients</TableCell>
                    <TableCell sx={{ p: 1 }}>Percentage</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {medicationStats.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ p: 1, fontSize: '12px' }}>
                        <Chip
                          label={item.med}
                          size="small"
                          sx={{
                            background: 'rgba(29, 222, 196, 0.15)',
                            color: '#1ddec4',
                            fontSize: '12px'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 1, fontSize: '12px' }}>{item.count}</TableCell>
                      <TableCell sx={{ p: 1, fontSize: '12px' }}>{item.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box> */}
            <Box>
              <Typography fontWeight="bold" mb={1}>
                Medication Distribution
              </Typography>

              <Box sx={{ height: 300 }}>
                <Chart
                  options={{
                    chart: {
                      type: 'bar',
                      toolbar: { show: false }
                    },
                    xaxis: {
                      categories: medicationStats.map((m) => m.med)
                    },
                    yaxis: {
                      title: {
                        text: '% of Patients'
                      }
                    },
                    dataLabels: {
                      enabled: true
                    },
                    colors: ['#1ddec4'], // your theme
                    plotOptions: {
                      bar: {
                        borderRadius: 6,
                        columnWidth: '40%' // 🔥 control width
                      }
                    },
                    tooltip: {
                      y: {
                        formatter: (val) => `${val}%`
                      }
                    }
                  }}
                  series={[
                    {
                      name: 'Patients %',
                      data: medicationStats.map((m) => Number(m.percentage))
                    }
                  ]}
                  type="bar"
                  height="100%"
                />
              </Box>
            </Box>
        </Grid>
         <Grid item xs={12} md={6}>
          <Box>
            {/* ===== PATIENT TABLE ===== */}
            <Typography fontWeight="bold" mb={1}>
              Patients List
            </Typography>

            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: 'none',
                overflowX: 'auto',
                border: '1px solid #d3d5d9',
                maxHeight: 300,
                overflow: 'auto'
              }}
            >
              <Table>
                <TableHead sx={{ p: 2, background: '#f0f2f8' }}>
                  <TableRow>
                    <TableCell sx={{ p: 1 }}>Name</TableCell>
                    <TableCell sx={{ p: 1 }}>Age</TableCell>
                    <TableCell sx={{ p: 1 }}>Gender</TableCell>
                    <TableCell sx={{ p: 1 }}>Medications</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {patients.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.name}</TableCell>
                      <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.age}</TableCell>
                      <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.gender}</TableCell>
                      <TableCell sx={{ p: 1, fontSize: '12px' }}>
                        {p.meds.map((m, idx) => (
                          <Chip
                            key={idx}
                            label={m}
                            size="small"
                            sx={{
                              mr: 1,
                              mb: 1,
                              background: m === topMedication?.med ? 'rgba(29, 222, 196, 0.15)' : '#f0f2f8',
                              color: m === topMedication?.med ? '#1ddec4' : 'inherit',
                              fontSize: '12px'
                            }}
                          />
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
       
       
      </Grid>
    </Card>
  );
};

export default DiseaseMedicationAnalytics;
