"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Building, MapPin, Clock, DollarSign, ExternalLink, Star, StarOff } from "lucide-react"
import { useState } from "react"

interface JobsListProps {
  jobs: any[]
  isLoading: boolean
  compact?: boolean
}

export default function JobsList({ jobs, isLoading, compact = false }: JobsListProps) {
  const [savedJobs, setSavedJobs] = useState<string[]>([])

  const toggleSaveJob = (jobId: string) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId))
    } else {
      setSavedJobs([...savedJobs, jobId])
    }
  }

  if (isLoading) {
    return (
      <Card className="border-none shadow-md bg-gradient-to-br from-background to-muted">
        <CardHeader>
          <CardTitle>Jobs List</CardTitle>
          <CardDescription>Loading available jobs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (jobs.length === 0) {
    return (
      <Card className="border-none shadow-md bg-gradient-to-br from-background to-muted">
        <CardHeader>
          <CardTitle>Jobs List</CardTitle>
          <CardDescription>No jobs found matching your criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24 border rounded-md">
            <p className="text-muted-foreground">Try adjusting your search filters</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-background to-muted">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Jobs List</CardTitle>
            <CardDescription>Found {jobs.length} jobs matching your criteria</CardDescription>
          </div>
          {!compact && savedJobs.length > 0 && (
            <Badge variant="outline" className="px-3 py-1">
              {savedJobs.length} Saved Jobs
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {jobs.slice(0, compact ? 3 : 10).map((job, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-none bg-gradient-to-br from-background/80 to-muted/30"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {!compact && (
                    <div className="flex-shrink-0 w-12 h-12 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                      {job.employer_logo ? (
                        <img
                          src={job.employer_logo || "/placeholder.svg"}
                          alt={job.employer_name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=48&width=48"
                          }}
                        />
                      ) : (
                        <Building className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold truncate">{job.job_title}</h3>
                      {!compact && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 flex-shrink-0"
                          onClick={() => toggleSaveJob(job.job_id)}
                        >
                          {savedJobs.includes(job.job_id) ? (
                            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Building className="mr-1 h-3 w-3" />
                        {job.employer_name}
                      </div>
                      {job.job_city && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {job.job_city}, {job.job_country}
                        </div>
                      )}
                      {job.job_employment_type && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Briefcase className="mr-1 h-3 w-3" />
                          {job.job_employment_type}
                        </div>
                      )}
                      {job.job_posted_at_datetime_utc && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {!compact && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {job.job_description || "No description available"}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.job_min_salary && (
                        <Badge variant="outline" className="flex items-center bg-green-500/10">
                          <DollarSign className="mr-1 h-3 w-3" />
                          {job.job_min_salary.toLocaleString()} - {job.job_max_salary?.toLocaleString() || "N/A"}
                        </Badge>
                      )}
                      {job.job_required_skills?.slice(0, 3).map((skill: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-primary/10 hover:bg-primary/20 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {!compact && (
                    <div className="flex-shrink-0 mt-4 sm:mt-0">
                      <Button asChild size="sm" className="gap-1">
                        <a href={job.job_apply_link} target="_blank" rel="noopener noreferrer">
                          Apply <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
      {!compact && jobs.length > 10 && (
        <CardFooter className="flex justify-center border-t p-4">
          <Button variant="outline">Load More Jobs</Button>
        </CardFooter>
      )}
    </Card>
  )
}

