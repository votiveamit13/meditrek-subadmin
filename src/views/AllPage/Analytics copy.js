import { useState, useMemo } from "react";
import TagSearch from "./Analytics/TagSearch";
import AgeRangeFilter from "./Analytics/AgeRangeFilter";
import GenderFilter from "./Analytics/GenderFilter";

const ALL_PATIENTS = [
  { id: 1, name: "John Smith", age: 65, gender: "Male", conditions: ["Hypertension", "Diabetes"], meds: ["Lisinopril", "Metformin"], reportedHealth: ["Headache", "Fatigue"] },
  { id: 2, name: "Michael Brown", age: 72, gender: "Male", conditions: ["Hypertension", "CAD", "Hyperlipidemia"], meds: ["Amlodipine", "Atorvastatin", "Metoprolol"], reportedHealth: ["Chest Pain", "Dizziness"] },
  { id: 3, name: "Jennifer Martinez", age: 52, gender: "Female", conditions: ["Hypertension", "Depression"], meds: ["Losartan", "Sertraline"], reportedHealth: ["Fatigue", "Insomnia"] },
  { id: 4, name: "Lisa Taylor", age: 55, gender: "Female", conditions: ["Diabetes", "Hypertension"], meds: ["Metformin", "Amlodipine"], reportedHealth: ["Nausea", "Fatigue"] },
  { id: 5, name: "James Thomas", age: 70, gender: "Male", conditions: ["Hypertension", "Diabetes", "COPD"], meds: ["Metoprolol", "Lisinopril", "Metformin", "Insulin"], reportedHealth: ["Shortness of Breath", "Fatigue", "Cough"] },
  { id: 6, name: "Emma Wilson", age: 28, gender: "Female", conditions: ["Asthma"], meds: ["Salbutamol"], reportedHealth: ["Wheezing", "Cough"] },
  { id: 7, name: "Chris Evans", age: 25, gender: "Male", conditions: ["Asthma", "Allergy"], meds: ["Cetirizine", "Salbutamol"], reportedHealth: ["Runny Nose", "Cough"] },
  { id: 8, name: "Alex Morgan", age: 34, gender: "Other", conditions: ["Anxiety"], meds: ["Escitalopram"], reportedHealth: ["Insomnia", "Palpitations"] },
  { id: 9, name: "Sarah Johnson", age: 48, gender: "Female", conditions: ["Hypertension", "Thyroid"], meds: ["Amlodipine", "Levothyroxine"], reportedHealth: ["Fatigue", "Weight Gain"] },
  { id: 10, name: "Robert Davis", age: 61, gender: "Male", conditions: ["Diabetes", "CAD"], meds: ["Metformin", "Atorvastatin", "Aspirin"], reportedHealth: ["Chest Pain", "Fatigue"] },
];

const AGE_GROUPS = {
  "0–18": (a) => a <= 18,
  "19–30": (a) => a >= 19 && a <= 30,
  "31–45": (a) => a >= 31 && a <= 45,
  "46–60": (a) => a >= 46 && a <= 60,
  "60+": (a) => a > 60,
};

const ACCENT = "#1ddec4";
const ACCENT_BG = "rgba(29,222,196,0.13)";
const GCOLORS = { Male: ACCENT, Female: "#60a5fa", Other: "#8b5cf6" };

const styles = {
  wrap: { display: "flex", gap: 24, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#f7f8fc" },
  nav: { width: 210, minWidth: 180, background: "#fff", borderRight: "1px solid #e8eaf0", display: "flex", flexDirection: "column", gap: 4, borderRadius: "0 16px 16px 0" },
  navSection: { padding: "8px 16px 4px", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#b0b8c9", textTransform: "uppercase" },
  navItem: (active) => ({
    margin: "1px 10px", padding: "9px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: active ? 600 : 400,
    background: active ? ACCENT_BG : "transparent", color: active ? ACCENT : "#4a5568",
    border: active ? `1px solid rgba(29,222,196,0.25)` : "1px solid transparent",
    transition: "all .18s", display: "flex", alignItems: "center", gap: 8,
  }),
  content: { flex: 1, overflowX: "hidden" },
  card: { background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.05)", marginBottom: 20 },
  statCard: { background: ACCENT_BG, borderRadius: 12, padding: "14px 18px", minWidth: 130, border: `1px solid rgba(29,222,196,0.2)` },
  row: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 },
  sectionRow: { display: "flex", gap: 20, alignItems: "flex-start" },
  filterPanel: { width: "100%", background: "#f7f8fc", borderRadius: 12, padding: 16, border: "1px solid #e8eaf0", flexShrink: 0, marginBottom: "20px" },
  label: { fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 6, display: "block", letterSpacing: .5 },
  chip: (teal) => ({
    display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999,
    fontSize: 11, fontWeight: 500, background: teal ? ACCENT_BG : "#f1f5f9", color: teal ? ACCENT : "#374151",
    border: teal ? `1px solid rgba(29,222,196,0.3)` : "1px solid #e5e7eb", margin: "2px 3px 2px 0",
  }),
  badge: (color) => ({
    display: "inline-block", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600,
    background: color === "Male" ? ACCENT_BG : color === "Female" ? "rgba(96,165,250,0.15)" : "rgba(139,92,246,0.15)",
    color: color === "Male" ? ACCENT : color === "Female" ? "#60a5fa" : "#8b5cf6", border: "1px solid transparent",
  }),
  th: { padding: "10px 12px", fontSize: 11, fontWeight: 700, color: "#6b7280", background: "#f7f8fc", borderBottom: "1px solid #e8eaf0", whiteSpace: "nowrap", letterSpacing: .4 },
  td: { padding: "10px 12px", fontSize: 12, color: "#374151", borderBottom: "1px solid #f1f5f9" },
  tableWrap: { overflowX: "auto", borderRadius: 10, border: "1px solid #e8eaf0" },
  input: { width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #e0e4eb", fontSize: 12, outline: "none", background: "#fff", boxSizing: "border-box" },
  h2: { fontSize: 17, fontWeight: 700, color: "#1a202c", marginBottom: 4, marginTop: 0 },
  h3: { fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12, marginTop: 0 },
  sub: { fontSize: 13, color: "#64748b", marginBottom: 24 },
  noData: { textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 13 },
  progressBg: { background: "#f1f5f9", borderRadius: 999, height: 6, overflow: "hidden", marginTop: 4 },
  progressFg: (pct, color) => ({ height: "100%", width: `${pct}%`, background: color || ACCENT, borderRadius: 999, transition: "width .5s" }),
  chartGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 0 },
};

function Table({ cols, rows, empty = "No data found" }) {
  return (
    <div style={styles.tableWrap}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>{cols.map(c => <th key={c.key} style={{ ...styles.th, textAlign: c.align || "left" }}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={styles.noData}>{empty}</td></tr>
          ) : rows.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafbfd" }}>
              {cols.map(c => <td key={c.key} style={{ ...styles.td, ...(c.style || {}) }}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={styles.statCard}>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: ACCENT }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SimpleBar({ data, color }) {
  // const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
            <span style={{ color: "#374151", fontWeight: 500 }}>{d.label}</span>
            <span style={{ color: color || ACCENT, fontWeight: 700 }}>{d.value}{d.pct != null ? ` (${d.pct}%)` : ""}</span>
          </div>
          <div style={styles.progressBg}>
  <div style={styles.progressFg(parseFloat(d.pct), color)} />
</div>
        </div>
      ))}
    </div>
  );
}

function DiseaseChips({ arr }) {
  return <>{arr.map((c, i) => <span key={i} style={styles.chip(false)}>{c}</span>)}</>;
}
function MedChips({ arr }) {
  return <>{arr.map((m, i) => <span key={i} style={styles.chip(true)}>{m}</span>)}</>;
}

function buildAgeDist(pts, denom) {
  const map = {};
  pts.forEach(p => { const g = Object.keys(AGE_GROUPS).find(k => AGE_GROUPS[k](p.age)) || "Other"; map[g] = (map[g] || 0) + 1; });
  return Object.entries(map).map(([label, value]) => ({ label, value, pct: ((value / Math.max(denom, 1)) * 100).toFixed(1) }));
}

function buildGenderDist(pts, denom) {
  const map = {};
  pts.forEach(p => { map[p.gender] = (map[p.gender] || 0) + 1; });
  return Object.entries(map).map(([label, value]) => ({ label, value, pct: ((value / Math.max(denom, 1)) * 100).toFixed(1) })).sort((a, b) => b.value - a.value);
}

function DiseasePatients() {
  const allDiseases = [...new Set(ALL_PATIENTS.flatMap(p => p.conditions))].sort();
  const [selDiseases, setSelDiseases] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [combinedOnly, setCombinedOnly] = useState(false);

  const toggle = (d) => setSelDiseases(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [ageGroup, gender]);

  const patients = useMemo(() => {
  let result = basePool;

  if (selDiseases.length > 0 && !combinedOnly) {
    const seen = new Set();
    result = result.filter(p => {
      if (!selDiseases.some(d => p.conditions.includes(d))) return false;
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }

  if (combinedOnly && selDiseases.length > 0) {
  result = result.filter(p =>
    p.conditions.length === selDiseases.length &&
    selDiseases.every(d => p.conditions.includes(d))
  );
}

  return result;
}, [selDiseases, basePool, combinedOnly]);

  const diseaseDist = useMemo(() => {
    const map = {};
    basePool.forEach(p => p.conditions.forEach(c => {
      if (!selDiseases.length || selDiseases.includes(c)) { map[c] = (map[c] || 0) + 1; }
    }));
    const denom = Math.max(basePool.length, 1);
    return Object.entries(map).map(([k, v]) => ({ label: k, value: v, pct: ((v / denom) * 100).toFixed(1) })).sort((a, b) => b.value - a.value);
  }, [basePool, selDiseases]);

  const ageDist = useMemo(() => buildAgeDist(patients, patients.length), [patients]);
  const genderDist = useMemo(() => buildGenderDist(patients, patients.length), [patients]);

  return (
    <div>
      <h2 style={styles.h2}>Disease Patients</h2>
      <p style={styles.sub}>Filter patients by disease, age, and gender</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <TagSearch label="Disease" all={allDiseases} selected={selDiseases} onToggle={toggle} searchPlaceholder="Search diseases…" />
          <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          <GenderFilter value={gender} onChange={setGender} />
        </div>
      </div>
      <div style={styles.row}>
        <StatCard label="Matching Patients" value={patients.length} sub={`of ${ALL_PATIENTS.length} total`} />
        <StatCard label="% of Total" value={`${((patients.length / ALL_PATIENTS.length) * 100).toFixed(1)}%`} />
        <StatCard label="Diseases Selected" value={selDiseases.length || "All"} />
      </div>
      <div style={styles.sectionRow}>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {diseaseDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>Disease Distribution <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of matched patients</span></h3>
              <SimpleBar data={diseaseDist} />
            </div>
          )}
          {patients.length > 0 && (ageDist.length > 0 || genderDist.length > 0) && (
            <div style={styles.chartGrid}>
              {ageDist.length > 0 && (
                <div style={styles.card}>
                  <h3 style={styles.h3}>Age Breakdown <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of matched patients</span></h3>
                  <SimpleBar data={ageDist} />
                </div>
              )}
              {genderDist.length > 0 && (
                <div style={styles.card}>
                  <h3 style={styles.h3}>Gender Breakdown <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of matched patients</span></h3>
                  {genderDist.map((g, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, color: GCOLORS[g.label] || "#374151" }}>{g.label}</span>
                        <span style={{ fontWeight: 700, color: GCOLORS[g.label] || ACCENT }}>{g.value} ({g.pct}%)</span>
                      </div>
                      <div style={styles.progressBg}><div style={styles.progressFg(parseFloat(g.pct), GCOLORS[g.label])} /></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={styles.card}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12
            }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
                Patients
              </h3>

              {selDiseases.length >= 2 && (
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                cursor: "pointer",
                color: combinedOnly ? ACCENT : "#64748b"
              }}>
                <input
                  type="checkbox"
                  checked={combinedOnly}
                  onChange={e => setCombinedOnly(e.target.checked)}
                  style={{ accentColor: ACCENT }}
                />
                Combined Diseases
              </label>
              )}
            </div>
            <Table
              cols={[
                { key: "name", label: "Patient Name" },
                { key: "age", label: "Age" },
                { key: "gender", label: "Gender", render: r => <span style={styles.badge(r.gender)}>{r.gender}</span> },
                { key: "conditions", label: "Diseases", render: r => <DiseaseChips arr={r.conditions} /> },
                { key: "meds", label: "Medications", render: r => <MedChips arr={r.meds} /> },
              ]}
              rows={patients}
              empty="No patients match the selected filters"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MedicationPatients() {
  const allMeds = [...new Set(ALL_PATIENTS.flatMap(p => p.meds))].sort();
  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [noOtherMeds, setNoOtherMeds] = useState(false);
  const [showTop10, setShowTop10] = useState(false);

  const toggle = (m) => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const topCombos = useMemo(() => {
    const map = {};
    ALL_PATIENTS.forEach(p => { const k = [...p.meds].sort().join(" + "); map[k] = (map[k] || 0) + 1; });
    return Object.entries(map).map(([combo, count]) => ({ combo, count, pct: ((count / ALL_PATIENTS.length) * 100).toFixed(1) })).sort((a, b) => b.count - a.count);
  }, []);

  const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [ageGroup, gender]);

  const patients = useMemo(() => basePool.filter(p => {
    if (selMeds.length > 0 && !selMeds.every(m => p.meds.includes(m))) return false;
    if (noOtherMeds && p.meds.some(m => !selMeds.includes(m))) return false;
    return true;
  }), [selMeds, noOtherMeds, basePool]);

  const ageRangeDist = useMemo(() => {
    if (selMeds.length === 0) return [];
    return buildAgeDist(patients, patients.length);
  }, [patients, selMeds]);

  const genderDist = useMemo(() => {
    if (selMeds.length === 0) return [];
    return buildGenderDist(patients, patients.length);
  }, [patients, selMeds]);

  const medDist = useMemo(() => {
    if (selMeds.length === 0) return [];
    const map = {};
    basePool.forEach(p => p.meds.forEach(m => { if (selMeds.includes(m)) map[m] = (map[m] || 0) + 1; }));
    const denom = Math.max(basePool.length, 1);
    return Object.entries(map).map(([label, value]) => ({ label, value, pct: ((value / denom) * 100).toFixed(1) })).sort((a, b) => b.value - a.value);
  }, [basePool, selMeds]);

  return (
    <div>
      <h2 style={styles.h2}>Medication Patients & Combinations</h2>
      <p style={styles.sub}>Select one or multiple medications to find matching patients and combinations</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <TagSearch label="Medications" all={allMeds} selected={selMeds} onToggle={toggle} searchPlaceholder="Search medications…" />

          <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          <GenderFilter value={gender} onChange={setGender} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer", color: noOtherMeds ? ACCENT : "#374151" }}>
            <input type="checkbox" checked={noOtherMeds} onChange={e => setNoOtherMeds(e.target.checked)} style={{ accentColor: ACCENT }} />
            No other medications
          </label>
        </div>
      </div>
      <div style={styles.row}>
        <StatCard label="Matching Patients" value={patients.length} sub={`of ${ALL_PATIENTS.length} total`} />
        <StatCard label="% of Total" value={`${((patients.length / ALL_PATIENTS.length) * 100).toFixed(1)}%`} />
        <div role="button" tabIndex={0} style={{ ...styles.statCard, cursor: "pointer" }} onClick={() => setShowTop10(!showTop10)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setShowTop10(v => !v); }}>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>Most Common Combination</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{topCombos[0]?.combo || "-"}</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
            {topCombos[0]?.pct}% · <span style={{ color: ACCENT, textDecoration: "underline" }}>View Top 10 ↗</span>
          </div>
        </div>
      </div>

      {showTop10 && (
        <div style={{ ...styles.card, borderLeft: `3px solid ${ACCENT}` }}>
          <h3 style={styles.h3}>Top 10 Medication Combinations</h3>
          {topCombos.slice(0, 10).map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", width: 18 }}>{i + 1}.</span>
                <div>{c.combo.split(" + ").map((m, j) => <span key={j} style={styles.chip(true)}>{m}</span>)}</div>
              </div>
              <span style={{ fontWeight: 700, color: ACCENT, fontSize: 12, whiteSpace: "nowrap" }}>{c.count} pts · {c.pct}%</span>
            </div>
          ))}
        </div>
      )}

      <div style={styles.sectionRow}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {medDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>Medication Usage <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of {basePool.length} patients in group</span></h3>
              <SimpleBar data={medDist} />
            </div>
          )}
          {patients.length > 0 && selMeds.length > 0 && (
            <div style={styles.chartGrid}>
              {ageRangeDist.length > 0 && (
                <div style={styles.card}>
                  <h3 style={styles.h3}>Age Breakdown <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of matched patients</span></h3>
                  <SimpleBar data={ageRangeDist} />
                </div>
              )}
              {genderDist.length > 0 && (
                <div style={styles.card}>
                  <h3 style={styles.h3}>Gender Breakdown <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of matched patients</span></h3>
                  {genderDist.map((g, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, color: GCOLORS[g.label] || "#374151" }}>{g.label}</span>
                        <span style={{ fontWeight: 700, color: GCOLORS[g.label] || ACCENT }}>{g.value} ({g.pct}%)</span>
                      </div>
                      <div style={styles.progressBg}><div style={styles.progressFg(parseFloat(g.pct), GCOLORS[g.label])} /></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={styles.card}>
            {selMeds.length === 0 && <div style={{ ...styles.noData, padding: "16px 0 8px" }}>Select at least one medication to see patients</div>}
            <Table cols={[
              { key: "name", label: "Patient Name" },
              { key: "age", label: "Age" },
              { key: "gender", label: "Gender", render: r => <span style={styles.badge(r.gender)}>{r.gender}</span> },
              { key: "conditions", label: "Diseases", render: r => <DiseaseChips arr={r.conditions} /> },
              { key: "meds", label: "Selected Meds", render: r => <MedChips arr={r.meds.filter(m => selMeds.includes(m))} /> },
              { key: "othermeds", label: "Other Meds", render: r => <>{r.meds.filter(m => !selMeds.includes(m)).map((m, i) => <span key={i} style={styles.chip(false)}>{m}</span>)}</> },
            ]} rows={patients} empty="No patients match the selected filters" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DiseaseMedication() {
  const allDiseases = [...new Set(ALL_PATIENTS.flatMap(p => p.conditions))].sort();
  const allMeds = [...new Set(ALL_PATIENTS.flatMap(p => p.meds))].sort();
  const [selDiseases, setSelDiseases] = useState([]);
  const [selMeds, setSelMeds] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");

  const toggleD = (d) => setSelDiseases(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleM = (m) => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [ageGroup, gender]);

  const patients = useMemo(() => basePool.filter(p => {
    if (selDiseases.length > 0 && !selDiseases.some(d => p.conditions.includes(d))) return false;
    if (selMeds.length > 0 && !selMeds.some(m => p.meds.includes(m))) return false;
    return true;
  }), [selDiseases, selMeds, basePool]);

  const medDist = useMemo(() => {
    const map = {};
    basePool.forEach(p => p.meds.forEach(m => { map[m] = (map[m] || 0) + 1; }));
    const denom = Math.max(basePool.length, 1);
    return Object.entries(map).map(([label, value]) => ({ label, value, pct: ((value / denom) * 100).toFixed(1) })).sort((a, b) => b.value - a.value);
  }, [basePool]);

  const ageDist = useMemo(() => buildAgeDist(patients, patients.length), [patients]);
  const genderDist = useMemo(() => buildGenderDist(patients, patients.length), [patients]);

  return (
    <div>
      <h2 style={styles.h2}>Disease → Medication</h2>
      <p style={styles.sub}>Understand what medications patients with specific diseases are taking</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <TagSearch label="Disease" all={allDiseases} selected={selDiseases} onToggle={toggleD} searchPlaceholder="Search diseases…" />
          <TagSearch label="Medication" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Search medications…" />
          <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          <GenderFilter value={gender} onChange={setGender} />
        </div>
      </div>
      <div style={styles.row}>
        <StatCard label="Matching Patients" value={patients.length} />
        <StatCard label="Unique Medications" value={[...new Set(patients.flatMap(p => p.meds))].length} />
        <StatCard label="Top Medication" value={medDist[0]?.label || "—"} sub={medDist[0] ? `${medDist[0].pct}% of patients` : ""} />
      </div>
      <div style={styles.sectionRow}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {medDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>Medication Distribution <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of {basePool.length} patients in group</span></h3>
              <SimpleBar data={medDist} />
            </div>
          )}
          {patients.length > 0 && (
            <div style={styles.chartGrid}>
              <div style={styles.card}>
                <h3 style={styles.h3}>Age Breakdown</h3>
                <SimpleBar data={ageDist} />
              </div>
              <div style={styles.card}>
                <h3 style={styles.h3}>Gender Breakdown</h3>
                {genderDist.map((g, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, color: GCOLORS[g.label] || "#374151" }}>{g.label}</span>
                      <span style={{ fontWeight: 700, color: GCOLORS[g.label] || ACCENT }}>{g.value} ({g.pct}%)</span>
                    </div>
                    <div style={styles.progressBg}><div style={styles.progressFg(parseFloat(g.pct), GCOLORS[g.label])} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={styles.card}>
            <Table cols={[
              { key: "name", label: "Patient Name" },
              { key: "age", label: "Age" },
              { key: "gender", label: "Gender", render: r => <span style={styles.badge(r.gender)}>{r.gender}</span> },
              { key: "conditions", label: "Diseases", render: r => <DiseaseChips arr={r.conditions} /> },
              { key: "meds", label: "Medications", render: r => <MedChips arr={r.meds} /> },
            ]} rows={patients} empty="No patients match the selected filters" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CombinedDiseases() {
  const allDiseases = [...new Set(ALL_PATIENTS.flatMap(p => p.conditions))].sort();
  const [selDiseases, setSelDiseases] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const [showTop10, setShowTop10] = useState(false);

  const toggle = (d) => setSelDiseases(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const topCombos = useMemo(() => {
    const map = {};
    ALL_PATIENTS.forEach(p => { const k = [...p.conditions].sort().join(" + "); map[k] = (map[k] || 0) + 1; });
    return Object.entries(map).map(([combo, count]) => ({ combo, count, pct: ((count / ALL_PATIENTS.length) * 100).toFixed(1) })).sort((a, b) => b.count - a.count);
  }, []);

  const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [ageGroup, gender]);

  const patients = useMemo(() => basePool.filter(p => {
    if (selDiseases.length > 0 && !selDiseases.every(d => p.conditions.includes(d))) return false;
    if (p.conditions.length < 2) return false;
    return true;
  }).map(p => ({ ...p, otherDiseases: p.conditions.filter(c => !selDiseases.includes(c)) })), [selDiseases, basePool]);

  const coDist = useMemo(() => {
    const map = {};
    basePool.filter(p => p.conditions.length >= 2).forEach(p => p.conditions.forEach(c => {
      if (!selDiseases.includes(c)) map[c] = (map[c] || 0) + 1;
    }));
    const denom = Math.max(basePool.filter(p => p.conditions.length >= 2).length, 1);
    return Object.entries(map).map(([label, value]) => ({ label, value, pct: ((value / denom) * 100).toFixed(1) })).sort((a, b) => b.value - a.value);
  }, [basePool, selDiseases]);

  const ageDist = useMemo(() => buildAgeDist(patients, patients.length), [patients]);
  const genderDist = useMemo(() => buildGenderDist(patients, patients.length), [patients]);

  return (
    <div>
      <h2 style={styles.h2}>Combined Diseases</h2>
      <p style={styles.sub}>Find patients with multiple co-occurring conditions</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <TagSearch label="Disease" all={allDiseases} selected={selDiseases} onToggle={toggle} searchPlaceholder="Search diseases…" />
          <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          <GenderFilter value={gender} onChange={setGender} />
        </div>
      </div>
      <div style={styles.row}>
        <StatCard label="Patients w/ Multiple Diseases" value={patients.length} />
        <div role="button" tabIndex={0} style={{ ...styles.statCard, cursor: "pointer" }} onClick={() => setShowTop10(!showTop10)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setShowTop10(v => !v); }}>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500, marginBottom: 4 }}>Top Combination</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{topCombos[0]?.combo || "—"}</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{topCombos[0]?.pct}% · <span style={{ color: ACCENT, textDecoration: "underline" }}>View Top 10 ↗</span></div>
        </div>
      </div>

      {showTop10 && (
        <div style={{ ...styles.card, borderLeft: `3px solid ${ACCENT}` }}>
          <h3 style={styles.h3}>Top 10 Disease Combinations</h3>
          {topCombos.slice(0, 10).map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", width: 18 }}>{i + 1}.</span>
                <div>{c.combo.split(" + ").map((d, j) => <span key={j} style={styles.chip(false)}>{d}</span>)}</div>
              </div>
              <span style={{ fontWeight: 700, color: "#374151", fontSize: 12 }}>{c.count} pts · {c.pct}%</span>
            </div>
          ))}
        </div>
      )}

      <div style={styles.sectionRow}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {coDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>Co-occurring Disease Distribution <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of multi-disease patients in group</span></h3>
              <SimpleBar data={coDist} />
            </div>
          )}
          {patients.length > 0 && (
            <div style={styles.chartGrid}>
              <div style={styles.card}>
                <h3 style={styles.h3}>Age Breakdown</h3>
                <SimpleBar data={ageDist} />
              </div>
              <div style={styles.card}>
                <h3 style={styles.h3}>Gender Breakdown</h3>
                {genderDist.map((g, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, color: GCOLORS[g.label] || "#374151" }}>{g.label}</span>
                      <span style={{ fontWeight: 700, color: GCOLORS[g.label] || ACCENT }}>{g.value} ({g.pct}%)</span>
                    </div>
                    <div style={styles.progressBg}><div style={styles.progressFg(parseFloat(g.pct), GCOLORS[g.label])} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={styles.card}>
            <Table cols={[
              { key: "name", label: "Patient Name" },
              { key: "age", label: "Age" },
              { key: "gender", label: "Gender", render: r => <span style={styles.badge(r.gender)}>{r.gender}</span> },
              { key: "conditions", label: "All Diseases", render: r => <DiseaseChips arr={r.conditions} /> },
              { key: "otherDiseases", label: "Co-occurring", render: r => <DiseaseChips arr={r.otherDiseases || []} /> },
              { key: "meds", label: "Medications", render: r => <MedChips arr={r.meds} /> },
            ]} rows={patients} empty="No patients with multiple diseases match these filters" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AgeVsDisease() {
  const allDiseases = [...new Set(ALL_PATIENTS.flatMap(p => p.conditions))].sort();
  const [ageGroup, setAgeGroup] = useState("All");
  const [selDiseases, setSelDiseases] = useState([]);
  const [gender, setGender] = useState("All");

  const toggle = (d) => setSelDiseases(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [ageGroup, gender]);

  const patients = useMemo(() => {
    if (selDiseases.length === 0) return basePool;
    return basePool.filter(p => selDiseases.some(d => p.conditions.includes(d)));
  }, [basePool, selDiseases]);

  const diseaseDist = useMemo(() => {
    const map = {};
    basePool.forEach(p => p.conditions.forEach(c => {
      if (selDiseases.length === 0 || selDiseases.includes(c)) map[c] = (map[c] || 0) + 1;
    }));
    const denom = Math.max(basePool.length, 1);
    return Object.entries(map).map(([label, value]) => ({ label, value, pct: ((value / denom) * 100).toFixed(1) })).sort((a, b) => b.value - a.value);
  }, [basePool, selDiseases]);

  const genderDist = useMemo(() => buildGenderDist(patients, patients.length), [patients]);

  return (
    <div>
      <h2 style={styles.h2}>Age vs Disease</h2>
      <p style={styles.sub}>Disease prevalence across different age groups</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          <TagSearch label="Disease" all={allDiseases} selected={selDiseases} onToggle={toggle} searchPlaceholder="Search diseases…" />
          <GenderFilter value={gender} onChange={setGender} />
        </div>
      </div>
      <div style={styles.row}><StatCard label="Patients in Group" value={patients.length} /></div>
      <div style={styles.sectionRow}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {diseaseDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>
                Disease Prevalence {ageGroup !== "All" ? `· Age ${ageGroup}` : ""}
                <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}> % of {basePool.length} patients in group</span>
              </h3>
              <SimpleBar data={diseaseDist} />
            </div>
          )}
          {patients.length > 0 && genderDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>Gender Breakdown of Matched Patients</h3>
              {genderDist.map((g, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, color: GCOLORS[g.label] || "#374151" }}>{g.label}</span>
                    <span style={{ fontWeight: 700, color: GCOLORS[g.label] || ACCENT }}>{g.value} ({g.pct}%)</span>
                  </div>
                  <div style={styles.progressBg}><div style={styles.progressFg(parseFloat(g.pct), GCOLORS[g.label])} /></div>
                </div>
              ))}
            </div>
          )}
          <div style={styles.card}>
            <Table cols={[
              { key: "name", label: "Patient Name" },
              { key: "age", label: "Age" },
              { key: "gender", label: "Gender", render: r => <span style={styles.badge(r.gender)}>{r.gender}</span> },
              { key: "conditions", label: "Diseases", render: r => <DiseaseChips arr={r.conditions} /> },
              { key: "meds", label: "Medications", render: r => <MedChips arr={r.meds} /> },
            ]} rows={patients} empty="No patients match the selected filters" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AgeVsMedication() {
  const allMeds = [...new Set(ALL_PATIENTS.flatMap(p => p.meds))].sort();
  const [ageGroup, setAgeGroup] = useState("All");
  const [selMeds, setSelMeds] = useState([]);
  const [gender, setGender] = useState("All");

  const toggle = (m) => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [ageGroup, gender]);

  const patients = useMemo(() => {
    if (selMeds.length === 0) return basePool;
    return basePool.filter(p => selMeds.some(m => p.meds.includes(m)));
  }, [basePool, selMeds]);

  const medDist = useMemo(() => {
    const map = {};
    basePool.forEach(p => p.meds.forEach(m => {
      if (selMeds.length === 0 || selMeds.includes(m)) map[m] = (map[m] || 0) + 1;
    }));
    const denom = Math.max(basePool.length, 1);
    return Object.entries(map).map(([label, value]) => ({ label, value, pct: ((value / denom) * 100).toFixed(1) })).sort((a, b) => b.value - a.value);
  }, [basePool, selMeds]);

  const genderDist = useMemo(() => buildGenderDist(patients, patients.length), [patients]);

  return (
    <div>
      <h2 style={styles.h2}>Age vs Medication</h2>
      <p style={styles.sub}>Medication usage patterns across age groups</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          <TagSearch label="Medication" all={allMeds} selected={selMeds} onToggle={toggle} searchPlaceholder="Search medications…" />
          <GenderFilter value={gender} onChange={setGender} />
        </div>
      </div>
      <div style={styles.row}><StatCard label="Patients in Group" value={patients.length} /></div>
      <div style={styles.sectionRow}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {medDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>
                Medication Prevalence {ageGroup !== "All" ? `· Age ${ageGroup}` : ""}
                <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}> % of {basePool.length} patients in group</span>
              </h3>
              <SimpleBar data={medDist} />
            </div>
          )}
          {patients.length > 0 && genderDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>Gender Breakdown of Matched Patients</h3>
              {genderDist.map((g, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, color: GCOLORS[g.label] || "#374151" }}>{g.label}</span>
                    <span style={{ fontWeight: 700, color: GCOLORS[g.label] || ACCENT }}>{g.value} ({g.pct}%)</span>
                  </div>
                  <div style={styles.progressBg}><div style={styles.progressFg(parseFloat(g.pct), GCOLORS[g.label])} /></div>
                </div>
              ))}
            </div>
          )}
          <div style={styles.card}>
            <Table cols={[
              { key: "name", label: "Patient Name" },
              { key: "age", label: "Age" },
              { key: "gender", label: "Gender", render: r => <span style={styles.badge(r.gender)}>{r.gender}</span> },
              { key: "conditions", label: "Diseases", render: r => <DiseaseChips arr={r.conditions} /> },
              { key: "meds", label: "Medications", render: r => <MedChips arr={r.meds} /> },
            ]} rows={patients} empty="No patients match the selected filters" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AgeVsSex() {
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");

  const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    return true;
  }), [ageGroup]);

  const patients = useMemo(() => basePool.filter(p => {
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [basePool, gender]);

  const genderDist = useMemo(() => buildGenderDist(basePool, basePool.length), [basePool]);

  const ageDist = useMemo(() => buildAgeDist(basePool, basePool.length), [basePool]);

  return (
    <div>
      <h2 style={styles.h2}>Age vs Sex</h2>
      <p style={styles.sub}>Gender distribution across age groups</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          <GenderFilter value={gender} onChange={setGender} />
        </div>
      </div>
      <div style={styles.row}><StatCard label="Patients in Group" value={patients.length} /></div>
      <div style={styles.sectionRow}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {genderDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>
                Gender Distribution {ageGroup !== "All" ? `· Age ${ageGroup}` : ""}
                <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}> % of {basePool.length} patients in age group</span>
              </h3>
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {genderDist.map((g, i) => (
                  <div key={i} style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: GCOLORS[g.label] || "#374151" }}>{g.label}</span>
                      <span style={{ fontWeight: 700 }}>{g.pct}%</span>
                    </div>
                    <div style={styles.progressBg}><div style={styles.progressFg(parseFloat(g.pct), GCOLORS[g.label])} /></div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{g.value} patients</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {ageGroup === "All" && ageDist.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>Age Group Distribution <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of all patients</span></h3>
              <SimpleBar data={ageDist} />
            </div>
          )}
          <div style={styles.card}>
            <Table cols={[
              { key: "name", label: "Patient Name" },
              { key: "age", label: "Age" },
              { key: "gender", label: "Gender", render: r => <span style={styles.badge(r.gender)}>{r.gender}</span> },
              { key: "conditions", label: "Diseases", render: r => <DiseaseChips arr={r.conditions} /> },
              { key: "meds", label: "Medications", render: r => <MedChips arr={r.meds} /> },
            ]} rows={patients} empty="No patients match the selected filters" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CommonReportedHealth() {
  const allSymptoms = [...new Set(ALL_PATIENTS.flatMap(p => p.reportedHealth))].sort();
  const [selSymptoms, setSelSymptoms] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");

  const toggle = (s) => setSelSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const basePool = useMemo(() => ALL_PATIENTS.filter(p => {
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [ageGroup, gender]);

  const patients = useMemo(() => {
    if (selSymptoms.length === 0) return basePool;
    return basePool.filter(p => selSymptoms.some(s => p.reportedHealth.includes(s)));
  }, [selSymptoms, basePool]);

  const symptomDist = useMemo(() => {
    const map = {};
    basePool.forEach(p => p.reportedHealth.forEach(s => {
      if (selSymptoms.length === 0 || selSymptoms.includes(s)) map[s] = (map[s] || 0) + 1;
    }));
    const denom = Math.max(basePool.length, 1);
    return Object.entries(map).map(([label, value]) => ({ label, value, pct: ((value / denom) * 100).toFixed(1) })).sort((a, b) => b.value - a.value);
  }, [basePool, selSymptoms]);

  const ageDist = useMemo(() => buildAgeDist(patients, patients.length), [patients]);
  const genderDist = useMemo(() => buildGenderDist(patients, patients.length), [patients]);

  return (
    <div>
      <h2 style={styles.h2}>Most Common Reported Health Symptoms</h2>
      <p style={styles.sub}>Symptom frequency across your patient population</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <TagSearch label="Symptom" all={allSymptoms} selected={selSymptoms} onToggle={toggle} searchPlaceholder="Search symptoms…" />
          <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          <GenderFilter value={gender} onChange={setGender} />
        </div>
      </div>
      <div style={styles.row}>
        <StatCard label="Most Reported" value={symptomDist[0]?.label || "—"} sub={`${symptomDist[0]?.pct || 0}% of patients`} />
        <StatCard label="Unique Symptoms" value={symptomDist.length} />
      </div>
      <div style={styles.sectionRow}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={styles.card}>
            <h3 style={styles.h3}>Symptom Prevalence <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 11 }}>% of {basePool.length} patients in group</span></h3>
            <SimpleBar data={symptomDist} />
          </div>
          {patients.length > 0 && (
            <div style={styles.chartGrid}>
              <div style={styles.card}>
                <h3 style={styles.h3}>Age Breakdown</h3>
                <SimpleBar data={ageDist} />
              </div>
              <div style={styles.card}>
                <h3 style={styles.h3}>Gender Breakdown</h3>
                {genderDist.map((g, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, color: GCOLORS[g.label] || "#374151" }}>{g.label}</span>
                      <span style={{ fontWeight: 700, color: GCOLORS[g.label] || ACCENT }}>{g.value} ({g.pct}%)</span>
                    </div>
                    <div style={styles.progressBg}><div style={styles.progressFg(parseFloat(g.pct), GCOLORS[g.label])} /></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={styles.card}>
            <Table cols={[
              { key: "name", label: "Patient Name" },
              { key: "age", label: "Age" },
              { key: "gender", label: "Gender", render: r => <span style={styles.badge(r.gender)}>{r.gender}</span> },
              { key: "conditions", label: "Diseases", render: r => <DiseaseChips arr={r.conditions} /> },
              { key: "reportedHealth", label: "Reported Symptoms", render: r => <DiseaseChips arr={r.reportedHealth} /> },
            ]} rows={patients} empty="No patients match the selected filters" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DrugsReportedHealth() {
  const allMeds = [...new Set(ALL_PATIENTS.flatMap(p => p.meds))].sort();
  const allSymptoms = [...new Set(ALL_PATIENTS.flatMap(p => p.reportedHealth))].sort();
  const [selMeds, setSelMeds] = useState([]);
  const [selSymptoms, setSelSymptoms] = useState([]);

  const toggleM = (m) => setSelMeds(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const toggleS = (s) => setSelSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const patients = useMemo(() => ALL_PATIENTS.filter(p => {
    if (selMeds.length > 0 && !selMeds.some(m => p.meds.includes(m))) return false;
    if (selSymptoms.length > 0 && !selSymptoms.some(s => p.reportedHealth.includes(s))) return false;
    return true;
  }), [selMeds, selSymptoms]);

  const drugSymptomMap = useMemo(() => {
    return allMeds.map(med => {
      const pts = ALL_PATIENTS.filter(p => p.meds.includes(med));
      const symMap = {};
      pts.forEach(p => p.reportedHealth.forEach(s => { symMap[s] = (symMap[s] || 0) + 1; }));
      const topSym = Object.entries(symMap).sort((a, b) => b[1] - a[1])[0];
      return { med, patientCount: pts.length, topSymptom: topSym?.[0] || "—", topPct: topSym ? ((topSym[1] / pts.length) * 100).toFixed(0) : "0" };
    }).sort((a, b) => b.patientCount - a.patientCount);
  }, []);

  return (
    <div>
      <h2 style={styles.h2}>Drugs & Reported Health</h2>
      <p style={styles.sub}>Correlation between medications and patient-reported symptoms</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <TagSearch label="Medication" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Search medications…" />
          <TagSearch label="Symptom" all={allSymptoms} selected={selSymptoms} onToggle={toggleS} searchPlaceholder="Search symptoms…" />
        </div>
      </div>
      <div style={styles.sectionRow}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={styles.card}>
            <h3 style={styles.h3}>Drug &#8594; Most Common Reported Symptom</h3>
            <Table cols={[
              { key: "med", label: "Medication", render: r => <span style={styles.chip(true)}>{r.med}</span> },
              { key: "patientCount", label: "Patients" },
              { key: "topSymptom", label: "Most Reported Symptom", render: r => <span style={styles.chip(false)}>{r.topSymptom}</span> },
              { key: "topPct", label: "% of Drug Patients", render: r => <span style={{ fontWeight: 700, color: ACCENT }}>{r.topPct}%</span> },
            ]} rows={selMeds.length > 0 ? drugSymptomMap.filter(d => selMeds.includes(d.med)) : drugSymptomMap} />
          </div>
          {patients.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.h3}>Matching Patients</h3>
              <Table cols={[
                { key: "name", label: "Patient Name" },
                { key: "age", label: "Age" },
                { key: "meds", label: "Medications", render: r => <MedChips arr={r.meds} /> },
                { key: "reportedHealth", label: "Reported Symptoms", render: r => <DiseaseChips arr={r.reportedHealth} /> },
              ]} rows={patients} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const ALL_FIELDS = [
  { key: "name", label: "Patient Name" },
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "conditions", label: "Diseases", isArr: true },
  { key: "meds", label: "Medications", isArr: true, isTeal: true },
  { key: "reportedHealth", label: "Reported Symptoms", isArr: true },
];

function CustomTableBuilder() {
  const [selFields, setSelFields] = useState(["name", "age", "gender"]);
  const [filterDisease, setFilterDisease] = useState([]);
  const [filterMed, setFilterMed] = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender, setGender] = useState("All");
  const allDiseases = [...new Set(ALL_PATIENTS.flatMap(p => p.conditions))].sort();
  const allMeds = [...new Set(ALL_PATIENTS.flatMap(p => p.meds))].sort();

  const toggleField = (k) => setSelFields(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
  const toggleD = (d) => setFilterDisease(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  const toggleM = (m) => setFilterMed(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const patients = useMemo(() => ALL_PATIENTS.filter(p => {
    if (filterDisease.length > 0 && !filterDisease.some(d => p.conditions.includes(d))) return false;
    if (filterMed.length > 0 && !filterMed.some(m => p.meds.includes(m))) return false;
    if (ageGroup !== "All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if (gender !== "All" && p.gender !== gender) return false;
    return true;
  }), [filterDisease, filterMed, ageGroup, gender]);

  const cols = ALL_FIELDS.filter(f => selFields.includes(f.key)).map(f => ({
    key: f.key, label: f.label,
    render: f.isArr ? (r => f.isTeal ? <MedChips arr={r[f.key]} /> : <DiseaseChips arr={r[f.key]} />) :
      f.key === "gender" ? (r => <span style={styles.badge(r.gender)}>{r.gender}</span>) : null
  }));

  return (
    <div>
      <h2 style={styles.h2}>Custom Table Builder</h2>
      <p style={styles.sub}>Build your own data view — choose columns and apply any combination of filters</p>
      <div style={styles.filterPanel}>
        <h3 style={styles.h3}>Columns</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          {ALL_FIELDS.map(f => (
            <label key={f.key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", cursor: "pointer", fontSize: 12, color: selFields.includes(f.key) ? ACCENT : "#374151" }}>
              <input type="checkbox" checked={selFields.includes(f.key)} onChange={() => toggleField(f.key)} style={{ accentColor: ACCENT }} />
              {f.label}
            </label>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #e8eaf0", margin: "12px 0" }} />
        <h3 style={styles.h3}>Data Filters</h3>
        <div className="d-flex align-items-center justify-content-between gap-2">
          <TagSearch label="Disease" all={allDiseases} selected={filterDisease} onToggle={toggleD} searchPlaceholder="Filter by disease…" />
          <TagSearch label="Medication" all={allMeds} selected={filterMed} onToggle={toggleM} searchPlaceholder="Filter by medication…" />
          <AgeRangeFilter value={ageGroup} onChange={setAgeGroup} />
          <GenderFilter value={gender} onChange={setGender} />
        </div>
      </div>
      <div style={styles.sectionRow}>
        <div style={{ flex: 1 }}>
          <div style={styles.row}><StatCard label="Matching Patients" value={patients.length} sub={`of ${ALL_PATIENTS.length} total`} /></div>
          <div style={styles.card}>
            {cols.length === 0 ? (
              <div style={styles.noData}>Select at least one column to display</div>
            ) : (
              <Table cols={cols} rows={patients} empty="No patients match the selected filters" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { section: "Ready-Made Tables" },
  { key: "disease", label: "Disease Patients", icon: "🏥" },
  { key: "medication", label: "Medication Patients", icon: "💊" },
  { key: "dismed", label: "Disease → Medication", icon: "🔗" },
  { key: "combined", label: "Combined Diseases", icon: "⚕️" },
  { section: "Age Analysis" },
  { key: "agedisease", label: "Age vs Disease", icon: "📊" },
  { key: "agemed", label: "Age vs Medication", icon: "📈" },
  { key: "agesex", label: "Age vs Sex", icon: "👥" },
  { section: "Health Insights" },
  { key: "health", label: "Reported Health", icon: "🩺" },
  { key: "drughealth", label: "Drugs & Health", icon: "⚗️" },
  { section: "Custom" },
  { key: "custom", label: "Build Your Table", icon: "🛠️" },
];

const COMPONENTS = {
  disease: DiseasePatients,
  medication: MedicationPatients,
  dismed: DiseaseMedication,
  combined: CombinedDiseases,
  agedisease: AgeVsDisease,
  agemed: AgeVsMedication,
  agesex: AgeVsSex,
  health: CommonReportedHealth,
  drughealth: DrugsReportedHealth,
  custom: CustomTableBuilder,
};

export default function Analytics() {
  const [active, setActive] = useState("disease");
  const ActiveComponent = COMPONENTS[active];

  return (
    <div style={styles.wrap}>
      <nav style={styles.nav}>
        <div style={{ padding: "18px 20px 10px", borderBottom: "1px solid #f1f5f9", marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1a202c", letterSpacing: -.3 }}>Analytics</div>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Patient Intelligence</div>
        </div>
        {NAV.map((item, i) => {
          if (item.section) return <div key={i} style={styles.navSection}>{item.section}</div>;
          const isActive = active === item.key;
          return (
            <div key={item.key} role="button" tabIndex={0} style={styles.navItem(isActive)} onClick={() => setActive(item.key)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setActive(item.key); }}>
              <span style={{ fontSize: 14 }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <main style={styles.content}>
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}