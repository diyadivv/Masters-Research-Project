"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { JobData } from "@/lib/api"
import { getRequiredSkills } from "@/lib/api"

Chart.register(...registerables)

interface RequiredSkillsChartProps {
  jobs: JobData[]
}

export function RequiredSkillsChart({ jobs }: RequiredSkillsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clean up previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Process data
    const skills = getRequiredSkills(jobs)

    const labels = skills.map((item) => item.skill)
    const data = skills.map((item) => item.count)

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "horizontalBar",
      data: {
        labels,
        datasets: [
          {
            label: "Demand",
            data,
            backgroundColor: "rgba(153, 102, 255, 0.7)",
            borderColor: "rgba(153, 102, 255, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Top Required Skills",
            font: {
              size: 14,
            },
          },
        },
        scales: {
          x: {
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
