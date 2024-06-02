// src/DataDisplay.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { PolarArea } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { data } from "./data";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Legend
);

const DataDisplay = () => {
  //   const [data, setData] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   console.log(data);
  //   useEffect(() => {
  //     fetch("http://localhost:3000/data")
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setData(data);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //         setLoading(false);
  //       });
  //   }, []);

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  // Count the number of occurrences of each event type
  const eventTypeCounts = data.reduce((counts, item) => {
    const eventType = item.event_type;
    counts[eventType] = (counts[eventType] || 0) + 1;
    return counts;
  }, {});

  const unwantedKeys = [
    "timestamp",
    "in_iface",
    "proto",
    "alert",
    "event_type",
  ];

  const dataset = {
    type: "bar",
    labels: Object.keys(data[0]).filter((key) => !unwantedKeys.includes(key)),
    datasets: [
      {
        label: "# of Alerts",
        data: Object.values(eventTypeCounts),
        color: "white",
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Example color
        borderColor: "rgba(54, 162, 235, 1)", // Example color
        borderWidth: 1,
      },
    ],
  };

  const polarAreaChartDataset = {
    type: "polarArea",
    labels: Object.keys(data[0]).filter((key) => !unwantedKeys.includes(key)),
    datasets: [
      {
        label: "# of Alerts",
        data: Object.values(eventTypeCounts),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "green",
          "yellow",
          "rgba(255, 159, 64, 0.2)",
        ],
        color: ["white"],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // const optionLine = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Chart.js Line Chart',
  //     },
  //   },
  // };
  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Change legend text color
        },
      },
      title: {
        display: true,
        text: "Chart.js Chart",
        color: "white", // Change title text color
      },
    },
    scales: {
      x: {
        grid: {
          color: "#444", // Change x-axis grid color
        },
        ticks: {
          color: "white", // Change x-axis labels color
        },
      },
      y: {
        grid: {
          color: "#444", // Change y-axis grid color
        },
        ticks: {
          color: "white", // Change y-axis labels color
        },
        beginAtZero: true,
      },
    },
  };

  const linechart = {
    type: "linechart",
    labels: Object.keys(data[0]).filter((key) => !unwantedKeys.includes(key)),
    datasets: [
      {
        label: "Dataset 1",
        data: Object.values(eventTypeCounts),
        borderColor: "skyblue",
        backgroundColor: "white",
      },
    ],
  };

  // const options = {
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //     },
  //   },
  // };

  return (
    <>
      <ScrollArea>
        <div className=" grid grid-cols-2 gap-20">
          <Bar
            className="max-w-[400px] max-h-[350px]"
            data={dataset}
            options={commonOptions}
          />
          <PolarArea
            className="max-w-[400px] max-h-[400px]"
            data={polarAreaChartDataset}
            options={commonOptions}
          />
          <Line
            className="max-w-[400px] max-h-[350px]"
            options={commonOptions}
            data={linechart}
          />
        </div>
      </ScrollArea>
    </>
  );
};

export default DataDisplay;
