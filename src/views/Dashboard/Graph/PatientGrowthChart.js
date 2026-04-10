import React from "react";
import Chart from "react-apexcharts";
import { Typography } from "@mui/material";
import CustomTable from "component/common/CustomTable";
import "./chart_css.css";
import { FadeLoader } from "react-spinners";

export default function PatientTrendChart({ data,
  availableYears,
  selectedYear,
  setSelectedYear,
  loading 
}) {

  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const apiMap = {};
  data?.forEach(item => {
    apiMap[item.month] = item.total;
  });

  const monthlyTotals = allMonths.map(month => apiMap[month] || 0);

  const cumulativeTotals = monthlyTotals.reduce((acc, curr, i) => {
    acc.push((acc[i - 1] || 0) + curr);
    return acc;
  }, []);

  const tableData = allMonths.map((month, index) => ({
    month,
    newPatients: monthlyTotals[index],
    totalPatients: cumulativeTotals[index]
  }));

  const columns = [
    { label: "Month", key: "month" },
    { label: "New Patients", key: "newPatients" },
    { label: "Total Patients", key: "totalPatients" }
  ];

  const series = [
    {
      name: "Patients Gained",
      data: monthlyTotals
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
    colors: ["#1DDEC4"],
    grid: {
      strokeDashArray: 4
    },
    markers: {
      size: 4
    },
    xaxis: {
      categories: allMonths,
      title: { text: "Month" }
    },
    yaxis: {
      title: { text: "Patients Gained" }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-between" style={{ position: "relative" }} >
      {loading ? (
  <div style={{
                  position: "absolute",
                   top: 100,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(255,255,255,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10,
      borderRadius: "16px"
                }}>
    <FadeLoader color="#36d7b7" />
  </div>
) : (
  <>
      <div className="w-100">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px"
        }}>
          <div>
            <Typography fontWeight={600}>
              Patient Growth Over Time
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Number of new patients gained each month
            </Typography>
          </div>
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "4px 10px",
                fontSize: "12px",
                outline: "none",
                cursor: "pointer",
                marginRight: "20px"
              }}
            >
              <option value="">All Years</option>
              {availableYears?.map(year => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
            </select>
          </div>
        </div>



        <Chart
          options={options}
          series={series}
          type="line"
          height={300}
        />
      </div>
      <div className="w-50">
        <Typography fontWeight={600} mb={0.5}>
          Total Patient Growth (Monthly Breakdown)
        </Typography>
        <div style={{ width: "100%", height: 355, display: "flex", flexDirection: "column" }} className="compact-table-wrapper">
          <CustomTable
            columns={columns}
            data={tableData}
            currentPage={1}
            rowsPerPage={12}
            onPageChange={() => { }}
            onRowsPerPageChange={() => { }}
            hideRowsPerPage={true}
            hidePagination={true}
          />
        </div>
      </div>
      </>
      )}
    </div>
  );
}