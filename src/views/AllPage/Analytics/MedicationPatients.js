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

  // combination data
  const combinationStats = useMemo(() => {
    const map = {};

    patientsData.forEach((p) => {
      const key = [...p.meds].sort().join(' + '); // normalize

      map[key] = (map[key] || 0) + 1;
    });

    const total = patientsData.length;

    let topCombo = '';
    let maxCount = 0;

    Object.entries(map).forEach(([combo, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topCombo = combo;
      }
    });

    const percentage = total ? ((maxCount / total) * 100).toFixed(1) : 0;

    return {
      topCombo,
      maxCount,
      percentage
    };
  }, []);

  const cardStyle = {
    background: 'rgba(29, 222, 196, 0.15)',
    // background:"#f0f2f8",
    p: 2,
    borderRadius: 3,
    height: '100%', // 🔥 equal height fix
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  };

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
      <Grid container spacing={2} alignItems="stretch" mb={3}>
        {/* ===== LEFT SIDE (STATS) ===== */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {/* CARD 1 */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={cardStyle}>
                <Typography fontSize={12} fontWeight={500}>
                  No of Patients
                </Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {medicationPatients}
                </Typography>
              </Box>
            </Grid>

            {/* CARD 2 */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={cardStyle}>
                <Typography fontSize={12} fontWeight={500}>
                  Total Patients
                </Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {percentageTotal}%
                </Typography>
              </Box>
            </Grid>

            {/* CARD 3 */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={cardStyle}>
                <Typography fontSize={12} fontWeight={500}>
                  Other Medications
                </Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {percentageVsOthers}%
                </Typography>
              </Box>
            </Grid>

            {/* CARD 4 (WIDER) */}
            <Grid item xs={12} sm={12} md={3}>
              <Box sx={cardStyle}>
                <Typography fontSize={12} fontWeight={500}>
                  Most Common Combination
                </Typography>

                <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                  {combinationStats.topCombo?.split(' + ').map((m, i) => (
                    <Chip
                      key={i}
                      label={m}
                      size="small"
                      sx={{
                        background: 'rgba(29, 222, 196, 0.15)',
                        color: '#1ddec4',
                        fontSize: '11px'
                      }}
                    />
                  ))}
                </Box>

                <Typography fontSize={14} fontWeight="bold" mt={1}>
                  {combinationStats.percentage}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* ===== RIGHT SIDE (SELECT) ===== */}
        <Grid item xs={12} md={3}>
          <Box>
            <Typography fontSize={13} mb={1}>
              Select Medication
            </Typography>

            <Select
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              size="small"
              fullWidth
              sx={{
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
          overflowX: 'auto', // 🔥 enables horizontal scroll
          border:"1px solid #d3d5d9"
        }}
      >
        <Table>
          <TableHead sx={{ p: 2, background: '#f0f2f8' }}>
            <TableRow>
              <TableCell sx={{ p: 1 }}>Patient Name</TableCell>
              <TableCell sx={{ p: 1 }}>Age</TableCell>
              <TableCell sx={{ p: 1 }}>Gender</TableCell>
              <TableCell sx={{ p: 1 }}>Medications</TableCell>
              <TableCell sx={{ p: 1 }}>Other Medications</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPatients.map((p, i) => (
              <TableRow key={i}>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.name}</TableCell>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.age}</TableCell>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.gender}</TableCell>
                <TableCell sx={{ p: 1 }}>
                  <Chip
                    label={medication}
                    size="small"
                    sx={{
                      fontSize: '12px',
                      background: 'rgba(29, 222, 196, 0.15)',
                      color: '#1ddec4'
                    }}
                  />
                </TableCell>

                <TableCell sx={{ p: 1 }}>
                  {p.meds
                    .filter((m) => m !== medication) // ✅ remove selected one
                    .map((m, idx) => (
                      <Chip
                        key={idx}
                        label={m}
                        size="small"
                        sx={{
                          mr: 1,
                          mb: 1,
                          fontSize: '12px',
                          background: '#f0f2f8',
                          color: 'currentcolor'
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
