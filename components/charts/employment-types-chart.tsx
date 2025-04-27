"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { JobData } from "@/lib/api"
import { getEmploymentTypes } from "@/lib/api"

Chart.register(...registerables)

interface EmploymentTypesChartProps {
  jobs: JobData[]
}

export function EmploymentTypesChart({ jobs }: EmploymentTypesChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clean up previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Process data
    const employmentTypes = getEmploymentTypes(jobs)

    const labels = employmentTypes.map((item) => item.type)
    const data = employmentTypes.map((item) => item.count)

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              "rgba(54, 162, 235, 0.7)",
              "rgba(255, 99, 132, 0.7)",
              "rgba(255, 206, 86, 0.7)",
              "rgba(75, 192, 192, 0.7)",
              "rgba(153, 102, 255, 0.7)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
          },
          title: {
            display: true,
            text: "Employment Types",
            font: {
              size: 14,
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
