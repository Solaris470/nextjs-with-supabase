"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PieChart() {
  const [chartData, setChartData] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchTaskProgress() {
      try {
        // ดึงข้อมูลจากตาราง tasks (แก้ชื่อตารางให้ถูกต้อง)
        const { count: totalTasks } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true });

        const { count: completedTasks } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Completed');

        const progressPercentage = totalTasks ? (completedTasks! / totalTasks! * 100) : 0;

        setChartData({
          options: {
            chart: {
              type: 'bar',
              height: 70,
              sparkline: {
                enabled: true
              }
            },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: '100%',
                borderRadius: 5,
                distributed: true,
                dataLabels: {
                  position: 'bottom'
                }
              },
            },
            grid: {
              show: true
            },
            colors: ['#86efac'], // สีเขียวอ่อนตามรูป
            fill: {
              type: 'solid'
            },
            xaxis: {
              categories: ['Progress'],
              max: 100 // กำหนดค่าสูงสุดเป็น 100%
            },
            tooltip: {
              enabled: true,
              y: {
                formatter: function(value: number) {
                  return value.toFixed(0) + '%';
                }
              }
            }
          },
          series: [{
            name: 'ความคืบหน้า',
            data: [progressPercentage]
          }]
        });
      } catch (error) {
        console.error('Error fetching task progress:', error);
      }
    }

    fetchTaskProgress();
  }, []);

  return (
    <div className="w-full rounded-lg p-4 bg-white dark:bg-gray-800 md:p-6 gap-y-5">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">ความคืบหน้าของงาน</h3>
      <div className="">
        {chartData && (
          <>
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={80}
            />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {chartData.series[0].data[0].toFixed(0)}% เสร็จสมบูรณ์
            </p>
          </>
        )}
      </div>
    </div>
  );
}