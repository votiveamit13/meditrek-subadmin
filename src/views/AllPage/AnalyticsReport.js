import React from 'react';


// material-ui
import { Card, Grid, Typography } from '@mui/material';


// project import

import { gridSpacing } from 'config.js';
import Chart from 'react-apexcharts';

// ==============================|| SAMPLE PAGE ||============================== //

const UserAnaReport = () => {
  const seriesmonthly = [{
    name: 'Total Users',
    data: [0, 1, 2, 15, 12, 0, 0, 0, 0, 0, 0, 0],
  }];
  const seriesyearly = [{
    name: 'Total Users',
    data: [0, 1, 2, 15, 12, 0],
  }];

  // Monthly chart configuration
  const monthly = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yaxis: {
      title: {
        text: 'Users'
      }
    },

    fill: {
      colors: ['#1ddec4']
    },
    legend: {
      show: false
    },
    colors: ['#000000']
  };

  // Yearly chart configuration
  const yearly = {
    chart: {
      height: 380,
      type: 'bar',
      zoom: {
        enabled: false
      },
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true,
      }
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['2020', '2021', '2022', '2023', '2024', '2025']
    },
    yaxis: {
      title: {
        text: 'Users'
      }
    },

    fill: {
      colors: ['#1ddec4']
    },
    legend: {
      show: false
    },
    colors: ['#000000']
  };

  return (
    <>
      <Typography style={{ marginTop: '15px', marginBottom: '30px' }} variant="h4" gutterBottom>
        <span style={{ color: '#1ddec4' }}>Dashboard</span> / User List / View User
      </Typography>

        <Typography className="d-flex justify-content-center" style={{ marginTop: '30px', marginBottom: '30px', color: '#000' }} variant="h4" gutterBottom>
          2024 Monthly Analytical Reports of Customers
        </Typography>

        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12} >
            <Card sx={{ marginTop: '10px' }}>
              <div className="chart ">
                {/* ApexCharts component */}
                <Chart options={monthly} series={seriesmonthly} type="bar" height={350} />
              </div>
            </Card>
          </Grid>


          <Typography className="" style={{ margin: ' 40px auto 0px', color: '#000' }} variant="h4" gutterBottom>
            2024 Yearly Analytical Reports of Customers
          </Typography>

          <Grid item xs={12} md={12} >
            <Card sx={{ marginTop: '10px' }}>
              <div className="chart">
                {/* ApexCharts component */}
                <Chart options={yearly} series={seriesyearly} type="bar" height={350} />
              </div>
            </Card>
          </Grid>
        </Grid>
      
    </>
  );
};

export default UserAnaReport;
