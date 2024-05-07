import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { skill_data } from "../data/skill_data.jsx";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
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
  Legend
);

const BarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Sample Data",
        data: [],
        backgroundColor: "rgb(53, 162, 235, 0.4",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
      },
    ],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = "../data/skill_data.jsx".json;
      setChartData({
        labels: data.map((user_data) => user_data.vender),
        datasets: [
          {
            ...chartData.datasets[0],
            data: data.map((user_data) => user_data.certification),
          },
        ],
      });
      setChartOptions({
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "資格分布",
          },
        },
        maintainAspectRatio: false,
        responsive: true,
      });
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default BarChart;
