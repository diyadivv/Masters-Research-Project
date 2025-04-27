"use client"

import type { JobData } from "@/lib/api"
import { JobCard } from "../ui/job-card"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

interface JobsListTabProps {
  jobs: JobData[]
  isLoading: boolean
}

export function JobsListTab({ jobs, isLoading }: JobsListTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 5

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      job.job_title.toLowerCase().includes(searchLower) ||
      job.employer_name.toLowerCase().includes(searchLower) ||
      (job.job_city && job.job_city.toLowerCase().includes(searchLower)) ||
      (job.job_state && job.job_state.toLowerCase().includes(searchLower))
    )
  })

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  if (isLoading) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4">Jobs List</h2>
        <div className="text-gray-500">Loading jobs...</div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">Jobs List</h2>

      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search jobs by title, company, or location..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1) // Reset to first page on search
          }}
          className="pl-10"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>

      {currentJobs.length === 0 ? (
        <div className="text-gray-500 py-4">No jobs found matching your search criteria.</div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length}{" "}
              jobs
            </p>
          </div>

          {currentJobs.map((job) => (
            <JobCard key={job.job_id} job={job} />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
