import React from "react";
import Chart from "react-apexcharts";
import { Typography } from "@mui/material";

const GenderChart = ({ data }) => {

  const filtered = data?.filter(g => g.gender !== null) || [];

  const labels = filtered.map(g => g.gender);
  const totals = filtered.map(g => g.total);

  const totalSum = totals.reduce((a, b) => a + b, 0);

  const series = totals.map(val => Math.round((val / totalSum) * 100));

  const options = {
    labels,

    colors: ["#1DDEC4", "#FF6B6B", "#6b7280"],

    chart: {
      toolbar: { show: false }
    },

    legend: {
      position: "bottom",
      fontSize: "13px"
    },

    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(0) + "%";
      },
      style: {
        fontSize: "12px",
        fontWeight: "600"
      }
    },

    tooltip: {
      y: {
        formatter: (val) => `${val}%`
      }
    },

    stroke: {
      colors: ["#fff"]
    }
  };

  return (
    <div>

      <Typography fontWeight={600} mb={0.5}>
        Percentage of Patients by Sex
      </Typography>

      <Chart
        options={options}
        series={series}
        type="pie"
        height={260}
      />

    </div>
  );
};

export default GenderChart;