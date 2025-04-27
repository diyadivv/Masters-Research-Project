"use client"

import type { ParsedResume } from "@/lib/resume-parser"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ATSScoreDisplayProps {
  parsedResume: ParsedResume
}

export function ATSScoreDisplay({ parsedResume }: ATSScoreDisplayProps) {
  if (!parsedResume.atsScore) return null

  const { overall, sections, feedback } = parsedResume.atsScore

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-600"
    if (score >= 60) return "bg-amber-600"
    return "bg-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />
    if (score >= 60) return <Info className="h-5 w-5 text-amber-600" />
    return <AlertCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">ATS Compatibility Score</h3>

      <div className="flex items-center mb-6">
        <div
          className="w-24 h-24 rounded-full border-4 flex items-center justify-center mr-4"
          style={{ borderColor: overall >= 80 ? "#16a34a" : overall >= 60 ? "#d97706" : "#dc2626" }}
        >
          <span className={`text-2xl font-bold ${getScoreColor(overall)}`}>{overall}%</span>
        </div>

        <div>
          <h4 className="font-medium mb-1">Overall Score</h4>
          <p className="text-sm text-gray-600 mb-2">
            {overall >= 80
              ? "Your resume is well-optimized for ATS systems"
              : overall >= 60
                ? "Your resume needs some improvements for ATS systems"
                : "Your resume needs significant improvements for ATS systems"}
          </p>
          <Progress value={overall} className={`h-2 ${getScoreProgressColor(overall)}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(sections).map(([key, score]) => (
          <div key={key} className="flex items-center">
            {getScoreIcon(score)}
            <div className="ml-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium capitalize">{key}</span>
                <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score}%</span>
              </div>
              <Progress value={score} className={`h-1.5 ${getScoreProgressColor(score)}`} />
            </div>
          </div>
        ))}
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="feedback">
          <AccordionTrigger>Improvement Suggestions</AccordionTrigger>
          <AccordionContent>
            <ul className="list-disc pl-5 space-y-1">
              {feedback.map((item, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
