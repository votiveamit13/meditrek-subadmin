import React from "react";
import Chart from "react-apexcharts";

const AgeChart = () => {
  const options = {
    chart: {
      toolbar: { show: false }
    },
    xaxis: {
      categories: ["0-10", "11-20", "21-30", "31-40"]
    },
    colors: ["#1DDEC4"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: {
        fontSize: "12px",
        colors: ["#fff"]
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%"
      }
    },
     title: {
    //   text: "Percentage of Patients by Age",
      align: "left",
      style: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#333"
      }
    },

  };

  const series = [
    {
      name: "Patients",
      data: [5, 12, 30, 18]
    }
  ];

  return (
   <div>
  <h4 style={{ marginBottom: "20px", fontSize: "14px",
        fontWeight: "600",
        color: "#333",textAlign:'center' }}>
    Percentage of Patients by Age
  </h4>
  <Chart options={options} series={series} type="bar" height={300} />
  </div>
  )
};

export default AgeChart;