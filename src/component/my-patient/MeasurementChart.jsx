import React from "react";
import Chart from "react-apexcharts";

const MeasurementChart = ({ data, type }) => {
    // Filter data based on chart type
    const getFilteredData = () => {
        if (!data) return [];

        switch (type) {
            case "bp":
                // Only include entries that have at least one BP value
                return data.filter(item =>
                    item.systolic_bp != null ||
                    item.diastolic_bp != null ||
                    item.pulse != null
                );
            case "fasting":
                // Only include entries with fasting glucose values
                return data.filter(item => item.fasting_glucose != null);
            case "ppbgs":
                // Only include entries with PPBGS values
                return data.filter(item => item.ppbgs != null);
            case "weight":
                // Only include entries with weight values
                return data.filter(item => item.weight != null);
            case "temp":
                // Only include entries with temperature values
                return data.filter(item => item.temperature != null);
            default:
                return data;
        }
    };

    const filteredData = getFilteredData();

    const parseDateTime = (date, time) => {
        if (!date || !time) return null;

        const [day, month, year] = date.split("-");
        const formatted = `${year}-${month}-${day} ${time}`;

        return new Date(formatted).getTime();
    };

    const chartTypeMap = {
        bp: "line",
        fasting: "line",
        ppbgs: "line",
        weight: "area",
        temp: "line",
        symptom: "line"
    };

    const getChartType = () => {
        return chartTypeMap[type] || "line";
    };

    const getSeries = () => {
        switch (type) {
            case "bp":
                return [
                    {
                        name: "Systolic BP",
                        data: filteredData.map(i => ({
                            x: parseDateTime(i.date, i.time),
                            y: i.systolic_bp || 0
                        }))
                    },
                    {
                        name: "Diastolic BP",
                        data: filteredData.map(i => ({
                            x: parseDateTime(i.date, i.time),
                            y: i.diastolic_bp || 0
                        }))
                    },
                    {
                        name: "Pulse",
                        data: filteredData.map(i => ({
                            x: parseDateTime(i.date, i.time),
                            y: i.pulse || 0
                        }))
                    }
                ];

            case "fasting":
                return [
                    {
                        name: "Fasting Glucose",
                        data: filteredData.map(i => ({
                            x: parseDateTime(i.date, i.time),
                            y: i.fasting_glucose || 0
                        }))
                    }
                ];

            case "ppbgs":
                return [
                    {
                        name: "PPBGS",
                        data: filteredData.map(i => ({
                            x: parseDateTime(i.date, i.time),
                            y: i.ppbgs || 0
                        }))
                    }
                ];

            case "weight":
                return [
                    {
                        name: "Weight",
                        data: filteredData.map(i => ({
                            x: parseDateTime(i.date, i.time),
                            y: i.weight || 0
                        }))
                    }
                ];

            case "temp":
                return [
                    {
                        name: "Temperature",
                        data: filteredData.map(i => ({
                            x: parseDateTime(i.date, i.time),
                            y: i.temperature || 0
                        }))
                    }
                ];

            default:
                return [];
        }
    };

    const getColors = () => {
        switch (type) {
            case "bp":
                return ["#1ddec4", "#f59e0b", "#6366f1"];
            case "fasting":
                return ["#8b5cf6"];
            case "ppbgs":
                return ["#f59e0b"];
            case "weight":
                return ["#6366f1"];
            case "temp":
                return ["#ef4444"];
            default:
                return ["#1ddec4"];
        }
    };

    // Get unique timestamps for x-axis
    const getUniqueTimestamps = () => {
        const timestamps = filteredData
            .map(i => parseDateTime(i.date, i.time))
            .filter(t => t !== null);

        // Remove duplicates by converting to Set and back to array
        return [...new Set(timestamps)].sort((a, b) => a - b);
    };
    const allValues = [
        ...filteredData.map(i => i.systolic_bp),
        ...filteredData.map(i => i.diastolic_bp),
        ...filteredData.map(i => i.pulse)
    ].filter(v => v != null);
    const getMinMaxValues = () => {
        if (!filteredData || filteredData.length === 0) return { min: 0, max: 100 };

        let values = [];

        switch (type) {
            case "fasting":
                values = filteredData.map(i => i.fasting_glucose).filter(v => v != null);
                break;
            case "ppbgs":
                values = filteredData.map(i => i.ppbgs).filter(v => v != null);
                break;
            case "weight":
                values = filteredData.map(i => i.weight).filter(v => v != null);
                break;
            case "temp":
                values = filteredData.map(i => i.temperature).filter(v => v != null);
                break;
            case "bp":

                values = allValues;
                break;
            default:
                values = [];
        }

        if (values.length === 0) return { min: 0, max: 100 };

        const min = Math.min(...values);
        const max = Math.max(...values);

        return {
            min: Math.max(0, Math.floor(min * 0.9)),
            max: Math.ceil(max * 1.1)
        };
    };

    const getChartOptions = () => {
        const { min, max } = getMinMaxValues();
        const uniqueTimestamps = getUniqueTimestamps();
        const timestampSet = new Set(uniqueTimestamps);

        const baseOptions = {
            chart: {
                toolbar: { show: false },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                },
                background: 'transparent',
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "15%",
                    borderRadius: 4,
                    borderRadiusApplication: 'end',
                }
            },
            stroke: {
                show: true,
                width: ["bp", "ppbgs", "temp"].includes(type) ? 0 : 3,
                curve: type === "area" ? 'smooth' : 'smooth',
                lineCap: 'round',
            },
            fill: {
                type: type === "area" ? "gradient" : "solid",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.5,
                    opacityTo: 0.1,
                    stops: [0, 90, 100]
                }
            },
            colors: getColors(),
            dataLabels: {
                enabled: false,
            },
            markers: {
                size: 5,
                colors: ['#ffffff'],
                strokeColors: getColors(),
                strokeWidth: 2,
                hover: {
                    size: 7
                }
            },
            xaxis: {
                type: "datetime",
                categories: uniqueTimestamps,
                tickAmount: uniqueTimestamps.length,
                tickPlacement: 'on',
                labels: {
                    formatter: function (value, timestamp) {
                        if (timestampSet.has(timestamp)) {
                            const date = new Date(timestamp);
                            return date.toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                            });
                        }
                        return '';
                    },
                    rotate: -55,
                    rotateAlways: true,
                    offsetY: 10,
                    trim: false,
                    style: {
                        fontSize: '10px',
                        fontWeight: 400,
                        colors: '#64748b'
                    },
                    showDuplicates: false,
                },
                axisBorder: {
                    show: true,
                    color: '#e2e8f0',
                },
                axisTicks: {
                    show: true,
                    color: '#e2e8f0',
                },
            },
            yaxis: {
                min: min,
                max: max,
                labels: {
                    style: {
                        fontSize: '10px',
                        fontWeight: 400,
                        colors: '#64748b'
                    },
                    formatter: function (val) {
                        return Math.round(val);
                    }
                },
                title: {
                    text: type === 'fasting' ? 'mg/dL' :
                        type === 'weight' ? 'kg' :
                            type === 'temp' ? '°C' : '',
                    style: {
                        fontSize: '10px',
                        fontWeight: 500,
                        color: '#64748b'
                    }
                },
            },
            grid: {
                borderColor: "#e2e8f0",
                strokeDashArray: 4,
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                },
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            tooltip: {
                enabled: true,
                shared: type === "bp",
                intersect: false,
                theme: 'light',
                x: {
                    format: 'dd MMM yyyy HH:mm'
                },
                y: {
                    formatter: function (val) {
                        if (type === 'fasting') return val + ' mg/dL';
                        if (type === 'weight') return val + ' kg';
                        if (type === 'temp') return val + '°C';
                        return val;
                    }
                }
            },
            legend: {
                show: type === "bp",
                position: 'top',
                fontSize: '12px',
                markers: {
                    width: 12,
                    height: 12,
                    radius: 6
                }
            }
        };

        // Add reference ranges for fasting glucose
        if (type === 'fasting' && filteredData.length > 0) {
            baseOptions.annotations = {
                yaxis: [
                    {
                        y: 70,
                        y2: 99,
                        borderColor: '#22c55e',
                        fillColor: '#22c55e20',
                        opacity: 0.3,
                        label: {
                            text: 'Normal',
                            style: {
                                color: '#166534',
                                background: '#ffffff',
                                fontSize: '9px',
                                fontWeight: 500,
                                padding: {
                                    left: 4,
                                    right: 4,
                                    top: 2,
                                    bottom: 2
                                }
                            },
                            position: 'left',
                            offsetX: 10,
                            offsetY: -5
                        }
                    },
                    {
                        y: 100,
                        y2: 125,
                        borderColor: '#eab308',
                        fillColor: '#eab30820',
                        opacity: 0.2,
                    },
                    {
                        y: 126,
                        y2: max + 10,
                        borderColor: '#ef4444',
                        fillColor: '#ef444410',
                        opacity: 0.1,
                    }
                ]
            };
        }

        return baseOptions;
    };

    const hasValidData = filteredData && filteredData.length > 0;

    if (!hasValidData) {
        return (
            <div
                style={{
                    height: "240px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                    fontSize: "13px",
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    margin: "4px 0"
                }}
            >
                No {type === "bp" ? "blood pressure" :
                    type === "fasting" ? "fasting glucose" :
                        type === "ppbgs" ? "PPBGS" :
                            type === "weight" ? "weight" :
                                type === "temp" ? "temperature" : ""} data available
            </div>
        );
    }

    return (
        <Chart
            options={getChartOptions()}
            series={getSeries()}
            type={getChartType()}
            height="240"
            width="100%"
        />
    );
};

export default MeasurementChart;