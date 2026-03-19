import React, { useState } from 'react';
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
      conditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
      meds: ['Amlodipine', 'Atorvastatin', 'Metoprolol']
    },
    {
      name: 'Jennifer Martinez',
      age: 52,
      gender: 'Female',
      conditions: ['Depression'],
      meds: ['Losartan', 'Sertraline']
    }
  ]
};

const DiseasePatients = () => {
  const [disease, setDisease] = useState('Hypertension');

  const patients = mockData[disease] || [];

  const totalPatients = patients.length;
  const percentage = ((patients.length / 15) * 100).toFixed(1); // mock %

  //   useEffect(() => {
  //     fetch(`/api/patients?disease=${disease}`)
  //       .then((res) => res.json())
  //       .then(setPatients);
  //   }, [disease]);

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Patients with Specific Disease
      </Typography>

      {/* <Box sx={{ display: 'flex' }}> */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={12} md={9} lg={9}>
          {/* STATS */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box
                sx={{
                  background: 'rgba(29, 222, 196, 0.15)',
                  p: 2,
                  borderRadius: 3,
                  minWidth: 140
                }}
              >
                <Typography fontSize={12}>Total Patients</Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {totalPatients}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box
                sx={{
                  background: 'rgba(29, 222, 196, 0.15)',
                  p: 2,
                  borderRadius: 3,
                  minWidth: 120
                }}
              >
                <Typography fontSize={12}>Percentage</Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {percentage}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={3} lg={3}>
          {/* SELECT */}
          <Box mb={3}>
            <Typography fontSize={13} mb={1}>
              Select Disease
            </Typography>

            <Select
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              size="small"
              sx={{
                minWidth: '100%',
                borderRadius: 2,
                background: '#F5F7FA',
                fontSize: '12px'
              }}
            >
              {Object.keys(mockData).map((d) => (
                <MenuItem key={d} value={d} sx={{ fontSize: '12px' }}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Grid>
      </Grid>
      {/* </Box> */}

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 'none',
          overflowX: 'auto' // 🔥 enables horizontal scroll
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ p: 2, background: '#f0f2f8' }}>
            <TableRow>
              <TableCell sx={{ p: 1 }}>Patient Name</TableCell>
              <TableCell sx={{ p: 1 }}>Age</TableCell>
              <TableCell sx={{ p: 1 }}>Gender</TableCell>
              <TableCell sx={{ p: 1 }}>Other Conditions</TableCell>
              <TableCell sx={{ p: 1 }}>Medications</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {patients.map((p, i) => (
              <TableRow key={i}>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.name}</TableCell>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.age}</TableCell>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.gender}</TableCell>

                {/* CONDITIONS */}
                <TableCell sx={{ p: 1, fontSize: '12px' }}>
                  {p.conditions.map((c, idx) => (
                    <Chip
                      key={idx}
                      label={c}
                      size="small"
                      sx={{
                        mr: 1,
                        mb: 1,
                        background: '#F1F5F9',
                        color: 'currentcolor',
                        fontSize: '12px'
                      }}
                    />
                  ))}
                </TableCell>

                {/* MEDS */}
                <TableCell sx={{ p: 1, fontSize: '12px' }}>
                  {p.meds.map((m, idx) => (
                    <Chip
                      key={idx}
                      label={m}
                      size="small"
                      sx={{
                        mr: 1,
                        mb: 1,
                        background: 'rgba(29, 222, 196, 0.15)',
                        color: '#1ddec4',
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
    </Card>
  );
};

export default DiseasePatients;
