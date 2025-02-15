"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from 'next/navigation';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function PieChart() {
  const [chartData, setChartData] = useState<any>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  useEffect(() => {
    async function fetchTaskProgress() {
      try {
        // สร้าง query พื้นฐานสำหรับงานทั้งหมด
        let totalQuery = supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true });

        // สร้าง query พื้นฐานสำหรับงานที่เสร็จแล้ว
        let completedQuery = supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'Completed');

        // เพิ่ม filter ตาม projectId ถ้ามีการเลือกโปรเจค
        if (projectId && projectId !== 'all') {
          totalQuery = totalQuery.eq('project_id', projectId);
          completedQuery = completedQuery.eq('project_id', projectId);
        }

        // ดึงข้อมูลพร้อมกันทั้งสอง queries
        const [totalResult, completedResult] = await Promise.all([
          totalQuery,
          completedQuery
        ]);

        // ตรวจสอบ error
        if (totalResult.error) throw totalResult.error;
        if (completedResult.error) throw completedResult.error;

        const totalTasks = totalResult.count || 0;
        const completedTasks = completedResult.count || 0;
        const progressPercentage = totalTasks ? (completedTasks / totalTasks * 100) : 0;

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
            colors: ['#86efac'],
            fill: {
              type: 'solid'
            },
            xaxis: {
              categories: ['Progress'],
              max: 100
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
  }, [projectId]); // เพิ่ม projectId ใน dependencies

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