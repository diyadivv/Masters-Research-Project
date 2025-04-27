import type { JobData } from "@/lib/api"
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface JobCardProps {
  job: JobData & { matchScore?: number; matchedKeywords?: string[] }
  showMatchScore?: boolean
}

export function JobCard({ job, showMatchScore = false }: JobCardProps) {
  // Fix for invalid dates
  let timeAgo = "Recently posted"
  try {
    const postedDate = new Date(job.job_posted_at_datetime_utc)
    const now = new Date()

    // Check if the date is valid and not too old (more than 5 years)
    if (!isNaN(postedDate.getTime()) && postedDate.getFullYear() >= now.getFullYear() - 5) {
      timeAgo = formatDistanceToNow(postedDate, { addSuffix: true })
    }
  } catch (error) {
    console.error("Error formatting date:", error)
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow mb-4 border border-gray-100 hover:border-gray-300 transition-all">
      <div className="flex items-start">
        {job.employer_logo ? (
          <img
            src={job.employer_logo || "/placeholder.svg"}
            alt={`${job.employer_name} logo`}
            className="w-12 h-12 object-contain mr-4 rounded"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "/diverse-business-team.png"
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded mr-4 flex items-center justify-center text-gray-500">
            {job.employer_name?.charAt(0) || "?"}
          </div>
        )}

        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg">{job.job_title}</h3>
            {showMatchScore && job.matchScore !== undefined && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Match: {Math.min(Math.round((job.matchScore / 20) * 100), 100)}%
              </span>
            )}
          </div>

          <p className="text-gray-600">{job.employer_name}</p>

          <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500">
            {job.job_city && job.job_state && (
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 mr-1" />
                <span>
                  {job.job_city}, {job.job_state}
                </span>
              </div>
            )}

            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{job.job_employment_type || "Not specified"}</span>
            </div>

            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>{timeAgo}</span>
            </div>
          </div>

          {showMatchScore && job.matchedKeywords && job.matchedKeywords.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Matched keywords:</p>
              <div className="flex flex-wrap gap-1">
                {job.matchedKeywords.slice(0, 5).map((keyword, index) => (
                  <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                    {keyword}
                  </span>
                ))}
                {job.matchedKeywords.length > 5 && (
                  <span className="text-xs text-gray-500">+{job.matchedKeywords.length - 5} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <a
          href={job.job_apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Apply Now →
        </a>
      </div>
    </div>
  )
}
