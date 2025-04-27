"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { JobData } from "@/lib/api"

Chart.register(...registerables)

interface JobDistributionChartProps {
  jobs: JobData[]
  selectedRole: string
}

export function JobDistributionChart({ jobs, selectedRole }: JobDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clean up previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Process data
    const employmentTypes = jobs.reduce((acc: Record<string, number>, job) => {
      const type = job.job_employment_type || "Not specified"
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    const labels = Object.keys(employmentTypes)
    const data = Object.values(employmentTypes)

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              font: {
                size: 11,
              },
            },
          },
          title: {
            display: true,
            text: `Job Types Distribution${selectedRole !== "All Roles" ? ` - ${selectedRole}` : ""}`,
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
  }, [jobs, selectedRole])

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <canvas ref={chartRef} />
    </div>
  )
}
