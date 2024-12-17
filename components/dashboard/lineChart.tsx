'use client'

import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChart: React.FC = () => {
  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    title: {
      text: 'งานที่เสร็จสิ้น',
      align: 'left'
    },
    xaxis: {
      categories: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.']
    },
    colors: ['#3B82F6'],
    series: [
      {
        name: 'งานสำเร็จ',
        data: [30, 40, 35, 50, 49, 60]
      }
    ],
    stroke: {
      curve: 'smooth'
    },
    markers: {
      size: 5
    }
  };

  return (
    <div className="w-full">
      <Chart 
        options={chartOptions} 
        series={chartOptions.series} 
        type="line" 
        height={350} 
      />
    </div>
  );
};

export default LineChart;