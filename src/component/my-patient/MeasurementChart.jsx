import React from "react";
import Chart from "react-apexcharts";

const MeasurementChart = ({ data, type }) => {
    const chartTypeMap = {
        bp: "bar", 
        fasting: "line",
        ppbgs: "bar",
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
                        data: data.map(i => i.systolic_bp || 0)
                    },
                    {
                        name: "Diastolic BP",
                        data: data.map(i => i.diastolic_bp || 0)
                    },
                    {
                        name: "Pulse",
                        data: data.map(i => i.pulse || 0)
                    }
                ];

            case "fasting":
                return [
                    {
                        name: "Fasting Glucose",
                        data: data.map(i => i.fasting_glucose || 0)
                    }
                ];

            case "ppbgs":
                return [
                    {
                        name: "PPBGS",
                        data: data.map(i => i.ppbgs || 0)
                    }
                ];

            case "weight":
                return [
                    {
                        name: "Weight",
                        data: data.map(i => i.weight || 0)
                    }
                ];

            case "temp":
                return [
                    {
                        name: "Temperature",
                        data: data.map(i => i.temperature || 0)
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
                return ["#8b5cf6"]; // Purple for fasting glucose
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

    // Get the minimum and maximum values for better y-axis scaling
    const getMinMaxValues = () => {
        if (!data || data.length === 0) return { min: 0, max: 100 };
        
        const values = data.map(i => i.fasting_glucose || 0).filter(v => v > 0);
        if (values.length === 0) return { min: 0, max: 100 };
        
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        // Add some padding
        return {
            min: Math.max(0, Math.floor(min * 0.9)),
            max: Math.ceil(max * 1.1)
        };
    };

    const getChartOptions = () => {
        const { min, max } = getMinMaxValues();
        
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
                // Removed dropShadow property that was causing the error
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
                width: type === "line" ? 3 : 2,
                curve: type === "area" ? 'smooth' : type === 'fasting' ? 'smooth' : 'straight',
                lineCap: 'round',
                colors: type === "area" ? ["#1ddec4"] : undefined,
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
                enabled: false, // Disabled to avoid clutter, you can enable if you want
            },
            markers: {
                size: type === 'fasting' ? 5 : 3,
                colors: ['#ffffff'],
                strokeColors: getColors(),
                strokeWidth: 2,
                hover: {
                    size: 7
                }
            },
            xaxis: {
                categories: data.map(i => i.date),
                labels: {
                    rotate: -45,  
                    rotateAlways: true,  
                    offsetY: 10,        
                    trim: false,
                    style: {
                        fontSize: '10px',
                        fontWeight: 400,
                        colors: '#64748b'
                    }
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
                min: type === 'fasting' ? Math.max(0, min - 10) : undefined,
                max: type === 'fasting' ? max + 10 : undefined,
                labels: {
                    style: {
                        fontSize: '10px',
                        fontWeight: 400,
                        colors: '#64748b'
                    },
                    formatter: function(val) {
                        return Math.round(val);
                    }
                },
                title: {
                    text: type === 'fasting' ? 'mg/dL' : '',
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
                y: {
                    formatter: function(val) {
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

        // Add reference ranges for fasting glucose using annotations (if available)
        if (type === 'fasting' && data.length > 0) {
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
                        // label: {
                        //     text: 'Pre-diabetes',
                        //     style: {
                        //         color: '#854d0e',
                        //         background: '#ffffff',
                        //         fontSize: '9px',
                        //         fontWeight: 500,
                        //         padding: {
                        //             left: 4,
                        //             right: 4,
                        //             top: 2,
                        //             bottom: 2
                        //         }
                        //     },
                        //     position: 'left',
                        //     offsetX: 10
                        // }
                    },
                    {
                        y: 126,
                        y2: max + 10,
                        borderColor: '#ef4444',
                        fillColor: '#ef444410',
                        opacity: 0.1,
                        // label: {
                        //     text: 'Diabetes',
                        //     style: {
                        //         color: '#b91c1c',
                        //         background: '#ffffff',
                        //         fontSize: '9px',
                        //         fontWeight: 500,
                        //         padding: {
                        //             left: 4,
                        //             right: 4,
                        //             top: 2,
                        //             bottom: 2
                        //         }
                        //     },
                        //     position: 'left',
                        //     offsetX: 10
                        // }
                    }
                ]
            };
        }

        return baseOptions;
    };

    const hasValidData = data && data.length > 0 && 
        data.some(item => {
            switch (type) {
                case "bp":
                    return item.systolic_bp || item.diastolic_bp || item.pulse;
                case "fasting":
                    return item.fasting_glucose;
                case "ppbgs":
                    return item.ppbgs;
                case "weight":
                    return item.weight;
                case "temp":
                    return item.temperature;
                default:
                    return false;
            }
        });

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