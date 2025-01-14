"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartEvent } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

export function DonutChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const data = {
    labels: ['用户', '订单', '店铺'],
    datasets: [
      {
        data: [1234, 5678, 42],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    onHover: (_: ChartEvent, elements: { index: number }[]) => {
      if (elements.length) setHoveredIndex(elements[0].index)
      else setHoveredIndex(null)
    },
  }

  return (
    <div className="relative">
      <Doughnut data={data} options={options} />
      {data.labels.map((label, index) => (
        <motion.div
          key={label}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: hoveredIndex === index ? 1 : 0, 
            scale: hoveredIndex === index ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-2xl font-bold">{data.datasets[0].data[index]}</p>
          <p className="text-sm">{label}</p>
        </motion.div>
      ))}
    </div>
  )
}

