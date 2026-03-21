import React, { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url, IMAGE_PATH } from "../../config";
import CustomPagination from "component/common/Pagination";

function NewInsights() {
    const [insights, setInsights] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(9);

    const getInsights = async () => {
        axios
            .get(`${Base_Url}get-insights-posts`)
            .then((response) => {
                const visibleData = response.data.data.filter(
                    (item) => item.is_visible === 1
                );
                setInsights(visibleData);
            })
            .catch((error) => {
                console.error("Error fetching insights:", error);
            });
    };

    useEffect(() => {
        getInsights();
    }, []);

    const filtered = insights.filter(
        (item) =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const startIndex = (page - 1) * rowsPerPage;
    const currentItems = filtered.slice(
        startIndex,
        startIndex + rowsPerPage
    );

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="p-2">
            <div
                style={{
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    padding: "16px"
                }}
            >
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <div>
                        <h6 style={{ fontWeight: 600, marginBottom: 2 }}>
                            New Insights
                        </h6>
                        <small style={{ color: "#64748b" }}>
                            Latest updates & articles
                        </small>
                    </div>

                    <input
                        type="text"
                        placeholder="Search insights..."
                        className="custom-search form-control"
                        style={{ width: "220px", fontSize: "13px" }}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>

                {currentItems.length > 0 ? (
                    <div className="row g-3">
                        {currentItems.map((item) => (
                            <div key={item.id} className="col-md-3">
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: "none" }}
                                >
                                    <div
                                        className="shadow-sm"
                                        style={{
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            background: "#fff",
                                            transition: "all 0.25s ease",
                                            cursor: "pointer"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 10px 20px rgba(0,0,0,0.08)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow =
                                                "0 2px 6px rgba(0,0,0,0.05)";
                                        }}
                                    >
                                        <img
                                            src={`${IMAGE_PATH}insightspost/${item.image}`}
                                            alt={item.title}
                                            style={{
                                                width: "100%",
                                                height: "140px",
                                                objectFit: "cover"
                                            }}
                                        />

                                        <div style={{ padding: "12px" }}>
                                            <h6
                                                style={{
                                                    fontSize: "14px",
                                                    fontWeight: 600,
                                                    color: "#111827",
                                                    marginBottom: "6px"
                                                }}
                                            >
                                                {item.title}
                                            </h6>

                                            <p
                                                style={{
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                    marginBottom: "8px",
                                                    lineHeight: "1.4"
                                                }}
                                            >
                                                {item.description?.slice(0, 80)}...
                                            </p>

                                            <div className="d-flex justify-content-between align-items-center">
                                                <small style={{ color: "#9ca3af" }}>
                                                    {formatDate(item.created_at)}
                                                </small>

                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#1ddec4",
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    Open →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-muted">
                        No insights available
                    </div>
                )}

                <div className="mt-3">
                    <CustomPagination
                        count={filtered.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={(newPage) => setPage(newPage)}
                        onRowsPerPageChange={(val) => {
                            setRowsPerPage(val);
                            setPage(1);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default NewInsights;