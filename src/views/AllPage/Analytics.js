import { useState, useMemo, useEffect } from "react";
import TagSearch from "./Analytics/TagSearch";
import AgeRangeFilter from "./Analytics/AgeRangeFilter";
import GenderFilter from "./Analytics/GenderFilter";
import ExportButton from "component/common/ExportButton";
import { fetchDemographicDetails, fetchDemographics, fetchDiseaseDashboard, fetchDiseaseMedicationStats, fetchDiseaseMedicationSummary, fetchDiseases, fetchMedicines, fetchDiseaseMedicationDetails, fetchMedicationFull, fetchMedicationDiseaseDashboard, fetchMedicationReportedHealth, fetchCustomPatientTable, fetchSymptoms, symptomCache } from "services/analyticsAPI";
import CustomPagination from "component/common/Pagination";
import { CircularProgress } from "@mui/material";

const ALL_PATIENTS = [
  {
    id: 1, name: "John Smith", age: 65, gender: "Male", conditions: ["Hypertension", "Diabetes"], meds: ["Lisinopril", "Metformin"], reportedHealth: [
      { drug: "Lisinopril", symptom: "Headache" },
      { drug: "Metformin", symptom: "Fatigue" }
    ]
  },
  {
    id: 2, name: "Michael Brown", age: 72, gender: "Male", conditions: ["Hypertension", "CAD", "Hyperlipidemia"], meds: ["Amlodipine", "Atorvastatin", "Metoprolol"], reportedHealth: [
      { drug: "Losartan", symptom: "Fatigue" },
      { drug: "Sertraline", symptom: "Insomnia" }
    ]
  },
  {
    id: 3, name: "Jennifer Martinez", age: 52, gender: "Female", conditions: ["Hypertension", "Depression"], meds: ["Losartan", "Sertraline"], reportedHealth: [
      { drug: "Losartan", symptom: "Fatigue" },
      { drug: "Sertraline", symptom: "Insomnia" }
    ]
  },
  {
    id: 4, name: "Lisa Taylor", age: 55, gender: "Female", conditions: ["Diabetes", "Hypertension"], meds: ["Metformin", "Amlodipine"], reportedHealth: [
      { drug: "Metformin", symptom: "Nausea" },
      { drug: "Amlodipine", symptom: "Fatigue" }
    ]
  },
  {
    id: 5, name: "James Thomas", age: 70, gender: "Male", conditions: ["Hypertension", "Diabetes", "COPD"], meds: ["Metoprolol", "Lisinopril", "Metformin", "Insulin"], reportedHealth: [
      { drug: "Metoprolol", symptom: "Shortness of Breath" },
      { drug: "Metformin", symptom: "Fatigue" },
      { drug: "Insulin", symptom: "Cough" }
    ]
  },
  {
    id: 6, name: "Emma Wilson", age: 28, gender: "Female", conditions: ["Asthma"], meds: ["Salbutamol"], reportedHealth: [
      { drug: "Salbutamol", symptom: "Wheezing" },
      { drug: "Salbutamol", symptom: "Cough" }
    ]
  },
  {
    id: 7, name: "Chris Evans", age: 25, gender: "Male", conditions: ["Asthma", "Allergy"], meds: ["Cetirizine", "Salbutamol"], reportedHealth: [
      { drug: "Cetirizine", symptom: "Runny Nose" },
      { drug: "Salbutamol", symptom: "Cough" }
    ]
  },
  {
    id: 8, name: "Alex Morgan", age: 34, gender: "Other", conditions: ["Anxiety"], meds: ["Escitalopram"], reportedHealth: [
      { drug: "Escitalopram", symptom: "Insomnia" },
      { drug: "Escitalopram", symptom: "Palpitations" }
    ]
  },
  {
    id: 9, name: "Sarah Johnson", age: 48, gender: "Female", conditions: ["Hypertension", "Thyroid"], meds: ["Amlodipine", "Levothyroxine"], reportedHealth: [
      { drug: "Amlodipine", symptom: "Fatigue" },
      { drug: "Levothyroxine", symptom: "Weight Gain" }
    ]
  },
  {
    id: 10, name: "Robert Davis", age: 61, gender: "Male", conditions: ["Diabetes", "CAD"], meds: ["Metformin", "Atorvastatin", "Aspirin"], reportedHealth: [
      { drug: "Atorvastatin", symptom: "Chest Pain" },
      { drug: "Metformin", symptom: "Fatigue" }
    ]
  },
];

const AGE_GROUPS = {
  "0-18": a => a >= 0 && a <= 18,
  "19-30": a => a >= 19 && a <= 30,
  "31-44": a => a >= 31 && a <= 44,
  "45-64": a => a >= 45 && a <= 64,
  "65-74": a => a >= 65 && a <= 74,
  "75-84": a => a >= 75 && a <= 84,
  "85+": a => a >= 85,
};

// const getAgeGroupLabel = (age) => {
//   if (typeof age === "string") return age;

//   if (age <= 18) return "0-18";
//   if (age <= 30) return "19-30";
//   if (age <= 44) return "31-44";
//   if (age <= 64) return "45-64";
//   if (age <= 74) return "65-74";
//   if (age <= 84) return "75-84";
//   return "85+";
// };

const normalizeGender = (g) => {
  if (!g) return "Not Specified";

  const val = String(g).toLowerCase();

  if (val === "male") return "Male";
  if (val === "female") return "Female";
  if (val === "other") return "Other";

  return "Not Specified";
};

const ACCENT = "#1ddec4";
const ACCENT_BG = "rgba(29,222,196,0.13)";
const GCOLORS = { Male: ACCENT, Female: "#60a5fa", Other: "#8b5cf6", "Not Specified": "#94a3b8" };
// const TOTAL = ALL_PATIENTS.length;

const S = {
  wrap: { display: "flex", fontFamily: "'DM Sans',sans-serif", minHeight: "100vh", background: "#f4f6fb" },
  nav: { width: 230, minWidth: 210, background: "#fff", borderRight: "1px solid #eaecf2", display: "flex", flexDirection: "column", flexShrink: 0 },
  navHead: { padding: "22px 20px 14px", borderBottom: "1px solid #f0f2f8" },
  navTitle: { fontSize: 15, fontWeight: 800, color: "#1a202c", letterSpacing: -.3 },
  navSub: { fontSize: 11, color: "#a0aec0", marginTop: 2 },
  navGroup: { padding: "14px 16px 4px 18px", fontSize: 10, fontWeight: 700, letterSpacing: 1.6, color: "#c4cad8", textTransform: "uppercase" },
  navItem: a => ({
    margin: "1px 10px", padding: "9px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12.5,
    fontWeight: a ? 600 : 400, background: a ? ACCENT_BG : "transparent", color: a ? ACCENT : "#4a5568",
    border: a ? `1px solid rgba(29,222,196,0.25)` : "1px solid transparent",
    transition: "all .15s", display: "flex", alignItems: "center", gap: 9,
  }),
  main: { flex: 1, padding: "28px 28px 40px", overflowX: "hidden", minWidth: 0 },
  pageHead: { marginBottom: 20 },
  pageTitle: { fontSize: 18, fontWeight: 800, color: "#1a202c", margin: 0 },
  pageSub: { fontSize: 13, color: "#64748b", marginTop: 4 },

  /* filters */
  filterBar: { background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #eaecf2", marginBottom: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
  filterRow: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" },
  filterLabel: { fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: 1, textTransform: "uppercase", marginBottom: 5, display: "block" },

  /* stat row */
  statRow: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 },
  statCard: { background: "#fff", borderRadius: 12, padding: "14px 18px", border: `1px solid #eaecf2`, minWidth: 130, boxShadow: "0 1px 6px rgba(0,0,0,0.04)" },
  statVal: { fontSize: 24, fontWeight: 800, color: ACCENT, lineHeight: 1.1 },
  statLbl: { fontSize: 11, color: "#94a3b8", marginBottom: 4, fontWeight: 500 },
  statSub: { fontSize: 11, color: "#b0b8c9", marginTop: 3 },

  /* cards */
  card: { background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #eaecf2", boxShadow: "0 1px 8px rgba(0,0,0,0.04)", marginBottom: 18 },
  cardTitle: { fontSize: 13, fontWeight: 700, color: "#1a202c", marginBottom: 14, marginTop: 0, display: "flex", alignItems: "center", justifyContent: "space-between" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 },

  /* table */
  tWrap: { overflowX: "hidden", borderRadius: 10, border: "1px solid #eaecf2" },
  th: { padding: "10px 13px", fontSize: 11, fontWeight: 700, color: "#6b7280", background: "#f8f9fc", borderBottom: "1px solid #eaecf2", wordBreak: "break-word", letterSpacing: .3 },
  td: { padding: "10px 13px", fontSize: 12, color: "#374151", borderBottom: "1px solid #f4f6fb", wordBreak: "break-word", whiteSpace: "normal" },

  /* chips */
  chip: t => ({
    display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 9px", borderRadius: 999,
    fontSize: 11, fontWeight: 500, background: t ? ACCENT_BG : "#f1f5f9", color: t ? ACCENT : "#374151",
    border: t ? `1px solid rgba(29,222,196,0.3)` : "1px solid #e5e7eb", margin: "2px 3px 2px 0",
    lineHeight: "15px"
  }),
  badge: c => ({
    display: "inline-block", whiteSpace: "nowrap", padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600,
    background: c === "Male" ? ACCENT_BG : c === "Female" ? "rgba(96,165,250,0.15)" : "rgba(139,92,246,0.15)",
    color: c === "Male" ? ACCENT : c === "Female" ? "#60a5fa" : "#8b5cf6",
  }),

  /* bars */
  barWrap: { display: "flex", flexDirection: "column", gap: 9 },
  barRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr 70px",
    alignItems: "center",
    gap: 10
  },
  barLabel: { fontSize: 12, color: "#374151", fontWeight: 500, wordBreak: "break-word", },
  barTrack: {
    width: "100%",
    background: "#f1f5f9",
    borderRadius: 999,
    height: 7,
    overflow: "hidden"
  },
  barFill: (pct, col) => ({ height: "100%", width: `${Math.min(pct, 100)}%`, background: col || ACCENT, borderRadius: 999, transition: "width .5s" }),
  barVal: { fontSize: 11, fontWeight: 700, color: ACCENT, textAlign: "right" },

  /* expand */
  expandBtn: { border: "none", cursor: "pointer", fontSize: 11, color: ACCENT, fontWeight: 600, padding: "4px 10px", borderRadius: 7, background: ACCENT_BG },
  expandPanel: { marginTop: 14, borderTop: "1px solid #eaecf2", paddingTop: 14 },

  /* misc */
  noData: { textAlign: "center", padding: "28px 0", color: "#b0b8c9", fontSize: 13 },
  input: { padding: "7px 11px", borderRadius: 8, border: "1px solid #dde1ec", fontSize: 12, outline: "none", background: "#fff", width: "100%", boxSizing: "border-box" },
  checkLabel: active => ({ display: "flex", alignItems: "center", gap: 7, fontSize: 12, cursor: "pointer", color: active ? ACCENT : "#374151", fontWeight: active ? 600 : 400 }),
};

function pct(n, d) { return d === 0 ? "0.0" : ((n / d) * 100).toFixed(1); }

// function buildAgeDist(pts, denom) {
//   const map = {};
//   pts.forEach(p => { const g = Object.keys(AGE_GROUPS).find(k => AGE_GROUPS[k](p.age)) || "Other"; map[g] = (map[g] || 0) + 1; });
//   return Object.entries(map).map(([label, value]) => ({ label, value, pct: pct(value, denom) }));
// }
// function buildGenderDist(pts, denom) {
//   const map = {};
//   pts.forEach(p => { map[p.gender] = (map[p.gender] || 0) + 1; });
//   return Object.entries(map).map(([label, value]) => ({ label, value, pct: pct(value, denom) })).sort((a, b) => b.value - a.value);
// }

function Chip({ label, teal }) { return <span style={S.chip(teal)}>{label}</span>; }
function DChips({ arr }) { return <>{arr.map((c, i) => <Chip key={i} label={c} teal={false} />)}</>; }
function MChips({ arr }) { return <>{arr.map((m, i) => <Chip key={i} label={m} teal={true} />)}</>; }

function StatCard({ label, value, sub, accent, highlightSub }) {
  return (
    <div style={S.statCard}>
      <div style={S.statLbl}>{label}</div>
      <div style={{ ...S.statVal, color: accent || ACCENT }}>{value}</div>
      {sub && (
        <div
          style={{
            ...S.statSub,
            fontSize: highlightSub ? 14 : 11,
            fontWeight: highlightSub ? 600 : 400,
            color: highlightSub ? "#f59e0b" : "#b0b8c9",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function HBar({ label, value, total, pctVal, color }) {
  const p = pctVal !== undefined ? parseFloat(pctVal) : (total > 0 ? (value / total) * 100 : 0);
  return (
    <div style={S.barRow}>
      <span style={S.barLabel} title={label}>{label}</span>
      <div style={S.barTrack}><div style={S.barFill(p, color)} /></div>
      <span style={{ ...S.barVal, color: color || ACCENT }}>{value} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({p.toFixed(1)}%)</span></span>
    </div>
  );
}

function DataTable({ cols, rows, empty = "No data found" }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const onSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc"
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return rows;

    return [...rows].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortConfig]);
  return (
    <div style={S.tWrap}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th
                key={c.key}
                style={{
                  ...S.th,
                  textAlign: c.align || "left",
                  cursor: c.sortable ? "pointer" : "default"
                }}
                onClick={() => c.sortable && onSort(c.key)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {c.label}

                  {c.sortable && (
                    <span className="sort-icons">
                      <span
                        className={`arrow up ${sortConfig?.key === c.key &&
                          sortConfig.direction === "asc"
                          ? "active"
                          : ""
                          }`}
                      />
                      <span
                        className={`arrow down ${sortConfig?.key === c.key &&
                          sortConfig.direction === "desc"
                          ? "active"
                          : ""
                          }`}
                      />
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0
            ? <tr><td colSpan={cols.length} style={S.noData}>{empty}</td></tr>
            : sortedRows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafbfd" }}>
                {cols.map(c => (
                  <td key={c.key} style={{ ...S.td, ...(c.style || {}) }}>
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

function ExpandPanel({ patients, showSymptoms = false, useAPI = false, fetchFn, fetchParams = {}, count = 0, }) {
  const [open, setOpen] = useState(false);
  const [apiPatients, setApiPatients] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && useAPI) {
      loadFromAPI();
    }
  }, [page, rowsPerPage, fetchParams]);

  const loadFromAPI = async () => {
    if (!fetchFn) return;

    setLoading(true);

    const res = await fetchFn({
      ...fetchParams,
      page,
      limit: rowsPerPage
    });

    const formatted = (res.patients || []).map(p => ({
      ...p,
      conditions: p.diseases
        ? p.diseases
          .replace(/\n/g, ",")
          .split("},").map(d => {
            const match = d.match(/name:\s*([^,}]+)/);
            return match ? match[1].trim() : "";
          }).filter(Boolean)
        : [],
      meds: Array.isArray(p.medications)
        ? p.medications.map(m => m.name).filter(Boolean)
        : [],

      reportedHealth: p.symptoms
        ? p.symptoms.split(",").map(s => ({
          symptom: s.trim()
        }))
        : []
    }));
    console.log(res.patients);
    setApiPatients(formatted);
    setTotal(res.total || count || res.matched_patients || 0);
    setLoading(false);
  };

  const handleToggle = () => {
    if (!open && useAPI) {
      loadFromAPI();
    }
    setOpen(!open);
  };

  const rows = useAPI ? apiPatients : patients;

  if (!useAPI && (!patients || patients.length === 0)) return null;

  return (
    <div>
      <button style={S.expandBtn} onClick={handleToggle}>
        {open ? "▲ Collapse patients" : `▼ Expand — view ${useAPI ? count : patients.length} patients`}
      </button>
      {open && (
        <div style={S.expandPanel}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              {useAPI && (
                <div style={{ marginBottom: 10, fontWeight: 600 }}>
                  Total: {total} patients
                </div>
              )}
              <DataTable
                cols={[
                  { key: "name", label: "Patient Name", sortable: true, },
                  { key: "age", label: "Age", sortable: true, },
                  { key: "gender", label: "Gender", sortable: true, render: r => <span style={S.badge(r.gender)}>{r.gender}</span> },
                  { key: "conditions", label: "Diseases", sortable: true, render: r => <DChips arr={r.conditions} /> },
                  { key: "meds", label: "Medications", sortable: true, render: r => <MChips arr={r.meds} /> },
                  ...(showSymptoms ? [
                    {
                      key: "reportedHealth",
                      label: "Symptoms",
                      render: r => (
                        <DChips arr={r.reportedHealth.map(x => x.symptom)} />
                      )
                    },
                    {
                      key: "medication_start_date",
                      label: "Medication Start Date",
                      sortable: true,
                      render: r => <span style={{ fontSize: 12, color: "#374151" }}>{r.medication_start_date || "—"}</span>
                    },
                    {
                      key: "reaction_date",
                      label: "Reaction Date",
                      sortable: true,
                      render: r => <span style={{ fontSize: 12, color: "#374151" }}>{r.reaction_date || "—"}</span>
                    }
                  ] : [])
                ]}
                rows={rows || []}
              />
              <CustomPagination
                count={useAPI ? total : rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(val) => {
                  setRowsPerPage(val);
                  setPage(1);
                }}
                hideRowsPerPage={true}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

const genderMap = {
  Male: 1,
  Female: 2,
  Other: 3,
  "Not Specified": 0,
};


const LoadingPlaceholder = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
    <CircularProgress size={24} />
  </div>
);

function Demographics() {
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const doctor_id = sessionStorage.getItem("doctor_id");
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchDemographics({ doctor_id });
        setData(res.list);
        setTotal(res.total);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const pool = useMemo(() => {
    return data.filter(item => {
      if (ageGroup !== "All" && item.age_group !== ageGroup) return false;
      if (gender !== "All" && item.gender !== gender) return false;
      return true;
    });
  }, [data, ageGroup, gender]);

  const patientsInView = useMemo(() => {
    return pool.reduce((sum, item) => sum + item.count, 0);
  }, [pool]);

  const ageGroupCount = useMemo(() => {
    const map = {
      "0-18": 0,
      "19-30": 0,
      "31-44": 0,
      "45-64": 0,
      "65-74": 0,
      "75-84": 0,
      "85+": 0,
    };

    pool.forEach(item => {
      if (map[item.age_group] !== undefined) {
        map[item.age_group] += item.count;
      }
    });

    return Object.entries(map).map(([label, value]) => ({
      label,
      value,
      pct: pct(value, total),
    }));
  }, [pool, total]);

  // const ageDist = useMemo(() => {
  //   const map = {
  //     "0-18": 0,
  //     "19-30": 0,
  //     "31-44": 0,
  //     "45-64": 0,
  //     "65-74": 0,
  //     "75-84": 0,
  //     "85+": 0,
  //   };

  //   pool.forEach(item => {
  //     if (map[item.age_group] !== undefined) {
  //       map[item.age_group] += item.count;
  //     }
  //   });

  //   return Object.entries(map).map(([label, value]) => ({
  //     label,
  //     value,
  //     pct: pct(value, total),
  //   }));
  // }, [pool, total]);
  const ageDist = useMemo(() => {
    const map = {};

    pool.forEach(item => {
      if (!map[item.age_group]) {
        map[item.age_group] = 0;
      }
      map[item.age_group] += item.count;
    });

    return Object.entries(map).map(([label, value]) => ({
      label,
      value,
      pct: pct(value, total),
    }));
  }, [pool, total]);

  // const genderDist = useMemo(() => {
  //   const genders = ["Male", "Female", "Other", "Not Specified"];
  //   const map = {
  //     Male: 0,
  //     Female: 0,
  //     Other: 0,
  //     "Not Specified": 0,
  //   };

  //   pool.forEach(item => {
  //     if (map[item.gender] !== undefined) {
  //       map[item.gender] += item.count;
  //     }
  //   });

  //   return genders.map(g => ({
  //     label: g,
  //     value: map[g],
  //     pct: pct(map[g], total),
  //   }));
  // }, [pool, total]);
  const genderDist = useMemo(() => {
    const map = {};

    pool.forEach(item => {
      if (!map[item.gender]) {
        map[item.gender] = 0;
      }
      map[item.gender] += item.count;
    });

    return Object.entries(map).map(([label, value]) => ({
      label,
      value,
      pct: pct(value, total),
    }));
  }, [pool, total]);

  // const crossData = useMemo(() => {
  //   const genders = ["Male", "Female", "Other", "Not Specified"];

  //   const map = {};

  //   Object.keys(AGE_GROUPS).forEach(age => {
  //     map[age] = {
  //       age,
  //       Male: 0,
  //       Female: 0,
  //       Other: 0,
  //       "Not Specified": 0,
  //       total: 0,
  //     };
  //   });

  //   pool.forEach(item => {
  //     if (!map[item.age_group]) return;

  //     map[item.age_group][item.gender] += item.count;
  //     map[item.age_group].total += item.count;
  //   });

  //   return Object.values(map).map(row => {
  //     const newRow = { ...row };

  //     genders.forEach(g => {
  //       newRow[g + "_pct"] = pct(row[g], total);
  //     });

  //     newRow.total_pct = pct(row.total, total);

  //     return newRow;
  //   });
  // }, [pool, total]);
  const crossData = useMemo(() => {
    const map = {};

    pool.forEach(item => {
      if (!map[item.age_group]) {
        map[item.age_group] = {
          age: item.age_group,
          Male: 0,
          Female: 0,
          Other: 0,
          "Not Specified": 0,
          total: 0,
        };
      }

      map[item.age_group][item.gender] += item.count;
      map[item.age_group].total += item.count;
    });

    return Object.values(map).map(row => {
      const newRow = { ...row };

      ["Male", "Female", "Other", "Not Specified"].forEach(g => {
        newRow[g + "_pct"] = pct(row[g], total);
      });

      newRow.total_pct = pct(row.total, total);

      return newRow;
    });
  }, [pool, total]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Demographics</h2>
        <p style={S.pageSub}>Age group × Sex distribution across your patient population</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 1, minWidth: 180 }}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup} /></div>
          <div style={{ flex: 1, minWidth: 180 }}><GenderFilter value={gender} onChange={setGender} /></div>
        </div>
      </div>

      <div style={S.statRow}>
        {loading ? (
          <>
            <div style={S.statCard}>
              <div style={S.statLbl}>Patients in View</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>

            <div style={S.statCard}>
              <div style={S.statLbl}>Total Patients</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>

            <div style={S.statCard}>
              <div style={S.statLbl}>Age Groups</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
          </>
        ) : (
          <>
            <StatCard label="Patients in View" value={patientsInView} sub={`${pct(patientsInView, total)}% of all patients`} highlightSub />
            <StatCard label="Total Patients" value={total} />
            <StatCard label="Age Groups" value={ageGroupCount.length} />
          </>
        )}
      </div>

      <div style={S.grid2}>
        {/* Age dist */}
        <div style={S.card}>
          <p style={S.cardTitle}>Age Group Distribution <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>% of all {total} patients</span></p>
          {loading ? (
            <LoadingPlaceholder />
          ) : (
            <div style={S.barWrap}>
              {ageDist.map((d, i) => <HBar key={i} label={d.label} value={d.value} total={total} pctVal={d.pct} />)}
            </div>
          )}
        </div>
        {/* Gender dist */}
        <div style={S.card}>
          <p style={S.cardTitle}>Sex Distribution <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>% of all {total} patients</span></p>
          {loading ? (
            <LoadingPlaceholder />
          ) : (
            <div style={S.barWrap}>
              {genderDist.map((d, i) => <HBar key={i} label={d.label} value={d.value} total={total} pctVal={d.pct} color={GCOLORS[d.label]} />)}
            </div>
          )}
        </div>
      </div>

      {/* Cross table */}
      <div style={S.card}>
        <p style={S.cardTitle}>Age × Sex Cross-table</p>
        {loading ? (
          <LoadingPlaceholder />
        ) : (
          <DataTable
            cols={[
              { key: "age", label: "Age Group", sortable: true, },
              { key: "Male", label: "Male", sortable: true, render: r => <span style={{ fontWeight: 600, color: ACCENT }}>{r.Male} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({r.Male_pct}%)</span></span> },
              { key: "Female", label: "Female", sortable: true, render: r => <span style={{ fontWeight: 600, color: "#60a5fa" }}>{r.Female} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({r.Female_pct}%)</span></span> },
              { key: "Other", label: "Other", sortable: true, render: r => <span style={{ fontWeight: 600, color: "#8b5cf6" }}>{r.Other} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({r.Other_pct}%)</span></span> },
              {
                key: "Not Specified",
                label: "Not Specified",
                sortable: true,
                render: r => (
                  <span style={{ fontWeight: 600, color: "#94a3b8" }}>
                    {r["Not Specified"]}
                    <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                      ({r["Not Specified_pct"]}%)
                    </span>
                  </span>
                )
              },
              { key: "total", label: "Total", sortable: true, render: r => <span style={{ fontWeight: 700 }}>{r.total} <span style={{ color: "#94a3b8", fontWeight: 400 }}>({r.total_pct}%)</span></span> },
            ]}
            rows={crossData}
          />
        )}
        <div style={{ marginTop: 14 }}>
          <ExpandPanel
            useAPI={true}
            fetchFn={fetchDemographicDetails}
            fetchParams={{
              doctor_id,
              age_group: ageGroup === "All" ? undefined : ageGroup,
              gender:
                gender === "All"
                  ? undefined
                  : genderMap[gender],
            }}
            count={patientsInView}
          />
        </div>
      </div>
    </div>
  );
}

function DiseaseDemo({ diseases }) {
  const allDiseases =
    diseases?.length > 0
      ? diseases.map(d => d.label)
      : [...new Set(ALL_PATIENTS.flatMap(p => p.conditions))].sort();
  const [selDiseases, setSelDiseases] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [combinedOnly, setCombined] = useState(false);
  const [singleOnly, setSingleOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingAllData, setLoadingAllData] = useState(false);

  const toggleD = d => setSelDiseases(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const [apiData, setApiData] = useState(null);
  const [allPatientsData, setAllPatientsData] = useState(null);

  const doctor_id = sessionStorage.getItem("doctor_id");

  useEffect(() => {
    const loadAllData = async () => {
      setLoadingAllData(true);
      try {
        const res = await fetchDiseaseDashboard({
          doctor_id,
          disease: selDiseases.length ? selDiseases : undefined,
          age_group: ageGroup !== "All" ? ageGroup : undefined,
          gender: gender !== "All" ? genderMap[gender] : undefined,
        });
        setAllPatientsData(res);
      } catch (error) {
        console.error("Error loading all patients data:", error);
      } finally {
        setLoadingAllData(false);
      }
    };
    loadAllData();
  }, [doctor_id, selDiseases, ageGroup, gender]);

  useEffect(() => {
    const loadPaginatedData = async () => {
      setLoading(true);
      try {
        const res = await fetchDiseaseDashboard({
          doctor_id,
          disease: selDiseases.length ? selDiseases : undefined,
          age_group: ageGroup !== "All" ? ageGroup : undefined,
          gender: gender !== "All" ? genderMap[gender] : undefined,
          page: page,
          limit: rowsPerPage
        });
        setApiData(res);
      } catch (error) {
        console.error("Error loading paginated data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPaginatedData();
  }, [doctor_id, selDiseases, ageGroup, gender, page, rowsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [selDiseases, ageGroup, gender, combinedOnly, singleOnly]);

  const extractDiseaseNames = (str) => {
    if (!str) return ["No Disease"];

    const matches = [...str.matchAll(/name:\s*([^,}]+)/g)];
    return matches.map(m => m[1].trim());
  };

  const ALL_PATIENTS_DATA = useMemo(() => {
    if (!allPatientsData?.patients) return [];

    return allPatientsData.patients.map((p, i) => ({
      id: p.user_id || i + 1,
      name: p.name,
      age: p.age,
      gender: p.gender || "Not Specified",
      conditions: extractDiseaseNames(p.diseases),
      meds: Array.isArray(p.medications)
        ? p.medications.map(m => m.name).filter(Boolean)
        : [],
      reportedHealth: []
    }));
  }, [allPatientsData]);

  const filteredPatients = useMemo(() => {
    let filtered = ALL_PATIENTS_DATA;

    if (selDiseases.length > 0) {

      if (selDiseases.length === 1 && singleOnly) {
        filtered = filtered.filter(p =>
          p.conditions.length === 1 &&
          p.conditions.includes(selDiseases[0])
        );
      }

      else if (combinedOnly && selDiseases.length >= 2) {
        filtered = filtered.filter(p => {
          const hasAll = selDiseases.every(d => p.conditions.includes(d));
          const exactMatch = p.conditions.length === selDiseases.length;
          return hasAll && exactMatch;
        });
      }

      else {
        filtered = filtered.filter(p =>
          selDiseases.some(d => p.conditions.includes(d))
        );
      }
    }

    return filtered;
  }, [ALL_PATIENTS_DATA, selDiseases, combinedOnly, singleOnly]);

  const API_PATIENTS = useMemo(() => {
    if (!apiData?.patients) return [];

    return apiData.patients.map((p, i) => ({
      id: p.user_id || i + 1,
      name: p.name,
      age: p.age,
      gender: p.gender || "Not Specified",
      conditions: extractDiseaseNames(p.diseases),
      meds: Array.isArray(p.medications)
        ? p.medications.map(m => m.name).filter(Boolean)
        : [],
      reportedHealth: []
    }));
  }, [apiData]);

  const basePool = useMemo(() => ALL_PATIENTS_DATA.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [ALL_PATIENTS_DATA, ageGroup, gender]);

  const TOTAL_API = allPatientsData?.total_patients || ALL_PATIENTS_DATA.length;

  const matchedCount =
    (singleOnly || combinedOnly)
      ? filteredPatients.length
      : allPatientsData?.matched_patients ?? 0;

  const diseaseDist = useMemo(() => {
    if (singleOnly || combinedOnly) {
      const map = {};

      filteredPatients.forEach(p => {
        if (!p.conditions.length) {
          map["No Disease"] = (map["No Disease"] || 0) + 1;
        } else {
          p.conditions.forEach(d => {
            map[d] = (map[d] || 0) + 1;
          });
        }
      });

      return Object.entries(map).map(([label, value]) => ({
        label,
        value,
        pct: pct(value, filteredPatients.length),
      }));
    }

    return (allPatientsData?.disease_distribution || []).map(d => {
      const names = extractDiseaseNames(d.name);

      return {
        label: names.length ? names.join(", ") : "No Disease",
        value: d.count,
        pct: d.percentage
      };
    });

  }, [filteredPatients, allPatientsData, singleOnly, combinedOnly]);

  // const ageDist = useMemo(() => {
  //   const source =
  //     (singleOnly || combinedOnly)
  //       ? filteredPatients
  //       : ALL_PATIENTS_DATA;

  //   const map = {
  //     "0-18": 0,
  //     "19-30": 0,
  //     "31-45": 0,
  //     "46+": 0,
  //   };

  //   source.forEach(p => {
  //     const group = Object.keys(AGE_GROUPS).find(k => AGE_GROUPS[k](p.age));
  //     if (group) map[group]++;
  //   });

  //   return Object.entries(map).map(([age_group, count]) => ({
  //     age_group,
  //     count,
  //     percentage: pct(count, source.length),
  //   }));
  // }, [filteredPatients, ALL_PATIENTS_DATA, singleOnly, combinedOnly]);
  const ageDist = useMemo(() => {
    const source =
      (singleOnly || combinedOnly)
        ? filteredPatients
        : ALL_PATIENTS_DATA;

    const map = {};

    source.forEach(p => {
      const group = Object.keys(AGE_GROUPS).find(k => AGE_GROUPS[k](p.age));
      if (!group) return;

      if (!map[group]) {
        map[group] = 0;
      }

      map[group]++;
    });

    return Object.entries(map).map(([age_group, count]) => ({
      age_group,
      count,
      percentage: pct(count, source.length),
    }));
  }, [filteredPatients, ALL_PATIENTS_DATA, singleOnly, combinedOnly]);

  // const genderDist = useMemo(() => {
  //   const source =
  //     (singleOnly || combinedOnly)
  //       ? filteredPatients
  //       : ALL_PATIENTS_DATA;

  //   const base = {
  //     Male: 0,
  //     Female: 0,
  //     Other: 0,
  //     "Not Specified": 0,
  //   };

  //   source.forEach(p => {
  //     if (base[p.gender] !== undefined) {
  //       base[p.gender]++;
  //     } else {
  //       base["Not Specified"]++;
  //     }
  //   });

  //   return Object.entries(base).map(([gender, count]) => ({
  //     gender,
  //     count,
  //     percentage: pct(count, source.length),
  //   }));
  // }, [filteredPatients, ALL_PATIENTS_DATA, singleOnly, combinedOnly]);
  const genderDist = useMemo(() => {
    const source =
      (singleOnly || combinedOnly)
        ? filteredPatients
        : ALL_PATIENTS_DATA;

    const map = {};

    source.forEach(p => {
      const g = p.gender || "Not Specified";

      if (!map[g]) {
        map[g] = 0;
      }

      map[g]++;
    });

    return Object.entries(map).map(([gender, count]) => ({
      gender,
      count,
      percentage: pct(count, source.length),
    }));
  }, [filteredPatients, ALL_PATIENTS_DATA, singleOnly, combinedOnly]);


  useEffect(() => {
    if (selDiseases.length !== 1 && singleOnly) {
      setSingleOnly(false);
    }
    if (selDiseases.length < 2 && combinedOnly) {
      setCombined(false);
    }
  }, [selDiseases]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Disease / Demographics</h2>
        <p style={S.pageSub}>Disease prevalence by age and sex</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}><TagSearch label="Disease" all={allDiseases} selected={selDiseases} onToggle={toggleD} searchPlaceholder="Search diseases…" /></div>
          <div style={{ flex: 1, minWidth: 160 }}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><GenderFilter value={gender} onChange={setGender} /></div>
        </div>
        {selDiseases.length >= 2 && (
          <label style={{ ...S.checkLabel(combinedOnly) }}>
            <input type="checkbox" checked={combinedOnly} onChange={e => setCombined(e.target.checked)} style={{ accentColor: ACCENT }} />
            Combined diseases only (patients with ALL selected diseases)
          </label>
        )}
        {selDiseases.length === 1 && (
          <label style={S.checkLabel(singleOnly)}>
            <input
              type="checkbox"
              checked={singleOnly}
              onChange={e => setSingleOnly(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            Only patients with this disease
          </label>
        )}
      </div>

      <div style={S.statRow}>
        {loadingAllData ? (
          <>
            <div style={S.statCard}>
              <div style={S.statLbl}>Matched Patients</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
            <div style={S.statCard}>
              <div style={S.statLbl}>Group Size</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
            <div style={S.statCard}>
              <div style={S.statLbl}>Diseases Selected</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
          </>
        ) : (
          <>
            <StatCard
              label="Matched Patients"
              value={matchedCount}
              sub={`${pct(matchedCount, TOTAL_API)}% of group`}
              highlightSub
            />
            <StatCard
              label="Group Size"
              value={TOTAL_API}
              sub={`${pct(basePool.length, TOTAL_API)}% of all patients`}
              highlightSub
            />
            <StatCard
              label="Diseases Selected"
              value={selDiseases.length || "All"}
            />
          </>
        )}
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>Disease Distribution <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>% of {matchedCount} in group</span></p>
          {loadingAllData ? (
            <LoadingPlaceholder />
          ) : (
            <div style={S.barWrap}>
              {diseaseDist.map((d, i) => <HBar key={i} label={d.label} value={d.value} total={matchedCount} pctVal={d.pct} />)}
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.card}>
            <p style={S.cardTitle}>Age Breakdown <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>% of matched</span></p>
            {loadingAllData ? (
              <LoadingPlaceholder />
            ) : (
              ageDist.length > 0 ? (
                <div style={S.barWrap}>
                  {ageDist.map((d, i) => <HBar key={i} label={d.age_group} value={d.count} total={matchedCount} pctVal={d.percentage} />)}
                </div>
              ) : (
                <div style={S.noData}>No age data available</div>
              )
            )}
          </div>
          <div style={S.card}>
            <p style={S.cardTitle}>Sex Breakdown <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>% of matched</span></p>
            {loadingAllData ? (
              <LoadingPlaceholder />
            ) : (
              genderDist.length > 0 ? (
                <div style={S.barWrap}>
                  {genderDist.map((d, i) => <HBar key={i} label={d.gender} value={d.count} total={matchedCount} pctVal={d.percentage} color={GCOLORS[d.gender]} />)}
                </div>
              ) : (
                <div style={S.noData}>No gender data available</div>
              )
            )}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>Patient Table</p>
        {loading ? (
          <LoadingPlaceholder />
        ) : (
          <>
            <DataTable
              cols={[
                { key: "name", label: "Patient Name", sortable: true, },
                { key: "age", label: "Age", sortable: true, },
                { key: "gender", label: "Gender", sortable: true, render: r => <span style={S.badge(r.gender)}>{r.gender}</span> },
                { key: "conditions", label: "Diseases", sortable: true, render: r => <DChips arr={r.conditions} /> },
                { key: "meds", label: "Medications", sortable: true, render: r => <MChips arr={r.meds} /> },
              ]}
              rows={
                (singleOnly || combinedOnly)
                  ? filteredPatients
                  : API_PATIENTS
              }
              empty="No patients match the selected filters"
            />
            <div style={{ marginTop: 14 }}>
              <CustomPagination
                count={TOTAL_API}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(val) => {
                  setRowsPerPage(val);
                  setPage(1);
                }}
                hideRowsPerPage={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DiseaseMedication({ diseases, medicines }) {
  const allDiseases =
    diseases?.length > 0
      ? diseases.map(d => d.label)
      : [...new Set(ALL_PATIENTS.flatMap(p => p.conditions))].sort();
  const [selDiseases, setSelDiseases] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [combinedOnly, setCombined] = useState(false);
  const [excludeMeds, setExcludeMeds] = useState([]);
  const [singleOnly, setSingleOnly] = useState(false);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  // const [totalPatients, setTotalPatients] = useState(0);
  // const [matchedPatients, setMatchedPatients] = useState(0);
  const [loadingTable, setLoadingTable] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const doctor_id = sessionStorage.getItem("doctor_id");

  const toggleD = d => setSelDiseases(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleExclude = m => setExcludeMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);

      const res = await fetchDiseaseMedicationStats({
        doctor_id,
        disease: selDiseases,
        medication: excludeMeds,
        age_group: ageGroup !== "All" ? ageGroup : undefined,
        gender: gender !== "All" ? genderMap[gender] : undefined,
        singleOnly,
        combinedOnly,
      });

      setStats(res);
      setLoadingStats(false);
    };

    loadStats();
  }, [doctor_id, selDiseases, ageGroup, gender, excludeMeds, singleOnly, combinedOnly]);

  useEffect(() => {
    const loadSummary = async () => {
      setLoadingTable(true);

      const res = await fetchDiseaseMedicationSummary({
        doctor_id,
        disease: selDiseases,
        age_group: ageGroup !== "All" ? ageGroup : undefined,
        gender: gender !== "All" ? genderMap[gender] : undefined,
        page,
        limit: rowsPerPage,
        singleOnly,
        combinedOnly,
      });

      if (res) {
        setSummaryData(res.summary || []);
        // setTotalPatients(res.total_patients || 0);
        // setMatchedPatients(res.matched_patients || 0);
      }

      setLoadingTable(false);
    };

    loadSummary();
  }, [doctor_id, selDiseases, ageGroup, gender, page, rowsPerPage, singleOnly, combinedOnly]);

  // const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
  //   if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
  //   if (gender !== "All" && p.gender !== gender) return false;
  //   return true;
  // }), [ageGroup, gender]);

  // const patients = useMemo(() => {
  //   let r = basePool;

  //   if (selDiseases.length > 0) {

  //     // ✅ SINGLE EXACT
  //     if (selDiseases.length === 1 && singleOnly) {
  //       r = r.filter(p =>
  //         p.conditions.length === 1 &&
  //         p.conditions.includes(selDiseases[0])
  //       );
  //     }

  //     // ✅ MULTI EXACT
  //     else if (combinedOnly && selDiseases.length >= 2) {
  //       r = r.filter(p => {
  //         const hasAll = selDiseases.every(d => p.conditions.includes(d));
  //         const exactCount = p.conditions.length === selDiseases.length;
  //         return hasAll && exactCount;
  //       });
  //     }

  //     // ✅ DEFAULT
  //     else {
  //       r = r.filter(p =>
  //         selDiseases.some(d => p.conditions.includes(d))
  //       );
  //     }
  //   }

  //   return r;
  // }, [basePool, selDiseases, combinedOnly, singleOnly]);

  useEffect(() => {
    setSingleOnly(false);
    setCombined(false);
  }, [selDiseases]);

  /* drug distribution among matched patients */
  // const medDist = useMemo(() => {
  //   const map = {};
  //   patients.forEach(p => p.meds.forEach(m => {
  //     if (!excludeMeds.includes(m)) map[m] = (map[m] || 0) + 1;
  //   }));
  //   return Object.entries(map).map(([label, value]) => ({
  //     label, value,
  //     pctOfMatched: pct(value, patients.length),
  //     pctOfAll: pct(value, TOTAL),
  //   })).sort((a, b) => b.value - a.value);
  // }, [patients, excludeMeds]);

  const allMedsInResult =
    medicines?.length > 0
      ? medicines.map(m => m.label)
      : [...new Set(ALL_PATIENTS.flatMap(p => p.meds))].sort();

  const filteredSummaryData = useMemo(() => {
    if (!summaryData) return [];

    return summaryData.filter(
      item => !excludeMeds.includes(item.medicine_name)
    );
  }, [summaryData, excludeMeds]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Disease / Medication</h2>
        <p style={S.pageSub}>Select one or more diseases to see which drugs are prescribed - with counts and percentages</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}><TagSearch label="Disease(s)" all={allDiseases} selected={selDiseases} onToggle={toggleD} searchPlaceholder="Add diseases…" /></div>
          <div style={{ flex: 1, minWidth: 160 }}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><GenderFilter value={gender} onChange={setGender} /></div>
        </div>
        {selDiseases.length >= 2 && (
          <label style={{ ...S.checkLabel(combinedOnly) }}>
            <input type="checkbox" checked={combinedOnly} onChange={e => setCombined(e.target.checked)} style={{ accentColor: ACCENT }} />
            Combined — patients must have ALL selected diseases
          </label>
        )}
        {selDiseases.length === 1 && (
          <label style={S.checkLabel(singleOnly)}>
            <input
              type="checkbox"
              checked={singleOnly}
              onChange={e => setSingleOnly(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            Only patients with this disease
          </label>
        )}
        {allMedsInResult.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <span style={{ ...S.filterLabel, display: "block", marginBottom: 6 }}>Exclude medications from table</span>
            <div>
              <TagSearch
                all={allMedsInResult}
                selected={excludeMeds}
                onToggle={toggleExclude}
                searchPlaceholder="Search medications to exclude…"
              />
            </div>
          </div>
        )}
      </div>

      <div style={S.statRow}>
        {loadingStats ? (
          <>
            <div style={S.statCard}>
              <div style={S.statLbl}>Matched Patients</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>

            <div style={S.statCard}>
              <div style={S.statLbl}>Total Patients</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>

            <div style={S.statCard}>
              <div style={S.statLbl}>Top Drug</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
          </>
        ) : (
          <>
            <StatCard label="Matched Patients" value={stats?.matched_patients || 0} sub={`${stats?.percentage} of all patients`} highlightSub />
            <StatCard label="Total Patients" value={stats?.total_patients || 0} />
            <StatCard label="Top Drug" value={stats?.top_drug || "—"} />
          </>
        )}
      </div>

      {/* <div style={S.card}>
        <p style={S.cardTitle}>
          Drug Distribution

          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }} className="d-flex align-items-center justfiy-content-between">among {stats?.matched_patients || 0} matched patients
            <ExportButton
              data={filteredSummaryData}
              fileName="Drug_Distribution"
              mapFn={(r, i) => ({
                "S. No.": i + 1,
                "Medication": r.medicine_name,
                "Patients Count": r.patient_count,
                "% of Matched": r.percent_matched,
                "% of All Patients": r.percent_total,
              })}
            /></span>
        </p>
        {loadingTable ? (
          <LoadingPlaceholder />
        ) : summaryData.length === 0 ? (
          <div style={S.noData}>No data found</div>
        ) : (
          <DataTable
            cols={[
              {
                key: "medicine_name",
                label: "Medication",
                sortable: true,
                render: r => <Chip label={r.medicine_name} teal={true} />
              },
              {
                key: "patient_count",
                label: "Patients",
                sortable: true,
                render: r => (
                  <span style={{ fontWeight: 700, color: ACCENT }}>
                    {r.patient_count}
                  </span>
                )
              },
              {
                key: "percent_matched",
                label: "% of Matched",
                sortable: true,
                render: r => <span>{r.percent_matched}%</span>
              },
              {
                key: "percent_total",
                label: "% of All Patients",
                sortable: true,
                render: r => <span style={{ color: "#94a3b8" }}>{r.percent_total}%</span>
              },
              {
                key: "bar",
                label: "",
                render: r => (
                  <div style={{ ...S.barTrack, minWidth: 80 }}>
                    <div style={S.barFill(parseFloat(r.percent_matched))} />
                  </div>
                )
              }
            ]}
            rows={filteredSummaryData}
          />
        )}
        <div style={{ marginTop: 14 }}>
          <CustomPagination
            count={filteredSummaryData.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
            onRowsPerPageChange={(val) => {
              setRowsPerPage(val);
              setPage(1);
            }}
            hideRowsPerPage={true}
          />
        </div>
        <div style={{ marginTop: 14 }}>
          <ExpandPanel
            useAPI={true}
            fetchFn={fetchDiseaseMedicationDetails}
            fetchParams={{
              doctor_id,
              age_group: ageGroup === "All" ? undefined : ageGroup,
              gender: gender === "All" ? undefined : genderMap[gender],
              diseases: selDiseases,
              singleOnly,
              combinedOnly
            }}
            count={stats?.matched_patients || 0}
          />
        </div>
      </div> */}

<div style={S.card}>
  <p style={S.cardTitle}>
    Medication Distribution
    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8, display: "flex", alignItems: "end" }}>
      among {stats?.matched_patients || 0} matched patients
      <ExportButton
        data={filteredSummaryData}
        fileName="Medication_Distribution"
        mapFn={(r, i) => ({
          "S. No.": i + 1,
          "Medication": r.medicine_name,
          "Patients Count": r.patient_count,
          "% of Matched": r.percent_matched,
          "% of All Patients": r.percent_total,
        })}
      />
    </span>
  </p>
  {loadingTable ? (
    <LoadingPlaceholder />
  ) : summaryData.length === 0 ? (
    <div style={S.noData}>No data found</div>
  ) : (
    <DataTable
      cols={[
        {
          key: "medicine_name",
          label: "Medication",
          sortable: true,
          render: r => <Chip label={r.medicine_name} teal={true} />
        },
        {
          key: "patient_count",
          label: "Patients",
          sortable: true,
          render: r => (
            <span style={{ fontWeight: 700, color: ACCENT }}>
              {r.patient_count}
            </span>
          )
        },
        {
          key: "percent_matched",
          label: "% of Matched",
          sortable: true,
          render: r => <span>{r.percent_matched}%</span>
        },
        {
          key: "percent_total",
          label: "% of All Patients",
          sortable: true,
          render: r => <span style={{ color: "#94a3b8" }}>{r.percent_total}%</span>
        },
        {
          key: "bar",
          label: "",
          render: r => (
            <div style={{ ...S.barTrack, minWidth: 80 }}>
              <div style={S.barFill(parseFloat(r.percent_matched))} />
            </div>
          )
        }
      ]}
      rows={filteredSummaryData}
    />
  )}
  <div style={{ marginTop: 14 }}>
    <CustomPagination
      count={filteredSummaryData.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={(newPage) => setPage(newPage)}
      onRowsPerPageChange={(val) => {
        setRowsPerPage(val);
        setPage(1);
      }}
      hideRowsPerPage={true}
    />
  </div>
  <div style={{ marginTop: 14 }}>
    <ExpandPanel
      useAPI={true}
      fetchFn={fetchDiseaseMedicationDetails}
      fetchParams={{
        doctor_id,
        age_group: ageGroup === "All" ? undefined : ageGroup,
        gender: gender === "All" ? undefined : genderMap[gender],
        diseases: selDiseases,
        singleOnly,
        combinedOnly
      }}
      count={stats?.matched_patients || 0}
    />
  </div>
</div>
    </div>
  );
}

function MedicationDemo({ medicines }) {
  const allMeds =
    medicines?.length > 0
      ? medicines.map(m => m.label)
      : [...new Set(ALL_PATIENTS.flatMap(p => p.meds))].sort();
  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [summaryPage, setSummaryPage] = useState(1);
  const [summaryRowsPerPage, setSummaryRowsPerPage] = useState(10);
  const [patientsData, setPatientsData] = useState(null);
  const [summaryData, setSummaryData] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [combinedOnly, setCombined] = useState(false);
  const [singleOnly, setSingleOnly] = useState(false);

  const doctor_id = sessionStorage.getItem("doctor_id");

  const toggleM = m => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  useEffect(() => {
    const loadSummary = async () => {
      setSummaryLoading(true);
      const res = await fetchMedicationFull({
        doctor_id,
        medication: selMeds,
        age_group: ageGroup !== "All" ? ageGroup : undefined,
        gender: gender !== "All" ? genderMap[gender] : undefined,
        summary_page: summaryPage,
        summary_limit: summaryRowsPerPage,
        singleOnly,
        combinedOnly,
      });

      if (res) setSummaryData(res.summary || []);
      setSummaryLoading(false);
    };

    loadSummary();
  }, [doctor_id, selMeds, ageGroup, gender, summaryPage, summaryRowsPerPage, singleOnly, combinedOnly]);

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);

      const res = await fetchMedicationFull({
        doctor_id,
        medication: selMeds,
        age_group: ageGroup !== "All" ? ageGroup : undefined,
        gender: gender !== "All" ? genderMap[gender] : undefined,
        patient_page: page,
        patient_limit: rowsPerPage,
        singleOnly,
        combinedOnly,
      });

      if (res) setPatientsData(res);
      setLoading(false);
    };

    loadPatients();
  }, [doctor_id, selMeds, ageGroup, gender, page, rowsPerPage, singleOnly, combinedOnly]);

  // const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
  //   if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
  //   if (gender !== "All" && p.gender !== gender) return false;
  //   return true;
  // }), [ageGroup, gender]);

  const patients = useMemo(() => {
    if (!patientsData?.details) return [];

    return patientsData.details.map(p => ({
      id: p.user_id,
      name: p.name,
      age: p.age,
      gender: p.gender || "Not Specified",

      conditions: Array.isArray(p.diseases)
        ? p.diseases.map(d => d.name || "").filter(Boolean)
        : [],

      meds: Array.isArray(p.medications)
        ? p.medications.map(m => m.name).filter(Boolean)
        : [],
    }));
  }, [patientsData]);

  const totalPatients = patientsData?.total_patients || 0;
  const matchedPatients = patientsData?.matched_patients || 0;
  const percentage = patientsData?.percentage || "0.00%";
  const totalMedications = patientsData?.selected_medication_count || 0;

  const medDist = useMemo(() => {
    if (!summaryData) return [];

    return summaryData.map(item => ({
      label: item.medicine_name,
      value: item.patient_count,
      pct: parseFloat(item.percentage),
    }));
  }, [summaryData]);

  const demographics = patientsData?.demographics || [];
  // const ageDist = useMemo(() => {
  //   if (!demographics.length) return [];

  //   const map = {
  //     "0-18": 0,
  //     "19-30": 0,
  //     "31-45": 0,
  //     "46+": 0,
  //   };

  //   demographics.forEach(d => {
  //     const label = getAgeGroupLabel(d.age_group);
  //     if (map[label] !== undefined) {
  //       map[label] += d.count;
  //     }
  //   });

  //   return Object.entries(map).map(([label, value]) => ({
  //     label,
  //     value,
  //     pct: ((value / matchedPatients) * 100).toFixed(1),
  //   }));
  // }, [demographics, matchedPatients]);
  const ageDist = useMemo(() => {
    if (!demographics.length) return [];

    const map = {};

    demographics.forEach(d => {
      map[d.age_group] = (map[d.age_group] || 0) + d.count;
    });

    return Object.entries(map).map(([label, value]) => ({
      label,
      value,
      pct: ((value / matchedPatients) * 100).toFixed(1),
    }));
  }, [demographics, matchedPatients]);
  // const genderDist = useMemo(() => {
  //   if (!demographics.length) return [];

  //   const map = {
  //     Male: 0,
  //     Female: 0,
  //     Other: 0,
  //     "Not Specified": 0,
  //   };

  //   demographics.forEach(d => {
  //     const g = normalizeGender(d.gender);
  //     map[g] += d.count;
  //   });

  //   return Object.entries(map).map(([label, value]) => ({
  //     label,
  //     value,
  //     pct: ((value / matchedPatients) * 100).toFixed(1),
  //   }));
  // }, [demographics, matchedPatients]);
  const genderDist = useMemo(() => {
    if (!demographics.length) return [];

    const map = {};

    demographics.forEach(d => {
      const g = normalizeGender(d.gender);

      map[g] = (map[g] || 0) + d.count;
    });

    return Object.entries(map).map(([label, value]) => ({
      label,
      value,
      pct: ((value / matchedPatients) * 100).toFixed(1),
    }));
  }, [demographics, matchedPatients]);

  useEffect(() => {
    setPage(1);
    setSummaryPage(1);
  }, [selMeds, ageGroup, gender]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Medication / Demographics</h2>
        <p style={S.pageSub}>Medication usage breakdown by age and sex</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}><TagSearch label="Medication" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Search medications…" /></div>
          <div style={{ flex: 1, minWidth: 160 }}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><GenderFilter value={gender} onChange={setGender} /></div>
        </div>
        {selMeds.length >= 2 && (
          <label style={{ ...S.checkLabel(combinedOnly) }}>
            <input
              type="checkbox"
              checked={combinedOnly}
              onChange={(e) => {
                const checked = e.target.checked;
                setCombined(checked);
                if (checked) setSingleOnly(false);
              }}
              style={{ accentColor: ACCENT }}
            />
            Combined — patients must have ALL selected medications
          </label>
        )}

        {selMeds.length === 1 && (
          <label style={S.checkLabel(singleOnly)}>
            <input
              type="checkbox"
              checked={singleOnly}
              onChange={(e) => {
                const checked = e.target.checked;
                setSingleOnly(checked);
                if (checked) setCombined(false);
              }}
              style={{ accentColor: ACCENT }}
            />
            Only patients with this medication
          </label>
        )}
      </div>

      <div style={S.statRow}>
        {loading ? (
          <>
            <div style={S.statCard}>
              <div style={S.statLbl}>Matched Patients</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>

            <div style={S.statCard}>
              <div style={S.statLbl}>Total Patients</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>

            <div style={S.statCard}>
              <div style={S.statLbl}>Selected Medications</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
          </>
        ) : (
          <>
            <StatCard label="Matched Patients" value={matchedPatients} sub={`${percentage} of all patients`} highlightSub />
            <StatCard label="Total Patients" value={totalPatients} />
            <StatCard label="Selected Medications" value={totalMedications} />
          </>
        )}
      </div>

      <div style={S.grid2}>
        {/* <div style={S.card}>
          <p style={S.cardTitle}>Medication Distribution <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>% of {matchedPatients} matched patients</span></p>
          {summaryLoading ? (
            <LoadingPlaceholder />
          ) : (
            <div style={S.barWrap}>{medDist.map((d, i) => <HBar key={i} label={d.label} value={d.value} total={matchedPatients} pctVal={d.pct} />)}</div>
          )}
          <CustomPagination
            count={patientsData?.summary_total || 0}
            page={summaryPage}
            rowsPerPage={summaryRowsPerPage}
            onPageChange={(newPage) => setSummaryPage(newPage)}
            onRowsPerPageChange={(val) => {
              setSummaryRowsPerPage(val);
              setSummaryPage(1);
            }}
            hideRowsPerPage={true}
          />
        </div> */}


<div style={S.card}>
  <p style={S.cardTitle}>
    Drug Distribution
    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8, display: "flex",
alignItems: "end" }}>
      among {matchedPatients} matched patients
      <ExportButton
        data={medDist}
        fileName="Drug_Distribution"
        mapFn={(r, i) => ({
          "S. No.": i + 1,
          "Drug": r.label,
          "Patients Count": r.value,
          "% of Matched": r.pct,
        })}
      />
    </span>
  </p>
  {summaryLoading ? (
    <LoadingPlaceholder />
  ) : (
    <div style={S.barWrap}>
      {medDist.map((d, i) => (
        <HBar 
          key={i} 
          label={d.label} 
          value={d.value} 
          total={matchedPatients} 
          pctVal={d.pct} 
        />
      ))}
    </div>
  )}
  <CustomPagination
    count={patientsData?.summary_total || 0}
    page={summaryPage}
    rowsPerPage={summaryRowsPerPage}
    onPageChange={(newPage) => setSummaryPage(newPage)}
    onRowsPerPageChange={(val) => {
      setSummaryRowsPerPage(val);
      setSummaryPage(1);
    }}
    hideRowsPerPage={true}
  />
</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {ageDist.length > 0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>Age Breakdown <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>% of matched</span></p>
              {loading ? (
                <LoadingPlaceholder />
              ) : (
                <div style={S.barWrap}>{ageDist.map((d, i) => <HBar key={i} label={d.label} value={d.value} total={patients.length} pctVal={d.pct} />)}</div>
              )}
            </div>
          )}
          {genderDist.length > 0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>Sex Breakdown <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>% of matched</span></p>
              {loading ? (
                <LoadingPlaceholder />
              ) : (
                <div style={S.barWrap}>{genderDist.map((d, i) => <HBar key={i} label={d.label} value={d.value} total={patients.length} pctVal={d.pct} color={GCOLORS[d.label]} />)}</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>Patient Table</p>
        {loading ? (
          <LoadingPlaceholder />
        ) : (
          <DataTable
            cols={[
              { key: "name", label: "Patient Name", sortable: true, },
              { key: "age", label: "Age", sortable: true, },
              { key: "gender", label: "Gender", sortable: true, render: r => <span style={S.badge(r.gender)}>{r.gender}</span> },
              { key: "conditions", label: "Diseases", sortable: true, render: r => <DChips arr={r.conditions} /> },
              { key: "meds", label: "Medications", sortable: true, render: r => <MChips arr={r.meds} /> },
            ]}
            rows={patients}
            empty="No patients match the selected filters"
          />
        )}
        <CustomPagination
          count={patientsData?.patient_total || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(val) => {
            setRowsPerPage(val);
            setPage(1);
          }}
          hideRowsPerPage={true}
        />
      </div>
    </div>
  );
}

function MedicationDisease({ medicines, diseases }) {
  const allMeds =
    medicines?.length > 0
      ? medicines.map(m => m.label)
      : [...new Set(ALL_PATIENTS.flatMap(p => p.meds))].sort();
  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [comboOnly, setComboOnly] = useState(false);
  const [excludeDisease, setExcludeDisease] = useState([]);
  const [singleOnly, setSingleOnly] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const doctor_id = sessionStorage.getItem("doctor_id");

  const toggleM = m => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const toggleExclude = d =>
    setExcludeDisease(prev =>
      prev.includes(d)
        ? prev.filter(x => x !== d)
        : [...prev, d]
    );

  useEffect(() => {
    const loadData = async () => {
      setLoadingStats(true);

      const res = await fetchMedicationDiseaseDashboard({
        doctor_id,
        medication: selMeds.length ? selMeds : undefined,
        age_group: ageGroup !== "All" ? ageGroup : undefined,
        gender: gender !== "All" ? genderMap[gender] : undefined,
        exclude_disease: excludeDisease,
        singleOnly: singleOnly,
        combinedOnly: comboOnly,
        page,
        limit: rowsPerPage,
      });

      setApiData(res);
      setLoadingStats(false);
    };

    loadData();
  }, [doctor_id, selMeds, ageGroup, gender, excludeDisease, singleOnly, comboOnly, page, rowsPerPage]);

  const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [ageGroup, gender]);

  //   const patients = useMemo(() => {
  //   if (!apiData?.patients) return [];

  //   return apiData.patients.map(p => ({
  //     id: p.user_id,
  //     name: p.name,
  //     age: p.age,
  //     gender: p.gender || "Not Specified",
  //     conditions: p.diseases
  //       ? [...p.diseases.matchAll(/name:\s*([^,}]+)/g)].map(m => m[1])
  //       : [],
  //     meds: Array.isArray(p.medications)
  //       ? p.medications.map(m => m.name)
  //       : [],
  //   }));
  // }, [apiData]);

  useEffect(() => {
    setSingleOnly(false);
    setComboOnly(false);
  }, [selMeds]);

  const diseaseDist = useMemo(() => {
    if (!apiData?.disease_distribution) return [];

    return apiData.disease_distribution.map(d => ({
      label: d.disease,
      value: d.patient_count,
      pctOfMatched: d.percent_matched,
      pctOfAll: d.percent_total,
    }));
  }, [apiData]);

  const allDisInResult =
    diseases?.length > 0
      ? diseases.map(d => d.label)
      : [...new Set(ALL_PATIENTS.flatMap(p => p.conditions))].sort();

  const totalPatients = apiData?.total_patients || 0;
  const matchedPatients = apiData?.matched_patients || 0;
  // const uniqueDiseases = apiData?.unique_diseases || 0;
  // const topDisease = apiData?.top_disease || "-";

  useEffect(() => {
    setPage(1);
  }, [selMeds, ageGroup, gender, excludeDisease, singleOnly, comboOnly]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Medication / Disease</h2>
        <p style={S.pageSub}>Select one or more medications to see which diseases are associated — with counts and percentages</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 2, minWidth: 200 }}><TagSearch label="Medication(s)" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Add medications…" /></div>
          <div style={{ flex: 1, minWidth: 160 }}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup} /></div>
          <div style={{ flex: 1, minWidth: 160 }}><GenderFilter value={gender} onChange={setGender} /></div>
        </div>
        {selMeds.length >= 2 && (
          <label style={{ ...S.checkLabel(comboOnly) }}>
            <input type="checkbox" checked={comboOnly} onChange={e => setComboOnly(e.target.checked)} style={{ accentColor: ACCENT }} />
            Combination — patients must be on ALL selected medications
          </label>
        )}
        {selMeds.length === 1 && (
          <label style={S.checkLabel(singleOnly)}>
            <input
              type="checkbox"
              checked={singleOnly}
              onChange={e => setSingleOnly(e.target.checked)}
              style={{ accentColor: ACCENT }}
            />
            Only patients with this medication
          </label>
        )}
        {allDisInResult.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <span style={{ ...S.filterLabel, display: "block", marginBottom: 6 }}>Exclude diseases from table</span>
            <div>
              <TagSearch
                all={allDisInResult}
                selected={excludeDisease}
                onToggle={toggleExclude}
                searchPlaceholder="Search diseases to exclude…"
              />
            </div>
          </div>
        )}
      </div>

      <div style={S.statRow}>
        {loadingStats ? (
          <>
            <div style={S.statCard}>
              <div style={S.statLbl}>Matched Patients</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
            <div style={S.statCard}>
              <div style={S.statLbl}>Total Patients</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
            <div style={S.statCard}>
              <div style={S.statLbl}>Top Disease</div>
              <div style={{ ...S.statVal, display: "flex", justifyContent: "center", alignItems: "center", height: 36 }}>
                <CircularProgress size={24} />
              </div>
            </div>
          </>
        ) : (
          <>
            <StatCard label="Matched Patients" value={apiData?.matched_patients || 0} sub={`${pct(matchedPatients, totalPatients)}% of all patients`} highlightSub />
            <StatCard label="Unique Diseases" value={apiData?.total_patients || 0} />
            <StatCard label="Top Disease" value={apiData?.top_disease || "—"} />
          </>
        )}
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>
          Disease Distribution
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }} className="d-flex align-items-center justfiy-content-between">among {matchedPatients} matched patients
            <ExportButton
              data={diseaseDist}
              fileName="Medication_Distribution"
              mapFn={(r, i) => ({
                "S. No.": i + 1,
                "Medication": r.label,
                [`Patients Count (${basePool.length})`]: r.value,
                "% of Matched": r.pctOfMatched,
                "% of All Patients": r.pctOfAll,
              })}
            />
          </span>
        </p>
        {loadingStats ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        ) : diseaseDist.length === 0 ? (
          <div style={S.noData}>Select a medication to see disease data</div>
        ) : (
          <DataTable
            cols={[
              { key: "label", label: "Disease", sortable: true, render: r => <Chip label={r.label} teal={false} /> },
              { key: "value", label: "Patients", sortable: true, render: r => <span style={{ fontWeight: 700, color: ACCENT }}>{r.value}</span> },
              { key: "pctOfMatched", label: "% of Matched", sortable: true, render: r => <span style={{ fontWeight: 600 }}>{r.pctOfMatched}%</span> },
              { key: "pctOfAll", label: "% of All Patients", sortable: true, render: r => <span style={{ color: "#94a3b8" }}>{r.pctOfAll}%</span> },
              {
                key: "bar", label: "", render: r => (
                  <div style={{ ...S.barTrack, minWidth: 80 }}>
                    <div style={{ ...S.barFill(parseFloat(r.pctOfMatched)), background: "#f59e0b" }} />
                  </div>
                )
              },
            ]}
            rows={diseaseDist}
          />
        )}
        <CustomPagination
          count={apiData?.matched_patients || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(val) => {
            setRowsPerPage(val);
            setPage(1);
          }}
          hideRowsPerPage={true}
        />
        <div style={{ marginTop: 14 }}>
          <ExpandPanel
            useAPI={true}
            fetchFn={fetchMedicationDiseaseDashboard}
            fetchParams={{
              doctor_id,
              medication: selMeds,
              age_group: ageGroup === "All" ? undefined : ageGroup,
              gender: gender === "All" ? undefined : genderMap[gender],
              exclude_disease: excludeDisease,
              singleOnly: singleOnly,
              combinedOnly: comboOnly,
            }}
            count={matchedPatients}
          />
        </div>
      </div>
    </div>
  );
}

function MedicationHealth({ medicines }) {
  const [selMeds, setSelMeds] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [allMedNames, setAllMedNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [patientPages, setPatientPages] = useState({}); 

  const doctor_id = sessionStorage.getItem("doctor_id");

  const toggleM = m => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  useEffect(() => {
    const loadAllMeds = async () => {
      const res = await fetchMedicationReportedHealth({
        doctor_id,
        page: 1,
        limit: 1000, // get all medications for dropdown
        patient_page: 1,
        patient_limit: 1,
      });

      if (res?.data) {
        const names = res.data.map(item => item.medication.name);
        setAllMedNames(names);
      }
    };

    loadAllMeds();
  }, [doctor_id]);

  // On filter/page change: fetch filtered data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const res = await fetchMedicationReportedHealth({
        doctor_id,
        medication: selMeds.length ? selMeds : undefined,
        page,
        limit: rowsPerPage,
        patient_page: 1,
        patient_limit: 5,
      });

      setApiData(res);
      setLoading(false);
    };

    loadData();
  }, [doctor_id, selMeds, page, rowsPerPage]);

  const loadMorePatients = async (medicationName, currentPatientPage) => {
    const res = await fetchMedicationReportedHealth({
      doctor_id,
      medication: selMeds.length ? selMeds : undefined,
      page,
      limit: rowsPerPage,
      patient_page: currentPatientPage + 1,
      patient_limit: 5,
    });

    if (res?.data) {
      setApiData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map(item => {
            if (item.medication.name === medicationName) {
              const newPatients = res.data.find(
                newItem => newItem.medication.name === medicationName
              )?.patients || [];
              return {
                ...item,
                patients: [...item.patients, ...newPatients],
                patient_page: currentPatientPage + 1
              };
            }
            return item;
          })
        };
      });
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selMeds]);

  const allMeds = allMedNames.length > 0
    ? allMedNames
    : (medicines?.length > 0 ? medicines.map(m => m.label) : []);

  if (loading && !apiData) {
    return (
      <div>
        <div style={S.pageHead}>
          <h2 style={S.pageTitle}>Medication / Reported Health</h2>
          <p style={S.pageSub}>For each medication, see the reported health outcomes and their frequency</p>
        </div>
        <div style={S.filterBar}>
          <div style={S.filterRow}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <TagSearch
                label="Drug name(s)"
                all={allMeds}
                selected={selMeds}
                onToggle={toggleM}
                searchPlaceholder="Filter by drug name…"
              />
            </div>
          </div>
        </div>
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "40px" }}>
            <CircularProgress size={32} />
          </div>
        </div>
      </div>
    );
  }

  const medHealthData = apiData?.data || [];
  const totalCount = apiData?.total_medications || 0;

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Medication / Reported Health</h2>
        <p style={S.pageSub}>For each medication, see the reported health outcomes and their frequency</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <TagSearch
              label="Drug name(s)"
              all={allMeds}
              selected={selMeds}
              onToggle={toggleM}
              searchPlaceholder="Filter by drug name…"
            />
          </div>
        </div>
      </div>

      {medHealthData.length === 0 ? (
        <div style={S.card}>
          <div style={S.noData}>No data found</div>
        </div>
      ) : (
        <>
          {medHealthData.map((item, idx) => {
            // Extract disease names from diseases string for each patient
            const extractDiseaseNames = (str) => {
              if (!str) return [];
              const matches = [...str.matchAll(/name:\s*([^,}]+)/g)];
              return matches.map(m => m[1].trim());
            };

            const formatDate = (dateStr) => {
              if (!dateStr) return "—";
              const d = new Date(dateStr);
              const day = String(d.getDate()).padStart(2, "0");
              const month = String(d.getMonth() + 1).padStart(2, "0");
              const year = d.getFullYear();
              return `${day}-${month}-${year}`;
            };

            const formattedPatients = (item.patients || []).map(p => ({
              id: p.user_id,
              name: p.patient_name,
              age: p.age,
              gender: "Not Specified",
              conditions: extractDiseaseNames(p.diseases),
              meds: (p.all_medications || []).map(m => m.name),
              reportedHealth: p.symptoms ? p.symptoms.split(", ").map(symptom => ({
                drug: p.reacted_medication?.name || item.medication.name,
                symptom: symptom
              })) : [],
              medication_start_date: formatDate(p.medication_start_date),
              reaction_date: formatDate(p.reaction_date),
            }));

            return (
              <div key={idx} style={S.card}>
                <p style={S.cardTitle}>
                  <span>
                    <Chip label={item.medication.name} teal={true} />
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400, marginLeft: 6 }}>
                      {item.total_patients} patients ({item.percentage} of total)
                    </span>
                  </span>
                </p>
                <div style={S.barWrap}>
                  {(item.symptoms || []).map((o, i) => (
                    <HBar
                      key={i}
                      label={o.symptom}
                      value={o.count}
                      total={item.total_patients}
                      pctVal={o.count / item.total_patients * 100}
                      color="#f59e0b"
                    />
                  ))}
                  {(!item.symptoms || item.symptoms.length === 0) && (
                    <div style={S.noData}>No reported symptoms for this medication</div>
                  )}
                </div>
                <div style={{ marginTop: 14 }}>
                  <ExpandPanel
                    patients={formattedPatients}
                    showSymptoms={true}
                    useAPI={false}
                  />
                  {item.total_patients_in_medication > item.patients?.length && (
                    <div style={{ marginTop: 10, textAlign: "center" }}>
                      <button
                        onClick={() => loadMorePatients(item.medication.name, item.patient_page || 1)}
                        style={S.expandBtn}
                      >
                        Load More Patients ({item.patients?.length || 0} / {item.total_patients_in_medication})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
            <CustomPagination
              count={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(newPage) => setPage(newPage)}
              onRowsPerPageChange={(val) => {
                setRowsPerPage(val);
                setPage(1);
              }}
              hideRowsPerPage={true}
            />
          </div>
        </>
      )}
    </div>
  );
}

const FIELD_DEFS = [
  { key: "name", label: "Patient Name" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "conditions", label: "Diseases", isArr: true },
  { key: "meds", label: "Medications", isArr: true, teal: true },
  { key: "reportedHealth", label: "Reported Health", isArr: true },
];

function CustomizeTable({ diseases, medicines, symptoms }) {
  const allDiseases = diseases?.length > 0 ? diseases.map(d => d.label) : [];
  const allMeds     = medicines?.length > 0 ? medicines.map(m => m.label) : [];
  const allSymptoms = symptoms?.length  > 0 ? symptoms.map(s => s.label)  : [];

  const [selFields,          setSelFields]          = useState(["name", "age", "gender", "conditions", "meds", "reportedHealth"]);
  const [filterDis,          setFilterDis]          = useState([]);
  const [filterMed,          setFilterMed]          = useState([]);
  const [filterSymptoms,     setFilterSymptoms]     = useState([]);
  const [ageGroup,           setAgeGroup]           = useState("All");
  const [gender,             setGender]             = useState("All");
  const [page,               setPage]               = useState(1);
  const [rowsPerPage,        setRowsPerPage]        = useState(10);
  const [loading,            setLoading]            = useState(false);
  const [apiData,            setApiData]            = useState(null);

  // ── Disease filter modes (mutually exclusive) ──
  const [singleOnlyDisease,   setSingleOnlyDisease]   = useState(false);
  const [combinedOnlyDisease, setCombinedOnlyDisease] = useState(false);
  const [includeExtraDisease, setIncludeExtraDisease] = useState(false);

  // ── Medication filter modes (mutually exclusive) ──
  const [singleOnlyMed,   setSingleOnlyMed]   = useState(false);
  const [combinedOnlyMed, setCombinedOnlyMed] = useState(false);
  const [includeExtraMed, setIncludeExtraMed] = useState(false);

  // ── Summary pagination ──
  const [disPage,  setDisPage]  = useState(1);
  const [medPage,  setMedPage]  = useState(1);
  const [symPage,  setSymPage]  = useState(1);
  const SUMMARY_PAGE_SIZE = 5;

  const doctor_id = sessionStorage.getItem("doctor_id");

  const toggleF = k => setSelFields(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const toggleD = d => setFilterDis(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleM = m => setFilterMed(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const toggleH = h => setFilterSymptoms(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);

  // ── Auto-reset disease modes when selection changes ──
  useEffect(() => {
    if (filterDis.length !== 1) setSingleOnlyDisease(false);
    if (filterDis.length < 2)   { setCombinedOnlyDisease(false); setIncludeExtraDisease(false); }
  }, [filterDis]);

  // ── Auto-reset medication modes when selection changes ──
  useEffect(() => {
    if (filterMed.length !== 1) setSingleOnlyMed(false);
    if (filterMed.length < 2)   { setCombinedOnlyMed(false); setIncludeExtraMed(false); }
  }, [filterMed]);

  // ── Reset summary pages on filter change ──
  useEffect(() => {
    setDisPage(1); setMedPage(1); setSymPage(1);
  }, [filterDis, filterMed, filterSymptoms, ageGroup, gender,
      singleOnlyDisease, combinedOnlyDisease, includeExtraDisease,
      singleOnlyMed, combinedOnlyMed, includeExtraMed]);

  // ── Main data fetch ──
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Resolve disease mode
        const diseaseSingleOnly   = filterDis.length === 1  && singleOnlyDisease;
        const diseaseCombinedOnly = filterDis.length >= 2   && combinedOnlyDisease;
        const diseaseIncludeExtra = filterDis.length >= 2   && includeExtraDisease;

        // Resolve medication mode
        const medSingleOnly   = filterMed.length === 1  && singleOnlyMed;
        const medCombinedOnly = filterMed.length >= 2   && combinedOnlyMed;
        const medIncludeExtra = filterMed.length >= 2   && includeExtraMed;

        const res = await fetchCustomPatientTable({
          doctor_id,
          gender:    gender   !== "All" ? genderMap[gender]   : undefined,
          age_group: ageGroup !== "All" ? ageGroup            : undefined,
          disease:   filterDis,
          medication: filterMed,
          symptoms:  filterSymptoms,
          page,
          limit:     rowsPerPage,
          singleOnly:   diseaseSingleOnly  || medSingleOnly,
          combinedOnly: diseaseCombinedOnly || medCombinedOnly,
          includeExtra: diseaseIncludeExtra || medIncludeExtra,
        });

        setApiData(res);
      } catch (error) {
        console.error("Error loading custom table data:", error);
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadData, 300);
    return () => clearTimeout(timeoutId);
  }, [
    doctor_id, gender, ageGroup,
    filterDis, filterMed, filterSymptoms,
    page, rowsPerPage,
    singleOnlyDisease, combinedOnlyDisease, includeExtraDisease,
    singleOnlyMed, combinedOnlyMed, includeExtraMed,
  ]);

  // ── Reset to page 1 on filter change ──
  useEffect(() => {
    setPage(1);
  }, [
    gender, ageGroup, filterDis, filterMed, filterSymptoms,
    singleOnlyDisease, combinedOnlyDisease, includeExtraDisease,
    singleOnlyMed, combinedOnlyMed, includeExtraMed,
  ]);

  // ── Parse patients from API response ──
  const extractDiseaseNames = (diseasesStr) => {
    if (!diseasesStr) return [];
    if (Array.isArray(diseasesStr)) return diseasesStr;
    const matches = [...diseasesStr.matchAll(/name:\s*([^,}]+)/g)];
    if (matches.length > 0) return matches.map(m => m[1].trim());
    return diseasesStr.split(',').map(d => d.trim()).filter(Boolean);
  };

  const patients = useMemo(() => {
    if (!apiData?.patients) return [];
    return apiData.patients.map(patient => ({
      name:   patient.name   || "N/A",
      age:    patient.age    || 0,
      gender: patient.gender || "Not Specified",
      conditions: extractDiseaseNames(patient.diseases),
      meds: Array.isArray(patient.medications)
        ? patient.medications.map(m => m.name).filter(Boolean)
        : [],
      reportedHealth: Array.isArray(patient.reported_symptoms) && patient.reported_symptoms.length > 0
        ? patient.reported_symptoms
        : [],
    }));
  }, [apiData]);

  // ── Summary data from API ──
  const matched        = apiData?.matched_patients       || 0;
  const ageDist        = apiData?.age_distribution       || [];
  const genderDist     = apiData?.gender_distribution    || [];
  const allDiseaseDist = apiData?.disease_distribution   || [];
  const allMedDist     = apiData?.medication_distribution || [];
  const allSymptomDist = apiData?.symptom_distribution   || [];

  // Client-side pagination for summary sections
  const diseasePage  = allDiseaseDist.slice((disPage - 1) * SUMMARY_PAGE_SIZE, disPage * SUMMARY_PAGE_SIZE);
  const medPageData  = allMedDist.slice((medPage - 1) * SUMMARY_PAGE_SIZE, medPage * SUMMARY_PAGE_SIZE);
  const symPageData  = allSymptomDist.slice((symPage - 1) * SUMMARY_PAGE_SIZE, symPage * SUMMARY_PAGE_SIZE);

  // ── Table columns ──
  const cols = FIELD_DEFS.filter(f => selFields.includes(f.key)).map(f => ({
    key:      f.key,
    label:    f.label,
    sortable: true,
    render: f.isArr
      ? (r => {
          const arr = r[f.key];
          if (!arr || arr.length === 0) return <span style={{ color: "#94a3b8" }}>—</span>;
          return f.teal ? <MChips arr={arr} /> : <DChips arr={arr} />;
        })
      : f.key === "gender"
        ? (r => <span style={S.badge(r.gender)}>{r.gender}</span>)
        : f.key === "reportedHealth"
          ? (r => {
              const symptomsArray = Array.isArray(r.reportedHealth)
                ? r.reportedHealth.map(item =>
                    typeof item === "string" ? item :
                    (typeof item === "object" && item !== null ? item.symptom || "" : "")
                  ).filter(Boolean)
                : [];
              if (symptomsArray.length === 0) return <span style={{ color: "#94a3b8" }}>—</span>;
              return <DChips arr={symptomsArray} />;
            })
          : null,
  }));

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Customize Table</h2>
        <p style={S.pageSub}>Build your own lookup — choose columns and stack filters to find exactly who you need</p>
      </div>

      {/* ── Filter Bar ── */}
      <div style={S.filterBar}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ ...S.filterLabel, display: "block", marginBottom: 8 }}>Columns to display</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {FIELD_DEFS.map(f => (
              <label key={f.key} style={S.checkLabel(selFields.includes(f.key))}>
                <input type="checkbox" checked={selFields.includes(f.key)}
                  onChange={() => toggleF(f.key)} style={{ accentColor: ACCENT }} />
                {f.label}
              </label>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #eaecf2", margin: "12px 0" }} />

        <div style={{ ...S.filterRow, alignItems: "flex-start" }}>

          {/* Disease filter */}
          <div style={{ flex: 1, minWidth: 160 }}>
            <TagSearch label="Disease" all={allDiseases} selected={filterDis}
              onToggle={toggleD} searchPlaceholder="Filter by disease…" />

            {/* singleOnly — only when exactly 1 selected */}
            {filterDis.length === 1 && (
              <label style={{ ...S.checkLabel(singleOnlyDisease), marginTop: 8, display: "flex", alignItems: "center", gap: 7 }}>
                <input type="checkbox" checked={singleOnlyDisease}
                  onChange={e => setSingleOnlyDisease(e.target.checked)}
                  style={{ accentColor: ACCENT }} />
                Only patients with this disease
              </label>
            )}

            {/* combinedOnly + includeExtra — only when 2+ selected */}
            {filterDis.length >= 2 && (
              <>
                <label style={{ ...S.checkLabel(combinedOnlyDisease), marginTop: 8, display: "flex", alignItems: "center", gap: 7 }}>
                  <input type="checkbox" checked={combinedOnlyDisease}
                    onChange={e => {
                      setCombinedOnlyDisease(e.target.checked);
                      if (e.target.checked) setIncludeExtraDisease(false);
                    }}
                    style={{ accentColor: ACCENT }} />
                  Patients with ONLY these diseases
                </label>
                <label style={{ ...S.checkLabel(includeExtraDisease), marginTop: 6, display: "flex", alignItems: "center", gap: 7 }}>
                  <input type="checkbox" checked={includeExtraDisease}
                    onChange={e => {
                      setIncludeExtraDisease(e.target.checked);
                      if (e.target.checked) setCombinedOnlyDisease(false);
                    }}
                    style={{ accentColor: ACCENT }} />
                  Include patients with these + extra diseases
                </label>
              </>
            )}
          </div>

          {/* Medication filter */}
          <div style={{ flex: 1, minWidth: 160 }}>
            <TagSearch label="Medication" all={allMeds} selected={filterMed}
              onToggle={toggleM} searchPlaceholder="Filter by medication…" />

            {/* singleOnly — only when exactly 1 selected */}
            {filterMed.length === 1 && (
              <label style={{ ...S.checkLabel(singleOnlyMed), marginTop: 8, display: "flex", alignItems: "center", gap: 7 }}>
                <input type="checkbox" checked={singleOnlyMed}
                  onChange={e => setSingleOnlyMed(e.target.checked)}
                  style={{ accentColor: ACCENT }} />
                Only patients with this medication
              </label>
            )}

            {/* combinedOnly + includeExtra — only when 2+ selected */}
            {filterMed.length >= 2 && (
              <>
                <label style={{ ...S.checkLabel(combinedOnlyMed), marginTop: 8, display: "flex", alignItems: "center", gap: 7 }}>
                  <input type="checkbox" checked={combinedOnlyMed}
                    onChange={e => {
                      setCombinedOnlyMed(e.target.checked);
                      if (e.target.checked) setIncludeExtraMed(false);
                    }}
                    style={{ accentColor: ACCENT }} />
                  Patients on ONLY these medications
                </label>
                <label style={{ ...S.checkLabel(includeExtraMed), marginTop: 6, display: "flex", alignItems: "center", gap: 7 }}>
                  <input type="checkbox" checked={includeExtraMed}
                    onChange={e => {
                      setIncludeExtraMed(e.target.checked);
                      if (e.target.checked) setCombinedOnlyMed(false);
                    }}
                    style={{ accentColor: ACCENT }} />
                  Include patients on these + extra medications
                </label>
              </>
            )}
          </div>

          {/* Symptom filter — no modes, just tag search */}
          <div style={{ flex: 1, minWidth: 160 }}>
            <TagSearch label="Reported Symptoms" all={allSymptoms} selected={filterSymptoms}
              onToggle={toggleH} searchPlaceholder="Filter by symptom…" />
          </div>

          <div style={{ flex: 1, minWidth: 140 }}>
            <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <GenderFilter value={gender} onChange={setGender} />
          </div>
        </div>
      </div>

      {/* ── Stat Row ── */}
      <div style={S.statRow}>
        <StatCard
          label="Matching Patients"
          value={apiData?.matched_patients || 0}
          sub={`${apiData?.matched_patients
            ? ((apiData.matched_patients / (apiData.total || 1)) * 100).toFixed(1)
            : 0}% of total patients`}
          highlightSub
        />
        <StatCard label="Total Patients" value={apiData?.total || 0} />
        <StatCard
          label="Active Filters"
          value={
            filterDis.length + filterMed.length + filterSymptoms.length +
            (ageGroup !== "All" ? 1 : 0) + (gender !== "All" ? 1 : 0)
          }
        />
      </div>

      {/* ── Summary Cards (only when data exists) ── */}
      {!loading && matched > 0 && (
        <>
          {/* Row 1: Age + Gender */}
          {(ageDist.length > 0 || genderDist.length > 0) && (
            <div style={S.grid2}>
              {ageDist.length > 0 && (
                <div style={S.card}>
                  <p style={S.cardTitle}>
                    Age Group Distribution
                    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
                      % of {matched} matched patients
                    </span>
                  </p>
                  <div style={S.barWrap}>
                    {ageDist.map((d, i) => (
                      <HBar key={i} label={d.age_group} value={d.count}
                        total={matched} pctVal={d.percentage} color={ACCENT} />
                    ))}
                  </div>
                </div>
              )}
              {genderDist.length > 0 && (
                <div style={S.card}>
                  <p style={S.cardTitle}>
                    Sex Distribution
                    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
                      % of {matched} matched patients
                    </span>
                  </p>
                  <div style={S.barWrap}>
                    {genderDist.map((d, i) => (
                      <HBar key={i} label={d.gender} value={d.count}
                        total={matched} pctVal={d.percentage}
                        color={GCOLORS[d.gender] ?? ACCENT} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Row 2: Top Diseases + Top Medications */}
          {(allDiseaseDist.length > 0 || allMedDist.length > 0) && (
            <div style={S.grid2}>
              {allDiseaseDist.length > 0 && (
                <div style={S.card}>
                  <p style={S.cardTitle}>
                    Top Diseases
                    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
                      % of {matched} matched patients
                    </span>
                  </p>
                  <div style={S.barWrap}>
                    {diseasePage.map((d, i) => (
                      <HBar key={i} label={d.disease} value={d.count}
                        total={matched} pctVal={d.percentage} color="#f59e0b" />
                    ))}
                  </div>
                  <CustomPagination
                    count={allDiseaseDist.length}
                    page={disPage}
                    rowsPerPage={SUMMARY_PAGE_SIZE}
                    onPageChange={setDisPage}
                    onRowsPerPageChange={() => {}}
                    hideRowsPerPage={true}
                  />
                </div>
              )}
              {allMedDist.length > 0 && (
                <div style={S.card}>
                  <p style={S.cardTitle}>
                    Top Medications
                    <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
                      % of {matched} matched patients
                    </span>
                  </p>
                  <div style={S.barWrap}>
                    {medPageData.map((d, i) => (
                      <HBar key={i} label={d.medication} value={d.count}
                        total={matched} pctVal={d.percentage} color={ACCENT} />
                    ))}
                  </div>
                  <CustomPagination
                    count={allMedDist.length}
                    page={medPage}
                    rowsPerPage={SUMMARY_PAGE_SIZE}
                    onPageChange={setMedPage}
                    onRowsPerPageChange={() => {}}
                    hideRowsPerPage={true}
                  />
                </div>
              )}
            </div>
          )}

          {/* Row 3: Top Symptoms — full width */}
          {allSymptomDist.length > 0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>
                Top Reported Symptoms
                <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 400 }}>
                  % of {matched} matched patients
                </span>
              </p>
              <div style={S.barWrap}>
                {symPageData.map((d, i) => (
                  <HBar key={i} label={d.symptom} value={d.count}
                    total={matched} pctVal={d.percentage} color="#8b5cf6" />
                ))}
              </div>
              <CustomPagination
                count={allSymptomDist.length}
                page={symPage}
                rowsPerPage={SUMMARY_PAGE_SIZE}
                onPageChange={setSymPage}
                onRowsPerPageChange={() => {}}
                hideRowsPerPage={true}
              />
            </div>
          )}
        </>
      )}

      {/* ── Patient Table Card ── */}
      <div style={S.card}>
        {loading ? (
          <LoadingPlaceholder />
        ) : cols.length === 0 ? (
          <div style={S.noData}>Select at least one column to display</div>
        ) : (
          <>
            <DataTable
              cols={cols}
              rows={patients}
              empty="No patients match the selected filters"
            />
            <div style={{ marginTop: 14 }}>
              <CustomPagination
                count={apiData?.matched_patients || 0}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(newPage) => setPage(newPage)}
                onRowsPerPageChange={(val) => { setRowsPerPage(val); setPage(1); }}
                hideRowsPerPage={true}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { BsFillFileBarGraphFill, BsPeopleFill } from "react-icons/bs";
import { PiHospitalFill } from "react-icons/pi";
import { GiMedicines, GiPillDrop } from "react-icons/gi";
import { FaStethoscope } from "react-icons/fa";
import { BiSolidCustomize } from "react-icons/bi";
const NAV = [
  { section: "Patient Info" },
  { key: "demographics", label: "Demographics", icon: <BsPeopleFill /> },
  { section: "Disease" },
  { key: "diseasedemo", label: "Disease / Demographics", icon: <PiHospitalFill /> },
  { key: "diseasemed", label: "Disease / Medication", icon: <GiMedicines /> },
  { section: "Drug Info" },
  { key: "meddemo", label: "Medication / Demographics", icon: <BsFillFileBarGraphFill /> },
  { key: "meddisease", label: "Medication / Disease", icon: <GiPillDrop /> },
  { key: "medhealth", label: "Medication / Reported Health", icon: <FaStethoscope /> },
  { section: "Custom" },
  { key: "customize", label: "Customize Table", icon: <BiSolidCustomize /> },
];

const VIEWS = {
  demographics: Demographics,
  diseasedemo: DiseaseDemo,
  diseasemed: DiseaseMedication,
  meddemo: MedicationDemo,
  meddisease: MedicationDisease,
  medhealth: MedicationHealth,
  customize: CustomizeTable,
};

export default function Analytics() {
  const [active, setActive] = useState("demographics");
  const View = VIEWS[active];
  const [diseases, setDiseases] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [symptoms, setSymptoms] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const doctor_id = sessionStorage.getItem("doctor_id");

      delete symptomCache[doctor_id];

      const d = await fetchDiseases(doctor_id);
      const m = await fetchMedicines(doctor_id);
      const s = await fetchSymptoms(doctor_id);

      // ✅ ADD THESE 3 LINES TEMPORARILY
      console.log("doctor_id:", doctor_id);
      console.log("symptoms raw response:", s);
      console.log("symptomCache after fetch:", symptomCache);

      setDiseases(d);
      setMedicines(m);
      setSymptoms(s);
    };

    loadData();
  }, []);

  return (
    <div style={S.wrap}>
      <nav style={S.nav}>
        <div style={S.navHead}>
          <div style={S.navTitle}>Analytics</div>
          <div style={S.navSub}>Patient Intelligence</div>
        </div>
        {NAV.map((item, i) => {
          if (item.section) return <div key={i} style={S.navGroup}>{item.section}</div>;
          const isActive = active === item.key;
          return (
            <div
              key={item.key}
              role="button"
              tabIndex={0}
              style={S.navItem(isActive)}
              onClick={() => setActive(item.key)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setActive(item.key); }}
            >
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <main style={S.main}>
        {View && <View diseases={diseases} medicines={medicines} symptoms={symptoms} />}
      </main>
    </div>
  );
}