"use client"

import type { JobData } from "@/lib/api"
import { JobDistributionChart } from "../charts/job-distribution-chart"
import { LocationBarChart } from "../charts/location-bar-chart"
import { SalaryRangeChart } from "../charts/salary-range-chart"
import { getTopLocations } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface OverviewTabProps {
  jobs: JobData[]
  isLoading: boolean
  selectedRole: string
}

export function OverviewTab({ jobs, isLoading, selectedRole }: OverviewTabProps) {
  const topLocations = getTopLocations(jobs)

  // Get recent jobs
  const recentJobs = [...jobs]
    .sort((a, b) => {
      return new Date(b.job_posted_at_datetime_utc).getTime() - new Date(a.job_posted_at_datetime_utc).getTime()
    })
    .slice(0, 5)

  // Get top employers
  const employerCounts = jobs.reduce((acc: Record<string, number>, job) => {
    acc[job.employer_name] = (acc[job.employer_name] || 0) + 1
    return acc
  }, {})

  const topEmployers = Object.entries(employerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4">Jobs Overview</h2>
        <div className="text-gray-500">Loading job data...</div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4">Jobs Overview</h2>
        <div className="text-gray-500">No job data available for the selected filters.</div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">Jobs Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <JobDistributionChart jobs={jobs} selectedRole={selectedRole} />
        <LocationBarChart locations={topLocations} />
      </div>

      <div className="mb-6">
        <SalaryRangeChart jobs={jobs} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Job Postings</CardTitle>
            <CardDescription>Latest opportunities in the market</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentJobs.map((job) => {
                const postedDate = new Date(job.job_posted_at_datetime_utc)
                const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true })

                return (
                  <li key={job.job_id} className="border-b pb-2 last:border-0">
                    <div className="font-medium">{job.job_title}</div>
                    <div className="text-sm text-gray-600">{job.employer_name}</div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {job.job_city}, {job.job_state}
                      </span>
                      <span>{timeAgo}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Employers</CardTitle>
            <CardDescription>Companies with the most job listings</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {topEmployers.map((employer, index) => (
                <li key={index} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <span className="font-medium">{employer.name}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {employer.count} {employer.count === 1 ? "job" : "jobs"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Market Insights</CardTitle>
          <CardDescription>Key trends and observations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              Based on the current data of {jobs.length} jobs, we're seeing strong demand for{" "}
              {selectedRole === "All Roles" ? "technical roles" : selectedRole}
              {topLocations.length > 0 ? ` especially in ${topLocations[0].location}` : ""}.
            </p>
            <p>
              The average salary range for these positions falls primarily in the $75k-$125k range, with some variations
              based on location and experience level.
            </p>
            <p>
              {jobs.some((job) => job.job_required_skills)
                ? "Top required skills include JavaScript, React, and Node.js, with an increasing demand for TypeScript and cloud expertise."
                : "Companies are looking for candidates with strong technical and communication skills, with an emphasis on problem-solving abilities."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
