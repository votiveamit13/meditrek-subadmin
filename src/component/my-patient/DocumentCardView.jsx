import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IMAGE_PATH } from "../../config";

function DocumentCardView({ data = [] }) {
  if (!data.length) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
        📄 No documents found
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "14px",
        padding: "12px"
      }}
    >
      {data.map((item, index) => (
  <DocumentCard
    key={item.medical_report_id}
    item={item}
    index={index}
  />
))}
    </div>
  );
}

export default DocumentCardView;


/* ================= CARD ================= */

function DocumentCard({ item, index }) {
  return (
    <div
     className="shadow-sm animation-card"
      style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "14px 16px",
        border: "1px solid #e5e7eb",
        borderLeft: "4px solid #1ddec4",
        transition: "0.2s ease",
        animationDelay: `${index * 0.05}s`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* TOP ROW */}
      <div className="d-flex justify-content-between align-items-center mb-1">
        
        {/* TITLE */}
        <div style={{ fontWeight: 600, fontSize: "14px" }}>
          📄 {item.category_name || "Report"}
        </div>

        {/* VIEW BUTTON */}
        <button
          onClick={() =>
            window.open(
              item.file
                ? `${IMAGE_PATH}${item.file}?${new Date().getTime()}`
                : `${IMAGE_PATH}placeholder.jpg`,
              "_blank"
            )
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            border: "none",
            background: "#e6f9f6",
            color: "#1ddec4",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "11px",
            cursor: "pointer"
          }}
        >
          <VisibilityIcon style={{ fontSize: "13px" }} />
          View
        </button>
      </div>

      {/* DATE */}
      <div style={{ fontSize: "12px", color: "#6b7280" }}>
        {item.createtime || "-"}
      </div>
    </div>
  );
}