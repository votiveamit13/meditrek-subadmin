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
  TableContainer,
  Paper,
  Chip
} from '@mui/material';

/* ---------- MOCK DATA ---------- */
const patientsData = [
  {
    name: 'John Smith',
    age: 65,
    conditions: ['Hypertension', 'Diabetes'],
    meds: ['Lisinopril', 'Metformin']
  },
  {
    name: 'Michael Brown',
    age: 72,
    conditions: ['Hypertension', 'CAD'],
    meds: ['Amlodipine', 'Atorvastatin']
  },
  {
    name: 'Lisa Taylor',
    age: 52,
    conditions: ['Diabetes'],
    meds: ['Metformin']
  },
  {
    name: 'James Thomas',
    age: 70,
    conditions: ['Hypertension', 'Diabetes', 'COPD'],
    meds: ['Metoprolol', 'Insulin']
  }
];

/* ---------- AGE GROUPS ---------- */
const ageGroups = {
  '0-18': (age) => age <= 18,
  '19-30': (age) => age >= 19 && age <= 30,
  '31-45': (age) => age >= 31 && age <= 45,
  '46-60': (age) => age >= 46 && age <= 60,
  '60+': (age) => age > 60
};

const AgeVsMedication = () => {
  const [selectedAge, setSelectedAge] = useState('60+');

  /* FILTER PATIENTS */
  const filteredPatients = useMemo(() => {
    return patientsData.filter((p) => ageGroups[selectedAge](p.age));
  }, [selectedAge]);

  /* CALCULATE MEDICATION % */
  const chartData = useMemo(() => {
    const map = {};

    filteredPatients.forEach((p) => {
      p.meds.forEach((m) => {
        map[m] = (map[m] || 0) + 1;
      });
    });

    const total = filteredPatients.length;

    return Object.entries(map)
      .map(([med, count]) => ({
        med,
        percentage: total ? Number(((count / total) * 100).toFixed(1)) : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [filteredPatients]);

  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Age vs Medication
          </Typography>
        </Grid>
        {/* DROPDOWN */}
        <Grid item xs={12} md={3}>
          <Typography fontSize={13} mb={1}>
            Select Age Group
          </Typography>

          <Select
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            size="small"
            fullWidth
            sx={{
              borderRadius: 2,
              background: '#F5F7FA',
              fontSize: '12px'
            }}
          >
            {Object.keys(ageGroups).map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* DONUT CHART */}
        <Grid item xs={12} md={4}>
          <Box sx={{ height: '320px' }}>
            {chartData.length === 0 ? (
              <Typography>No data available</Typography>
            ) : (
              <Chart
                options={{
                  chart: { type: 'donut' },
                  labels: chartData.map((d) => d.med),
                  colors: ['#1ddec4', '#60a5fa', '#f59e0b', '#ef4444', '#8b5cf6'],
                  legend: { position: 'bottom' },
                  dataLabels: {
                    enabled: true,
                    formatter: (val) => `${val.toFixed(1)}%`
                  },
                  tooltip: {
                    y: {
                      formatter: (val) => `${val}%`
                    }
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '65%'
                      }
                    }
                  }
                }}
                series={chartData.map((d) => d.percentage)}
                type="donut"
                height="100%"
              />
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* PATIENT TABLE */}
          <Box mt={3}>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: 3,
                boxShadow: 'none',
                border: '1px solid #d3d5d9',
                maxHeight: 300,
                overflow: 'auto',
              }}
            >
              <Table stickyHeader>
                <TableHead sx={{ background: '#f0f2f8' }}>
                  <TableRow>
                    <TableCell sx={{ p: 1 }}>Name</TableCell>
                    <TableCell sx={{ p: 1 }}>Age</TableCell>
                    <TableCell sx={{ p: 1 }}>Disease</TableCell>
                    <TableCell sx={{ p: 1 }}>Medications</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredPatients.map((p, i) => (
                    <TableRow key={i}>
                      {/* NAME */}
                      <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.name}</TableCell>

                      {/* AGE */}
                      <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.age}</TableCell>

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
                              fontSize: '12px',
                              color: 'currentcolor'
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

                  {filteredPatients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No patients found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AgeVsMedication;
