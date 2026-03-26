import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { RiFileExcel2Line } from "react-icons/ri";

export default function ExportButton({ data = [], fileName = "Export", mapFn }) {
  const handleExport = () => {
    if (!data.length) return;

    const formatted = mapFn ? data.map(mapFn) : data;

    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], { type: "application/octet-stream" });

    saveAs(blob, `${fileName}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: 16,
        color: "#1ddec4",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      title="Export"
    >
      <RiFileExcel2Line size={18} />
    </button>
  );
}