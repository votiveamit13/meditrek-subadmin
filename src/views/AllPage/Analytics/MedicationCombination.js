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

  const combinationStats = useMemo(() => {
  const map = {};

  patientsData.forEach((p) => {
    const key = [...p.meds].sort().join(" + "); // normalize

    map[key] = (map[key] || 0) + 1;
  });

  const total = patientsData.length;

  const result = Object.entries(map).map(([combo, count]) => ({
    combo,
    count,
    percentage: total ? ((count / total) * 100).toFixed(1) : 0,
  }));

  return result.sort((a, b) => b.count - a.count);
}, []);

const topCombo = combinationStats[0];

  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Medication Combination
      </Typography>
      {/* <Box sx={{ display: 'flex' }}> */}
      <Grid container spacing={2} >
        <Grid item xs={12} sm={12} md={9} lg={9}>
          {/* STATS */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box
                sx={cardStyle}
              >
                <Typography fontSize={12} fontWeight={500}>
                  Matching Patients
                </Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {matched}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box
                sx={cardStyle}
              >
                <Typography fontSize={12} fontWeight={500}>
                  Total
                </Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {percentage}%
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
  <Box sx={cardStyle}>
    <Typography fontSize={12} fontWeight={500}>
      Most Common Combination
    </Typography>

    <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
      {topCombo?.combo
        ?.split(" + ")
        .map((m, i) => (
          <Chip
            key={i}
            label={m}
            size="small"
            sx={{
              background: "rgba(29, 222, 196, 0.15)",
              color: "#1ddec4",
              fontSize: "11px",
            }}
          />
        ))}
    </Box>

    <Typography mt={1} fontWeight="bold">
      {topCombo?.percentage || 0}%
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
          overflowX: 'auto',
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

      {/* <Typography fontWeight="bold" mb={1}>
  Top Medication Combinations
</Typography>

<TableContainer component={Paper} sx={{ mb: 2 }}>
  <Table>
    <TableHead sx={{ background: "#f0f2f8" }}>
      <TableRow>
        <TableCell>Combination</TableCell>
        <TableCell>Patients</TableCell>
        <TableCell>%</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {combinationStats.slice(0, 3).map((item, i) => (
        <TableRow key={i}>
          <TableCell>
            <Box display="flex" gap={0.5} flexWrap="wrap">
              {item.combo.split(" + ").map((m, idx) => (
                <Chip
                  key={idx}
                  label={m}
                  size="small"
                  sx={{
                    background: "rgba(29, 222, 196, 0.15)",
                    color: "#1ddec4",
                  }}
                />
              ))}
            </Box>
          </TableCell>

          <TableCell>{item.count}</TableCell>
          <TableCell>{item.percentage}%</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer> */}
    </Card>
  );
};

export default MedicationCombination;
