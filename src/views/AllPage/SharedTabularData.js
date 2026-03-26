import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Base_Url } from '../../config';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomTable from 'component/common/CustomTable';

// ─── Styles ──────────────────────────────────────────────────────────────────
const STYLES = `
  .std-root {
    min-height: 100vh;
    background: #f5f6fa;
    color: #1a1d23;
  }
  .std-header { margin-bottom: 20px; }
  .std-title { font-size: 22px; font-weight: 700; letter-spacing: -0.4px; color: #111827; margin: 0; }
  .std-subtitle { font-size: 13px; color: #6b7280; margin: 4px 0 0; font-weight: 400; }

  /* Filter card */
  .std-filter-card {
    background: #fff;
    border-radius: 16px;
    padding: 24px 28px;
    margin-bottom: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
  }
  .std-filter-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1.8fr auto;
    gap: 16px;
    align-items: end;
  }
  @media (max-width: 900px) { .std-filter-grid { grid-template-columns: 1fr 1fr; } }

  .std-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 7px;
  }
  .std-input {
    width: 100%;
    height: 42px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 0 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #111827;
    background: #fafafa;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
    box-sizing: border-box;
  }
  .std-input:focus {
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
    background: #fff;
  }
  .std-error { color: #ef4444; font-size: 12px; margin-top: 4px; }

  .std-apply-btn {
    height: 42px;
    padding: 0 24px;
    background: #14b8a6;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
    white-space: nowrap;
    width: 100%;
  }
  .std-apply-btn:hover { background: #0d9488; box-shadow: 0 4px 12px rgba(20,184,166,0.3); }
  .std-apply-btn:active { transform: scale(0.97); }
  .std-apply-btn:disabled { background: #a7f3d0; cursor: not-allowed; }

  /* Patient picker */
  .std-patient-picker { position: relative; }
  .std-picker-trigger {
    width: 100%;
    height: 42px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 0 38px 0 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #111827;
    background: #fafafa;
    outline: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: border-color 0.18s, box-shadow 0.18s;
    box-sizing: border-box;
    user-select: none;
    position: relative;
  }
  .std-picker-trigger:hover, .std-picker-trigger.open {
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
    background: #fff;
  }
  .std-picker-trigger-text {
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    flex: 1; font-size: 14px; color: #374151;
  }
  .std-picker-trigger-text.placeholder { 
    color: #9ca3af;
    background: #fff; 
  }
  .std-picker-caret {
    position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%); color: #9ca3af;
    pointer-events: none; transition: transform 0.18s;
  }
  .std-picker-caret.open { transform: translateY(-50%) rotate(180deg); }
  .std-picker-dropdown {
    position: absolute; top: calc(100% + 6px); left: 0; right: 0;
    background: #fff; border: 1.5px solid #e5e7eb; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12); z-index: 200; overflow: hidden;
    animation: dropIn 0.16s ease;
  }
  @keyframes dropIn { from { opacity:0; transform: translateY(-6px); } to { opacity:1; transform: translateY(0); } }
  .std-picker-search { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; }
  .std-picker-search input {
    width: 100%; border: 1.5px solid #e5e7eb; border-radius: 8px;
    padding: 6px 10px; font-size: 13px; font-family: 'DM Sans', sans-serif;
    outline: none; background: #f9fafb; box-sizing: border-box;
  }
  .std-picker-search input:focus { border-color: #14b8a6; background: #fff; }
  .std-picker-actions {
    padding: 7px 12px; border-bottom: 1px solid #f3f4f6;
    display: flex; gap: 10px; align-items: center;
  }
  .std-picker-action-btn {
    font-size: 12px; font-weight: 600; color: #14b8a6;
    background: none; border: none; cursor: pointer; padding: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .std-picker-action-btn:hover { text-decoration: underline; }
  .std-picker-list { max-height: 200px; overflow-y: auto; padding: 6px 0; }
  .std-picker-item {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 14px; cursor: pointer; font-size: 14px; color: #374151;
    transition: background 0.1s;
  }
  .std-picker-item:hover { background: #f0fdfb; }
  .std-picker-item.selected { background: #f0fdfb; }
  .std-picker-checkbox {
    width: 16px; height: 16px; border-radius: 4px; border: 2px solid #d1d5db;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.12s, border-color 0.12s;
  }
  .std-picker-item.selected .std-picker-checkbox { background: #14b8a6; border-color: #14b8a6; }
  .std-picker-empty { padding: 16px; text-align: center; color: #9ca3af; font-size: 13px; }

  /* Chips */
  .std-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
  .std-chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f0fdfb; border: 1px solid #99f6e4; color: #0f766e;
    border-radius: 6px; padding: 3px 8px 3px 10px; font-size: 12px; font-weight: 500;
  }
  .std-chip-remove {
    background: none; border: none; color: #0f766e; cursor: pointer;
    padding: 0; line-height: 1; font-size: 14px; opacity: 0.7;
  }
  .std-chip-remove:hover { opacity: 1; }

  /* Options row */
  .std-options-row {
    margin-top: 16px; display: flex; align-items: center;
    gap: 20px; flex-wrap: wrap;
  }
  .std-checkbox-label {
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: #4b5563; cursor: pointer; user-select: none;
  }
  .std-checkbox-label input[type=checkbox] { accent-color: #14b8a6; width: 15px; height: 15px; cursor: pointer; }

  /* Tabs */
  .std-tabs {
    display: flex; gap: 4px; margin-bottom: 20px;
    background: #fff; border-radius: 14px; padding: 6px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    overflow-x: auto;
  }
  .std-tab-btn {
    flex-shrink: 0;
    padding: 8px 18px;
    border: none; border-radius: 10px;
    font-size: 13px; font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    background: transparent; color: #6b7280;
    display: flex; align-items: center; gap: 7px;
    white-space: nowrap;
  }
  .std-tab-btn:hover { background: #f0fdfb; color: #0f766e; }
  .std-tab-btn.active {
    background: #14b8a6; color: #fff;
    box-shadow: 0 2px 8px rgba(20,184,166,0.35);
  }
  .std-tab-badge {
    border-radius: 20px;
    padding: 1px 7px;
    font-size: 11px;
    font-weight: 700;
    background: rgba(255,255,255,0.25);
    color: inherit;
  }
  .std-tab-btn:not(.active) .std-tab-badge { background: #f3f4f6; color: #9ca3af; }

  /* Stats bar */
  .std-stats-bar { display: flex; gap: 12px; margin-bottom: 16px; }
  .std-stat {
    background: #fff; border-radius: 12px; padding: 14px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05); flex: 1;
    display: flex; flex-direction: column; gap: 4px;
  }
  .std-stat-val {
    font-size: 24px; font-weight: 700; color: #111827;
    font-family: 'DM Mono', monospace; letter-spacing: -1px; line-height: 1;
  }
  .std-stat-lbl { font-size: 12px; color: #9ca3af; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .std-stat.accent .std-stat-val { color: #14b8a6; }

  /* Table card */
  .std-table-card {
    background: #fff; border-radius: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05);
    overflow: hidden; position: relative;
  }
  .std-table-header {
    padding: 18px 24px 14px; display: flex; align-items: center;
    justify-content: space-between; border-bottom: 1px solid #f3f4f6;
  }
  .std-table-title { font-size: 15px; font-weight: 600; color: #111827; margin: 0; }
  .std-table-meta { font-size: 12px; color: #9ca3af; margin-top: 2px; }
  .std-export-btn {
    display: flex; align-items: center; gap: 7px;
    height: 36px; padding: 0 16px;
    background: #f0fdfb; color: #0f766e;
    border: 1.5px solid #99f6e4; border-radius: 8px;
    font-size: 13px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s;
    white-space: nowrap;
  }
  .std-export-btn:hover { background: #ccfbf1; box-shadow: 0 2px 8px rgba(20,184,166,0.18); }
  .std-table-body { padding: 16px 24px 20px; }

  /* Loader */
  .std-overlay {
    position: absolute; inset: 0; background: rgba(255,255,255,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 20; border-radius: 16px; backdrop-filter: blur(2px);
  }
  .std-spinner {
    width: 36px; height: 36px;
    border: 3px solid #e5e7eb; border-top-color: #14b8a6;
    border-radius: 50%; animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Empty */
  .std-empty { text-align: center; padding: 56px 24px; color: #9ca3af; }
  .std-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.5; }
  .std-empty p { font-size: 14px; margin: 0; }

  /* Status badges */
  .std-badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 20px;
    font-size: 12px; font-weight: 600;
  }
  .std-badge.taken    { background: #d1fae5; color: #065f46; }
  .std-badge.not-taken{ background: #fee2e2; color: #991b1b; }
  .std-badge.na       { background: #f3f4f6; color: #6b7280; }
`;

// ─── Patient Picker ───────────────────────────────────────────────────────────
function PatientPicker({ patients, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const toggle = (id) => {
    const sid = String(id);
    onChange(selected.includes(sid) ? selected.filter(x => x !== sid) : [...selected, sid]);
  };
  const selectAll = () => onChange(patients.map(p => String(p.user_id)));
  const clearAll  = () => onChange([]);

  const label = selected.length === 0 ? null
    : selected.length === patients.length ? 'All patients'
    : `${selected.length} patient${selected.length > 1 ? 's' : ''} selected`;

  return (
    <div className="std-patient-picker" ref={ref}>
      <div
        className={`std-picker-trigger${open ? ' open' : ''}`}
        onClick={() => setOpen(v => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setOpen(v => !v)}
      >
        <span className={`std-picker-trigger-text${!label ? ' placeholder' : ''}`}>
          {label || 'All patients (no filter)'}
        </span>
        <svg className={`std-picker-caret${open ? ' open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && (
        <div className="std-picker-dropdown">
          <div className="std-picker-search">
            <input autoFocus placeholder="Search patients…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="std-picker-actions">
            <button type="button" className="std-picker-action-btn" onClick={selectAll}>Select all</button>
            <span style={{color:'#e5e7eb'}}>|</span>
            <button type="button" className="std-picker-action-btn" onClick={clearAll}>Clear</button>
          </div>
          <div className="std-picker-list" role="listbox" aria-multiselectable="true">
            {filtered.length === 0
              ? <div className="std-picker-empty">No patients found</div>
              : filtered.map(p => {
                  const sid = String(p.user_id);
                  const isSel = selected.includes(sid);
                  return (
                    <div
                      key={p.user_id}
                      className={`std-picker-item${isSel ? ' selected' : ''}`}
                      onClick={() => toggle(p.user_id)}
                      role="option"
                      aria-selected={isSel}
                      tabIndex={0}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggle(p.user_id)}
                    >
                      <div className="std-picker-checkbox">
                        {isSel && (
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {p.name}
                    </div>
                  );
                })
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const calculateAge = (dob) => {
  if (!dob) return 'NA';
  const b = new Date(dob), t = new Date();
  let age = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
  return age;
};
const fmt = (d) => d ? new Date(d).toLocaleDateString() : '-';
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { key: 'medication',      label: 'Medication',      icon: '💊' },
  { key: 'adverseReaction', label: 'Adverse Reaction', icon: '⚠️' },
  { key: 'measurement',     label: 'Measurements',     icon: '📏' },
  { key: 'compliance',      label: 'Compliance',       icon: '📋' },
];

const TAB_COLUMNS = {
  medication: [
    { label: '#',           key: 'sr',              render: (_, i) => i + 1 },
    { label: 'Patient',     key: 'patient_name' },
    { label: 'Age',         key: 'dob',             render: r => calculateAge(r.dob) !== 'NA' ? `${calculateAge(r.dob)} yrs` : 'NA' },
    { label: 'Medicine',    key: 'medicine_name' },
    { label: 'Dosage',      key: 'dosage' },
    { label: 'Schedule',    key: 'schedule',        render: r => r.schedule == 0 ? 'Daily' : 'Weekly' },
    { label: 'Remind When', key: 'remind_quantity', render: r => r.remind_quantity || '1' },
    { label: 'Instruction', key: 'instruction' },
    { label: 'Date',        key: 'createtime',      render: r => fmt(r.createtime) },
  ],
  adverseReaction: [
    { label: '#',              key: 'sr',                   render: (_, i) => i + 1 },
    { label: 'Patient',        key: 'patient_name' },
    { label: 'Medicine',       key: 'medicine_name' },
    { label: 'Dosage',         key: 'dosage' },
    { label: 'Medicine Type',  key: 'category_name' },
    { label: 'Symptom',        key: 'symptom_name' },
    { label: 'Description',    key: 'instruction' },
    { label: 'Med Start Date', key: 'medication_start_date', render: r => fmt(r.medication_start_date) },
    { label: 'Reaction Date',  key: 'reaction_date',         render: r => fmt(r.reaction_date) },
  ],
  measurement: [
    { label: '#',            key: 'sr',             render: (_, i) => i + 1 },
    { label: 'Patient',      key: 'patient_name' },
    { label: 'Systolic BP',  key: 'systolic_bp',    render: r => r.systolic_bp    || '-' },
    { label: 'Diastolic BP', key: 'diastolic_bp',   render: r => r.diastolic_bp   || '-' },
    { label: 'Pulse',        key: 'pulse',          render: r => r.pulse          || '-' },
    { label: 'Weight',       key: 'weight',         render: r => r.weight         ? `${r.weight} KG`          : '-' },
    { label: 'PPBGS',        key: 'ppbgs',          render: r => r.ppbgs          ? `${r.ppbgs} mg/dl`        : '-' },
    { label: 'Glucose',      key: 'fasting_glucose',render: r => r.fasting_glucose? `${r.fasting_glucose} mg/dl` : '-' },
    { label: 'Temp',         key: 'temperature',    render: r => r.temperature    ? `${r.temperature} °C`     : '-' },
    { label: 'Symptom',      key: 'symptom',        render: r => r.symptom        || '-' },
    { label: 'Range',        key: 'symptom_range',  render: r => r.symptom_range  || '-' },
    { label: 'Date',         key: 'date',           render: r => fmt(r.date) },
  ],
  compliance: [
    { label: '#',       key: 'sr',           render: (_, i) => i + 1 },
    { label: 'Patient', key: 'patient_name', render: r => r.patient_name || r.name || '-' },
    { label: 'Medicine',key: 'medicine_name' },
    {
      label: 'Status', key: 'taken_status',
      render: r => {
        if (r.taken_status == 1) return <span className="std-badge taken">Taken</span>;
        if (r.taken_status == 0) return <span className="std-badge not-taken">Not Taken</span>;
        return <span className="std-badge na">NA</span>;
      }
    },
    { label: 'Date', key: 'updatetime', render: r => fmt(r.updatetime) },
  ],
};

const buildExcelRows = (tab, data) => {
  switch (tab) {
    case 'medication':
      return data.map((item, i) => ({
        'S. No': i + 1, 'Patient Name': item.patient_name || '-',
        'Age': calculateAge(item.dob) !== 'NA' ? `${calculateAge(item.dob)} years` : 'NA',
        'Medicine': item.medicine_name || '-', 'Dosage': item.dosage || '-',
        'Schedule': item.schedule == 0 ? 'Daily' : 'Weekly',
        'Remind When': item.remind_quantity || '1', 'Instruction': item.instruction || '-',
        'Created Date': fmt(item.createtime),
      }));
    case 'adverseReaction':
      return data.map((item, i) => ({
        'S. No': i + 1, 'Patient Name': item.patient_name || '-',
        'Medicine': item.medicine_name || '-', 'Dosage': item.dosage || '-',
        'Medicine Type': item.category_name || '-', 'Symptom': item.symptom_name || '-',
        'Description': item.instruction || '-',
        'Med Start Date': fmt(item.medication_start_date), 'Reaction Date': fmt(item.reaction_date),
      }));
    case 'measurement':
      return data.map((item, i) => ({
        'S. No': i + 1, 'Patient Name': item.patient_name || '-',
        'Systolic BP': item.systolic_bp || '-', 'Diastolic BP': item.diastolic_bp || '-',
        'Pulse': item.pulse || '-',
        'Weight': item.weight ? `${item.weight} KG` : '-',
        'PPBGS': item.ppbgs ? `${item.ppbgs} mg/dl` : '-',
        'Glucose': item.fasting_glucose ? `${item.fasting_glucose} mg/dl` : '-',
        'Temperature': item.temperature ? `${item.temperature} °C` : '-',
        'Symptom': item.symptom || '-', 'Range': item.symptom_range || '-',
        'Date': fmt(item.date),
      }));
    case 'compliance':
      return data.map((item, i) => ({
        'S. No': i + 1, 'Patient Name': item.patient_name || item.name || '-',
        'Medicine': item.medicine_name || '-',
        'Status': item.taken_status == 1 ? 'Taken' : item.taken_status == 0 ? 'Not Taken' : 'NA',
        'Date': fmt(item.updatetime),
      }));
    default: return [];
  }
};

// ─── Main ─────────────────────────────────────────────────────────────────────
function SharedTabularData() {
  const [from_date, setFromDate]             = useState('');
  const [to_date, setToDate]                 = useState('');
  const [from_date_error, setFromDateError]  = useState('');
  const [to_date_error, setToDateError]      = useState('');

  const [patients, setPatients]                       = useState([]);
  const [filterPatients, setFilterPatients]           = useState([]);
  const [exportSelectedOnly, setExportSelectedOnly]   = useState(false);
  const [tableFilterActive, setTableFilterActive]     = useState(false);

  const [allData, setAllData] = useState({
    medication: [], adverseReaction: [], measurement: [], compliance: []
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [activeTab, setActiveTab]   = useState('medication');
  const [pages, setPages]           = useState({ medication: 1, adverseReaction: 1, measurement: 1, compliance: 1 });
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const doctorId = sessionStorage.getItem('doctor_id');

  useEffect(() => {
    axios.get(`${Base_Url}get_all_patient`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    }).then(res => {
      if (res.data.success) setPatients(res.data.patient || []);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    let err = false;
    if (!from_date) { setFromDateError('Please enter From Date'); err = true; } else setFromDateError('');
    if (!to_date)   { setToDateError('Please enter To Date'); err = true; }
    else if (to_date < from_date) { setToDateError('To Date must be after From Date'); err = true; }
    else setToDateError('');
    if (err) return;

    setLoading(true);
    axios.get(`${Base_Url}get_shared_tabular?from_date=${from_date}&to_date=${to_date}&doctor_id=${doctorId}`)
      .then(res => {
        if (res.data.success) {
          setAllData({
            medication:      res.data.medication      || [],
            adverseReaction: res.data.adverseReaction || [],
            measurement:     res.data.measurement     || [],
            compliance:      res.data.compliance      || [],
          });
        } else {
          setAllData({ medication: [], adverseReaction: [], measurement: [], compliance: [] });
        }
        setDataLoaded(true);
        setPages({ medication: 1, adverseReaction: 1, measurement: 1, compliance: 1 });
      })
      .catch(() => {
        setAllData({ medication: [], adverseReaction: [], measurement: [], compliance: [] });
        setDataLoaded(true);
      })
      .finally(() => setLoading(false));
  };

  const getDisplayData = (tab) => {
    const raw = allData[tab];
    if (tableFilterActive && filterPatients.length > 0)
      return raw.filter(item => filterPatients.includes(String(item.user_id)));
    return raw;
  };

  const getExportData = (tab) => {
    const raw = allData[tab];
    if (exportSelectedOnly && filterPatients.length > 0)
      return raw.filter(item => filterPatients.includes(String(item.user_id)));
    return raw;
  };

  const exportToExcel = (tab) => {
    const rows = buildExcelRows(tab, getExportData(tab));
    const tabLabel = TABS.find(t => t.key === tab)?.label || tab;
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tabLabel);
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), `${tabLabel}_Report.xlsx`);
  };

  const patientMap     = Object.fromEntries(patients.map(p => [String(p.user_id), p.name]));
  const activeDisplay  = getDisplayData(activeTab);
  const uniquePatients = new Set(allData[activeTab].map(d => d.user_id)).size;
  const activeTabMeta  = TABS.find(t => t.key === activeTab);

  return (
    <>
      <style>{STYLES}</style>
      <div className="std-root">

        {/* Header */}
        <div className="std-header">
          <h4 className="std-title">Shared Tabular Report</h4>
          <p className="std-subtitle">Export patient records by date range and patient selection</p>
        </div>

        {/* Filter Card */}
        <div className="std-filter-card">
          <form onSubmit={handleSubmit}>
            <div className="std-filter-grid">
              <div>
                <label className="std-label" htmlFor="std-from-date">From Date</label>
                <input
                  id="std-from-date" type="date" className="std-input"
                  value={from_date}
                  onChange={e => { setFromDate(e.target.value); setFromDateError(''); }}
                />
                {from_date_error && <p className="std-error">{from_date_error}</p>}
              </div>
              <div>
                <label className="std-label" htmlFor="std-to-date">To Date</label>
                <input
                  id="std-to-date" type="date" className="std-input"
                  value={to_date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => { setToDate(e.target.value); setToDateError(''); }}
                />
                {to_date_error && <p className="std-error">{to_date_error}</p>}
              </div>
              <div>
                <label className="std-label" htmlFor="std-patient-label">Filter by Patients</label>
                <PatientPicker patients={patients} selected={filterPatients} onChange={setFilterPatients} />
              </div>
              <div>
                <button type="submit" className="std-apply-btn" disabled={loading}>
                  {loading ? 'Loading…' : 'Apply Filters'}
                </button>
              </div>
            </div>

            {filterPatients.length > 0 && filterPatients.length < patients.length && (
              <div className="std-chips">
                {filterPatients.map(id => (
                  <span className="std-chip" key={id}>
                    {patientMap[id] || `Patient ${id}`}
                    <button
                      type="button" className="std-chip-remove"
                      onClick={() => setFilterPatients(p => p.filter(x => x !== id))}
                    >×</button>
                  </span>
                ))}
              </div>
            )}

            <div className="std-options-row">
              <label className="std-checkbox-label">
                <input type="checkbox" checked={exportSelectedOnly} onChange={e => setExportSelectedOnly(e.target.checked)} />
                Export only selected patients
              </label>
              <label className="std-checkbox-label">
                <input type="checkbox" checked={tableFilterActive} onChange={e => setTableFilterActive(e.target.checked)} />
                Show only selected patients in table
              </label>
            </div>
          </form>
        </div>

        {/* Data section */}
        {dataLoaded && (
          <>
            {/* Tab bar */}
            <div className="std-tabs" role="tablist">
              {TABS.map(t => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === t.key}
                  className={`std-tab-btn${activeTab === t.key ? ' active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                >
                  <span>{t.icon}</span>
                  {t.label}
                  <span className="std-tab-badge">{allData[t.key].length}</span>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="std-stats-bar">
              <div className="std-stat accent">
                <div className="std-stat-val">{activeDisplay.length}</div>
                <div className="std-stat-lbl">Records shown</div>
              </div>
              <div className="std-stat">
                <div className="std-stat-val">{uniquePatients}</div>
                <div className="std-stat-lbl">Patients</div>
              </div>
              <div className="std-stat">
                <div className="std-stat-val">{allData[activeTab].length}</div>
                <div className="std-stat-lbl">Total records</div>
              </div>
              {filterPatients.length > 0 && (
                <div className="std-stat">
                  <div className="std-stat-val">{filterPatients.length}</div>
                  <div className="std-stat-lbl">Selected</div>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="std-table-card">
              {loading && <div className="std-overlay"><div className="std-spinner" /></div>}

              <div className="std-table-header">
                <div>
                  <p className="std-table-title">{activeTabMeta?.icon} {activeTabMeta?.label}</p>
                  {(from_date || to_date) && (
                    <p className="std-table-meta">
                      {from_date && `From ${fmt(from_date)}`}
                      {from_date && to_date && ' — '}
                      {to_date && `To ${fmt(to_date)}`}
                    </p>
                  )}
                </div>
                {activeDisplay.length > 0 && (
                  <button className="std-export-btn" onClick={() => exportToExcel(activeTab)}>
                    <DownloadIcon />
                    Export Excel
                    {exportSelectedOnly && filterPatients.length > 0 && ` (${filterPatients.length})`}
                  </button>
                )}
              </div>

              <div className="std-table-body">
                {activeDisplay.length === 0 ? (
                  <div className="std-empty">
                    <div className="std-empty-icon">🗂</div>
                    <p>No records match the current filters</p>
                  </div>
                ) : (
                  <CustomTable
                    columns={TAB_COLUMNS[activeTab]}
                    data={activeDisplay}
                    currentPage={pages[activeTab]}
                    rowsPerPage={rowsPerPage}
                    onPageChange={page => setPages(p => ({ ...p, [activeTab]: page }))}
                    onRowsPerPageChange={size => {
                      setRowsPerPage(size);
                      setPages(p => ({ ...p, [activeTab]: 1 }));
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SharedTabularData;