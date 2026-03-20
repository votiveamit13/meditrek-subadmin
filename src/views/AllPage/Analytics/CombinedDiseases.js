import React, { useState,useMemo } from 'react';
// import Chart from 'react-apexcharts';
import CancelIcon from '@mui/icons-material/Cancel';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
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
  Chip,
  TableContainer,
  Paper
} from '@mui/material';

/* ---------- MOCK DATA ---------- */
const patientsData = [
  {
    name: 'John Smith',
    age: 65,
    gender: 'Male',
    conditions: ['Hypertension', 'Diabetes']
  },
  {
    name: 'Michael Brown',
    age: 72,
    gender: 'Male',
    conditions: ['Hypertension', 'CAD']
  },
  {
    name: 'Lisa Taylor',
    age: 55,
    gender: 'Female',
    conditions: ['Diabetes']
  },
  {
    name: 'James Thomas',
    age: 70,
    gender: 'Male',
    conditions: ['Hypertension', 'Diabetes', 'COPD']
  }
];

/* ---------- COMPONENT ---------- */
const CombinedDiseases = () => {
  // const [selectedDisease, setSelectedDisease] = useState('Hypertension');
  const [selectedDiseases, setSelectedDiseases] = useState(['Hypertension']);

  /* ALL DISEASES */
  const allDiseases = useMemo(() => {
    const set = new Set();
    patientsData.forEach((p) => p.conditions.forEach((c) => set.add(c)));
    return [...set];
  }, []);

  /* FILTER PATIENTS (WITH COMBINED DISEASES) */
  // const filteredPatients = useMemo(() => {
  //   return patientsData
  //     .filter((p) => p.conditions.includes(selectedDisease))
  //     .map((p) => ({
  //       ...p,
  //       otherDiseases: p.conditions.filter((c) => c !== selectedDisease)
  //     }))
  //     .filter((p) => p.otherDiseases.length > 0); // 🔥 only combined
  // }, [selectedDisease]);

  const filteredPatients = useMemo(() => {
  if (selectedDiseases.length === 0) return [];

  return patientsData
    .filter((p) =>
      selectedDiseases.every((d) => p.conditions.includes(d))
    )
    .map((p) => ({
      ...p,
      otherDiseases: p.conditions.filter(
        (c) => !selectedDiseases.includes(c)
      )
    }))
    .filter((p) => p.otherDiseases.length > 0);
}, [selectedDiseases]);
  /* STATS */
  const total = filteredPatients.length;

  const cardStyle = {
    background: 'rgba(29, 222, 196, 0.15)',
    p: 2,
    borderRadius: 3,
    height: '100%', // 🔥 equal height fix
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
  };

  // const combinedStats = useMemo(() => {
  //   const map = {};

  //   filteredPatients.forEach((p) => {
  //     p.otherDiseases.forEach((d) => {
  //       map[d] = (map[d] || 0) + 1;
  //     });
  //   });

  //   const total = filteredPatients.length;

  //   return Object.entries(map)
  //     .map(([disease, count]) => ({
  //       disease,
  //       percentage: total ? Number(((count / total) * 100).toFixed(1)) : 0
  //     }))
  //     .sort((a, b) => b.percentage - a.percentage);
  // }, [filteredPatients]);

  const combinationStats = useMemo(() => {
    const map = {};

    patientsData.forEach((p) => {
      const key = [...p.conditions].sort().join(' + ');
      map[key] = (map[key] || 0) + 1;
    });

    // const total = patientsData.length;
    const total = filteredPatients.length;

    return Object.entries(map)
      .map(([combo, count]) => ({
        combo,
        count,
        percentage: ((count / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  }, []);
  return (
    <Card sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Combined Diseases Analysis
      </Typography>

      {/* FILTER */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={12} md={9} lg={9}>
          {/* STATS */}
          <Grid container spacing={2}>
            {/* STATS */}
            <Grid item xs={12} sm={6} md={3} lg={3}>
              <Box sx={cardStyle}>
                <Typography fontSize={12} fontWeight={500}>
                  Patients with Combined Diseases
                </Typography>
                <Typography fontSize={16} fontWeight="bold">
                  {total}
                </Typography>
              </Box>
            </Grid>
            {/* TOP COMBINATION */}
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={cardStyle}>
                <Typography fontSize={12} fontWeight={500}>
                  Top Combination
                </Typography>

                <Typography fontSize={11} fontWeight="600" mt={0.5}>
                  {combinationStats[0]?.combo || '-'}
                </Typography>

                <Typography fontWeight="bold" mt={1}>
                  {combinationStats[0]?.percentage || 0}%
                </Typography>
              </Box>
            </Grid>

            {/* 🔥 FULL LIST */}
            {/* <Box mt={2}>
    <Typography fontWeight="bold" mb={1}>
      Top Disease Combinations
    </Typography>

    <Box display="flex" flexDirection="column" gap={1}>
      {combinationStats.slice(0, 3).map((item, i) => (
        <Box
          key={i}
          display="flex"
          justifyContent="space-between"
          sx={{
            background: '#F8FAFC',
            p: 1,
            borderRadius: 2
          }}
        >
          <Typography fontSize={12}>{item.combo}</Typography>
          <Typography fontSize={12} fontWeight="bold">
            {item.percentage}%
          </Typography>
        </Box>
      ))}
    </Box>
  </Box> */}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Typography fontSize={13} mb={1}>
            Select Disease
          </Typography>

          {/* <Select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            size="small"
            fullWidth
            sx={{
              borderRadius: 2,
              background: '#F5F7FA',
              fontSize: '12px'
            }}
          >
            {allDiseases.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </Select> */}
          <Select
            multiple
            value={selectedDiseases}
            onChange={(e) => setSelectedDiseases(e.target.value)}
            size="small"
            displayEmpty
            renderValue={(selected) => {
              if (selected.length === 0) {
                return <span style={{ color: '#94a3b8' }}>Select diseases</span>;
              }

              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      size="small"
                      deleteIcon={<CancelIcon onMouseDown={(e) => e.stopPropagation()} />}
                      onDelete={(e) => {
                        e.stopPropagation();
                        setSelectedDiseases((prev) => prev.filter((item) => item !== value));
                      }}
                      sx={{
                        background: 'rgba(29, 222, 196, 0.15)',
                        color: '#1ddec4',
                        fontSize: '12px'
                      }}
                    />
                  ))}
                </Box>
              );
            }}
            sx={{
              width: '100%',
              borderRadius: 2,
              background: '#F5F7FA',
              fontSize: '12px'
            }}
          >
            {allDiseases.map((d) => (
              <MenuItem key={d} value={d}>
                <Checkbox checked={selectedDiseases.includes(d)} />
                <ListItemText primary={d} />
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      {/* TABLE */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 'none',
          overflowX: 'auto',
          border: '1px solid #d3d5d9'
        }}
      >
        <Table stickyHeader>
          <TableHead sx={{ width: '100%' }}>
            <TableRow>
              <TableCell sx={{ p: 1 }}>Name</TableCell>
              <TableCell sx={{ p: 1 }}>Age</TableCell>
              <TableCell sx={{ p: 1 }}>Gender</TableCell>
              <TableCell sx={{ p: 1 }}>Selected Disease</TableCell>
              <TableCell sx={{ p: 1 }}>Other Diseases</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPatients.map((p, i) => (
              <TableRow key={i}>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.name}</TableCell>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.age}</TableCell>
                <TableCell sx={{ p: 1, fontSize: '12px' }}>{p.gender}</TableCell>

                <TableCell sx={{ p: 1, fontSize: '12px' }}>
                  {/* <Chip
                    label={selectedDisease}
                    size="small"
                    sx={{
                      background: 'rgba(29, 222, 196, 0.15)',
                      color: '#1ddec4',
                      fontSize: '12px'
                    }}
                  /> */}
                  {selectedDiseases.map((d, idx) => (
                    <Chip
                      key={idx}
                      label={d}
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

                <TableCell sx={{ p: 1, fontSize: '12px' }}>
                  {p.otherDiseases.map((d, idx) => (
                    <Chip
                      key={idx}
                      label={d}
                      size="small"
                      sx={{
                        mr: 1,
                        mb: 1,
                        background: '#f1f5f9',
                        color: 'currentcolor',
                        fontSize: '12px'
                      }}
                    />
                  ))}
                </TableCell>
              </TableRow>
            ))}

            {filteredPatients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No combined diseases found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <Box>
        <Typography fontWeight="bold" mb={1}>
          Combined Diseases Distribution
        </Typography>
        <Box>
          <Box sx={{ height: 320 }}>
            {combinedStats.length === 0 ? (
              <Typography>No combined diseases found</Typography>
            ) : (
              <Chart
                options={{
                  chart: {
                    type: 'line',
                    toolbar: { show: false }
                  },
                  xaxis: {
                    categories: combinedStats.map((d) => d.disease)
                  },
                  yaxis: {
                    title: {
                      text: '% of Patients'
                    }
                  },
                  stroke: {
                    curve: 'smooth', // 🔥 smooth line
                    width: 3
                  },
                  markers: {
                    size: 5
                  },
                  dataLabels: {
                    enabled: true
                  },
                  colors: ['#1ddec4'],
                  tooltip: {
                    y: {
                      formatter: (val) => `${val}%`
                    }
                  },
                  grid: {
                    borderColor: '#e5e7eb'
                  }
                }}
                series={[
                  {
                    name: 'Co-occurrence %',
                    data: combinedStats.map((d) => d.percentage)
                  }
                ]}
                type="line"
                height="100%"
              />
            )}
          </Box>
        </Box>
      </Box> */}
    </Card>
  );
};

export default CombinedDiseases;

// import React, { useState, useMemo } from "react";
// import Chart from "react-apexcharts";
// import {
//   Box,
//   Card,
//   Typography,
//   Select,
//   MenuItem,
//   Grid,
//   Checkbox,
//   ListItemText,
//   FormControlLabel,
// } from "@mui/material";

// /* ---------- MOCK DATA ---------- */
// const patientsData = [
//   { name: "John Smith", conditions: ["Hypertension", "Diabetes"] },
//   { name: "Michael Brown", conditions: ["Hypertension", "CAD"] },
//   { name: "Lisa Taylor", conditions: ["Diabetes"] },
//   { name: "James Thomas", conditions: ["Hypertension", "Diabetes", "COPD"] },
// ];

// const CombinedDiseases = () => {
//   const [selectedDiseases, setSelectedDiseases] = useState([]);
//   const [includeOthers, setIncludeOthers] = useState(true);

//   /* ALL DISEASES */
//   const allDiseases = useMemo(() => {
//     const set = new Set();
//     patientsData.forEach((p) =>
//       p.conditions.forEach((c) => set.add(c))
//     );
//     return [...set];
//   }, []);

//   /* FILTER PATIENTS */
//   const filteredPatients = useMemo(() => {
//     if (selectedDiseases.length === 0) return [];

//     return patientsData.filter((p) => {
//       const hasAll = selectedDiseases.every((d) =>
//         p.conditions.includes(d)
//       );

//       if (!hasAll) return false;

//       if (!includeOthers) {
//         return p.conditions.length === selectedDiseases.length;
//       }

//       return true;
//     });
//   }, [selectedDiseases, includeOthers]);

//   /* CO-OCCURRENCE STATS */
//   const combinedStats = useMemo(() => {
//     const map = {};

//     filteredPatients.forEach((p) => {
//       p.conditions.forEach((d) => {
//         if (!selectedDiseases.includes(d)) {
//           map[d] = (map[d] || 0) + 1;
//         }
//       });
//     });

//     const total = filteredPatients.length;

//     return Object.entries(map)
//       .map(([disease, count]) => ({
//         disease,
//         percentage: total
//           ? Number(((count / total) * 100).toFixed(1))
//           : 0,
//       }))
//       .sort((a, b) => b.percentage - a.percentage);
//   }, [filteredPatients, selectedDiseases]);

//   /* TOP COMBINATIONS */
//   const combinationStats = useMemo(() => {
//     const map = {};

//     patientsData.forEach((p) => {
//       const key = [...p.conditions].sort().join(" + ");
//       map[key] = (map[key] || 0) + 1;
//     });

//     const total = patientsData.length;

//     return Object.entries(map)
//       .map(([combo, count]) => ({
//         combo,
//         count,
//         percentage: ((count / total) * 100).toFixed(1),
//       }))
//       .sort((a, b) => b.count - a.count);
//   }, []);

//   return (
//     <Card sx={{ p: 3, borderRadius: 4 }}>
//       <Typography variant="h6" fontWeight="bold" mb={2}>
//         Combined Diseases Analysis
//       </Typography>

//       {/* FILTERS */}
//       <Grid container spacing={2} mb={3}>
//         <Grid item xs={12} md={9}>
//           <Typography fontWeight="bold" mb={1}>
//             Top Disease Combinations
//           </Typography>

//           <Box display="flex" flexDirection="column" gap={1}>
//             {combinationStats.slice(0, 3).map((item, i) => (
//               <Box
//                 key={i}
//                 display="flex"
//                 justifyContent="space-between"
//                 sx={{
//                   background: "#F8FAFC",
//                   p: 1,
//                   borderRadius: 2,
//                 }}
//               >
//                 <Typography fontSize={12}>{item.combo}</Typography>
//                 <Typography fontSize={12} fontWeight="bold">
//                   {item.percentage}%
//                 </Typography>
//               </Box>
//             ))}
//           </Box>
//         </Grid>

//         {/* SELECT */}
//         <Grid item xs={12} md={3}>
//           <Typography fontSize={13} mb={1}>
//             Select Diseases
//           </Typography>

//           <Select
//             multiple
//             value={selectedDiseases}
//             onChange={(e) => setSelectedDiseases(e.target.value)}
//             fullWidth
//             size="small"
//             renderValue={(selected) =>
//               selected.length === 0
//                 ? "Select diseases"
//                 : selected.join(", ")
//             }
//           >
//             {allDiseases.map((d) => (
//               <MenuItem key={d} value={d}>
//                 <Checkbox checked={selectedDiseases.includes(d)} />
//                 <ListItemText primary={d} />
//               </MenuItem>
//             ))}
//           </Select>

//           <FormControlLabel
//             sx={{ mt: 1 }}
//             control={
//               <Checkbox
//                 checked={includeOthers}
//                 onChange={(e) =>
//                   setIncludeOthers(e.target.checked)
//                 }
//               />
//             }
//             label="Include other diseases"
//           />
//         </Grid>
//       </Grid>

//       {/* CHART */}
//       <Box>
//         <Typography fontWeight="bold" mb={1}>
//           Co-occurring Diseases (%)
//         </Typography>

//         <Box sx={{ height: 320 }}>
//           {combinedStats.length === 0 ? (
//             <Typography>No data available</Typography>
//           ) : (
//             <Chart
//               options={{
//                 chart: { type: "bar", toolbar: { show: false } },
//                 xaxis: {
//                   categories: combinedStats.map((d) => d.disease),
//                 },
//                 dataLabels: { enabled: true },
//                 colors: ["#1ddec4"],
//                 plotOptions: {
//                   bar: { borderRadius: 6, columnWidth: "40%" },
//                 },
//                 tooltip: {
//                   y: { formatter: (val) => `${val}%` },
//                 },
//               }}
//               series={[
//                 {
//                   name: "Co-occurrence %",
//                   data: combinedStats.map((d) => d.percentage),
//                 },
//               ]}
//               type="bar"
//               height="100%"
//             />
//           )}
//         </Box>
//       </Box>
//     </Card>
//   );
// };

// export default CombinedDiseases;
