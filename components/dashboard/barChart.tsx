"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BarChart() {
  const [chartData, setChartData] = useState<any>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  useEffect(() => {
    async function fetchCategoryData() {
        // ดึง user ที่ล็อกอินอยู่
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

      try {
        let query = supabase
          .from("tasks")
          .select(
            `
            category_id,
            category ( name )
          `
          )
          .not("category_id", "is", null);

        // ถ้ามีการเลือกโปรเจค ให้เพิ่มเงื่อนไขในการ filter
        if (projectId && projectId !== "all") {
          query = query.eq("project_id", projectId);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }

        // จัดกลุ่มข้อมูลตามประเภท
        const categoryCount = data.reduce((acc: any, task) => {
          const categoryName = task.category?.name || "ไม่ระบุประเภท";
          acc[categoryName] = (acc[categoryName] || 0) + 1;
          return acc;
        }, {});

        // แปลงข้อมูลให้อยู่ในรูปแบบที่ ApexCharts ต้องการ
        const categories = Object.keys(categoryCount);
        const counts = Object.values(categoryCount);

        setChartData({
          options: {
            chart: {
              type: "bar",
              height: 350,
            },
            plotOptions: {
              bar: {
                horizontal: true,
                columnWidth: "55%",
                borderRadius: 5,
              },
            },
            dataLabels: { enabled: false },
            xaxis: {
              categories,
              labels: { style: { fontSize: "12px" } },
            },
            fill: { opacity: 1 },
            tooltip: {
              y: {
                formatter: (val: number) => `${val} งาน`,
              },
            },
            colors: ["#3b82f6"],
          },
          series: [{ name: "จำนวนงาน", data: counts }],
        });
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    }

    fetchCategoryData();
  }, [projectId]);

  return (
    <>
      <div className="flex justify-between p-3 align-middle">
        <h1 className="text-xl font-semibold">จำนวนงานแยกตามประเภท</h1>
      </div>
      <div className="w-full rounded-lg p-4 bg-white dark:bg-gray-800 md:p-6">
        {chartData ? (
          <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
        ) : (
          <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        )}
      </div>
    </>
  );
}
