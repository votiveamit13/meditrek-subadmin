import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Base_Url } from '../../config';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import CustomTable from 'component/common/CustomTable';

// ─── Inline styles as a style tag injected once ───────────────────────────────
const STYLES = `
  .std-root {
    min-height: 100vh;
    background: #f5f6fa;
    color: #1a1d23;
  }

  /* ── Header ── */
  .std-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .std-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.4px;
    color: #111827;
    margin: 0;
  }
  .std-subtitle {
    font-size: 13px;
    color: #6b7280;
    margin: 4px 0 0;
    font-weight: 400;
  }

  /* ── Filter Panel ── */
  .std-filter-card {
    background: #ffffff;
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
  @media (max-width: 900px) {
    .std-filter-grid { grid-template-columns: 1fr 1fr; }
  }
  .std-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 7px;
  }
  .std-input, .std-select-single {
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
    appearance: auto;
  }
  .std-input:focus, .std-select-single:focus {
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
    background: #fff;
  }
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
  }
  .std-apply-btn:hover { background: #0d9488; box-shadow: 0 4px 12px rgba(20,184,166,0.3); }
  .std-apply-btn:active { transform: scale(0.97); }
  .std-apply-btn:disabled { background: #a7f3d0; cursor: not-allowed; }

  /* ── Patient Picker ── */
  .std-patient-picker {
    position: relative;
  }
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
    justify-content: space-between;
    transition: border-color 0.18s, box-shadow 0.18s;
    box-sizing: border-box;
    user-select: none;
  }
  .std-picker-trigger:hover, .std-picker-trigger.open {
    border-color: #14b8a6;
    box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
    background: #fff;
  }
  .std-picker-trigger-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    font-size: 14px;
    color: #374151;
  }
  .std-picker-trigger-text.placeholder { 
      color: #9ca3af; 
      background: none;
  }
  .std-picker-caret {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
    transition: transform 0.18s;
  }
  .std-picker-caret.open { transform: translateY(-50%) rotate(180deg); }

  .std-picker-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    z-index: 200;
    overflow: hidden;
    animation: dropIn 0.16s ease;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .std-picker-search {
    padding: 10px 12px;
    border-bottom: 1px solid #f3f4f6;
  }
  .std-picker-search input {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    background: #f9fafb;
    box-sizing: border-box;
  }
  .std-picker-search input:focus { border-color: #14b8a6; background: #fff; }
  .std-picker-actions {
    padding: 7px 12px;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    gap: 10px;
  }
  .std-picker-action-btn {
    font-size: 12px;
    font-weight: 600;
    color: #14b8a6;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .std-picker-action-btn:hover { text-decoration: underline; }
  .std-picker-list {
    max-height: 200px;
    overflow-y: auto;
    padding: 6px 0;
  }
  .std-picker-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    cursor: pointer;
    font-size: 14px;
    color: #374151;
    transition: background 0.1s;
  }
  .std-picker-item:hover { background: #f0fdfb; }
  .std-picker-item.selected { background: #f0fdfb; }
  .std-picker-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.12s, border-color 0.12s;
  }
  .std-picker-item.selected .std-picker-checkbox {
    background: #14b8a6;
    border-color: #14b8a6;
  }
  .std-picker-empty { padding: 16px; text-align: center; color: #9ca3af; font-size: 13px; }

  /* ── Chips ── */
  .std-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
  }
  .std-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f0fdfb;
    border: 1px solid #99f6e4;
    color: #0f766e;
    border-radius: 6px;
    padding: 3px 8px 3px 10px;
    font-size: 12px;
    font-weight: 500;
  }
  .std-chip-remove {
    background: none;
    border: none;
    color: #0f766e;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    font-size: 14px;
    opacity: 0.7;
  }
  .std-chip-remove:hover { opacity: 1; }

  /* ── Options row ── */
  .std-options-row {
    margin-top: 16px;
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .std-checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #4b5563;
    cursor: pointer;
    user-select: none;
  }
  .std-checkbox-label input[type=checkbox] { accent-color: #14b8a6; width: 15px; height: 15px; cursor: pointer; }

  /* ── Stats bar ── */
  .std-stats-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  .std-stat {
    background: #fff;
    border-radius: 12px;
    padding: 14px 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .std-stat-val {
    font-size: 26px;
    font-weight: 700;
    color: #111827;
    font-family: 'DM Mono', monospace;
    letter-spacing: -1px;
    line-height: 1;
  }
  .std-stat-lbl {
    font-size: 12px;
    color: #9ca3af;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .std-stat.accent .std-stat-val { color: #14b8a6; }

  /* ── Table Card ── */
  .std-table-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05);
    overflow: hidden;
    position: relative;
  }
  .std-table-header {
    padding: 18px 24px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f4f6;
  }
  .std-table-title {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }
  .std-table-meta {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 2px;
  }
  .std-export-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    height: 36px;
    padding: 0 16px;
    background: #f0fdfb;
    color: #0f766e;
    border: 1.5px solid #99f6e4;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s, box-shadow 0.15s;
  }
  .std-export-btn:hover { background: #ccfbf1; box-shadow: 0 2px 8px rgba(20,184,166,0.18); }
  .std-table-body { padding: 16px 24px 20px; }

  /* ── Loader overlay ── */
  .std-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255,255,255,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    border-radius: 16px;
    backdrop-filter: blur(2px);
  }
  .std-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #e5e7eb;
    border-top-color: #14b8a6;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Empty state ── */
  .std-empty {
    text-align: center;
    padding: 56px 24px;
    color: #9ca3af;
  }
  .std-empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
  .std-empty p { font-size: 14px; margin: 0; }
`;

// ─── Patient Multi-Select Dropdown ────────────────────────────────────────────
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

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    const sid = String(id);
    onChange(
      selected.includes(sid)
        ? selected.filter(x => x !== sid)
        : [...selected, sid]
    );
  };

  const selectAll = () => onChange(patients.map(p => String(p.user_id)));
  const clearAll  = () => onChange([]);

  const label = selected.length === 0
    ? null
    : selected.length === patients.length
    ? 'All patients'
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
        <svg className={`std-picker-caret${open ? ' open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </div>

      {open && (
        <div className="std-picker-dropdown">
          <div className="std-picker-search">
            <input
              autoFocus
              placeholder="Search patients…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="std-picker-actions">
            <button className="std-picker-action-btn" onClick={selectAll}>Select all</button>
            <span style={{color:'#e5e7eb'}}>|</span>
            <button className="std-picker-action-btn" onClick={clearAll}>Clear</button>
          </div>
          <div className="std-picker-list">
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

// ─── Main Component ───────────────────────────────────────────────────────────
function SharedTabularData() {
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate]     = useState('');
  const [patients, setPatients]  = useState([]);

  // Selected patients for FILTERING the displayed table
  const [filterPatients, setFilterPatients]   = useState([]);
  // Whether to scope export to filterPatients
  const [exportSelectedOnly, setExportSelectedOnly] = useState(false);
  // Show only selected-patient rows in the table too
  const [tableFilterActive, setTableFilterActive]   = useState(false);

  const [medicationData, setMedicationData] = useState([]);
  const [dataLoaded, setDataLoaded]         = useState(false);
  const [loading, setLoading]               = useState(false);

  const [currentPage, setCurrentPage]       = useState(1);
  const [rowsPerPage, setRowsPerPage]       = useState(10);

  const doctorId = sessionStorage.getItem('doctor_id');

  // Fetch patients
  useEffect(() => {
    axios.get(`${Base_Url}get_all_patient`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    }).then(res => {
      if (res.data.success) setPatients(res.data.patient || []);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.get(
      `${Base_Url}get_shared_tabular?from_date=${from_date}&to_date=${to_date}&doctor_id=${doctorId}`
    ).then(res => {
      if (res.data.success) setMedicationData(res.data.medication || []);
      else setMedicationData([]);
      setDataLoaded(true);
      setCurrentPage(1);
    }).finally(() => setLoading(false));
  };

  // Derived: which rows to show in table
  const displayData = (tableFilterActive && filterPatients.length > 0)
    ? medicationData.filter(item => filterPatients.includes(String(item.user_id)))
    : medicationData;

  // Stats
  const uniquePatients = new Set(medicationData.map(d => d.user_id)).size;

  const exportToExcel = () => {
    const base = (exportSelectedOnly && filterPatients.length > 0)
      ? medicationData.filter(item => filterPatients.includes(String(item.user_id)))
      : medicationData;

    const rows = base.map((item, i) => ({
      'S. No': i + 1,
      'Patient Name': item.patient_name || '-',
      'Medicine': item.medicine_name || '-',
      'Dosage': item.dosage || '-',
      'Schedule': item.schedule == 0 ? 'Daily' : 'Weekly',
      'Created Date': new Date(item.createtime).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Medication');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer]), 'Medication_Report.xlsx');
  };

  const columns = [
    { label: "#", key: "sr_no", render: (_, i) => i + 1 },
    { label: "Patient", key: "patient_name" },
    { label: "Medicine", key: "medicine_name" },
    { label: "Dosage", key: "dosage" },
    { label: "Schedule", key: "schedule", render: (row) => row.schedule == 0 ? 'Daily' : 'Weekly' },
    { label: "Date", key: "createtime", render: (row) => new Date(row.createtime).toLocaleDateString() }
  ];

  const patientMap = Object.fromEntries(patients.map(p => [String(p.user_id), p.name]));

  return (
    <>
      <style>{STYLES}</style>
      <div className="std-root">

        {/* Header */}
        <div className="std-header">
          <div>
            <h4 className="std-title">Shared Tabular Report</h4>
            <p className="std-subtitle">Export patient medication records by date range and selection</p>
          </div>
        </div>

        {/* Filter Card */}
        <div className="std-filter-card">
          <form onSubmit={handleSubmit}>
            <div className="std-filter-grid">
              <div>
                <label className="std-label" htmlFor="std-from-date">From Date</label>
                <input
                  id="std-from-date"
                  type="date"
                  className="std-input"
                  value={from_date}
                  onChange={e => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="std-label" htmlFor="std-to-date">To Date</label>
                <input
                  id="std-to-date"
                  type="date"
                  className="std-input"
                  value={to_date}
                  onChange={e => setToDate(e.target.value)}
                />
              </div>
              <div>
                <label className="std-label" htmlFor="std-patient-picker-label">Filter by Patients</label>
                <PatientPicker
                  patients={patients}
                  selected={filterPatients}
                  onChange={setFilterPatients}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="std-apply-btn"
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Loading…' : 'Apply Filters'}
                </button>
              </div>
            </div>

            {/* Selected patient chips */}
            {filterPatients.length > 0 && filterPatients.length < patients.length && (
              <div className="std-chips">
                {filterPatients.map(id => (
                  <span className="std-chip" key={id}>
                    {patientMap[id] || `Patient ${id}`}
                    <button
                      type="button"
                      className="std-chip-remove"
                      onClick={() => setFilterPatients(p => p.filter(x => x !== id))}
                    >×</button>
                  </span>
                ))}
              </div>
            )}

            {/* Options */}
            <div className="std-options-row">
              <label className="std-checkbox-label">
                <input
                  type="checkbox"
                  checked={exportSelectedOnly}
                  onChange={e => setExportSelectedOnly(e.target.checked)}
                />
                Export only selected patients
              </label>
              <label className="std-checkbox-label">
                <input
                  type="checkbox"
                  checked={tableFilterActive}
                  onChange={e => setTableFilterActive(e.target.checked)}
                />
                Show only selected patients in table
              </label>
            </div>
          </form>
        </div>

        {/* Table section */}
        {dataLoaded && (
          <>
            {/* Stats */}
            <div className="std-stats-bar">
              <div className="std-stat accent">
                <div className="std-stat-val">{displayData.length}</div>
                <div className="std-stat-lbl">Records shown</div>
              </div>
              <div className="std-stat">
                <div className="std-stat-val">{uniquePatients}</div>
                <div className="std-stat-lbl">Total patients</div>
              </div>
              <div className="std-stat">
                <div className="std-stat-val">{medicationData.length}</div>
                <div className="std-stat-lbl">Total records</div>
              </div>
              {filterPatients.length > 0 && (
                <div className="std-stat">
                  <div className="std-stat-val">{filterPatients.length}</div>
                  <div className="std-stat-lbl">Patients selected</div>
                </div>
              )}
            </div>

            <div className="std-table-card">
              {loading && (
                <div className="std-overlay">
                  <div className="std-spinner" />
                </div>
              )}

              <div className="std-table-header">
                <div>
                  <p className="std-table-title">Medication Records</p>
                  {(from_date || to_date) && (
                    <p className="std-table-meta">
                      {from_date && `From ${new Date(from_date).toLocaleDateString()}`}
                      {from_date && to_date && ' — '}
                      {to_date && `To ${new Date(to_date).toLocaleDateString()}`}
                    </p>
                  )}
                </div>

                {displayData.length > 0 && (
                  <button className="std-export-btn" onClick={exportToExcel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Export Excel
                    {exportSelectedOnly && filterPatients.length > 0 &&
                      ` (${filterPatients.length})`
                    }
                  </button>
                )}
              </div>

              <div className="std-table-body">
                {displayData.length === 0 ? (
                  <div className="std-empty">
                    <div className="std-empty-icon">🗂</div>
                    <p>No records match the current filters</p>
                  </div>
                ) : (
                  <CustomTable
                    columns={columns}
                    data={displayData}
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    onRowsPerPageChange={(size) => { setRowsPerPage(size); setCurrentPage(1); }}
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