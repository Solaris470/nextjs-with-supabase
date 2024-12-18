"use client";

import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


export default function BarChart(){
  const [chartData, setChartData] = useState<any>(null);
useEffect(() => {
  setChartData({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
      categories: [
        "Frontend Development",
        "Backend Development",
        "Database Design",
        "DevOps",
        "API Integration",
        "Testing and QA",
        "Security Audits",
        "Mobile Development",
        "UI/UX Design",
        "Code Reviews",
      ],
      },
    },
    series: [
      {
        data: [30, 40, 45, 50, 49, 60, 70, 91],
      },
    ],
    chart:{
      type: 'line',
      toolbar: {
        show: false,
      }
    }
  });
});
// const BarChart: React.FC = () => {
//   const chartOptions = {
//     chart: {
//       type: "bar",
//       height: 350,
//       toolbar: {
//         show: false,
//       },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: true,
//         columnWidth: "55%",
//         endingShape: "rounded",
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     xaxis: {
//       categories: [
//         "Frontend Development",
//         "Backend Development",
//         "Database Design",
//         "DevOps",
//         "API Integration",
//         "Testing and QA",
//         "Security Audits",
//         "Mobile Development",
//         "UI/UX Design",
//         "Code Reviews",
//       ],
//     },
//     colors: ["#3B82F6", "#10B981", "#F43F5E", "#8B5CF6", "#F59E0B"],
//     series: [
//       {
//         name: "จำนวนงาน",
//         data: [44, 30, 15, 25, 10],
//       },
//     ],
//   };

  return (
    <div className="w-full">
      {chartData ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      ) : (
        <p>Loading Chart...</p>
      )}
    </div>
  );
// };
}
