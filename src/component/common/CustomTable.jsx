import React from "react";
import { Table } from "react-bootstrap";
import CustomPagination from "./Pagination";
import "./table.css";

const CustomTable = ({
    columns,
    data,
    sortConfig,
    onSort,
    currentPage,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange
}) => {

    const indexOfLast = currentPage * rowsPerPage;
    const indexOfFirst = indexOfLast - rowsPerPage;

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig?.key) return 0;

        const aVal = a[sortConfig.key] || "";
        const bVal = b[sortConfig.key] || "";

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const currentData = sortedData.slice(indexOfFirst, indexOfLast);

    return (
        <div style={{ background: "#fff", borderRadius: 16 }}>
            <div className="table-container">
                <Table responsive hover>
                    <thead>
                        <tr style={{ background: "#f1f5f9" }}>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    onClick={() => col.sortable && onSort(col.key)}
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",

                                        userSelect: "none",
                                        cursor: col.sortable ? "pointer" : "default"
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        {col.label}

                                        {/* SORT ICON */}
                                        {col.sortable && (
                                            <span className="sort-icons">
                                                <span
                                                    className={`arrow up ${sortConfig?.key === col.key &&
                                                            sortConfig.direction === "asc"
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                />
                                                <span
                                                    className={`arrow down ${sortConfig?.key === col.key &&
                                                            sortConfig.direction === "desc"
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                />
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((row, i) => (
                                <tr key={i}>
                                    {columns.map((col, j) => (
                                        <td key={j} style={{ fontSize: "13px", padding: "12px" }}>
                                            {col.render
                                                ? col.render(row, indexOfFirst + i)
                                                : row[col.key] || "-"}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center py-4">
                                    No Data Available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* PAGINATION */}
            <CustomPagination
                count={data.length}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </div>
    );
};

export default CustomTable;