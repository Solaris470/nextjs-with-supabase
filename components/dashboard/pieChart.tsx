"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PieChart() {
  const [chartData, setChartData] = useState<any>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

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

        const userId = user.id;

        // 🔹 ดึงงานทั้งหมดที่ assigned ให้ user
        let query = supabase.from("tasks").select("status");

        // ถ้ามี projectId ให้กรองเพิ่ม
        if (projectId && projectId !== "all") {
          query = query.eq("project_id", projectId);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching tasks:", error);
          return;
        }

        // 🔹 นับจำนวนงานแต่ละสถานะ
        const statusCounts = data.reduce(
          (acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
          },
          { Pending: 0, "In Progress": 0, Completed: 0 }
        );

        setChartData({
          options: {
            chart: {
              animation: { enabled: true, speed: 800 },
            },
            labels: ["งานที่ได้รับมอบหมาย", "งานที่กำลังทำอยู่", "งานที่เสร็จสิ้น"],
            colors: ["#8280FF", "#FEC53D", "#4AD991"],
          },
          series: [statusCounts.Pending, statusCounts["In Progress"], statusCounts.Completed],
        });
      } catch (e) {
        console.error("Unexpected Error:", e);
      }
    };
    fetchTaskCounts();
  }, [projectId]);

  return (
    <>
      <div className="flex justify-between p-3 align-middle">
        <h1 className="text-xl font-semibold">ผลการดำเนินงาน</h1>
      </div>
      <div className="w-full max-w-xl rounded-lg bg-white p-4 dark:bg-gray-800 md:p-6">
        {chartData ? (
          <Chart options={chartData.options} series={chartData.series} type="donut" />
        ) : (
          <p>Loading Chart...</p>
        )}
      </div>
    </>
  );
}
