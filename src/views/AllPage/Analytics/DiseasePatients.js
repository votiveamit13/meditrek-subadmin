import React, { useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
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
  ],
    Diabetes: [
    {
      name: 'John Smith1',
      age: 65,
      gender: 'Male',
      conditions: ['Type 2 Diabetes'],
      meds: ['Lisinopril', 'Metformin']
    },
    {
      name: 'Michael Brown1',
      age: 72,
      gender: 'Male',
      conditions: ['Coronary Artery Disease', 'Hyperlipidemia'],
      meds: ['Amlodipine', 'Atorvastatin', 'Metoprolol']
    },
    {
      name: 'Jennifer Martinez1',
      age: 52,
      gender: 'Female',
      conditions: ['Depression'],
      meds: ['Losartan', 'Sertraline']
    }
  ]
};

const DiseasePatients = () => {
  const [diseases, setDiseases] = useState(['Hypertension']);

  const patients = diseases.flatMap((d) =>
    (mockData[d] || []).map((p) => ({
      ...p,
      disease: d // attach disease to each row
    }))
  );

  const totalPatients = patients.length;

  const percentage = totalPatients ? ((totalPatients / 15) * 100).toFixed(1) : 0;

  //   useEffect(() => {
  //     fetch(`/api/patients?disease=${disease}`)
  //       .then((res) => res.json())
  //       .then(setPatients);
  //   }, [disease]);

  // const uniquePatients = Object.values(
  //   patients.reduce((acc, p) => {
  //     acc[p.name] = acc[p.name]
  //       ? {
  //           ...p,
  //           disease: acc[p.name].disease + ', ' + p.disease
  //         }
  //       : p;
  //     return acc;
  //   }, {})
  // );

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
                sx={cardStyle }
              >
                <Typography fontSize={12} fontWeight={500}>Total Patients</Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {totalPatients}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box
                sx={cardStyle}
              >
                <Typography fontSize={12} fontWeight={500}>Percentage</Typography>
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
              multiple
              value={diseases}
              onChange={(e) => setDiseases(e.target.value)}
              size="small"
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <span style={{ color: '#94a3b8' }}>Select disease</span>;
                }

                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        size="small"
                        deleteIcon={<CancelIcon onMouseDown={(e) => e.stopPropagation()} />}
                        onDelete={(e) => {
                          e.stopPropagation();
                          setDiseases((prev) => prev.filter((item) => item !== value));
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
                width: '100%',
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
        <Table sx={{ width: '100%' }}>
          <TableHead sx={{ p: 2, background: '#f0f2f8' }}>
            <TableRow>
              <TableCell sx={{ p: 1 }}>Disease</TableCell> {/* ✅ NEW */}
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
                <TableCell sx={{ p: 1, fontSize: '12px' }} size="small">
                  {p.disease}
                </TableCell>
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
