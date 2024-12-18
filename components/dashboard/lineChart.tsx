"use client";

import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


export default function LineChart(){
  const [chartData, setChartData] = useState<any>(null);
useEffect(() => {
  setChartData({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'] 
      },
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 35, 50, 49, 60]
      },
    ],
  });
});

  return (
    <div className="w-full">
      {chartData ? (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      ) : (
        <p>Loading Chart...</p>
      )}
    </div>
  );
// };
}
