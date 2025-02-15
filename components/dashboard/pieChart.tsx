"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";

// ทำการโหลด ApexCharts เฉพาะในฝั่ง Client เท่านั้น
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PieChart() {
  const [chartData, setChartData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchTaskCounts = async () => {
      try {
        // ดึง user ที่ล็อกอินอยู่
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("Auth Error:", authError.message);
          return;
        }

        if (!user) {
          console.error("No user found");
          return;
        }

        const userId = user.id; // user id ปัจจุบัน

        // Query เพื่อดึงจำนวนงานตามสถานะ
        const { count: pending, error: pendingError } = await supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .eq("assigned_to", userId)
          .eq("status", "Pending");

        const { count: inProgress, error: inProgressError } = await supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .eq("assigned_to", userId)
          .eq("status", "In Progress");

        const { count: completed, error: completedError } = await supabase
          .from("tasks")
          .select("*", { count: "exact" })
          .eq("assigned_to", userId)
          .eq("status", "Completed");

        if (pendingError || inProgressError || completedError) {
          console.error("Error fetching task counts");
          return;
        }

        setChartData({
          options: {
            chart: {
              animation: {
                enabled: true,
                speed: 800,
                animateGradually: {
                  enabled: true,
                  delay: 150,
                },
                dynamicAnimation: {
                  enabled: true,
                  speed: 350,
                },
              },
            },
            labels: [
              "งานที่ได้รับมอบหมาย",
              "งานที่กำลังทำอยู่",
              "งานที่เสร็จสิ้น",
            ],
            colors: ["#8280FF", "#FEC53D", "#4AD991"],
          },
          series: [inProgress, completed, pending],
        });
      } catch (e) {
        console.error("Unexpected Error:", e);
      }
    };
    fetchTaskCounts();
  }, []);

  return (
    <>
      <div className="flex justify-between p-3 align-middle">
        <div className="">
          <h1 className="text-xl font-semibold">ผลการดำเนินงาน</h1>
        </div>
        <div className="">
          {/* <select name="pie-filter" id="">
            <option value="มกราคม">มกราคม</option>
          </select> */}
        </div>
      </div>
      <div className="w-full max-w-xl rounded-lg bg-white p-4  dark:bg-gray-800 md:p-6">
        {chartData ? (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="donut"
          />
        ) : (
          <p>Loading Chart...</p>
        )}
      </div>
    </>
  );
}
