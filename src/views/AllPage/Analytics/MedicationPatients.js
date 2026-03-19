import React, { useState, useMemo } from 'react';
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
const patientsData = [
  {
    name: 'John Smith',
    age: 65,
    gender: 'Male',
    meds: ['Lisinopril', 'Metformin']
  },
  {
    name: 'Michael Brown',
    age: 72,
    gender: 'Male',
    meds: ['Amlodipine', 'Atorvastatin', 'Metoprolol']
  },
  {
    name: 'Jennifer Martinez',
    age: 52,
    gender: 'Female',
    meds: ['Losartan', 'Sertraline']
  },
  {
    name: 'Lisa Taylor',
    age: 55,
    gender: 'Female',
    meds: ['Metformin', 'Amlodipine']
  },
  {
    name: 'James Thomas',
    age: 70,
    gender: 'Male',
    meds: ['Metoprolol', 'Lisinopril', 'Metformin']
  }
];

/* ---------- COMPONENT ---------- */
const MedicationPatients = () => {
  const [medication, setMedication] = useState('Metformin');

  const allMedications = useMemo(() => {
    const meds = new Set();
    patientsData.forEach((p) => p.meds.forEach((m) => meds.add(m)));
    return [...meds];
  }, []);

  /* FILTER PATIENTS */
  const filteredPatients = patientsData.filter((p) => p.meds.includes(medication));

  /* STATS */
  const totalPatients = patientsData.length;
  const medicationPatients = filteredPatients.length;

  const percentageTotal = ((medicationPatients / totalPatients) * 100).toFixed(1);

  const otherPatients = totalPatients - medicationPatients;
  const percentageVsOthers = ((medicationPatients / (medicationPatients + otherPatients)) * 100).toFixed(1);

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        mt: 2
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Patients on Specific Medication
      </Typography>

      {/* <Box sx={{display:"flex"}}> */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={12} md={9} lg={9}>
          {/* STATS */}
          <Grid container spacing={2} mb={3}>
            {/* TOTAL */}
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box
                sx={{
                  background: 'rgba(29, 222, 196, 0.15)',
                  p: 2,
                  borderRadius: 3,
                  minWidth: 140
                }}
              >
                <Typography fontSize={12}>Patients on Medication</Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {medicationPatients}
                </Typography>
              </Box>
            </Grid>

            {/* % VS TOTAL */}
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
                  {percentageTotal}%
                </Typography>
              </Box>
            </Grid>

            {/* % VS OTHERS */}
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box
                sx={{
                  background: 'rgba(29, 222, 196, 0.15)',
                  p: 2,
                  borderRadius: 3,
                  minWidth: 140
                }}
              >
                <Typography fontSize={12}>Other Medications</Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {percentageVsOthers}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={3} lg={3}>
          {/* SELECT */}
          <Box mb={3}>
            <Typography fontSize={13} mb={1}>
              Select Medication
            </Typography>

            <Select
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              size="small"
              sx={{
                minWidth: '100%',
                borderRadius: 2,
                background: '#F5F7FA',
                fontSize: '12px'
              }}
            >
              {allMedications.map((m) => (
                <MenuItem key={m} value={m} sx={{ fontSize: '12px' }}>
                  {m}
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
        <Table>
          <TableHead sx={{ p: 2, background: '#f0f2f8' }}>
            <TableRow>
              <TableCell sx={{ p: 1 }}>Patient Name</TableCell>
              <TableCell sx={{ p: 1 }}>Age</TableCell>
              <TableCell sx={{ p: 1 }}>Gender</TableCell>
              <TableCell sx={{ p: 1 }}>Medications</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPatients.map((p, i) => (
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
                        fontSize: '12px',
                        background: m === medication ? '#E6F7F5' : '#f0f2f8',
                        color: m === medication ? '#1ddec4' : 'inherit'
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

export default MedicationPatients;
