import React, { useState, useMemo } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
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
const MedicationCombination = () => {
  const [selectedMeds, setSelectedMeds] = useState([]);

  /* ALL MEDS */
  const allMedications = useMemo(() => {
    const meds = new Set();
    patientsData.forEach((p) => p.meds.forEach((m) => meds.add(m)));
    return [...meds];
  }, []);

  /* FILTER (AND CONDITION) */
  const filteredPatients = useMemo(() => {
    if (selectedMeds.length === 0) return [];

    return patientsData.filter((p) => selectedMeds.every((med) => p.meds.includes(med)));
  }, [selectedMeds]);

  /* STATS */
  const totalPatients = patientsData.length;
  const matched = filteredPatients.length;

  const percentage = totalPatients ? ((matched / totalPatients) * 100).toFixed(1) : 0;

  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Medication Combination
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
                <Typography fontSize={12}>Matching Patients</Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {matched}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box
                sx={{
                  background: 'rgba(29, 222, 196, 0.15)',
                  p: 2,
                  borderRadius: 3,
                  minWidth: 140
                }}
              >
                <Typography fontSize={12}>Total</Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {percentage}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {/* MULTI SELECT */}
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Box mb={3}>
            <Typography fontSize={13} mb={1}>
              Select Medications
            </Typography>

            <Select
              multiple
              value={selectedMeds}
              onChange={(e) => setSelectedMeds(e.target.value)}
              size="small"
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <span style={{ color: '#94a3b8' }}>Select medications</span>;
                }

                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        size="small"
                        deleteIcon={
                          <CancelIcon
                            onMouseDown={(e) => e.stopPropagation()} // 🔥 IMPORTANT FIX
                          />
                        }
                        onDelete={(e) => {
                          e.stopPropagation(); // optional but safe
                          setSelectedMeds((prev) => prev.filter((item) => item !== value));
                        }}
                        sx={{
                          background: 'rgba(29, 222, 196, 0.15)',
                          color: '#1ddec4',
                          fontSize: '12px'
                        }}
                      />
                    ))}
                  </Box>
                );
              }}
              sx={{
                minWidth: '100%',
                borderRadius: 2,
                background: '#F5F7FA'
              }}
            >
              {allMedications.map((m) => (
                <MenuItem key={m} value={m} sx={{ fontSize: '12px' }}>
                  <Checkbox checked={selectedMeds.includes(m)} />
                  <ListItemText primary={m} sx={{ fontSize: '12px' }} />
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
                  {p.meds.map((m, idx) => {
                    const isSelected = selectedMeds.includes(m);

                    return (
                      <Chip
                        key={idx}
                        label={m}
                        size="small"
                        sx={{
                          mr: 1,
                          mb: 1,
                          background: isSelected ? 'rgba(29, 222, 196, 0.15)' : '#F1F5F9',
                          color: isSelected ? '#1ddec4' : 'inherit',
                          fontSize: '12px'
                        }}
                      />
                    );
                  })}
                </TableCell>
              </TableRow>
            ))}

            {/* EMPTY STATE */}
            {selectedMeds.length > 0 && filteredPatients.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No patients found for this combination
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default MedicationCombination;
