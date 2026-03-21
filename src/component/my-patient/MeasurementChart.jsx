import React from "react";
import Chart from "react-apexcharts";

const TOTAL_SLOTS = 10;

// Types that should show ONLY scatter dots (no connecting line)
const SCATTER_ONLY_TYPES = ["bp", "ppbgs", "temp"];

const MeasurementChart = ({ data, type }) => {

    const getFilteredData = () => {
        if (!data || data.length === 0) return [];
        switch (type) {
            case "bp": return data.filter(i => i.systolic_bp != null || i.diastolic_bp != null || i.pulse != null);
            case "fasting": return data.filter(i => i.fasting_glucose != null);
            case "ppbgs": return data.filter(i => i.ppbgs != null);
            case "weight": return data.filter(i => i.weight != null);
            case "temp": return data.filter(i => i.temperature != null);
            default: return data;
        }
    };

    const filteredData = getFilteredData();
    const count = filteredData.length;
    const isScatterOnly = SCATTER_ONLY_TYPES.includes(type);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [day, month, year] = dateStr.split("-");
        return new Date(`${year}-${month}-${day}`)
            .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
    };

    const uniqueDates = (() => {
        const seen = new Set();
        filteredData.forEach(r => {
            const l = formatDate(r.date);
            if (!seen.has(l)) seen.add(l);
        });
        return [...seen];
    })();

    const dateToIndex = {};
    uniqueDates.forEach((d, i) => { dateToIndex[d] = i; });

    const slotLabels = Array.from({ length: TOTAL_SLOTS }, (_, i) =>
        uniqueDates[i] ?? ""
    );

    const groupBySlot = (accessor) => {
        const map = new Map();
        filteredData.forEach(row => {
            const idx = dateToIndex[formatDate(row.date)];
            const val = accessor(row);
            if (val == null) return;
            if (!map.has(idx)) map.set(idx, []);
            map.get(idx).push(val);
        });
        return map;
    };

    // Line series: average per slot (used only for weight/fasting)
    const buildLineSeries = (name, accessor) => {
        const grouped = groupBySlot(accessor);
        return {
            name,
            type: "line",
            data: Array.from({ length: TOTAL_SLOTS }, (_, idx) => {
                const vals = grouped.get(idx) ?? [];
                const avg = vals.length
                    ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
                    : null;
                return { x: idx, y: avg };
            })
        };
    };

    // Scatter series: every individual reading as a dot
    const buildScatterSeries = (name, accessor) => ({
        name: `${name}_scatter`,
        type: "scatter",
        data: filteredData.map(r => ({
            x: dateToIndex[formatDate(r.date)],
            y: accessor(r) ?? null
        }))
    });

    // Pure scatter series (no companion line) — for bp/ppbgs/temp
    const buildPureScatterSeries = (name, accessor) => ({
        name,
        type: "scatter",
        data: filteredData.map(r => ({
            x: dateToIndex[formatDate(r.date)],
            y: accessor(r) ?? null
        }))
    });

    const getSeries = () => {
        if (isScatterOnly) {
            // No line at all — just dots
            switch (type) {
                case "bp":
                    return [
                        buildPureScatterSeries("Systolic BP", r => r.systolic_bp),
                        buildPureScatterSeries("Diastolic BP", r => r.diastolic_bp),
                        buildPureScatterSeries("Pulse", r => r.pulse),
                    ];
                case "ppbgs":
                    return [buildPureScatterSeries("PPBGS", r => r.ppbgs)];
                case "temp":
                    return [buildPureScatterSeries("Temperature", r => r.temperature)];
                default:
                    return [];
            }
        }

        // Line + scatter for weight and fasting
        switch (type) {
            case "fasting":
                return [
                    buildLineSeries("Fasting Glucose", r => r.fasting_glucose),
                    buildScatterSeries("Fasting Glucose", r => r.fasting_glucose),
                ];
            case "weight":
                return [
                    buildLineSeries("Weight", r => r.weight),
                    buildScatterSeries("Weight", r => r.weight),
                ];
            default:
                return [];
        }
    };

    const baseColors = (() => {
        switch (type) {
            case "bp": return ["#1ddec4", "#f59e0b", "#6366f1"];
            case "fasting": return ["#8b5cf6"];
            case "ppbgs": return ["#f59e0b"];
            case "weight": return ["#6366f1"];
            case "temp": return ["#ef4444"];
            default: return ["#1ddec4"];
        }
    })();

    // For scatter-only: colors = baseColors directly (no companion line series)
    // For line+scatter: line colors first, then semi-transparent scatter colors
    const colors = isScatterOnly
        ? baseColors
        : [...baseColors, ...baseColors.map(c => c + "99")];

    const numLineSeries = isScatterOnly ? 0 : baseColors.length;

    const getMinMax = () => {
        let values = [];
        switch (type) {
            case "bp": values = filteredData.flatMap(r => [r.systolic_bp, r.diastolic_bp, r.pulse].filter(v => v != null)); break;
            case "fasting": values = filteredData.map(r => r.fasting_glucose).filter(v => v != null); break;
            case "ppbgs": values = filteredData.map(r => r.ppbgs).filter(v => v != null); break;
            case "weight": values = filteredData.map(r => r.weight).filter(v => v != null); break;
            case "temp": values = filteredData.map(r => r.temperature).filter(v => v != null); break;
            default: break;
        }
        if (!values.length) return { min: 0, max: 100 };
        return {
            min: Math.max(0, Math.floor(Math.min(...values) * 0.9)),
            max: Math.ceil(Math.max(...values) * 1.1)
        };
    };
    const { min, max } = getMinMax();

    const options = {
        chart: {
            type: "line",
            toolbar: { show: false },
            animations: { enabled: true, easing: "easeinout", speed: 600 },
            background: "transparent",
            zoom: { enabled: false },
        },

        xaxis: {
            type: "numeric",
            min: 0,
            max: TOTAL_SLOTS - 1,
            tickAmount: TOTAL_SLOTS,
            labels: {
                rotate: -35,
                rotateAlways: true,
                hideOverlappingLabels: false,
                formatter: (val) => {
                    const i = Math.round(val);
                    return slotLabels[i] ?? "";
                },
                style: { fontSize: "10px", fontWeight: 400, colors: "#64748b" },
            },
            axisBorder: { show: true, color: "#e2e8f0" },
            axisTicks: { show: true, color: "#e2e8f0" },
            tooltip: { enabled: false },
        },

        yaxis: {
            min,
            max,
            labels: {
                style: { fontSize: "10px", fontWeight: 400, colors: "#64748b" },
                formatter: val => Math.round(val),
            },
            title: {
                text: ["fasting", "ppbgs"].includes(type) ? "mg/dL"
                    : type === "weight" ? "kg"
                        : type === "temp" ? "°C"
                            : "",
                style: { fontSize: "10px", fontWeight: 500, color: "#64748b" },
            },
        },

        stroke: isScatterOnly
            ? { width: 0 }  // no lines at all for scatter-only types
            : {
                width: colors.map((_, i) => i < numLineSeries ? 2.5 : 0),
                curve: "smooth",
            },

        markers: isScatterOnly
            ? {
                size: 6,
                colors: baseColors.map(() => "#ffffff"),
                strokeColors: baseColors,
                strokeWidth: 2,
                hover: { size: 8 },
            }
            : {
                size: colors.map((_, i) => i < numLineSeries ? 4 : 5),
                colors: colors.map((_, i) => i < numLineSeries ? "#ffffff" : baseColors[i - numLineSeries] + "cc"),
                strokeColors: colors.map((_, i) => i < numLineSeries ? baseColors[i] : baseColors[i - numLineSeries]),
                strokeWidth: colors.map((_, i) => i < numLineSeries ? 2 : 1),
                hover: { size: 7 },
            },

        colors,
        dataLabels: { enabled: false },

        fill: isScatterOnly
            ? { type: "solid", opacity: 1 }
            : {
                type: colors.map((_, i) => (type === "weight" && i === 0) ? "gradient" : "solid"),
                gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.03, stops: [0, 90, 100] },
                opacity: colors.map((_, i) => i < numLineSeries ? 1 : 0.7),
            },

        grid: {
            borderColor: "#e2e8f0",
            strokeDashArray: 4,
            padding: { left: 10, right: 10, top: 10, bottom: 10 },
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },

        legend: {
            show: type === "bp",
            position: "top",
            fontSize: "12px",
            markers: { width: 12, height: 12, radius: 6 },
            showForSingleSeries: false,
            customLegendItems: type === "bp" ? ["Systolic BP", "Diastolic BP", "Pulse"] : [],
        },

        tooltip: {
            enabled: true,
            shared: false,
            intersect: true,
            theme: "light",
            custom: ({ series, seriesIndex, dataPointIndex }) => {
                const isScatterSeries = isScatterOnly || seriesIndex >= numLineSeries;
                const unit = ["fasting", "ppbgs"].includes(type) ? " mg/dL"
                    : type === "weight" ? " kg"
                        : type === "temp" ? " °C"
                            : "";

                if (isScatterSeries) {
                    const row = filteredData[dataPointIndex] ?? {};
                    const val = series[seriesIndex][dataPointIndex];
                    return `<div style="padding:8px 12px;font-size:12px;line-height:1.7;font-family:inherit">
                        <div style="color:#64748b">${row.date ?? ""} &nbsp;${row.time ?? ""}</div>
                        <div style="font-weight:700;color:#1e293b">${val ?? "-"}${unit}</div>
                    </div>`;
                }

                const val = series[seriesIndex][dataPointIndex];
                return `<div style="padding:8px 12px;font-size:12px;line-height:1.7;font-family:inherit">
                    <div style="color:#64748b">Avg · ${uniqueDates[dataPointIndex] ?? ""}</div>
                    <div style="font-weight:700;color:#1e293b">${val ?? "-"}${unit}</div>
                </div>`;
            },
        },

        ...(type === "fasting" && count > 0 ? {
            annotations: {
                yaxis: [
                    {
                        y: 70, y2: 99, fillColor: "#22c55e", opacity: 0.08,
                        label: {
                            text: "Normal",
                            style: {
                                color: "#166534", background: "#fff", fontSize: "9px", fontWeight: 500,
                                padding: { left: 4, right: 4, top: 2, bottom: 2 }
                            },
                            position: "left", offsetX: 10, offsetY: -5,
                        },
                    },
                    { y: 100, y2: 125, fillColor: "#eab308", opacity: 0.08 },
                    { y: 126, y2: max + 10, fillColor: "#ef4444", opacity: 0.05 },
                ],
            },
        } : {}),
    };

    if (!count) {
        const names = { bp: "blood pressure", fasting: "fasting glucose", ppbgs: "PPBGS", weight: "weight", temp: "temperature" };
        return (
            <div style={{
                height: "240px", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#9ca3af", fontSize: "13px", backgroundColor: "#f8fafc",
                borderRadius: "8px", margin: "4px 0"
            }}>
                No {names[type] ?? ""} data available
            </div>
        );
    }

    return (
        <Chart
            options={options}
            series={getSeries()}
            type="line"
            height="240"
            width="100%"
        />
    );
};

export default MeasurementChart;