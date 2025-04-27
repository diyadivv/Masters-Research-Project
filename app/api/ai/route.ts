import { NextResponse } from "next/server"

// Server-side function to call Gemini API
async function callGeminiAPI(prompt: string) {
  try {
    // Get the API key from server environment variables
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

    // Check if API key is available
    if (!apiKey) {
      console.error("Gemini API key not found in environment variables")
      return { error: "Gemini API key not configured. Please add the GEMINI_API_KEY environment variable." }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Gemini API request failed with status ${response.status}: ${errorText}`)
      return { error: `Error generating response (Status ${response.status}). Please try again later.` }
    }

    const data = await response.json()

    // Check if we have a valid response
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      console.error("Gemini API returned an empty or invalid response:", data)
      return { error: "Received an invalid response from the AI service. Please try again." }
    }

    return { text: data.candidates[0].content.parts[0].text || "No response generated" }
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return { error: "Error generating response. Please try again later." }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt, type, params } = body

    // Validate prompt
    if (!prompt) {
      console.error("Missing prompt in request:", body)
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    let finalPrompt = prompt

    // Format the prompt based on the type
    if (type === "resumeImprovement") {
      finalPrompt = `
        You are an expert resume reviewer and career coach. Analyze the following resume and provide:
        1. Three specific improvements to make it more ATS-friendly
        2. Two suggestions to better highlight achievements
        3. One tip for formatting or structure
        
        Resume:
        ${prompt}
        
        Format your response in clear, concise bullet points.
      `
    } else if (type === "jobApplicationTips") {
      finalPrompt = `
        You are an expert career coach. Based on the following job description, provide:
        1. Three key skills to emphasize in a cover letter
        2. Two suggestions for tailoring a resume to this position
        3. One tip for the interview process
        
        Job Description:
        ${prompt}
        
        Format your response in clear, concise bullet points.
      `
    } else if (type === "careerAdvice") {
      const { role, experience } = params || {}
      // We'll use the prompt as is since we now send a formatted prompt from the client
    } else if (type === "inDemandSkills") {
      const { jobTitles, jobDescriptions, role } = params || {}

      // Prepare sample data for the prompt
      const sampleTitles = (jobTitles || []).slice(0, 5).join("\n- ")
      const sampleDescriptions = (jobDescriptions || []).slice(0, 2).join("\n\n")

      finalPrompt = `
        You are an expert job market analyst. Based on the following job titles and descriptions for ${role || "technical roles"}, 
        provide a list of the top 8 most in-demand technical and soft skills.
        
        Sample job titles:
        - ${sampleTitles || "Software Developer"}
        
        Sample job descriptions:
        ${sampleDescriptions || "No descriptions provided"}
        
        Return ONLY a simple array of skills as plain text, with each skill separated by commas. 
        Do not include any markdown formatting, code blocks, or explanation.
        Example format: JavaScript, React, Python, SQL, Communication, Problem Solving, Cloud Computing, Data Analysis
      `
    }

    console.log(`Processing ${type} request with prompt length: ${finalPrompt.length} characters`)

    const result = await callGeminiAPI(finalPrompt)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in AI API route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
