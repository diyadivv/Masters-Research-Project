"use client"

import { useState, useEffect } from "react"
import type { JobData } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LocationBarChart } from "../charts/location-bar-chart"
import { JobDistributionChart } from "../charts/job-distribution-chart"
import { SalaryRangeChart } from "../charts/salary-range-chart"
import { JobPostingTrendChart } from "../charts/job-posting-trend-chart"
import { ExperienceLevelChart } from "../charts/experience-level-chart"
import { RemoteVsOnsiteChart } from "../charts/remote-vs-onsite-chart"
import { getTopLocations, getExperienceLevels, getRemoteVsOnsite } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getInDemandSkills } from "@/lib/gemini-api"
import { Loader2, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface MarketAnalysisTabProps {
  jobs: JobData[]
  isLoading: boolean
  selectedRole: string
}

export function MarketAnalysisTab({ jobs, isLoading, selectedRole }: MarketAnalysisTabProps) {
  const [activeTab, setActiveTab] = useState("locations")
  const [inDemandSkills, setInDemandSkills] = useState<string[]>([])
  const [isLoadingSkills, setIsLoadingSkills] = useState(false)
  const [skillsError, setSkillsError] = useState<string | null>(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  const topLocations = getTopLocations(jobs)
  const experienceLevels = getExperienceLevels(jobs)
  const remoteVsOnsite = getRemoteVsOnsite(jobs)

  // Default skills to use when API is unavailable
  const defaultSkills = [
    "JavaScript",
    "React",
    "Python",
    "SQL",
    "Communication",
    "Problem Solving",
    "Cloud Computing",
    "Data Analysis",
  ]

  // Fetch skills using Gemini API when jobs data changes
  useEffect(() => {
    async function fetchSkills() {
      if (jobs.length === 0) return

      // Check if we have enough skills data from the API
      const skillsFromAPI = Array.from(new Set(jobs.flatMap((job) => job.job_required_skills || []).filter(Boolean)))

      // If we have enough skills from the API, use those
      if (skillsFromAPI.length >= 8) {
        setInDemandSkills(skillsFromAPI.slice(0, 8))
        return
      }

      // Otherwise, use Gemini to generate skills
      try {
        setIsLoadingSkills(true)
        setSkillsError(null)

        // Extract job titles and descriptions for Gemini
        const jobTitles = jobs.map((job) => job.job_title)
        const jobDescriptions = jobs
          .map((job) => job.job_description)
          .filter(Boolean)
          .slice(0, 5) // Limit to 5 descriptions to avoid large prompts

        const skills = await getInDemandSkills(jobTitles, jobDescriptions, selectedRole)

        // Check if the response indicates an API key issue
        if (Array.isArray(skills) && skills.length > 0) {
          if (typeof skills[0] === "string" && skills[0].includes("Error:")) {
            setApiKeyMissing(true)
            setSkillsError("AI service unavailable. Using generic skills instead.")
            setInDemandSkills(defaultSkills)
          } else {
            setInDemandSkills(skills)
          }
        } else {
          // Fallback to generic skills if the response is not as expected
          setSkillsError("Could not generate skills. Using generic skills instead.")
          setInDemandSkills(defaultSkills)
        }
      } catch (error) {
        console.error("Error fetching skills:", error)
        setSkillsError("Failed to load skills. Using generic skills instead.")
        // Fallback to generic skills if Gemini fails
        setInDemandSkills(defaultSkills)
      } finally {
        setIsLoadingSkills(false)
      }
    }

    fetchSkills()
  }, [jobs, selectedRole])

  if (isLoading) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4">Jobs Market Analysis</h2>
        <div className="text-gray-500">Loading job data...</div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4">Jobs Market Analysis</h2>
        <div className="text-gray-500">No job data available for the selected filters.</div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Jobs Market Analysis</h2>
          <p className="text-sm text-gray-500">Comprehensive overview of the job market</p>
        </div>
        <div className="text-sm font-medium">{jobs.length} Jobs Analyzed</div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="w-full justify-start mb-6 bg-white border-b border-gray-200 p-0 h-auto">
          <TabsTrigger
            value="locations"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-3"
          >
            Locations
          </TabsTrigger>
          <TabsTrigger
            value="employment"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-3"
          >
            Employment Types
          </TabsTrigger>
          <TabsTrigger
            value="salary"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-3"
          >
            Salary Ranges
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-3"
          >
            Experience
          </TabsTrigger>
          <TabsTrigger
            value="remote"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-3"
          >
            Remote vs. Onsite
          </TabsTrigger>
        </TabsList>

        <TabsContent value="locations">
          <div className="h-[350px]">
            <LocationBarChart locations={topLocations} />
          </div>
        </TabsContent>

        <TabsContent value="employment">
          <div className="h-[350px]">
            <JobDistributionChart jobs={jobs} selectedRole={selectedRole} />
          </div>
        </TabsContent>

        <TabsContent value="salary">
          <div className="h-[350px]">
            <SalaryRangeChart jobs={jobs} />
          </div>
        </TabsContent>

        <TabsContent value="experience">
          <div className="h-[350px]">
            <ExperienceLevelChart experienceLevels={experienceLevels} />
          </div>
        </TabsContent>

        <TabsContent value="remote">
          <div className="h-[350px]">
            <RemoteVsOnsiteChart remoteVsOnsite={remoteVsOnsite} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Job Posting Trends</h3>
        <div className="h-[300px]">
          <JobPostingTrendChart jobs={jobs} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Skills in Demand</CardTitle>
            <CardDescription>
              Most requested skills for {selectedRole === "All Roles" ? "all roles" : selectedRole}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSkills ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-sm text-gray-500">Analyzing skills in demand...</span>
              </div>
            ) : (
              <div className="text-sm">
                {apiKeyMissing && (
                  <Alert variant="warning" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>AI Service Unavailable</AlertTitle>
                    <AlertDescription className="text-xs">
                      The AI service is currently unavailable. Using generic skills instead.
                    </AlertDescription>
                  </Alert>
                )}

                {skillsError && !apiKeyMissing && <div className="text-amber-600 mb-2 text-xs">{skillsError}</div>}

                {inDemandSkills.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-2">
                    {inDemandSkills.map((skill, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-xs mr-2">
                          {index + 1}
                        </span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No skill data available for the selected jobs.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
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
                The job market for {selectedRole === "All Roles" ? "these roles" : selectedRole} shows consistent
                growth, with an average of {Math.round(jobs.length / 30)} new postings per day over the last month.
              </p>
              <p>
                {remoteVsOnsite[0]?.type === "Remote"
                  ? "Remote work opportunities continue to dominate the market, offering flexibility for job seekers."
                  : "Companies are increasingly looking for candidates to work onsite or in hybrid arrangements."}
              </p>
              {inDemandSkills.length > 0 && (
                <p>
                  Top skills employers are looking for include {inDemandSkills.slice(0, 3).join(", ")}, and{" "}
                  {inDemandSkills[3]}.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
