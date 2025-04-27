"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { JobData } from "@/lib/api"
import { getPostingTrends } from "@/lib/api"

Chart.register(...registerables)

interface JobPostingTrendChartProps {
  jobs: JobData[]
  days?: number
}

export function JobPostingTrendChart({ jobs, days = 30 }: JobPostingTrendChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clean up previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Process data
    const trendData = getPostingTrends(jobs, days)

    const labels = trendData.map((item) => {
      const date = new Date(item.date)
      return `${date.getMonth() + 1}/${date.getDate()}`
    })

    const data = trendData.map((item) => item.count)

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Job Postings",
            data,
            fill: true,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Job Posting Trends (Last 30 Days)",
            font: {
              size: 14,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0,
            },
          },
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: 10,
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [jobs, days])

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <canvas ref={chartRef} />
    </div>
  )
}
