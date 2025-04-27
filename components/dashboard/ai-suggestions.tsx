"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCareerAdvice, getJobApplicationTips, getResumeImprovement } from "@/lib/gemini-api"
import { Sparkles, FileText, Briefcase, GraduationCap, Loader2, Upload, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { parseResume } from "@/lib/resume-parser"

export function AISuggestions() {
  const [activeTab, setActiveTab] = useState("resume")
  const [resumeText, setResumeText] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [role, setRole] = useState("Software Developer")
  const [experience, setExperience] = useState("3-5 years")
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [error, setError] = useState("")
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  // Check if AI service is available
  useEffect(() => {
    // We'll make a test request when the component mounts
    const checkApiAvailability = async () => {
      try {
        const testResponse = await getCareerAdvice("Test", "Test")
        if (testResponse.includes("Error:")) {
          setApiKeyMissing(true)
          setError("AI service is currently unavailable. Please try again later.")
        } else {
          setApiKeyMissing(false)
        }
      } catch (err) {
        console.error("Error checking AI service:", err)
        setApiKeyMissing(true)
        setError("Could not connect to AI service. Please try again later.")
      }
    }

    checkApiAvailability()
  }, [])

  const handleResumeImprovement = async () => {
    if (apiKeyMissing) {
      setError("AI service is currently unavailable. Please try again later.")
      return
    }

    if (!resumeText.trim() && !resumeFile) {
      setError("Please enter your resume text or upload a resume file")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      let textToAnalyze = resumeText

      // If a file is uploaded but no text is entered, parse the file
      if (resumeFile && !resumeText.trim()) {
        setIsParsingResume(true)
        try {
          const parsedResume = await parseResume(resumeFile)
          // Create a text representation of the parsed resume
          textToAnalyze = `
Skills: ${parsedResume.skills.join(", ")}
Experience: ${parsedResume.experience.join(", ")}
Education: ${parsedResume.education.join(", ")}
          `
        } catch (err) {
          setError("Failed to parse resume file. Please try entering text manually.")
          setIsLoading(false)
          setIsParsingResume(false)
          return
        }
        setIsParsingResume(false)
      }

      const response = await getResumeImprovement(textToAnalyze)

      // Check if response contains an error message
      if (response.startsWith("Error:")) {
        setError(response.replace("Error:", "").trim())
      } else {
        setAiResponse(response)
      }
    } catch (err) {
      setError("Failed to generate suggestions. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobTips = async () => {
    if (apiKeyMissing) {
      setError("AI service is currently unavailable. Please try again later.")
      return
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      const response = await getJobApplicationTips(jobDescription)

      // Check if response contains an error message
      if (response.startsWith("Error:")) {
        setError(response.replace("Error:", "").trim())
      } else {
        setAiResponse(response)
      }
    } catch (err) {
      setError("Failed to generate suggestions. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCareerAdvice = async () => {
    if (apiKeyMissing) {
      setError("AI service is currently unavailable. Please try again later.")
      return
    }

    setIsLoading(true)
    setError("")
    try {
      const response = await getCareerAdvice(role, experience)

      // Check if response contains an error message
      if (response.startsWith("Error:")) {
        setError(response.replace("Error:", "").trim())
      } else {
        setAiResponse(response)
      }
    } catch (err) {
      setError("Failed to generate suggestions. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
        <h2 className="text-xl font-semibold">AI-Powered Career Assistant</h2>
      </div>

      {apiKeyMissing && (
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>AI Service Unavailable</AlertTitle>
          <AlertDescription>The AI service is currently unavailable. Please try again later.</AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
          setAiResponse("")
          setError("")
        }}
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="resume">
            <FileText className="h-4 w-4 mr-2" />
            Resume Improvement
          </TabsTrigger>
          <TabsTrigger value="job">
            <Briefcase className="h-4 w-4 mr-2" />
            Job Application Tips
          </TabsTrigger>
          <TabsTrigger value="career">
            <GraduationCap className="h-4 w-4 mr-2" />
            Career Advice
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "resume"
                  ? "Improve Your Resume"
                  : activeTab === "job"
                    ? "Get Job Application Tips"
                    : "Get Career Advice"}
              </CardTitle>
              <CardDescription>
                {activeTab === "resume"
                  ? "Upload your resume or paste the text to get AI-powered improvement suggestions"
                  : activeTab === "job"
                    ? "Paste a job description to get tailored application tips"
                    : "Get personalized career advice based on your role and experience"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TabsContent value="resume" className="mt-0">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4">
                    {resumeFile ? (
                      <div className="flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">{resumeFile.name}</p>
                          <p className="text-sm text-gray-500">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload your resume file</p>
                        <p className="text-xs text-gray-400 mt-1">Supports PDF, DOCX, TXT (Max 5MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      id="ai-resume-upload"
                      className="hidden"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => document.getElementById("ai-resume-upload")?.click()}
                      disabled={apiKeyMissing}
                    >
                      Browse Files
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-500 my-2">OR</div>

                  <Textarea
                    placeholder="Paste your resume text here..."
                    className="min-h-[200px]"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    disabled={apiKeyMissing}
                  />
                </div>
              </TabsContent>

              <TabsContent value="job" className="mt-0">
                <Textarea
                  placeholder="Paste the job description here..."
                  className="min-h-[200px]"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={apiKeyMissing}
                />
              </TabsContent>

              <TabsContent value="career" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Your Role</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g., Software Developer"
                      disabled={apiKeyMissing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience Level</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      disabled={apiKeyMissing}
                    >
                      <option value="Entry level (0-2 years)">Entry level (0-2 years)</option>
                      <option value="Mid level (3-5 years)">Mid level (3-5 years)</option>
                      <option value="Senior (6-10 years)">Senior (6-10 years)</option>
                      <option value="Expert (10+ years)">Expert (10+ years)</option>
                    </select>
                  </div>
                </div>
              </TabsContent>
            </CardContent>
            <CardFooter>
              <Button
                onClick={
                  activeTab === "resume"
                    ? handleResumeImprovement
                    : activeTab === "job"
                      ? handleJobTips
                      : handleCareerAdvice
                }
                disabled={isLoading || isParsingResume || apiKeyMissing}
                className="w-full"
              >
                {isLoading || isParsingResume ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isParsingResume ? "Parsing Resume..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Suggestions
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
              <CardDescription>Personalized suggestions powered by AI</CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : aiResponse ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line">{aiResponse}</div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>AI suggestions will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}
