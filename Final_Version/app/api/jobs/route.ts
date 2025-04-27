import { NextResponse } from "next/server"
import { FALLBACK_JOB_DATA } from "@/lib/api"

const JSEARCH_API_URL = "https://jsearch.p.rapidapi.com"

export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || "developer jobs in us"
    const page = searchParams.get("page") || "1"
    const numPages = searchParams.get("numPages") || "10"

    // Hardcode the API key as a fallback (the one provided by the user)
    const HARDCODED_API_KEY = "0b84615354mshf9534660ca5d750p190bc9jsn0504c434cceb"

    // Try to get the API key from environment variables, fall back to hardcoded key
    const apiKey = process.env.RAPIDAPI_KEY || HARDCODED_API_KEY

    console.log("API Key available:", !!apiKey) // Log if we have an API key (without exposing the actual key)

    // Build the API URL
    const url = `${JSEARCH_API_URL}/search?query=${encodeURIComponent(
      query,
    )}&page=${page}&num_pages=${numPages}&country=us&date_posted=all`

    console.log("Fetching job data from API...")

    // Make the API request
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      cache: "no-store", // Don't cache the response
    })

    // Specifically handle rate limit errors (429)
    if (response.status === 429) {
      console.warn("API rate limit exceeded (429)")
      return NextResponse.json({
        data: FALLBACK_JOB_DATA,
        status: "warning",
        message: "API rate limit exceeded. Using sample data instead. Please try again later.",
      })
    }

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`)
      return NextResponse.json({
        data: FALLBACK_JOB_DATA,
        status: "error",
        message: `API request failed with status ${response.status}`,
      })
    }

    const data = await response.json()

    // If the API returns no data, use fallback data
    if (!data.data || data.data.length === 0) {
      console.warn("API returned no data, using fallback data")
      return NextResponse.json({
        data: FALLBACK_JOB_DATA,
        status: "warning",
        message: "No jobs found for your search query",
      })
    }

    return NextResponse.json({ ...data, status: "ok" })
  } catch (error) {
    console.error("Error in jobs API route:", error)
    return NextResponse.json({
      data: FALLBACK_JOB_DATA,
      status: "error",
      message: "Failed to fetch job data",
    })
  }
}
