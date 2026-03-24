import { useState, useEffect, useRef } from "react";

const ACCENT = "#1ddec4";
const ACCENT_BG = "rgba(29,222,196,0.13)";

// Styles for the dropdown
const DROPDOWN_STYLES = `
  .tag-dropdown-container {
    position: relative;
    width: 100%;
  }

  .tag-dropdown-trigger {
    width: 100%;
    height: 38px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 0 32px 0 12px;
    font-size: 13px;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: border-color 0.18s, box-shadow 0.18s;
    box-sizing: border-box;
  }

  .tag-dropdown-trigger:hover, .tag-dropdown-trigger.open {
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(29,222,196,0.12);
  }

  .tag-dropdown-trigger-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    font-size: 13px;
    color: #374151;
  }

  .tag-dropdown-trigger-text.placeholder {
    color: #9ca3af;
    background: none;
  }

  .tag-dropdown-caret {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    transition: transform 0.18s;
  }

  .tag-dropdown-caret.open {
    transform: translateY(-50%) rotate(180deg);
  }

  .tag-dropdown-menu {
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
    to { opacity: 1; transform: translateY(0); }
  }

  .tag-dropdown-search {
    padding: 10px 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .tag-dropdown-search input {
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 13px;
    outline: none;
    background: #f9fafb;
    box-sizing: border-box;
  }

  .tag-dropdown-search input:focus {
    border-color: ${ACCENT};
    background: #fff;
  }

  .tag-dropdown-actions {
    padding: 8px 12px;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    gap: 12px;
  }

  .tag-dropdown-action-btn {
    font-size: 12px;
    font-weight: 600;
    color: ${ACCENT};
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  .tag-dropdown-action-btn:hover {
    text-decoration: underline;
  }

  .tag-dropdown-list {
    max-height: 240px;
    overflow-y: auto;
    padding: 6px 0;
  }

  .tag-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    cursor: pointer;
    font-size: 13px;
    color: #374151;
    transition: background 0.1s;
  }

  .tag-dropdown-item:hover {
    background: ${ACCENT_BG};
  }

  .tag-dropdown-item.selected {
    background: ${ACCENT_BG};
  }

  .tag-dropdown-checkbox {
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

  .tag-dropdown-item.selected .tag-dropdown-checkbox {
    background: ${ACCENT};
    border-color: ${ACCENT};
  }

  .tag-dropdown-empty {
    padding: 16px;
    text-align: center;
    color: #9ca3af;
    font-size: 12px;
  }

  .tag-dropdown-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .tag-dropdown-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: ${ACCENT_BG};
    border: 1px solid rgba(29,222,196,0.3);
    color: ${ACCENT};
    border-radius: 6px;
    padding: 2px 8px 2px 10px;
    font-size: 11px;
    font-weight: 500;
  }

  .tag-dropdown-chip-remove {
    background: none;
    border: none;
    color: ${ACCENT};
    cursor: pointer;
    padding: 0;
    line-height: 1;
    font-size: 14px;
    opacity: 0.7;
  }

  .tag-dropdown-chip-remove:hover {
    opacity: 1;
  }
`;

function TagSearch({ label, all, selected, onToggle, searchPlaceholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = all.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (item) => {
    onToggle(item);
  };

  const selectAll = () => {
    all.forEach(item => {
      if (!selected.includes(item)) {
        onToggle(item);
      }
    });
  };

  const clearAll = () => {
    [...selected].forEach(item => {
      onToggle(item);
    });
  };

  const displayText = selected.length === 0
    ? null
    : selected.length === all.length
    ? `All ${label?.toLowerCase() || 'items'}`
    : `${selected.length} ${label?.toLowerCase() || 'items'} selected`;

  const styles = {
    label: {
      fontSize: 11,
      fontWeight: 600,
      color: "#6b7280",
      marginBottom: 6,
      display: "block",
      letterSpacing: 0.5
    },
    chip: (teal) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 10px",
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 500,
      background: teal ? ACCENT_BG : "#f1f5f9",
      color: teal ? ACCENT : "#374151",
      border: teal ? `1px solid rgba(29,222,196,0.3)` : "1px solid #e5e7eb",
      margin: "2px 3px 2px 0"
    })
  };

  return (
    <>
      <style>{DROPDOWN_STYLES}</style>
      <div style={{ marginBottom: 14, width: "100%" }}>
        {label && <span style={styles.label}>{label}</span>}
        
        <div className="tag-dropdown-container" ref={ref}>
          <div
            className={`tag-dropdown-trigger${open ? " open" : ""}`}
            onClick={() => setOpen(v => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setOpen(v => !v)}
          >
            <span className={`tag-dropdown-trigger-text${!displayText ? " placeholder" : ""}`}>
              {displayText || searchPlaceholder || `Select ${label?.toLowerCase() || 'items'}...`}
            </span>
            <svg 
              className={`tag-dropdown-caret${open ? " open" : ""}`} 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {open && (
            <div className="tag-dropdown-menu">
              <div className="tag-dropdown-search">
                <input
                  autoFocus
                  placeholder={searchPlaceholder || `Search ${label?.toLowerCase() || 'items'}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="tag-dropdown-actions">
                <button className="tag-dropdown-action-btn" onClick={selectAll}>
                  Select all
                </button>
                <span style={{ color: "#e5e7eb" }}>|</span>
                <button className="tag-dropdown-action-btn" onClick={clearAll}>
                  Clear
                </button>
              </div>
              <div className="tag-dropdown-list">
                {filtered.length === 0 ? (
                  <div className="tag-dropdown-empty">No {label?.toLowerCase() || 'items'} found</div>
                ) : (
                  filtered.map(item => {
                    const isSelected = selected.includes(item);
                    return (
                      <div
                        key={item}
                        className={`tag-dropdown-item${isSelected ? " selected" : ""}`}
                        onClick={() => toggle(item)}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={0}
                        onKeyDown={e => (e.key === "Enter" || e.key === " ") && toggle(item)}
                      >
                        <div className="tag-dropdown-checkbox">
                          {isSelected && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                              <polyline 
                                points="2,6 5,9 10,3" 
                                stroke="#fff" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                        {item}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selected chips - shown below the dropdown - COMMENTED OUT */}
        {/* {selected.length > 0 && (
          <div className="tag-dropdown-chips">
            {selected.map(s => (
              <span key={s} className="tag-dropdown-chip">
                {s}
                <button
                  type="button"
                  className="tag-dropdown-chip-remove"
                  onClick={() => onToggle(s)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )} */}
      </div>
    </>
  );
}

export default TagSearch;