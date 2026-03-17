// import React from "react";
// import Chart from "react-apexcharts";

// const PatientGrowthChart = () => {

//   const options = {
//     chart: {
//       id: "patients-growth",
//       toolbar: { show: false }
//     },
//     title: {
//     //   text: "Total Number of Patients Registered",
//       align: "left",
//       style: {
//         fontSize: "14px",
//         fontWeight: "600",
//         color: "#333"
//       }
//     },
//     xaxis: {
//       categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
//       title: {
//         text: "Months"
//       }
//     },
//     yaxis: {
//       title: {
//         text: "Number of Patients"
//       }
//     },
//     stroke: {
//       curve: "smooth"
//     },
//     colors: ["#1DDEC4"]
//   };

//   const series = [
//     {
//       name: "Patients",
//       data: [5, 12, 18, 25, 30, 45]
//     }
//   ];

//   return (
//     <div>
//   <h4 style={{ marginBottom: "20px", fontSize: "14px",
//         fontWeight: "600",
//         color: "#333",textAlign:'center' }}>
//      Total Number of Patients Registered
//   </h4>
//     <Chart
//       options={options}
//       series={series}
//       type="line"
//       height={300}
//     />
//     </div>
//   );
// };

// export default PatientGrowthChart;


// ==========================================

import React from "react";
import Chart from "react-apexcharts";
import {  Typography } from "@mui/material";

export default function PatientTrendChart() {

  const series = [
    {
      name: "Patients",
      data: [80, 95, 120, 110, 140, 160, 180, 200, 190, 220, 240, 260]
    }
  ];

  const options = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false }
    },

    stroke: {
      curve: "smooth",
      width: 3
    },

    colors: ["#3b82f6"],

    grid: {
      // borderColor: "#e5e7eb",
      strokeDashArray: 4
    },

    xaxis: {
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ]
    },

    tooltip: {
      theme: "light"
    }
  };

  return (
    <div >
      {/* <CardContent> */}

        <Typography fontWeight={600}>
          Patient Acquisition Trend
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
        >
          New vs Returning Patients - Last 12 Months
        </Typography>

        <Chart
          options={options}
          series={series}
          type="line"
          height={280}
        />

      {/* </CardContent> */}
    </div>
  );
}