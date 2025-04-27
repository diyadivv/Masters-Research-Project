"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { JobData } from "@/lib/api"
import { getSalaryRanges } from "@/lib/api"

Chart.register(...registerables)

interface SalaryRangesChartProps {
  jobs: JobData[]
}

export function SalaryRangesChart({ jobs }: SalaryRangesChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clean up previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Process data
    const salaryRanges = getSalaryRanges(jobs)

    const labels = salaryRanges.map((item) => item.range)
    const data = salaryRanges.map((item) => item.count)

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Number of Jobs",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Salary Ranges",
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
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [jobs])

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <canvas ref={chartRef} />
    </div>
  )
}
