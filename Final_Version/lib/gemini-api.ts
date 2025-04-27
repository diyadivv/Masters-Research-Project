// Client-side functions that call our server API route

async function callServerAI(prompt: string, type: string, params?: any) {
  try {
    // Ensure we have a non-empty prompt
    if (!prompt && prompt !== "") {
      console.error("Empty prompt provided to callServerAI")
      return "Error: Invalid request. No prompt provided."
    }

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        type,
        params,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Server AI request failed with status ${response.status}: ${errorText}`)
      return `Error: Server request failed (Status ${response.status}). Please try again later.`
    }

    const data = await response.json()

    if (data.error) {
      return `Error: ${data.error}`
    }

    return data.text
  } catch (error) {
    console.error("Error calling server AI endpoint:", error)
    return "Error: Failed to connect to AI service. Please try again later."
  }
}

export async function getResumeImprovement(resumeText: string) {
  return callServerAI(resumeText, "resumeImprovement")
}

export async function getJobApplicationTips(jobDescription: string) {
  return callServerAI(jobDescription, "jobApplicationTips")
}

export async function getCareerAdvice(role: string, experience: string) {
  // Create a basic prompt instead of empty string
  const prompt = `Provide career advice for a ${role} with ${experience} experience.`
  return callServerAI(prompt, "careerAdvice", { role, experience })
}

export async function getInDemandSkills(jobTitles: string[], jobDescriptions: string[], role: string) {
  // Create a basic prompt with the job titles and role instead of empty string
  const sampleTitles = jobTitles.slice(0, 3).join(", ")
  const prompt = `Analyze in-demand skills for ${role || "technical roles"} based on job titles like: ${sampleTitles}`

  const response = await callServerAI(prompt, "inDemandSkills", {
    jobTitles,
    jobDescriptions,
    role,
  })

  try {
    // Clean the response - remove any markdown formatting or code blocks
    const cleanedResponse = response
      .replace(/```json|```/g, "") // Remove markdown code blocks
      .replace(/^\s*\[|\]\s*$/g, "") // Remove array brackets
      .trim()

    // If it still looks like JSON (has quotes and commas), try to parse it
    if (cleanedResponse.includes('"') && cleanedResponse.includes(",")) {
      try {
        // Try to parse as a JSON array by adding brackets back
        const parsedSkills = JSON.parse(`[${cleanedResponse}]`)
        return parsedSkills.map((skill: string) => skill.trim()).filter(Boolean)
      } catch (e) {
        // If that fails, fall back to splitting by commas
        console.log("Failed to parse as JSON array, falling back to comma splitting")
      }
    }

    // Split by commas and clean up each skill
    return cleanedResponse
      .split(",")
      .map((skill: string) => skill.trim().replace(/^["']|["']$/g, "")) // Remove quotes
      .filter(Boolean) // Remove empty strings
      .slice(0, 8) // Limit to 8 skills
  } catch (error) {
    console.error("Failed to process skills response:", error)

    // Fallback: extract skills from text using a more robust approach
    const skillsText = response
      .replace(/```json|```/g, "") // Remove code blocks
      .replace(/[[\]"']/g, "") // Remove brackets and quotes
      .split(/,|\n/) // Split by commas or newlines
      .map((s: string) => s.trim()) // Trim whitespace
      .filter((s: string) => s && s.length > 1) // Remove empty strings and single characters
      .slice(0, 8) // Limit to 8 skills

    return skillsText.length > 0
      ? skillsText
      : ["JavaScript", "React", "Python", "SQL", "Communication", "Problem Solving", "Cloud Computing", "Data Analysis"]
  }
}
