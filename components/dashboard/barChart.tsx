'use client'

import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart: React.FC = () => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Frontend Development', 'Backend Development', 'Database Design', 'DevOps', 'API Integration','Testing and QA','Security Audits','Mobile Development','UI/UX Design','Code Reviews']
    },
    colors: ['#3B82F6', '#10B981', '#F43F5E', '#8B5CF6', '#F59E0B'],
    series: [
      {
        name: 'จำนวนงาน',
        data: [44, 30, 15, 25, 10]
      }
    ]
  };

  return (
    <div className="w-full">
      <Chart 
        options={chartOptions} 
        series={chartOptions.series} 
        type="bar" 
        height={350} 
      />
    </div>
  );
};

export default BarChart;