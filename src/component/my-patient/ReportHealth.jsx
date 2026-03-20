import React, { useState } from "react";

function AdverseCardView({ data = [] }) {
    const [view, setView] = useState("grid");

    if (!data.length) {
        return (
            <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
                🩺 No health reports found
            </div>
        );
    }

    return (
        <div className="p-3">

            <div className="d-flex justify-content-end mb-3 gap-2">
                <button
                    onClick={() => setView("grid")}
                    style={{
                        padding: "5px 10px",
                        borderRadius: "6px",
                        border: "none",
                        background: view === "grid" ? "#1ddec4" : "#eef2f7",
                        color: view === "grid" ? "#fff" : "#64748b"
                    }}
                >
                    Grid
                </button>

                <button
                    onClick={() => setView("list")}
                    style={{
                        padding: "5px 10px",
                        borderRadius: "6px",
                        border: "none",
                        background: view === "list" ? "#1ddec4" : "#eef2f7",
                        color: view === "list" ? "#fff" : "#64748b"
                    }}
                >
                    List
                </button>
            </div>

            {view === "grid" && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "14px"
                    }}
                >
                   {data.map((item, index) => (
  <CardItem
    key={item.adverse_reaction_id}
    item={item}
    index={index}
  />
))}
                </div>
            )}

            {view === "list" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                       {data.map((item, index) => (
  <CardItem
    key={item.adverse_reaction_id}
    item={item}
    index={index}
  />
))}
                </div>
            )}
        </div>
    );
}

export default AdverseCardView;





/* ================= CARD ================= */

function CardItem({ item, index }) {
    return (
                          
        <div
            className="shadow-sm animation-card"
            style={{
                background: "#fff",
        borderRadius: "10px",
        padding: "14px 16px",

        border: "1.5px solid #e5e7eb",

        borderLeft: "4px solid #ef4444",

        transition: "0.2s ease",
        animationDelay: `${index * 0.05}s`
      }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
            }}
        >
            <div className="d-flex justify-content-between align-items-center mb-1">
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#111827" }}>
                    {item.medicine_name}
                </div>

                <span
                    style={{
                        fontSize: "11px",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        background: "#fee2e2",
                        color: "#dc2626",
                        fontWeight: 500
                    }}
                >
                    {item.symptom_name}
                </span>
            </div>

            <div
                style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "8px",
                    lineHeight: "1.4"
                }}
            >
                {item.instruction?.slice(0, 120) || "-"}
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    fontSize: "12px",
                    color: "#374151"
                }}
            >
                <span><strong>Dosage:</strong> {item.dosage}</span>
                <span><strong>Medicine Type:</strong> {item.category_name}</span>
            </div>

            <div
                style={{
                    marginTop: "8px",
                    fontSize: "11px",
                    color: "#9ca3af"
                }}
            >
                Start Date: {item.medication_start_date} → Reaction Date: {item.reaction_date}
            </div>
        </div>
    );
}