import React from "react";
import Chart from "react-apexcharts";
import { Typography } from "@mui/material";

const AgeChart = ({ data }) => {

  const allCategories = [
    "0-10",
    "11-20",
    "21-30",
    "31-40",
    "41-50",
    "51+"
  ];

  // convert API array to object
  const apiMap = {};
  data?.forEach(item => {
    apiMap[item.age_group] = item.total;
  });

  // ensure all categories exist
  const totals = allCategories.map(cat => apiMap[cat] || 0);

  const totalSum = totals.reduce((a, b) => a + b, 0);

  const percentages = totals.map(val =>
    totalSum ? Math.round((val / totalSum) * 100) : 0
  );

  const series = [
    {
      name: "Patients %",
      data: percentages
    }
  ];

  const options = {
    chart: {
      toolbar: { show: false }
    },

    colors: ["#1DDEC4"],

    xaxis: {
      categories: allCategories,
      title: {
        text: "Age Groups"
      }
    },

    yaxis: {
      title: {
        text: "Percentage (%)"
      },
      labels: {
        formatter: val => `${val}%`
      }
    },

    dataLabels: {
      enabled: true,
      formatter: val => `${val}%`
    },

    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "45%"
      }
    },

    grid: {
      strokeDashArray: 4
    }
  };

  return (
    <div>
      <Typography fontWeight={600} mb={0.5}>
        Percentage of Patients by Age
      </Typography>

      <Chart
        options={options}
        series={series}
        type="bar"
        height={245}
      />
    </div>
  );
};

export default AgeChart;