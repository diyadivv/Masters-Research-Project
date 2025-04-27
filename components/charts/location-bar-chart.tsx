"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface LocationBarChartProps {
  locations: { location: string; count: number }[]
}

export function LocationBarChart({ locations }: LocationBarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || locations.length === 0) return

    // Clean up previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const labels = locations.map((loc) => loc.location)
    const data = locations.map((loc) => loc.count)

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
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Top Job Locations",
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
          y: {
            ticks: {
              font: {
                size: 11,
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
  }, [locations])

  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <canvas ref={chartRef} />
    </div>
  )
}
