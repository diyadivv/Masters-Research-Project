import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || "developer"
  const page = searchParams.get("page") || "1"
  const numPages = searchParams.get("num_pages") || "1"

  try {
    const apiUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}%20jobs%20in%20us&page=${page}&num_pages=${numPages}&country=us&date_posted=all`

    const response = await fetch(apiUrl, {
      headers: {
        "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      jobs: data.data || [],
      status: "success",
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)

    return NextResponse.json(
      {
        jobs: [],
        status: "error",
        message: error instanceof Error ? error.message : "Failed to fetch jobs",
      },
      { status: 500 },
    )
  }
}

