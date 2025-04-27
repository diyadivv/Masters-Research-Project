"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import JobsOverview from "@/components/jobs-overview"
import JobsList from "@/components/jobs-list"
import ResumeUpload from "@/components/resume-upload"
import JobsFilter from "@/components/jobs-filter"
import { useJobs } from "@/hooks/use-jobs"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Search, FileText, BarChart3 } from "lucide-react"

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const { jobs, isLoading, error } = useJobs(selectedRole)
  const [resumeJobs, setResumeJobs] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
  }

  const handleResumeMatch = (matchedJobs: any[]) => {
    setResumeJobs(matchedJobs)
    // Automatically switch to the resume tab when matches are found
    if (matchedJobs.length > 0) {
      setActiveTab("resume")
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container flex h-16 items-center px-4 md:px-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text">
            JobSearch Dashboard
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="hidden md:flex">
              <span className="text-xs font-medium">API Status: </span>
              <span className={`ml-1 text-xs ${error ? "text-destructive" : "text-green-500"}`}>
                {error ? "Error" : "Connected"}
              </span>
            </Badge>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 md:px-6 md:py-8 lg:py-10">
        <div className="grid gap-6">
          <JobsFilter onRoleChange={handleRoleChange} selectedRole={selectedRole} />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Jobs List</span>
              </TabsTrigger>
              <TabsTrigger value="resume" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Resume Match</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-muted">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Jobs Found</CardTitle>
                    <div className="rounded-full bg-primary/10 p-1">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{isLoading ? "Loading..." : jobs.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {selectedRole === "all" ? "Across all roles" : `For ${selectedRole} roles`}
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-muted">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading
                        ? "Loading..."
                        : jobs.length > 0
                          ? `$${Math.round(
                              jobs.reduce((acc, job) => acc + (job.job_min_salary || 0), 0) /
                                jobs.filter((job) => job.job_min_salary).length,
                            ).toLocaleString()}`
                          : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">Based on available salary data</p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-muted">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recent Postings</CardTitle>
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-primary"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading
                        ? "Loading..."
                        : jobs.filter(
                            (job) =>
                              new Date(job.job_posted_at_datetime_utc) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                          ).length}
                    </div>
                    <p className="text-xs text-muted-foreground">Posted in the last 7 days</p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-muted">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Locations</CardTitle>
                    <div className="rounded-full bg-primary/10 p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
                        <path d="M9 17v4h6v-4" />
                      </svg>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isLoading
                        ? "Loading..."
                        : jobs.length > 0
                          ? Object.entries(
                              jobs.reduce((acc: any, job: any) => {
                                const location = job.job_city || "Unknown"
                                if (!acc[location]) acc[location] = 0
                                acc[location]++
                                return acc
                              }, {}),
                            ).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || "N/A"
                          : "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground">Most popular job location</p>
                  </CardContent>
                </Card>
              </div>

              <JobsOverview jobs={jobs} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              <JobsList jobs={jobs} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="resume" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-1 border-none shadow-md bg-gradient-to-br from-background to-muted">
                  <CardHeader>
                    <CardTitle>Upload Your Resume</CardTitle>
                    <CardDescription>We'll match your skills with available jobs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResumeUpload jobs={jobs} onMatch={handleResumeMatch} />
                  </CardContent>
                </Card>
                <Card className="md:col-span-1 border-none shadow-md bg-gradient-to-br from-background to-muted">
                  <CardHeader>
                    <CardTitle>Matched Jobs</CardTitle>
                    <CardDescription>Jobs that match your resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {resumeJobs.length > 0 ? (
                      <JobsList jobs={resumeJobs} isLoading={false} compact />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-center">
                        <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">Upload your resume to see matching jobs</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

