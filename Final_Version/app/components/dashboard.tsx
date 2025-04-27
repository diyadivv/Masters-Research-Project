"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type JobData,
  calculateAverageSalary,
  extractRolesFromJobs,
  filterJobsByRole,
  getRecentPostings,
  getTopLocations,
  FALLBACK_JOB_DATA,
} from "@/lib/api"
import { OverviewTab } from "./dashboard/overview-tab"
import { JobsListTab } from "./dashboard/jobs-list-tab"
import { ResumeMatchTab } from "./dashboard/resume-match-tab"
import { MarketAnalysisTab } from "./dashboard/market-analysis-tab"
import { StatCard } from "./ui/stat-card"
import {
  BarChart3,
  BriefcaseIcon,
  DollarSign,
  FileText,
  MapPinIcon,
  RefreshCw,
  TrendingUp,
  Loader2,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [jobs, setJobs] = useState<JobData[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>([])
  const [roles, setRoles] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState("All Roles")
  const [searchQuery, setSearchQuery] = useState("developer jobs in us")
  const [activeTab, setActiveTab] = useState("market")
  const [apiStatus, setApiStatus] = useState<"connected" | "error" | "warning" | "rate-limited">("connected")
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [useFallbackData, setUseFallbackData] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [rateLimitRetryTime, setRateLimitRetryTime] = useState<Date | null>(null)

  const fetchJobs = async (retry = false) => {
    try {
      setIsLoading(true)
      setApiErrorMessage(null)

      // Use fallback data if we've already tried to fetch real data and failed
      if (retry || useFallbackData) {
        console.log("Using fallback job data")
        setJobs(FALLBACK_JOB_DATA)
        setFilteredJobs(FALLBACK_JOB_DATA)
        setRoles(["All Roles", ...extractRolesFromJobs(FALLBACK_JOB_DATA)])
        setApiStatus("warning")
        setApiErrorMessage("Using sample job data. Some features may be limited.")
        setLastUpdated(new Date())
        setIsLoading(false)
        return
      }

      // Check if we're in a rate limit cooldown period
      if (rateLimitRetryTime && new Date() < rateLimitRetryTime) {
        console.log("Still in rate limit cooldown period, using fallback data")
        setJobs(FALLBACK_JOB_DATA)
        setFilteredJobs(FALLBACK_JOB_DATA)
        setRoles(["All Roles", ...extractRolesFromJobs(FALLBACK_JOB_DATA)])
        setApiStatus("rate-limited")

        // Calculate time remaining
        const minutesRemaining = Math.ceil((rateLimitRetryTime.getTime() - new Date().getTime()) / (1000 * 60))
        setApiErrorMessage(
          `API rate limit exceeded. Using sample data. Try again in approximately ${minutesRemaining} minute${
            minutesRemaining !== 1 ? "s" : ""
          }.`,
        )

        setLastUpdated(new Date())
        setIsLoading(false)
        return
      }

      console.log(`Fetching jobs with query: ${searchQuery}`)

      // Use our server-side API route
      const response = await fetch(`/api/jobs?query=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        console.warn(`API route returned error status: ${response.status}`)
        setApiStatus("error")
        setApiErrorMessage("Could not connect to the job search API. Using sample data instead.")
        setUseFallbackData(true)

        // Use fallback data
        setJobs(FALLBACK_JOB_DATA)
        setFilteredJobs(FALLBACK_JOB_DATA)
        setRoles(["All Roles", ...extractRolesFromJobs(FALLBACK_JOB_DATA)])
      } else {
        const data = await response.json()

        if (data.status === "error") {
          console.warn("API returned error:", data.message)
          setApiStatus("error")
          setApiErrorMessage(data.message || "Could not connect to the job search API. Using sample data instead.")
          setUseFallbackData(true)
        } else if (data.status === "warning") {
          console.warn("API returned warning:", data.message)

          // Check if this is a rate limit warning
          if (data.message && data.message.includes("rate limit exceeded")) {
            setApiStatus("rate-limited")

            // Set a retry time for 1 hour from now
            const retryTime = new Date()
            retryTime.setHours(retryTime.getHours() + 1)
            setRateLimitRetryTime(retryTime)

            setApiErrorMessage(`${data.message} Try again in approximately 1 hour.`)
          } else {
            setApiStatus("warning")
            setApiErrorMessage(data.message || "Using sample job data. Some features may be limited.")
          }
        } else {
          setApiStatus("connected")
          setUseFallbackData(false)
          setApiErrorMessage(null)
          setRateLimitRetryTime(null)
        }

        setJobs(data.data)
        setFilteredJobs(data.data)
        setRoles(["All Roles", ...extractRolesFromJobs(data.data)])
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setApiStatus("error")
      setApiErrorMessage("An unexpected error occurred. Using sample data instead.")
      setUseFallbackData(true)

      // Use fallback data
      setJobs(FALLBACK_JOB_DATA)
      setFilteredJobs(FALLBACK_JOB_DATA)
      setRoles(["All Roles", ...extractRolesFromJobs(FALLBACK_JOB_DATA)])

      // Try again with fallback data
      if (!retry && retryCount < 1) {
        setRetryCount((prev) => prev + 1)
        fetchJobs(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()

    // Set up a timer to check if we can retry after rate limit
    const timer = setInterval(() => {
      if (rateLimitRetryTime && new Date() >= rateLimitRetryTime) {
        setRateLimitRetryTime(null)
        setApiStatus("warning")
        setApiErrorMessage("Rate limit cooldown period ended. You can try fetching new data now.")
      }
    }, 60000) // Check every minute

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (selectedRole === "All Roles") {
      setFilteredJobs(jobs)
    } else {
      setFilteredJobs(filterJobsByRole(jobs, selectedRole))
    }
  }, [selectedRole, jobs])

  const handleRefresh = async () => {
    // Don't allow refresh if we're in rate limit cooldown
    if (rateLimitRetryTime && new Date() < rateLimitRetryTime) {
      const minutesRemaining = Math.ceil((rateLimitRetryTime.getTime() - new Date().getTime()) / (1000 * 60))
      setApiErrorMessage(
        `API rate limit exceeded. Please wait approximately ${minutesRemaining} minute${
          minutesRemaining !== 1 ? "s" : ""
        } before trying again.`,
      )
      return
    }

    setIsRefreshing(true)
    // Try to fetch real data again, even if we were using fallback data
    setUseFallbackData(false)
    setRetryCount(0)
    await fetchJobs()
    setIsRefreshing(false)
  }

  const handleSearch = async () => {
    // Don't allow search if we're in rate limit cooldown
    if (rateLimitRetryTime && new Date() < rateLimitRetryTime) {
      const minutesRemaining = Math.ceil((rateLimitRetryTime.getTime() - new Date().getTime()) / (1000 * 60))
      setApiErrorMessage(
        `API rate limit exceeded. Please wait approximately ${minutesRemaining} minute${
          minutesRemaining !== 1 ? "s" : ""
        } before trying again.`,
      )
      return
    }

    setIsRefreshing(true)
    setUseFallbackData(false)
    setRetryCount(0)
    await fetchJobs()
    setIsRefreshing(false)
  }

  // Calculate stats
  const totalJobs = filteredJobs.length
  const averageSalary = calculateAverageSalary(filteredJobs)
  const recentPostings = getRecentPostings(filteredJobs, 7).length
  const topLocations = getTopLocations(filteredJobs, 1)
  const topLocation = topLocations.length > 0 ? topLocations[0].location : "N/A"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">JobSearch Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm flex items-center">
              <span className="mr-2">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading || (rateLimitRetryTime && new Date() < rateLimitRetryTime)}
                className="h-8 px-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <div className="text-sm flex items-center">
              API Status:
              <Badge
                variant={
                  apiStatus === "connected"
                    ? "default"
                    : apiStatus === "warning"
                      ? "outline"
                      : apiStatus === "rate-limited"
                        ? "secondary"
                        : "destructive"
                }
                className="ml-2"
              >
                {apiStatus === "connected"
                  ? "Connected"
                  : apiStatus === "warning"
                    ? "Using Sample Data"
                    : apiStatus === "rate-limited"
                      ? "Rate Limited"
                      : "Error"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {apiErrorMessage && (
          <Alert
            variant={apiStatus === "error" ? "destructive" : apiStatus === "rate-limited" ? "default" : "default"}
            className="mb-6"
          >
            {apiStatus === "rate-limited" ? <Clock className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <AlertTitle>
              {apiStatus === "error"
                ? "API Connection Error"
                : apiStatus === "rate-limited"
                  ? "API Rate Limit Exceeded"
                  : "Notice"}
            </AlertTitle>
            <AlertDescription>
              {apiErrorMessage}
              {apiStatus === "error" && !rateLimitRetryTime && (
                <div className="mt-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                    Try Again
                  </Button>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-4 mb-8">
          <div className="flex items-center mb-4">
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Job Search Filters</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">Filter jobs by search query and role to find the perfect match</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="query-input" className="block text-sm font-medium text-gray-700 mb-1">
                Search Query
              </label>
              <Input
                id="query-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., data engineer jobs in new york"
                disabled={rateLimitRetryTime && new Date() < rateLimitRetryTime}
              />
            </div>

            <div>
              <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
                disabled={rateLimitRetryTime && new Date() < rateLimitRetryTime}
              >
                <SelectTrigger id="role-select">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSearch}
              disabled={isRefreshing || isLoading || (rateLimitRetryTime && new Date() < rateLimitRetryTime)}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>Search Jobs</>
              )}
            </Button>
          </div>
        </Card>

        <div className="mb-6">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
              <StatCard
                icon={<BriefcaseIcon className="h-5 w-5" />}
                title="Total Jobs Found"
                value={isLoading ? "Loading..." : totalJobs}
                description="Across all roles"
                isLoading={isLoading}
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
              <StatCard
                icon={<DollarSign className="h-5 w-5" />}
                title="Average Salary"
                value={isLoading ? "Loading..." : `$${averageSalary.toLocaleString()}`}
                description="Based on available salary data"
                isLoading={isLoading}
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
              <StatCard
                icon={<BarChart3 className="h-5 w-5" />}
                title="Recent Postings"
                value={isLoading ? "Loading..." : recentPostings}
                description="Posted in the last 7 days"
                isLoading={isLoading}
              />
            </div>

            <div className="w-full sm:w-1/2 md:w-1/4 px-2 mb-4">
              <StatCard
                icon={<MapPinIcon className="h-5 w-5" />}
                title="Top Locations"
                value={isLoading ? "Loading..." : topLocation}
                description="Most popular job location"
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="market">
              <TrendingUp className="h-4 w-4 mr-2" />
              Market Analysis
            </TabsTrigger>
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              Jobs List
            </TabsTrigger>
            <TabsTrigger value="resume">
              <FileText className="h-4 w-4 mr-2" />
              Resume Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="market">
            <MarketAnalysisTab jobs={filteredJobs} isLoading={isLoading} selectedRole={selectedRole} />
          </TabsContent>

          <TabsContent value="overview">
            <OverviewTab jobs={filteredJobs} isLoading={isLoading} selectedRole={selectedRole} />
          </TabsContent>

          <TabsContent value="jobs">
            <JobsListTab jobs={filteredJobs} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="resume">
            <ResumeMatchTab jobs={jobs} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
