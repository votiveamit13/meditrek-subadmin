import { useState, useMemo } from "react";
import TagSearch from "./Analytics/TagSearch";
import AgeRangeFilter from "./Analytics/AgeRangeFilter";
import GenderFilter from "./Analytics/GenderFilter";

/* ============================================================
   MOCK DATA
   ============================================================ */
const ALL_PATIENTS = [
  { id:1,  name:"John Smith",        age:65, gender:"Male",   conditions:["Hypertension","Diabetes"],              meds:["Lisinopril","Metformin"],                       reportedHealth:["Headache","Fatigue"] },
  { id:2,  name:"Michael Brown",     age:72, gender:"Male",   conditions:["Hypertension","CAD","Hyperlipidemia"],  meds:["Amlodipine","Atorvastatin","Metoprolol"],       reportedHealth:["Chest Pain","Dizziness"] },
  { id:3,  name:"Jennifer Martinez", age:52, gender:"Female", conditions:["Hypertension","Depression"],           meds:["Losartan","Sertraline"],                        reportedHealth:["Fatigue","Insomnia"] },
  { id:4,  name:"Lisa Taylor",       age:55, gender:"Female", conditions:["Diabetes","Hypertension"],             meds:["Metformin","Amlodipine"],                       reportedHealth:["Nausea","Fatigue"] },
  { id:5,  name:"James Thomas",      age:70, gender:"Male",   conditions:["Hypertension","Diabetes","COPD"],      meds:["Metoprolol","Lisinopril","Metformin","Insulin"], reportedHealth:["Shortness of Breath","Fatigue","Cough"] },
  { id:6,  name:"Emma Wilson",       age:28, gender:"Female", conditions:["Asthma"],                              meds:["Salbutamol"],                                  reportedHealth:["Wheezing","Cough"] },
  { id:7,  name:"Chris Evans",       age:25, gender:"Male",   conditions:["Asthma","Allergy"],                    meds:["Cetirizine","Salbutamol"],                      reportedHealth:["Runny Nose","Cough"] },
  { id:8,  name:"Alex Morgan",       age:34, gender:"Other",  conditions:["Anxiety"],                             meds:["Escitalopram"],                                reportedHealth:["Insomnia","Palpitations"] },
  { id:9,  name:"Sarah Johnson",     age:48, gender:"Female", conditions:["Hypertension","Thyroid"],              meds:["Amlodipine","Levothyroxine"],                   reportedHealth:["Fatigue","Weight Gain"] },
  { id:10, name:"Robert Davis",      age:61, gender:"Male",   conditions:["Diabetes","CAD"],                      meds:["Metformin","Atorvastatin","Aspirin"],            reportedHealth:["Chest Pain","Fatigue"] },
];

const AGE_GROUPS = {
  "0–18":  a => a <= 18,
  "19–30": a => a >= 19 && a <= 30,
  "31–45": a => a >= 31 && a <= 45,
  "46–60": a => a >= 46 && a <= 60,
  "60+":   a => a > 60,
};

const ACCENT    = "#1ddec4";
const ACCENT_BG = "rgba(29,222,196,0.13)";
const GCOLORS   = { Male:ACCENT, Female:"#60a5fa", Other:"#8b5cf6" };
const TOTAL     = ALL_PATIENTS.length;

/* ============================================================
   STYLES
   ============================================================ */
const S = {
  wrap:        { display:"flex", fontFamily:"'DM Sans',sans-serif", minHeight:"100vh", background:"#f4f6fb" },
  nav:         { width:230, minWidth:210, background:"#fff", borderRight:"1px solid #eaecf2", display:"flex", flexDirection:"column", flexShrink:0 },
  navHead:     { padding:"22px 20px 14px", borderBottom:"1px solid #f0f2f8" },
  navTitle:    { fontSize:15, fontWeight:800, color:"#1a202c", letterSpacing:-.3 },
  navSub:      { fontSize:11, color:"#a0aec0", marginTop:2 },
  navGroup:    { padding:"14px 16px 4px 18px", fontSize:10, fontWeight:700, letterSpacing:1.6, color:"#c4cad8", textTransform:"uppercase" },
  navItem:     a => ({
    margin:"1px 10px", padding:"9px 12px", borderRadius:10, cursor:"pointer", fontSize:12.5,
    fontWeight:a?600:400, background:a?ACCENT_BG:"transparent", color:a?ACCENT:"#4a5568",
    border:a?`1px solid rgba(29,222,196,0.25)`:"1px solid transparent",
    transition:"all .15s", display:"flex", alignItems:"center", gap:9,
  }),
  main:        { flex:1, padding:"28px 28px 40px", overflowX:"hidden", minWidth:0 },
  pageHead:    { marginBottom:20 },
  pageTitle:   { fontSize:18, fontWeight:800, color:"#1a202c", margin:0 },
  pageSub:     { fontSize:13, color:"#64748b", marginTop:4 },

  /* filters */
  filterBar:   { background:"#fff", borderRadius:14, padding:"16px 20px", border:"1px solid #eaecf2", marginBottom:20, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" },
  filterRow:   { display:"flex", gap:12, flexWrap:"wrap", alignItems:"flex-end" },
  filterLabel: { fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:1, textTransform:"uppercase", marginBottom:5, display:"block" },

  /* stat row */
  statRow:     { display:"flex", gap:14, flexWrap:"wrap", marginBottom:20 },
  statCard:    { background:"#fff", borderRadius:12, padding:"14px 18px", border:`1px solid #eaecf2`, minWidth:130, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" },
  statVal:     { fontSize:24, fontWeight:800, color:ACCENT, lineHeight:1.1 },
  statLbl:     { fontSize:11, color:"#94a3b8", marginBottom:4, fontWeight:500 },
  statSub:     { fontSize:11, color:"#b0b8c9", marginTop:3 },

  /* cards */
  card:        { background:"#fff", borderRadius:14, padding:"20px 22px", border:"1px solid #eaecf2", boxShadow:"0 1px 8px rgba(0,0,0,0.04)", marginBottom:18 },
  cardTitle:   { fontSize:13, fontWeight:700, color:"#1a202c", marginBottom:14, marginTop:0, display:"flex", alignItems:"center", justifyContent:"space-between" },
  grid2:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 },

  /* table */
  tWrap:       { overflowX:"auto", borderRadius:10, border:"1px solid #eaecf2" },
  th:          { padding:"10px 13px", fontSize:11, fontWeight:700, color:"#6b7280", background:"#f8f9fc", borderBottom:"1px solid #eaecf2", whiteSpace:"nowrap", letterSpacing:.3 },
  td:          { padding:"10px 13px", fontSize:12, color:"#374151", borderBottom:"1px solid #f4f6fb" },

  /* chips */
  chip:        t => ({
    display:"inline-flex", alignItems:"center", gap:3, padding:"2px 9px", borderRadius:999,
    fontSize:11, fontWeight:500, background:t?ACCENT_BG:"#f1f5f9", color:t?ACCENT:"#374151",
    border:t?`1px solid rgba(29,222,196,0.3)`:"1px solid #e5e7eb", margin:"2px 3px 2px 0",
  }),
  badge:       c => ({
    display:"inline-block", padding:"2px 9px", borderRadius:999, fontSize:11, fontWeight:600,
    background:c==="Male"?ACCENT_BG:c==="Female"?"rgba(96,165,250,0.15)":"rgba(139,92,246,0.15)",
    color:c==="Male"?ACCENT:c==="Female"?"#60a5fa":"#8b5cf6",
  }),

  /* bars */
  barWrap:     { display:"flex", flexDirection:"column", gap:9 },
  barRow:      { display:"flex", alignItems:"center", gap:10 },
  barLabel:    { fontSize:12, color:"#374151", fontWeight:500, minWidth:110, maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" },
  barTrack:    { flex:1, background:"#f1f5f9", borderRadius:999, height:7, overflow:"hidden" },
  barFill:     (pct,col) => ({ height:"100%", width:`${Math.min(pct,100)}%`, background:col||ACCENT, borderRadius:999, transition:"width .5s" }),
  barVal:      { fontSize:11, fontWeight:700, color:ACCENT, minWidth:60, textAlign:"right" },

  /* expand */
  expandBtn:   { border:"none", cursor:"pointer", fontSize:11, color:ACCENT, fontWeight:600, padding:"4px 10px", borderRadius:7, background:ACCENT_BG },
  expandPanel: { marginTop:14, borderTop:"1px solid #eaecf2", paddingTop:14 },

  /* misc */
  noData:      { textAlign:"center", padding:"28px 0", color:"#b0b8c9", fontSize:13 },
  input:       { padding:"7px 11px", borderRadius:8, border:"1px solid #dde1ec", fontSize:12, outline:"none", background:"#fff", width:"100%", boxSizing:"border-box" },
  checkLabel:  active => ({ display:"flex", alignItems:"center", gap:7, fontSize:12, cursor:"pointer", color:active?ACCENT:"#374151", fontWeight:active?600:400 }),
};

/* ============================================================
   HELPERS
   ============================================================ */
function pct(n, d) { return d===0 ? "0.0" : ((n/d)*100).toFixed(1); }

function buildAgeDist(pts, denom) {
  const map={};
  pts.forEach(p=>{const g=Object.keys(AGE_GROUPS).find(k=>AGE_GROUPS[k](p.age))||"Other"; map[g]=(map[g]||0)+1;});
  return Object.entries(map).map(([label,value])=>({label,value,pct:pct(value,denom)}));
}
function buildGenderDist(pts, denom) {
  const map={};
  pts.forEach(p=>{map[p.gender]=(map[p.gender]||0)+1;});
  return Object.entries(map).map(([label,value])=>({label,value,pct:pct(value,denom)})).sort((a,b)=>b.value-a.value);
}

/* ============================================================
   REUSABLE UI
   ============================================================ */
function Chip({label, teal}) { return <span style={S.chip(teal)}>{label}</span>; }
function DChips({arr}) { return <>{arr.map((c,i)=><Chip key={i} label={c} teal={false}/>)}</>; }
function MChips({arr}) { return <>{arr.map((m,i)=><Chip key={i} label={m} teal={true}/>)}</>; }

function StatCard({label, value, sub, accent}) {
  return (
    <div style={S.statCard}>
      <div style={S.statLbl}>{label}</div>
      <div style={{...S.statVal, color:accent||ACCENT}}>{value}</div>
      {sub && <div style={S.statSub}>{sub}</div>}
    </div>
  );
}

function HBar({label, value, total, pctVal, color}) {
  const p = pctVal !== undefined ? parseFloat(pctVal) : (total>0?(value/total)*100:0);
  return (
    <div style={S.barRow}>
      <span style={S.barLabel} title={label}>{label}</span>
      <div style={S.barTrack}><div style={S.barFill(p, color)} /></div>
      <span style={{...S.barVal, color:color||ACCENT}}>{value} <span style={{color:"#94a3b8",fontWeight:400}}>({p.toFixed(1)}%)</span></span>
    </div>
  );
}

function DataTable({cols, rows, empty="No data found"}) {
  return (
    <div style={S.tWrap}>
      <table style={{width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr>{cols.map(c=><th key={c.key} style={{...S.th, textAlign:c.align||"left"}}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length===0
            ? <tr><td colSpan={cols.length} style={S.noData}>{empty}</td></tr>
            : rows.map((r,i)=>(
              <tr key={i} style={{background:i%2===0?"#fff":"#fafbfd"}}>
                {cols.map(c=><td key={c.key} style={{...S.td,...(c.style||{})}}>{c.render?c.render(r):r[c.key]}</td>)}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

/* collapsible patient detail panel */
function ExpandPanel({patients}) {
  const [open, setOpen] = useState(false);
  if(!patients || patients.length===0) return null;
  return (
    <div>
      <button style={S.expandBtn} onClick={()=>setOpen(v=>!v)}>
        {open ? "▲ Collapse patients" : `▼ Expand — view ${patients.length} patient${patients.length!==1?"s":""}`}
      </button>
      {open && (
        <div style={S.expandPanel}>
          <DataTable
            cols={[
              {key:"name", label:"Patient Name"},
              {key:"age",  label:"Age"},
              {key:"gender", label:"Gender", render:r=><span style={S.badge(r.gender)}>{r.gender}</span>},
              {key:"conditions", label:"Diseases", render:r=><DChips arr={r.conditions}/>},
              {key:"meds", label:"Medications", render:r=><MChips arr={r.meds}/>},
            ]}
            rows={patients}
          />
        </div>
      )}
    </div>
  );
}

/* ============================================================
   1. DEMOGRAPHICS  (Age group × Sex)
   ============================================================ */
function Demographics() {
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender,   setGender]   = useState("All");

  const pool = useMemo(()=>ALL_PATIENTS.filter(p=>{
    if(ageGroup!=="All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if(gender!=="All"   && p.gender!==gender)            return false;
    return true;
  }),[ageGroup,gender]);

  const ageDist    = useMemo(()=>buildAgeDist(pool, TOTAL),[pool]);
  const genderDist = useMemo(()=>buildGenderDist(pool, TOTAL),[pool]);

  /* cross table: age group × gender */
  const crossData = useMemo(()=>{
    const genders = ["Male","Female","Other"];
    return Object.keys(AGE_GROUPS).map(ag=>{
      const row = {age:ag};
      genders.forEach(g=>{
        const n = ALL_PATIENTS.filter(p=>AGE_GROUPS[ag](p.age)&&p.gender===g).length;
        row[g] = n;
        row[g+"_pct"] = pct(n, TOTAL);
      });
      row.total = ALL_PATIENTS.filter(p=>AGE_GROUPS[ag](p.age)).length;
      row.total_pct = pct(row.total, TOTAL);
      return row;
    });
  },[]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Demographics</h2>
        <p style={S.pageSub}>Age group × Sex distribution across your patient population</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:1, minWidth:180}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1, minWidth:180}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
      </div>

      <div style={S.statRow}>
        <StatCard label="Patients in View" value={pool.length} sub={`${pct(pool.length,TOTAL)}% of all patients`}/>
        <StatCard label="Total Patients"   value={TOTAL}/>
        <StatCard label="Age Groups"       value={Object.keys(AGE_GROUPS).length}/>
      </div>

      <div style={S.grid2}>
        {/* Age dist */}
        <div style={S.card}>
          <p style={S.cardTitle}>Age Group Distribution <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>% of all {TOTAL} patients</span></p>
          <div style={S.barWrap}>
            {ageDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={TOTAL} pctVal={d.pct}/>)}
          </div>
        </div>
        {/* Gender dist */}
        <div style={S.card}>
          <p style={S.cardTitle}>Sex Distribution <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>% of all {TOTAL} patients</span></p>
          <div style={S.barWrap}>
            {genderDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={TOTAL} pctVal={d.pct} color={GCOLORS[d.label]}/>)}
          </div>
        </div>
      </div>

      {/* Cross table */}
      <div style={S.card}>
        <p style={S.cardTitle}>Age × Sex Cross-table</p>
        <DataTable
          cols={[
            {key:"age",       label:"Age Group"},
            {key:"Male",      label:"Male (n)", render:r=><span style={{fontWeight:600,color:ACCENT}}>{r.Male} <span style={{color:"#94a3b8",fontWeight:400}}>({r.Male_pct}%)</span></span>},
            {key:"Female",    label:"Female (n)", render:r=><span style={{fontWeight:600,color:"#60a5fa"}}>{r.Female} <span style={{color:"#94a3b8",fontWeight:400}}>({r.Female_pct}%)</span></span>},
            {key:"Other",     label:"Other (n)", render:r=><span style={{fontWeight:600,color:"#8b5cf6"}}>{r.Other} <span style={{color:"#94a3b8",fontWeight:400}}>({r.Other_pct}%)</span></span>},
            {key:"total",     label:"Total", render:r=><span style={{fontWeight:700}}>{r.total} <span style={{color:"#94a3b8",fontWeight:400}}>({r.total_pct}%)</span></span>},
          ]}
          rows={crossData}
        />
        <div style={{marginTop:14}}>
          <ExpandPanel patients={pool}/>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   2. DISEASE / DEMOGRAPHICS
   ============================================================ */
function DiseaseDemo() {
  const allDiseases = [...new Set(ALL_PATIENTS.flatMap(p=>p.conditions))].sort();
  const [selDiseases, setSelDiseases] = useState([]);
  const [ageGroup,    setAgeGroup]    = useState("All");
  const [gender,      setGender]      = useState("All");
  const [combinedOnly,setCombined]    = useState(false);

  const toggleD = d=>setSelDiseases(prev=>prev.includes(d)?prev.filter(x=>x!==d):[...prev,d]);

  const basePool = useMemo(()=>ALL_PATIENTS.filter(p=>{
    if(ageGroup!=="All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if(gender!=="All"   && p.gender!==gender)            return false;
    return true;
  }),[ageGroup,gender]);

  const patients = useMemo(()=>{
    let r = basePool;
    if(selDiseases.length>0) {
      if(combinedOnly && selDiseases.length>=2)
        r = r.filter(p=>selDiseases.every(d=>p.conditions.includes(d)));
      else
        r = r.filter(p=>selDiseases.some(d=>p.conditions.includes(d)));
    } else if(combinedOnly) {
      r = r.filter(p=>p.conditions.length>=2);
    }
    return r;
  },[basePool,selDiseases,combinedOnly]);

  const diseaseDist = useMemo(()=>{
    const map={};
    basePool.forEach(p=>p.conditions.forEach(c=>{
      if(!selDiseases.length||selDiseases.includes(c)) map[c]=(map[c]||0)+1;
    }));
    return Object.entries(map).map(([k,v])=>({label:k,value:v,pct:pct(v,basePool.length)})).sort((a,b)=>b.value-a.value);
  },[basePool,selDiseases]);

  const ageDist    = useMemo(()=>buildAgeDist(patients,patients.length),[patients]);
  const genderDist = useMemo(()=>buildGenderDist(patients,patients.length),[patients]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Disease / Demographics</h2>
        <p style={S.pageSub}>Disease prevalence by age and sex</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:2,minWidth:200}}><TagSearch label="Disease" all={allDiseases} selected={selDiseases} onToggle={toggleD} searchPlaceholder="Search diseases…"/></div>
          <div style={{flex:1,minWidth:160}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:160}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
        {selDiseases.length>=2 && (
          <label style={{...S.checkLabel(combinedOnly), marginTop:10}}>
            <input type="checkbox" checked={combinedOnly} onChange={e=>setCombined(e.target.checked)} style={{accentColor:ACCENT}}/>
            Combined diseases only (patients with ALL selected diseases)
          </label>
        )}
      </div>

      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={patients.length} sub={`${pct(patients.length,basePool.length)}% of group · ${pct(patients.length,TOTAL)}% of all`}/>
        <StatCard label="Group Size" value={basePool.length} sub={`${pct(basePool.length,TOTAL)}% of all patients`}/>
        <StatCard label="Diseases Selected" value={selDiseases.length||"All"}/>
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>Disease Distribution <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>% of {basePool.length} in group</span></p>
          <div style={S.barWrap}>{diseaseDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={basePool.length} pctVal={d.pct}/>)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {ageDist.length>0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>Age Breakdown <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>% of matched</span></p>
              <div style={S.barWrap}>{ageDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={patients.length} pctVal={d.pct}/>)}</div>
            </div>
          )}
          {genderDist.length>0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>Sex Breakdown <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>% of matched</span></p>
              <div style={S.barWrap}>{genderDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={patients.length} pctVal={d.pct} color={GCOLORS[d.label]}/>)}</div>
            </div>
          )}
        </div>
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>Patient Table</p>
        <DataTable
          cols={[
            {key:"name",label:"Patient Name"},
            {key:"age",label:"Age"},
            {key:"gender",label:"Gender",render:r=><span style={S.badge(r.gender)}>{r.gender}</span>},
            {key:"conditions",label:"Diseases",render:r=><DChips arr={r.conditions}/>},
            {key:"meds",label:"Medications",render:r=><MChips arr={r.meds}/>},
          ]}
          rows={patients}
          empty="No patients match the selected filters"
        />
      </div>
    </div>
  );
}

/* ============================================================
   3. DISEASE / MEDICATION
   Multiple disease combos → drug list with % and numbers
   ============================================================ */
function DiseaseMedication() {
  const allDiseases = [...new Set(ALL_PATIENTS.flatMap(p=>p.conditions))].sort();
  const [selDiseases, setSelDiseases] = useState([]);
  const [ageGroup,    setAgeGroup]    = useState("All");
  const [gender,      setGender]      = useState("All");
  const [combinedOnly,setCombined]    = useState(false);
  const [excludeMeds, setExcludeMeds] = useState([]);

  const toggleD = d=>setSelDiseases(prev=>prev.includes(d)?prev.filter(x=>x!==d):[...prev,d]);
  const toggleExclude = m=>setExcludeMeds(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);

  const basePool = useMemo(()=>ALL_PATIENTS.filter(p=>{
    if(ageGroup!=="All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if(gender!=="All"   && p.gender!==gender)            return false;
    return true;
  }),[ageGroup,gender]);

  const patients = useMemo(()=>{
    let r = basePool;
    if(selDiseases.length>0) {
      if(combinedOnly && selDiseases.length>=2)
        r = r.filter(p=>selDiseases.every(d=>p.conditions.includes(d)));
      else
        r = r.filter(p=>selDiseases.some(d=>p.conditions.includes(d)));
    }
    return r;
  },[basePool,selDiseases,combinedOnly]);

  /* drug distribution among matched patients */
  const medDist = useMemo(()=>{
    const map={};
    patients.forEach(p=>p.meds.forEach(m=>{
      if(!excludeMeds.includes(m)) map[m]=(map[m]||0)+1;
    }));
    return Object.entries(map).map(([label,value])=>({
      label, value,
      pctOfMatched: pct(value,patients.length),
      pctOfAll:     pct(value,TOTAL),
    })).sort((a,b)=>b.value-a.value);
  },[patients,excludeMeds]);

  const allMedsInResult = useMemo(()=>[...new Set(patients.flatMap(p=>p.meds))].sort(),[patients]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Disease / Medication</h2>
        <p style={S.pageSub}>Select one or more diseases to see which drugs are prescribed — with counts and percentages</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:2,minWidth:200}}><TagSearch label="Disease(s)" all={allDiseases} selected={selDiseases} onToggle={toggleD} searchPlaceholder="Add diseases…"/></div>
          <div style={{flex:1,minWidth:160}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:160}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
        {selDiseases.length>=2 && (
          <label style={{...S.checkLabel(combinedOnly), marginTop:10}}>
            <input type="checkbox" checked={combinedOnly} onChange={e=>setCombined(e.target.checked)} style={{accentColor:ACCENT}}/>
            Combined — patients must have ALL selected diseases
          </label>
        )}
        {allMedsInResult.length>0 && (
          <div style={{marginTop:12}}>
            <span style={{...S.filterLabel, display:"block", marginBottom:6}}>Exclude medications from table</span>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {allMedsInResult.map(m=>(
                <label key={m} style={S.checkLabel(excludeMeds.includes(m))}>
                  <input type="checkbox" checked={excludeMeds.includes(m)} onChange={()=>toggleExclude(m)} style={{accentColor:"#ef4444"}}/>
                  <span style={{color:excludeMeds.includes(m)?"#ef4444":"#374151"}}>{m}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={patients.length} sub={`${pct(patients.length,TOTAL)}% of all patients`}/>
        <StatCard label="Unique Drugs" value={medDist.length}/>
        <StatCard label="Top Drug" value={medDist[0]?.label||"—"} sub={medDist[0]?`${medDist[0].pctOfMatched}% of matched`:""}/>
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>
          Drug Distribution
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:400,marginLeft:8}}>among {patients.length} matched patients</span>
        </p>
        {medDist.length===0
          ? <div style={S.noData}>Select a disease to see medication data</div>
          : <DataTable
              cols={[
                {key:"label",          label:"Medication",    render:r=><Chip label={r.label} teal={true}/>},
                {key:"value",          label:"# Patients",    render:r=><span style={{fontWeight:700,color:ACCENT}}>{r.value}</span>},
                {key:"pctOfMatched",   label:"% of Matched",  render:r=><span style={{fontWeight:600}}>{r.pctOfMatched}%</span>},
                {key:"pctOfAll",       label:"% of All Patients", render:r=><span style={{color:"#94a3b8"}}>{r.pctOfAll}%</span>},
                {key:"bar", label:"", render:r=>(
                  <div style={{...S.barTrack, minWidth:80}}>
                    <div style={S.barFill(parseFloat(r.pctOfMatched))}/>
                  </div>
                )},
              ]}
              rows={medDist}
            />
        }
        <div style={{marginTop:14}}><ExpandPanel patients={patients}/></div>
      </div>
    </div>
  );
}

/* ============================================================
   4. MEDICATION / DEMOGRAPHICS
   ============================================================ */
function MedicationDemo() {
  const allMeds = [...new Set(ALL_PATIENTS.flatMap(p=>p.meds))].sort();
  const [selMeds,  setSelMeds]  = useState([]);
  const [ageGroup, setAgeGroup] = useState("All");
  const [gender,   setGender]   = useState("All");

  const toggleM = m=>setSelMeds(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);

  const basePool = useMemo(()=>ALL_PATIENTS.filter(p=>{
    if(ageGroup!=="All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if(gender!=="All"   && p.gender!==gender)            return false;
    return true;
  }),[ageGroup,gender]);

  const patients = useMemo(()=>{
    if(selMeds.length===0) return basePool;
    return basePool.filter(p=>selMeds.some(m=>p.meds.includes(m)));
  },[basePool,selMeds]);

  const medDist    = useMemo(()=>{
    const map={};
    basePool.forEach(p=>p.meds.forEach(m=>{
      if(!selMeds.length||selMeds.includes(m)) map[m]=(map[m]||0)+1;
    }));
    return Object.entries(map).map(([k,v])=>({label:k,value:v,pct:pct(v,basePool.length)})).sort((a,b)=>b.value-a.value);
  },[basePool,selMeds]);

  const ageDist    = useMemo(()=>buildAgeDist(patients,patients.length),[patients]);
  const genderDist = useMemo(()=>buildGenderDist(patients,patients.length),[patients]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Medication / Demographics</h2>
        <p style={S.pageSub}>Medication usage breakdown by age and sex</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:2,minWidth:200}}><TagSearch label="Medication" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Search medications…"/></div>
          <div style={{flex:1,minWidth:160}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:160}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
      </div>

      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={patients.length} sub={`${pct(patients.length,basePool.length)}% of group`}/>
        <StatCard label="Group Size" value={basePool.length} sub={`${pct(basePool.length,TOTAL)}% of all patients`}/>
        <StatCard label="Meds Selected" value={selMeds.length||"All"}/>
      </div>

      <div style={S.grid2}>
        <div style={S.card}>
          <p style={S.cardTitle}>Medication Distribution <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>% of {basePool.length} in group</span></p>
          <div style={S.barWrap}>{medDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={basePool.length} pctVal={d.pct}/>)}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {ageDist.length>0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>Age Breakdown <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>% of matched</span></p>
              <div style={S.barWrap}>{ageDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={patients.length} pctVal={d.pct}/>)}</div>
            </div>
          )}
          {genderDist.length>0 && (
            <div style={S.card}>
              <p style={S.cardTitle}>Sex Breakdown <span style={{fontSize:10,color:"#94a3b8",fontWeight:400}}>% of matched</span></p>
              <div style={S.barWrap}>{genderDist.map((d,i)=><HBar key={i} label={d.label} value={d.value} total={patients.length} pctVal={d.pct} color={GCOLORS[d.label]}/>)}</div>
            </div>
          )}
        </div>
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>Patient Table</p>
        <DataTable
          cols={[
            {key:"name",label:"Patient Name"},
            {key:"age",label:"Age"},
            {key:"gender",label:"Gender",render:r=><span style={S.badge(r.gender)}>{r.gender}</span>},
            {key:"conditions",label:"Diseases",render:r=><DChips arr={r.conditions}/>},
            {key:"meds",label:"Medications",render:r=><MChips arr={r.meds}/>},
          ]}
          rows={patients}
          empty="No patients match the selected filters"
        />
      </div>
    </div>
  );
}

/* ============================================================
   5. MEDICATION / DISEASE
   Multiple medication combos → disease list with % and numbers
   ============================================================ */
function MedicationDisease() {
  const allMeds     = [...new Set(ALL_PATIENTS.flatMap(p=>p.meds))].sort();
  const [selMeds,    setSelMeds]    = useState([]);
  const [ageGroup,   setAgeGroup]   = useState("All");
  const [gender,     setGender]     = useState("All");
  const [comboOnly,  setComboOnly]  = useState(false);
  const [excludeDis, setExcludeDis] = useState([]);

  const toggleM = m=>setSelMeds(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);
  const toggleExclude = d=>setExcludeDis(prev=>prev.includes(d)?prev.filter(x=>x!==d):[...prev,d]);

  const basePool = useMemo(()=>ALL_PATIENTS.filter(p=>{
    if(ageGroup!=="All" && !AGE_GROUPS[ageGroup](p.age)) return false;
    if(gender!=="All"   && p.gender!==gender)            return false;
    return true;
  }),[ageGroup,gender]);

  const patients = useMemo(()=>{
    let r = basePool;
    if(selMeds.length>0) {
      if(comboOnly && selMeds.length>=2)
        r = r.filter(p=>selMeds.every(m=>p.meds.includes(m)));
      else
        r = r.filter(p=>selMeds.some(m=>p.meds.includes(m)));
    }
    return r;
  },[basePool,selMeds,comboOnly]);

  const diseaseDist = useMemo(()=>{
    const map={};
    patients.forEach(p=>p.conditions.forEach(c=>{
      if(!excludeDis.includes(c)) map[c]=(map[c]||0)+1;
    }));
    return Object.entries(map).map(([label,value])=>({
      label, value,
      pctOfMatched: pct(value,patients.length),
      pctOfAll:     pct(value,TOTAL),
    })).sort((a,b)=>b.value-a.value);
  },[patients,excludeDis]);

  const allDisInResult = useMemo(()=>[...new Set(patients.flatMap(p=>p.conditions))].sort(),[patients]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Medication / Disease</h2>
        <p style={S.pageSub}>Select one or more medications to see which diseases are associated — with counts and percentages</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:2,minWidth:200}}><TagSearch label="Medication(s)" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Add medications…"/></div>
          <div style={{flex:1,minWidth:160}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:160}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
        {selMeds.length>=2 && (
          <label style={{...S.checkLabel(comboOnly), marginTop:10}}>
            <input type="checkbox" checked={comboOnly} onChange={e=>setComboOnly(e.target.checked)} style={{accentColor:ACCENT}}/>
            Combination — patients must be on ALL selected medications
          </label>
        )}
        {allDisInResult.length>0 && (
          <div style={{marginTop:12}}>
            <span style={{...S.filterLabel, display:"block", marginBottom:6}}>Exclude diseases from table</span>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {allDisInResult.map(d=>(
                <label key={d} style={S.checkLabel(excludeDis.includes(d))}>
                  <input type="checkbox" checked={excludeDis.includes(d)} onChange={()=>toggleExclude(d)} style={{accentColor:"#ef4444"}}/>
                  <span style={{color:excludeDis.includes(d)?"#ef4444":"#374151"}}>{d}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={S.statRow}>
        <StatCard label="Matched Patients" value={patients.length} sub={`${pct(patients.length,TOTAL)}% of all patients`}/>
        <StatCard label="Unique Diseases" value={diseaseDist.length}/>
        <StatCard label="Top Disease" value={diseaseDist[0]?.label||"—"} sub={diseaseDist[0]?`${diseaseDist[0].pctOfMatched}% of matched`:""}/>
      </div>

      <div style={S.card}>
        <p style={S.cardTitle}>
          Disease Distribution
          <span style={{fontSize:10,color:"#94a3b8",fontWeight:400,marginLeft:8}}>among {patients.length} matched patients</span>
        </p>
        {diseaseDist.length===0
          ? <div style={S.noData}>Select a medication to see disease data</div>
          : <DataTable
              cols={[
                {key:"label",        label:"Disease",        render:r=><Chip label={r.label} teal={false}/>},
                {key:"value",        label:"# Patients",     render:r=><span style={{fontWeight:700,color:ACCENT}}>{r.value}</span>},
                {key:"pctOfMatched", label:"% of Matched",   render:r=><span style={{fontWeight:600}}>{r.pctOfMatched}%</span>},
                {key:"pctOfAll",     label:"% of All Patients", render:r=><span style={{color:"#94a3b8"}}>{r.pctOfAll}%</span>},
                {key:"bar", label:"", render:r=>(
                  <div style={{...S.barTrack, minWidth:80}}>
                    <div style={{...S.barFill(parseFloat(r.pctOfMatched)), background:"#f59e0b"}}/>
                  </div>
                )},
              ]}
              rows={diseaseDist}
            />
        }
        <div style={{marginTop:14}}><ExpandPanel patients={patients}/></div>
      </div>
    </div>
  );
}

/* ============================================================
   6. MEDICATION / REPORTED HEALTH
   ============================================================ */
function MedicationHealth() {
  const allMeds = [...new Set(ALL_PATIENTS.flatMap(p=>p.meds))].sort();
  const [selMeds, setSelMeds] = useState([]);
  const toggleM = m=>setSelMeds(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);

  /* For each medication: show reported health outcomes and % */
  const medHealthData = useMemo(()=>{
    const meds = selMeds.length>0 ? selMeds : allMeds;
    return meds.map(med=>{
      const pts = ALL_PATIENTS.filter(p=>p.meds.includes(med));
      const symMap={};
      pts.forEach(p=>p.reportedHealth.forEach(s=>{symMap[s]=(symMap[s]||0)+1;}));
      const outcomes = Object.entries(symMap)
        .map(([symptom,count])=>({symptom, count, pct:pct(count,pts.length)}))
        .sort((a,b)=>b.count-a.count);
      return {med, patientCount:pts.length, pctOfAll:pct(pts.length,TOTAL), outcomes};
    }).filter(d=>d.patientCount>0);
  },[selMeds]);

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Medication / Reported Health</h2>
        <p style={S.pageSub}>For each medication, see the reported health outcomes and their frequency</p>
      </div>

      <div style={S.filterBar}>
        <div style={S.filterRow}>
          <div style={{flex:1,minWidth:240}}><TagSearch label="Drug name(s)" all={allMeds} selected={selMeds} onToggle={toggleM} searchPlaceholder="Filter by drug name…"/></div>
        </div>
      </div>

      {medHealthData.map((item,idx)=>(
        <div key={idx} style={S.card}>
          <p style={S.cardTitle}>
            <span><Chip label={item.med} teal={true}/> <span style={{fontSize:12,color:"#94a3b8",fontWeight:400,marginLeft:6}}>{item.patientCount} patients ({item.pctOfAll}% of all)</span></span>
          </p>
          <div style={S.barWrap}>
            {item.outcomes.map((o,i)=>(
              <HBar key={i} label={o.symptom} value={o.count} total={item.patientCount} pctVal={o.pct} color="#f59e0b"/>
            ))}
          </div>
          <div style={{marginTop:14}}>
            <ExpandPanel patients={ALL_PATIENTS.filter(p=>p.meds.includes(item.med))}/>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   7. CUSTOMIZE TABLE
   ============================================================ */
const FIELD_DEFS = [
  {key:"name",        label:"Patient Name"},
  {key:"age",         label:"Age"},
  {key:"gender",      label:"Gender"},
  {key:"conditions",  label:"Diseases",          isArr:true},
  {key:"meds",        label:"Medications",        isArr:true, teal:true},
  {key:"reportedHealth",label:"Reported Health",  isArr:true},
];

function CustomizeTable() {
  const allDiseases = [...new Set(ALL_PATIENTS.flatMap(p=>p.conditions))].sort();
  const allMeds     = [...new Set(ALL_PATIENTS.flatMap(p=>p.meds))].sort();
  const allSymptoms = [...new Set(ALL_PATIENTS.flatMap(p=>p.reportedHealth))].sort();

  const [selFields,    setSelFields]    = useState(["name","age","gender","conditions","meds"]);
  const [filterDis,    setFilterDis]    = useState([]);
  const [filterMed,    setFilterMed]    = useState([]);
  const [filterHealth, setFilterHealth] = useState([]);
  const [ageGroup,     setAgeGroup]     = useState("All");
  const [gender,       setGender]       = useState("All");

  const toggleF = k=>setSelFields(prev=>prev.includes(k)?prev.filter(x=>x!==k):[...prev,k]);
  const toggleD = d=>setFilterDis(prev=>prev.includes(d)?prev.filter(x=>x!==d):[...prev,d]);
  const toggleM = m=>setFilterMed(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m]);
  const toggleH = h=>setFilterHealth(prev=>prev.includes(h)?prev.filter(x=>x!==h):[...prev,h]);

  const patients = useMemo(()=>ALL_PATIENTS.filter(p=>{
    if(filterDis.length>0    && !filterDis.some(d=>p.conditions.includes(d)))      return false;
    if(filterMed.length>0    && !filterMed.some(m=>p.meds.includes(m)))            return false;
    if(filterHealth.length>0 && !filterHealth.some(h=>p.reportedHealth.includes(h))) return false;
    if(ageGroup!=="All"      && !AGE_GROUPS[ageGroup](p.age))                       return false;
    if(gender!=="All"        && p.gender!==gender)                                   return false;
    return true;
  }),[filterDis,filterMed,filterHealth,ageGroup,gender]);

  const cols = FIELD_DEFS.filter(f=>selFields.includes(f.key)).map(f=>({
    key:f.key, label:f.label,
    render: f.isArr
      ? (r=>f.teal?<MChips arr={r[f.key]}/>:<DChips arr={r[f.key]}/>)
      : f.key==="gender"?(r=><span style={S.badge(r.gender)}>{r.gender}</span>)
      : null
  }));

  return (
    <div>
      <div style={S.pageHead}>
        <h2 style={S.pageTitle}>Customize Table</h2>
        <p style={S.pageSub}>Build your own lookup — choose columns and stack filters to find exactly who you need</p>
      </div>

      <div style={S.filterBar}>
        {/* Column picker */}
        <div style={{marginBottom:14}}>
          <span style={{...S.filterLabel, display:"block", marginBottom:8}}>Columns to display</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
            {FIELD_DEFS.map(f=>(
              <label key={f.key} style={S.checkLabel(selFields.includes(f.key))}>
                <input type="checkbox" checked={selFields.includes(f.key)} onChange={()=>toggleF(f.key)} style={{accentColor:ACCENT}}/>
                {f.label}
              </label>
            ))}
          </div>
        </div>
        <div style={{borderTop:"1px solid #eaecf2",margin:"12px 0"}}/>
        {/* Filters */}
        <div style={{...S.filterRow, alignItems:"flex-start"}}>
          <div style={{flex:1,minWidth:160}}><TagSearch label="Disease" all={allDiseases} selected={filterDis} onToggle={toggleD} searchPlaceholder="Filter by disease…"/></div>
          <div style={{flex:1,minWidth:160}}><TagSearch label="Medication" all={allMeds} selected={filterMed} onToggle={toggleM} searchPlaceholder="Filter by medication…"/></div>
          <div style={{flex:1,minWidth:160}}><TagSearch label="Reported Health" all={allSymptoms} selected={filterHealth} onToggle={toggleH} searchPlaceholder="Filter by symptom…"/></div>
          <div style={{flex:1,minWidth:140}}><AgeRangeFilter value={ageGroup} onChange={setAgeGroup}/></div>
          <div style={{flex:1,minWidth:140}}><GenderFilter value={gender} onChange={setGender}/></div>
        </div>
      </div>

      <div style={S.statRow}>
        <StatCard label="Matching Patients" value={patients.length} sub={`${pct(patients.length,TOTAL)}% of all ${TOTAL} patients`}/>
        <StatCard label="Total Patients" value={TOTAL}/>
        <StatCard label="Active Filters" value={filterDis.length+filterMed.length+filterHealth.length+(ageGroup!=="All"?1:0)+(gender!=="All"?1:0)}/>
      </div>

      <div style={S.card}>
        {cols.length===0
          ? <div style={S.noData}>Select at least one column to display</div>
          : <DataTable cols={cols} rows={patients} empty="No patients match the selected filters"/>
        }
      </div>
    </div>
  );
}

/* ============================================================
   NAV
   ============================================================ */
const NAV = [
  { section:"Patient Info" },
  { key:"demographics",  label:"Demographics",           icon:"👥" },
  { section:"Disease" },
  { key:"diseasedemo",   label:"Disease / Demographics", icon:"🏥" },
  { key:"diseasemed",    label:"Disease / Medication",   icon:"💊" },
  { section:"Drug Info" },
  { key:"meddemo",       label:"Medication / Demographics", icon:"📊" },
  { key:"meddisease",    label:"Medication / Disease",   icon:"🔗" },
  { key:"medhealth",     label:"Medication / Reported Health", icon:"🩺" },
  { section:"Custom" },
  { key:"customize",     label:"Customize Table",        icon:"🛠️" },
];

const VIEWS = {
  demographics: Demographics,
  diseasedemo:  DiseaseDemo,
  diseasemed:   DiseaseMedication,
  meddemo:      MedicationDemo,
  meddisease:   MedicationDisease,
  medhealth:    MedicationHealth,
  customize:    CustomizeTable,
};

/* ============================================================
   ROOT
   ============================================================ */
export default function Analytics() {
  const [active, setActive] = useState("demographics");
  const View = VIEWS[active];

  return (
    <div style={S.wrap}>
      <nav style={S.nav}>
        <div style={S.navHead}>
          <div style={S.navTitle}>Analytics</div>
          <div style={S.navSub}>Patient Intelligence</div>
        </div>
        {NAV.map((item,i)=>{
          if(item.section) return <div key={i} style={S.navGroup}>{item.section}</div>;
          const isActive = active===item.key;
          return (
            <div
              key={item.key}
              role="button"
              tabIndex={0}
              style={S.navItem(isActive)}
              onClick={()=>setActive(item.key)}
              onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setActive(item.key);}}
            >
              <span style={{fontSize:15}}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <main style={S.main}>
        {View && <View/>}
      </main>
    </div>
  );
}