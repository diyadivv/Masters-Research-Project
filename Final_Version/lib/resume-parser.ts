export type ParsedResume = {
  skills: string[]
  experience: string[]
  education: string[]
  keywords: string[]
  atsScore?: {
    overall: number
    sections: {
      format: number
      keywords: number
      skills: number
      experience: number
    }
    feedback: string[]
  }
}

export async function parseResume(file: File): Promise<ParsedResume> {
  // In a real application, you would use a proper resume parsing API or library
  // For this demo, we'll simulate parsing with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate extracted data
      resolve({
        skills: ["JavaScript", "React", "TypeScript", "Node.js", "CSS", "HTML"],
        experience: ["Frontend Developer", "Software Engineer", "Web Developer"],
        education: ["Computer Science", "Information Technology"],
        keywords: ["web", "frontend", "development", "software", "engineering"],
        atsScore: {
          overall: 76,
          sections: {
            format: 85,
            keywords: 70,
            skills: 80,
            experience: 68,
          },
          feedback: [
            "Add more quantifiable achievements",
            "Include more industry-specific keywords",
            "Improve job description formatting",
            "Consider adding a professional summary",
          ],
        },
      })
    }, 1500)
  })
}

export function matchJobsToResume(jobs: any[], parsedResume: ParsedResume): any[] {
  return jobs
    .map((job) => {
      const description = job.job_description?.toLowerCase() || ""
      const title = job.job_title?.toLowerCase() || ""

      let matchScore = 0
      let matchedKeywords: string[] = []

      // Check for skills matches
      parsedResume.skills.forEach((skill) => {
        const skillLower = skill.toLowerCase()
        if (description.includes(skillLower) || title.includes(skillLower)) {
          matchScore += 2
          matchedKeywords.push(skill)
        }
      })

      // Check for experience matches
      parsedResume.experience.forEach((exp) => {
        const expLower = exp.toLowerCase()
        if (description.includes(expLower) || title.includes(expLower)) {
          matchScore += 3
          matchedKeywords.push(exp)
        }
      })

      // Check for education matches
      parsedResume.education.forEach((edu) => {
        const eduLower = edu.toLowerCase()
        if (description.includes(eduLower)) {
          matchScore += 1
          matchedKeywords.push(edu)
        }
      })

      // Check for keyword matches
      parsedResume.keywords.forEach((keyword) => {
        const keywordLower = keyword.toLowerCase()
        if (description.includes(keywordLower) || title.includes(keywordLower)) {
          matchScore += 1
          matchedKeywords.push(keyword)
        }
      })

      // Remove duplicates from matchedKeywords
      matchedKeywords = [...new Set(matchedKeywords)]

      return {
        ...job,
        matchScore,
        matchedKeywords,
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}
