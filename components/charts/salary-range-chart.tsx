"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import type { JobData } from "@/lib/api"

Chart.register(...registerables)

interface SalaryRangeChartProps {
  jobs: JobData[]
}

export function SalaryRangeChart({ jobs }: SalaryRangeChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Clean up previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Process data - create salary ranges
    const jobsWithSalary = jobs.filter((job) => job.job_salary_min !== undefined || job.job_salary_max !== undefined)

    if (jobsWithSalary.length === 0) {
      // No salary data available
      return
    }

    const salaryRanges = {
      "< $50k": 0,
      "$50k - $75k": 0,
      "$75k - $100k": 0,
      "$100k - $125k": 0,
      "$125k - $150k": 0,
      "> $150k": 0,
    }

    jobsWithSalary.forEach((job) => {
      const min = job.job_salary_min || 0
      const max = job.job_salary_max || min
      const avg = (min + max) / 2

      if (avg < 50000) salaryRanges["< $50k"]++
      else if (avg < 75000) salaryRanges["$50k - $75k"]++
      else if (avg < 100000) salaryRanges["$75k - $100k"]++
      else if (avg < 125000) salaryRanges["$100k - $125k"]++
      else if (avg < 150000) salaryRanges["$125k - $150k"]++
      else salaryRanges["> $150k"]++
    })

    const labels = Object.keys(salaryRanges)
    const data = Object.values(salaryRanges)

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
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "Salary Distribution",
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
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <canvas ref={chartRef} />
    </div>
  )
}
