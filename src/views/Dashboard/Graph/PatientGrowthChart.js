import React from "react";
import Chart from "react-apexcharts";
import { Typography } from "@mui/material";

export default function PatientTrendChart({ data }) {

  const allMonths = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // convert API array to object
  const apiMap = {};
  data?.forEach(item => {
    apiMap[item.month] = item.total;
  });

  // ensure all months exist
  const totals = allMonths.map(month => apiMap[month] || 0);

  const series = [
    {
      name: "Patients Gained",
      data: totals
    }
  ];

  const options = {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      redrawOnParentResize: true,
      redrawOnWindowResize: true
    },

    stroke: {
      curve: "smooth",
      width: 3
    },

    colors: ["#1DDEC4"],

    grid: {
      strokeDashArray: 4
    },

    markers: {
      size: 4,
      colors: ["#1DDEC4"],
      strokeWidth: 2
    },

    xaxis: {
      categories: allMonths,
      title: {
        text: "Month"
      }
    },

    yaxis: {
      title: {
        text: "Patients Gained"
      }
    },

    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val} patients`
      }
    }
  };

  return (
    <div>

      <Typography fontWeight={600} mb={0.5}>
        Patient Growth Over Time
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
      >
        Number of new patients gained each month
      </Typography>

      <Chart
        options={options}
        series={series}
        type="line"
        height={250}
      />

    </div>
  );
}