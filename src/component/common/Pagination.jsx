import React from "react";
import { Box, IconButton } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

const CustomPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleFirst = () => onPageChange(1);
  const handlePrev = () => onPageChange(page - 1);
  const handleNext = () => onPageChange(page + 1);
  const handleLast = () => onPageChange(totalPages);

  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, count);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        borderTop: "1px solid #eee",
        width: "100%"
      }}
    >
      {/* LEFT: Rows per page */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>
          Rows per page:
        </span>

        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          style={{
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: "2px 6px",
            fontSize: 12
          }}
        >
          {[5, 10, 25, 50].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </Box>

      {/* CENTER: Range */}
      <span style={{ fontSize: 12, color: "#64748b" }}>
        {start}–{end} of {count}
      </span>

      {/* RIGHT: Controls */}
      <Box>
        <IconButton onClick={handleFirst} disabled={page === 1}>
          <FirstPageIcon />
        </IconButton>

        <IconButton onClick={handlePrev} disabled={page === 1}>
          <KeyboardArrowLeft />
        </IconButton>

        <IconButton
          onClick={handleNext}
          disabled={page === totalPages}
        >
          <KeyboardArrowRight />
        </IconButton>

        <IconButton
          onClick={handleLast}
          disabled={page === totalPages}
        >
          <LastPageIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomPagination;