"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BarChart() {
  const [chartData, setChartData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        // ดึงข้อมูลโดย join ตาราง tasks กับ categories
        const { data, error } = await supabase
          .from("tasks")
          .select(
            `
            category_id,
            category (
              name
            )
          `
          )
          .not("category_id", "is", null);

        if (error) throw error;

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
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: categories,

              labels: {
                style: {
                  fontSize: "12px",
                },
              },
            },
            yaxis: {},
            fill: {
              opacity: 1,
            },
            tooltip: {
              y: {
                formatter: function (val: number) {
                  return val + " งาน";
                },
              },
            },
            colors: ["#3b82f6"], // สีน้ำเงิน
            title: {
              text: "จำนวนงานแยกตามประเภท",
              align: "left",
              style: {
                fontSize: "16px",
                fontWeight: 600,
              },
            },
          },
          series: [
            {
              name: "จำนวนงาน",
              data: counts,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    }

    fetchCategoryData();
  }, []);

  return (
    <>
      <div className="flex justify-between p-3 align-middle">
        <div className="">
          <h1 className="text-xl font-semibold">จำนวนงานแยกตามประเภท</h1>
        </div>
        <div className="">
          {/* <select name="pie-filter" id="">
            <option value="มกราคม">มกราคม</option>
          </select> */}
        </div>
      </div>
      <div className="w-full  rounded-lg p-4 bg-white dark:bg-gray-800 md:p-6">
        <div>
          {chartData && (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
            />
          )}
        </div>
      </div>
    </>
  );
}
