import { useState, useEffect, useRef } from "react";

const ACCENT = "#1ddec4";
const ACCENT_BG = "rgba(29,222,196,0.13)";

// Styles for the dropdown (same as TagSearch)
const DROPDOWN_STYLES = `
  .gender-dropdown-container {
    position: relative;
    width: 100%;
  }

  .gender-dropdown-trigger {
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

  .gender-dropdown-trigger:hover, .gender-dropdown-trigger.open {
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(29,222,196,0.12);
  }

  .gender-dropdown-trigger-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    font-size: 13px;
    color: #374151;
  }

  .gender-dropdown-trigger-text.placeholder {
    color: #9ca3af;
    background: none;
  }

  .gender-dropdown-caret {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    transition: transform 0.18s;
  }

  .gender-dropdown-caret.open {
    transform: translateY(-50%) rotate(180deg);
  }

  .gender-dropdown-menu {
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

  .gender-dropdown-list {
    max-height: 240px;
    overflow-y: auto;
    padding: 6px 0;
  }

  .gender-dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    cursor: pointer;
    font-size: 13px;
    color: #374151;
    transition: background 0.1s;
  }

  .gender-dropdown-item:hover {
    background: ${ACCENT_BG};
  }

  .gender-dropdown-item.selected {
    background: ${ACCENT_BG};
  }

  .gender-dropdown-radio {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.12s;
  }

  .gender-dropdown-item.selected .gender-dropdown-radio {
    border-color: ${ACCENT};
  }

  .gender-dropdown-radio-inner {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${ACCENT};
  }

  .gender-dropdown-empty {
    padding: 16px;
    text-align: center;
    color: #9ca3af;
    font-size: 12px;
  }
`;

function GenderFilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
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

  const genderOptions = [
    { value: "All", label: "All Genders" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" }
  ];

  const getDisplayText = () => {
    const selected = genderOptions.find(opt => opt.value === value);
    return selected ? selected.label : "Select Gender";
  };

  const styles = {
    label: {
      fontSize: 11,
      fontWeight: 600,
      color: "#6b7280",
      marginBottom: 6,
      display: "block",
      letterSpacing: 0.5
    }
  };

  return (
    <>
      <style>{DROPDOWN_STYLES}</style>
      <div style={{ marginBottom: 14, width: "100%" }}>
        <span style={styles.label}>Gender</span>
        
        <div className="gender-dropdown-container" ref={ref}>
          <div
            className={`gender-dropdown-trigger${open ? " open" : ""}`}
            onClick={() => setOpen(v => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && setOpen(v => !v)}
          >
            <span className={`gender-dropdown-trigger-text${value === "All" ? " placeholder" : ""}`}>
              {getDisplayText()}
            </span>
            <svg 
              className={`gender-dropdown-caret${open ? " open" : ""}`} 
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
            <div className="gender-dropdown-menu">
              <div className="gender-dropdown-list">
                {genderOptions.map(option => {
                  const isSelected = value === option.value;
                  return (
                    <div
                      key={option.value}
                      className={`gender-dropdown-item${isSelected ? " selected" : ""}`}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={0}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          onChange(option.value);
                          setOpen(false);
                        }
                      }}
                    >
                      <div className="gender-dropdown-radio">
                        {isSelected && <div className="gender-dropdown-radio-inner" />}
                      </div>
                      {option.label}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GenderFilter;