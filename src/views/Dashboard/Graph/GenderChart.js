import React from "react";
import Chart from "react-apexcharts";

const GenderChart = () => {
  const options = {
    labels: ["Male", "Female", "Other"],
    colors: ["#1DDEC4", "#FF6B6B", "#6b7280"],
    legend: {
      position: "bottom"
    },
     title: {
    //   text: "Percentage of Patients by Gender",
      align: "left",
       marginTop: 20,
      style: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        
      }
    },
  };

  const series = [55, 35, 10]; // Male, Female, Other
  return <div>
  <h4 style={{ marginBottom: "20px", fontSize: "14px",
        fontWeight: "600",
        color: "#333",textAlign:'center' }}>
    Percentage of Patients by Gender
  </h4>

  <Chart options={options} series={series} type="pie" height={250} />
</div>
};

export default GenderChart;