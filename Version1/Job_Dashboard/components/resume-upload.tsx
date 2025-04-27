"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"

interface ResumeUploadProps {
  jobs: any[]
  onMatch: (matchedJobs: any[]) => void
}

export default function ResumeUpload({ jobs, onMatch }: ResumeUploadProps) {
  const [resumeText, setResumeText] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setIsUploading(true)

    // Simulate file reading
    setTimeout(() => {
      setIsUploading(false)
      // In a real app, we would parse the resume file
      // For now, we'll just set some sample text
      setResumeText(
        "Experienced software developer with skills in React, TypeScript, Node.js, and cloud technologies. Proficient in building responsive web applications and RESTful APIs.",
      )
    }, 1500)
  }

  const handleAnalyzeResume = () => {
    if (!resumeText) return

    // Extract keywords from resume
    const keywords = extractKeywords(resumeText)

    // Match jobs based on keywords
    const matchedJobs = jobs.filter((job) => {
      const jobText = `${job.job_title} ${job.job_description} ${job.job_required_skills?.join(" ") || ""}`
      return keywords.some((keyword) => jobText.toLowerCase().includes(keyword.toLowerCase()))
    })

    // Sort by match score (number of keywords matched)
    matchedJobs.sort((a, b) => {
      const aScore = calculateMatchScore(a, keywords)
      const bScore = calculateMatchScore(b, keywords)
      return bScore - aScore
    })

    onMatch(matchedJobs)
  }

  const extractKeywords = (text: string) => {
    // In a real app, we would use NLP to extract keywords
    // For now, we'll use a simple approach
    const commonWords = ["and", "the", "in", "with", "for", "a", "an", "of", "to", "is", "are"]
    return text
      .split(/\s+/)
      .filter((word) => word.length > 3 && !commonWords.includes(word.toLowerCase()))
      .concat(["React", "TypeScript", "Node.js", "developer", "software"])
  }

  const calculateMatchScore = (job: any, keywords: string[]) => {
    const jobText = `${job.job_title} ${job.job_description} ${job.job_required_skills?.join(" ") || ""}`
    return keywords.reduce((score, keyword) => {
      return jobText.toLowerCase().includes(keyword.toLowerCase()) ? score + 1 : score
    }, 0)
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="resume">Upload Resume</Label>
        <div className="flex gap-2">
          <Input id="resume" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileChange} />
          <Button asChild variant="outline" className="w-full">
            <label htmlFor="resume" className="cursor-pointer flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload Resume"}
            </label>
          </Button>
        </div>
        {fileName && (
          <p className="text-sm text-muted-foreground">{isUploading ? "Processing..." : `Uploaded: ${fileName}`}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume-text">Or paste your resume text</Label>
        <Textarea
          id="resume-text"
          placeholder="Paste your resume content here..."
          className="min-h-[150px]"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
      </div>

      <Button onClick={handleAnalyzeResume} disabled={!resumeText || isUploading} className="w-full">
        Analyze Resume & Find Matches
      </Button>
    </div>
  )
}

