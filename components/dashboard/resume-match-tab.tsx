"use client"

import type React from "react"

import { useState } from "react"
import type { JobData } from "@/lib/api"
import { type ParsedResume, matchJobsToResume, parseResume } from "@/lib/resume-parser"
import { Button } from "@/components/ui/button"
import { JobCard } from "../ui/job-card"
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react"
import { ATSScoreDisplay } from "./ats-score-display"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AISuggestions } from "./ai-suggestions"

interface ResumeMatchTabProps {
  jobs: JobData[]
  isLoading: boolean
}

export function ResumeMatchTab({ jobs, isLoading }: ResumeMatchTabProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null)
  const [matchedJobs, setMatchedJobs] = useState<(JobData & { matchScore: number; matchedKeywords: string[] })[]>([])
  const [activeTab, setActiveTab] = useState("match")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    try {
      const parsed = await parseResume(file)
      setParsedResume(parsed)

      const matched = matchJobsToResume(jobs, parsed)
      setMatchedJobs(matched)
    } catch (error) {
      console.error("Error parsing resume:", error)
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-4">
        <h2 className="text-xl font-semibold mb-4">Resume Analysis</h2>
        <div className="text-gray-500">Loading jobs data...</div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <h2 className="text-xl font-semibold mb-4">Resume Analysis</h2>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="font-medium mb-4">Upload your resume for analysis and job matching</h3>

        <div className="mb-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {file ? (
              <div className="flex items-center justify-center">
                <FileText className="h-8 w-8 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Drag and drop your resume here, or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">Supports PDF, DOCX, TXT (Max 5MB)</p>
              </div>
            )}

            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => document.getElementById("resume-upload")?.click()}
            variant="outline"
            className="mr-2"
            disabled={isUploading}
          >
            Browse Files
          </Button>

          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Resume"
            )}
          </Button>
        </div>
      </div>

      {parsedResume && (
        <div className="mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Resume Successfully Analyzed</h4>
              <p className="text-sm text-green-700 mt-1">
                We found {parsedResume.skills.length} skills and {parsedResume.experience.length} relevant experiences
                in your resume.
              </p>

              {parsedResume.skills.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-green-800">Skills detected:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {parsedResume.skills.map((skill, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {parsedResume && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="match">Job Matches</TabsTrigger>
            <TabsTrigger value="ats">ATS Score</TabsTrigger>
            <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="match">
            {matchedJobs.length > 0 ? (
              <div>
                <h3 className="font-medium mb-4">Top Matching Jobs ({matchedJobs.length})</h3>
                {matchedJobs.map((job) => (
                  <JobCard key={job.job_id} job={job} showMatchScore={true} />
                ))}
              </div>
            ) : (
              <div className="text-gray-500 py-4">No matching jobs found.</div>
            )}
          </TabsContent>

          <TabsContent value="ats">
            <ATSScoreDisplay parsedResume={parsedResume} />
          </TabsContent>

          <TabsContent value="ai">
            <AISuggestions />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
