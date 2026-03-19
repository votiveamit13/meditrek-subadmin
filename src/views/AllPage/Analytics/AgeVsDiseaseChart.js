import React, { useState, useMemo } from 'react';
import { Box, Card, Typography, Select, MenuItem } from '@mui/material';
import Chart from 'react-apexcharts';
import {
  Grid,
} from '@mui/material';

/* ---------- MOCK DATA ---------- */
const patientsData = [
  { age: 65, conditions: ['Hypertension', 'Diabetes'] },
  { age: 72, conditions: ['Hypertension', 'CAD'] },
  { age: 52, conditions: ['Diabetes'] },
  { age: 30, conditions: ['Asthma'] },
  { age: 45, conditions: ['Hypertension'] },
  { age: 25, conditions: ['Asthma', 'Allergy'] }
];

/* ---------- AGE GROUPS ---------- */
const ageGroups = {
  '0-18': (age) => age <= 18,
  '19-30': (age) => age >= 19 && age <= 30,
  '31-45': (age) => age >= 31 && age <= 45,
  '46-60': (age) => age >= 46 && age <= 60,
  '60+': (age) => age > 60
};

const AgeVsDiseaseChart = () => {
  const [selectedAge, setSelectedAge] = useState('60+');

  /* FILTER PATIENTS */
  const filteredPatients = useMemo(() => {
    return patientsData.filter((p) => ageGroups[selectedAge](p.age));
  }, [selectedAge]);

  /* CALCULATE % */
  const chartData = useMemo(() => {
    const map = {};

    filteredPatients.forEach((p) => {
      p.conditions.forEach((c) => {
        map[c] = (map[c] || 0) + 1;
      });
    });

    const total = filteredPatients.length;

    const result = Object.entries(map).map(([disease, count]) => ({
      disease,
      percentage: total ? Number(((count / total) * 100).toFixed(1)) : 0
    }));

    // sort descending
    return result.sort((a, b) => b.percentage - a.percentage);
  }, [filteredPatients]);

  /* APEX CONFIG */
  //   const chartOptions = {
  //     chart: {
  //       type: "bar",
  //       toolbar: { show: false },
  //     },
  //     xaxis: {
  //       categories: chartData.map((d) => d.disease),
  //     },
  //     yaxis: {
  //       title: {
  //         text: "% of Patients",
  //       },
  //     },
  //     dataLabels: {
  //       enabled: true,
  //     },
  //     colors: ["#1ddec4"], // your theme color
  //     plotOptions: {
  //       bar: {
  //         borderRadius: 6,
  //         columnWidth: "20%",
  //       },
  //     },
  //     tooltip: {
  //       y: {
  //         formatter: (val) => `${val}%`,
  //       },
  //     },
  //   };

  //   const series = [
  //     {
  //       name: "Disease %",
  //       data: chartData.map((d) => d.percentage),
  //     },
  //   ];

  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Age vs Disease
      </Typography>

      {/* SELECT */}
      {/* <Box mb={3}>
        <Typography fontSize={13} mb={1}>
          Select Age Group
        </Typography>

        <Select
          value={selectedAge}
          onChange={(e) => setSelectedAge(e.target.value)}
          size="small"
          sx={{
            minWidth: 200,
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
      </Box> */}

      {/* CHART */}
      {/* <Box sx={{ width: "100%", height: 320 }}>
        <Chart
          options={chartOptions}
          series={series}
          type="bar"
          height="100%"
        />
        
      </Box> */}
      {/* <Box sx={{ width: '100%', height: 320 }}>
        {chartData.length === 0 ? (
          <Typography>No data available</Typography>
        ) : (
          <Chart
            options={{
              chart: {
                type: 'donut'
              },
              labels: chartData.map((d) => d.disease),
              colors: ['#1ddec4', '#60a5fa', '#f59e0b', '#ef4444', '#8b5cf6'],
              legend: {
                position: 'bottom'
              },
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
                    size: '65%' // 🔥 donut style
                  }
                }
              }
            }}
            series={chartData.map((d) => d.percentage)}
            type="donut"
            height="100%"
          />
        )}
      </Box> */}

      <Grid container spacing={2} alignItems="flex-start">
  
  {/* LEFT → CHART */}
  <Grid item xs={12} md={9}>
    <Box sx={{ width: '100%', height: 320 }}>
      {chartData.length === 0 ? (
        <Typography>No data available</Typography>
      ) : (
        <Chart
          options={{
            chart: {
              type: 'donut'
            },
            labels: chartData.map((d) => d.disease),
            colors: ['#1ddec4', '#60a5fa', '#f59e0b', '#ef4444', '#8b5cf6'],
            legend: {
              position: 'bottom'
            },
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

  {/* RIGHT → DROPDOWN */}
  <Grid item xs={12} md={3}>
    <Box>
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
    </Box>
  </Grid>

</Grid>
    </Card>
  );
};

export default AgeVsDiseaseChart;
