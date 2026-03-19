import React, { useState, useMemo } from 'react';
import Chart from "react-apexcharts";
import {
  Box,
  Card,
  Typography,
  Select,
  MenuItem,
  Grid,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Chip,
//   TableContainer,
//   Paper
} from '@mui/material';

/* ---------- MOCK DATA ---------- */
const patientsData = [
  {
    name: 'John Smith',
    age: 65,
    gender: 'Male',
    conditions: ['Hypertension', 'Diabetes']
  },
  {
    name: 'Michael Brown',
    age: 72,
    gender: 'Male',
    conditions: ['Hypertension', 'CAD']
  },
  {
    name: 'Lisa Taylor',
    age: 55,
    gender: 'Female',
    conditions: ['Diabetes']
  },
  {
    name: 'James Thomas',
    age: 70,
    gender: 'Male',
    conditions: ['Hypertension', 'Diabetes', 'COPD']
  }
];

/* ---------- COMPONENT ---------- */
const CombinedDiseases = () => {
  const [selectedDisease, setSelectedDisease] = useState('Hypertension');

  /* ALL DISEASES */
  const allDiseases = useMemo(() => {
    const set = new Set();
    patientsData.forEach((p) => p.conditions.forEach((c) => set.add(c)));
    return [...set];
  }, []);

  /* FILTER PATIENTS (WITH COMBINED DISEASES) */
  const filteredPatients = useMemo(() => {
    return patientsData
      .filter((p) => p.conditions.includes(selectedDisease))
      .map((p) => ({
        ...p,
        otherDiseases: p.conditions.filter((c) => c !== selectedDisease)
      }))
      .filter((p) => p.otherDiseases.length > 0); // 🔥 only combined
  }, [selectedDisease]);

  /* STATS */
  const total = filteredPatients.length;

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

    const combinedStats = useMemo(() => {
  const map = {};

  filteredPatients.forEach((p) => {
    p.otherDiseases.forEach((d) => {
      map[d] = (map[d] || 0) + 1;
    });
  });

  const total = filteredPatients.length;

  return Object.entries(map)
    .map(([disease, count]) => ({
      disease,
      percentage: total
        ? Number(((count / total) * 100).toFixed(1))
        : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}, [filteredPatients]);

  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Combined Diseases Analysis
      </Typography>

      {/* FILTER */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={12} md={9} lg={9}>
          {/* STATS */}
          <Grid container spacing={2}>
            {/* STATS */}
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box
               sx={cardStyle }
              >
                <Typography fontSize={12} fontWeight={500}>Patients with Combined Diseases</Typography>
                <Typography  fontSize={16} fontWeight="bold">{total}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Typography fontSize={13} mb={1}>
            Select Disease
          </Typography>

          <Select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            size="small"
            fullWidth
            sx={{
              borderRadius: 2,
              background: '#F5F7FA',
              fontSize: '12px'
            }}
          >
            {allDiseases.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {/* TABLE */}
      {/* <TableContainer
        component={Paper}
       sx={{
          borderRadius: 3,
          boxShadow: 'none',
          overflowX: 'auto', 
          border:"1px solid #d3d5d9"
        }}
      >
        <Table stickyHeader>
          <TableHead sx={{ width: '100%' }}>
            <TableRow>
              <TableCell sx={{ p: 1 }}>Name</TableCell>
              <TableCell sx={{ p: 1 }}>Age</TableCell>
              <TableCell sx={{ p: 1 }}>Gender</TableCell>
              <TableCell sx={{ p: 1 }}>Selected Disease</TableCell>
              <TableCell sx={{ p: 1 }}>Other Diseases</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPatients.map((p, i) => (
              <TableRow key={i}>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.name}</TableCell>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.age}</TableCell>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.gender}</TableCell>

        
                <TableCell sx={{ p: 1, fontSize: '12px' }}>
                  <Chip
                    label={selectedDisease}
                    size="small"
                    sx={{
                      background: 'rgba(29, 222, 196, 0.15)',
                      color: '#1ddec4',
                       fontSize: '12px'
                    }}
                  />
                </TableCell>

               
                <TableCell sx={{ p: 1, fontSize: '12px' }}>
                  {p.otherDiseases.map((d, idx) => (
                    <Chip
                      key={idx}
                      label={d}
                      size="small"
                      sx={{
                        mr: 1,
                        mb: 1,
                        background: '#f1f5f9',
                        color:"currentcolor",
                         fontSize: '12px'
                      }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}

       
            {filteredPatients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No combined diseases found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer> */}

      <Box>
  <Typography fontWeight="bold" mb={1}>
    Combined Diseases Distribution
  </Typography>

  {/* <Box sx={{ height: 320 }}>
    {combinedStats.length === 0 ? (
      <Typography>No combined diseases found</Typography>
    ) : (
      <Chart
        options={{
          chart: {
            type: "bar",
            toolbar: { show: false },
          },
          xaxis: {
            categories: combinedStats.map((d) => d.disease),
          },
          yaxis: {
            title: {
              text: "% of Patients",
            },
          },
          dataLabels: {
            enabled: true,
          },
          colors: ["#1ddec4"],
          plotOptions: {
            bar: {
              borderRadius: 6,
              columnWidth: "20%",
            },
          },
          tooltip: {
            y: {
              formatter: (val) => `${val}%`,
            },
          },
        }}
        series={[
          {
            name: "Co-occurrence %",
            data: combinedStats.map((d) => d.percentage),
          },
        ]}
        type="bar"
        height="100%"
      />
    )}
  </Box> */}
  <Box>
 

  <Box sx={{ height: 320 }}>
    {combinedStats.length === 0 ? (
      <Typography>No combined diseases found</Typography>
    ) : (
      <Chart
        options={{
          chart: {
            type: "line",
            toolbar: { show: false },
          },
          xaxis: {
            categories: combinedStats.map((d) => d.disease),
          },
          yaxis: {
            title: {
              text: "% of Patients",
            },
          },
          stroke: {
            curve: "smooth", // 🔥 smooth line
            width: 3,
          },
          markers: {
            size: 5,
          },
          dataLabels: {
            enabled: true,
          },
          colors: ["#1ddec4"],
          tooltip: {
            y: {
              formatter: (val) => `${val}%`,
            },
          },
          grid: {
            borderColor: "#e5e7eb",
          },
        }}
        series={[
          {
            name: "Co-occurrence %",
            data: combinedStats.map((d) => d.percentage),
          },
        ]}
        type="line"
        height="100%"
      />
    )}
  </Box>
</Box>
</Box>
    </Card>
  );
};

export default CombinedDiseases;
