// Sample fallback data to use when the API is unavailable
export const FALLBACK_JOB_DATA = [
  {
    employer_name: "Tech Solutions Inc.",
    employer_logo: null,
    employer_website: "https://techsolutions.example.com",
    job_id: "fallback-1",
    job_title: "Senior Frontend Developer",
    job_description:
      "We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web technologies.",
    job_country: "United States",
    job_city: "San Francisco",
    job_state: "CA",
    job_google_link: "https://example.com/job1",
    job_apply_link: "https://example.com/apply1",
    job_employment_type: "FULLTIME",
    job_salary_min: 120000,
    job_salary_max: 150000,
    job_salary_currency: "USD",
    job_salary_period: "YEAR",
    job_posted_at_datetime_utc: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    employer_name: "Data Insights Corp",
    employer_logo: null,
    employer_website: "https://datainsights.example.com",
    job_id: "fallback-2",
    job_title: "Data Engineer",
    job_description: "Join our team as a Data Engineer to build scalable data pipelines and infrastructure.",
    job_country: "United States",
    job_city: "New York",
    job_state: "NY",
    job_google_link: "https://example.com/job2",
    job_apply_link: "https://example.com/apply2",
    job_employment_type: "FULLTIME",
    job_salary_min: 130000,
    job_salary_max: 160000,
    job_salary_currency: "USD",
    job_salary_period: "YEAR",
    job_posted_at_datetime_utc: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    employer_name: "Cloud Systems LLC",
    employer_logo: null,
    employer_website: "https://cloudsystems.example.com",
    job_id: "fallback-3",
    job_title: "DevOps Engineer",
    job_description: "Looking for a DevOps Engineer to help automate our infrastructure and deployment processes.",
    job_country: "United States",
    job_city: "Austin",
    job_state: "TX",
    job_google_link: "https://example.com/job3",
    job_apply_link: "https://example.com/apply3",
    job_employment_type: "FULLTIME",
    job_salary_min: 125000,
    job_salary_max: 155000,
    job_salary_currency: "USD",
    job_salary_period: "YEAR",
    job_posted_at_datetime_utc: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    employer_name: "Mobile Innovations",
    employer_logo: null,
    employer_website: "https://mobileinnovations.example.com",
    job_id: "fallback-4",
    job_title: "Mobile Developer",
    job_description: "Join our team to build cutting-edge mobile applications for iOS and Android.",
    job_country: "United States",
    job_city: "Seattle",
    job_state: "WA",
    job_google_link: "https://example.com/job4",
    job_apply_link: "https://example.com/apply4",
    job_employment_type: "FULLTIME",
    job_salary_min: 115000,
    job_salary_max: 145000,
    job_salary_currency: "USD",
    job_salary_period: "YEAR",
    job_posted_at_datetime_utc: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    employer_name: "AI Research Group",
    employer_logo: null,
    employer_website: "https://airesearch.example.com",
    job_id: "fallback-5",
    job_title: "Machine Learning Engineer",
    job_description: "We're seeking a Machine Learning Engineer to develop and deploy AI models for our products.",
    job_country: "United States",
    job_city: "Boston",
    job_state: "MA",
    job_google_link: "https://example.com/job5",
    job_apply_link: "https://example.com/apply5",
    job_employment_type: "FULLTIME",
    job_salary_min: 140000,
    job_salary_max: 180000,
    job_salary_currency: "USD",
    job_salary_period: "YEAR",
    job_posted_at_datetime_utc: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    employer_name: "Security Solutions",
    employer_logo: null,
    employer_website: "https://securitysolutions.example.com",
    job_id: "fallback-6",
    job_title: "Cybersecurity Analyst",
    job_description: "Join our team to protect our systems and data from security threats.",
    job_country: "United States",
    job_city: "Chicago",
    job_state: "IL",
    job_google_link: "https://example.com/job6",
    job_apply_link: "https://example.com/apply6",
    job_employment_type: "FULLTIME",
    job_salary_min: 110000,
    job_salary_max: 140000,
    job_salary_currency: "USD",
    job_salary_period: "YEAR",
    job_posted_at_datetime_utc: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    employer_name: "Web Platforms Inc",
    employer_logo: null,
    employer_website: "https://webplatforms.example.com",
    job_id: "fallback-7",
    job_title: "Backend Developer",
    job_description: "Looking for a Backend Developer with experience in Node.js, Express, and databases.",
    job_country: "United States",
    job_city: "Denver",
    job_state: "CO",
    job_google_link: "https://example.com/job7",
    job_apply_link: "https://example.com/apply7",
    job_employment_type: "FULLTIME",
    job_salary_min: 115000,
    job_salary_max: 145000,
    job_salary_currency: "USD",
    job_salary_period: "YEAR",
    job_posted_at_datetime_utc: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    employer_name: "Product Design Co",
    employer_logo: null,
    employer_website: "https://productdesign.example.com",
    job_id: "fallback-8",
    job_title: "UX/UI Designer",
    job_description: "Join our design team to create beautiful and intuitive user experiences.",
    job_country: "United States",
    job_city: "Portland",
    job_state: "OR",
    job_google_link: "https://example.com/job8",
    job_apply_link: "https://example.com/apply8",
    job_employment_type: "FULLTIME",
    job_salary_min: 105000,
    job_salary_max: 135000,
    job_salary_currency: "USD",
    job_salary_period: "YEAR",
    job_posted_at_datetime_utc: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
]

export type JobData = {
  employer_name: string
  employer_logo: string | null
  employer_website: string
  job_id: string
  job_title: string
  job_description: string
  job_country: string
  job_city: string
  job_state: string
  job_google_link: string
  job_apply_link: string
  job_employment_type: string
  job_salary_min?: number
  job_salary_max?: number
  job_salary_currency?: string
  job_salary_period?: string
  job_posted_at_datetime_utc: string
  job_required_skills?: string[]
  job_required_experience?: {
    no_experience_required?: boolean
    required_experience_in_months?: number
    minimum_experience?: string
  }
}

export type JobSearchResponse = {
  data: JobData[]
  status: string
}

// REMOVED the searchJobs function that used the API key directly
// All API calls will now go through the server-side API route

export function extractRolesFromJobs(jobs: JobData[]): string[] {
  const roleSet = new Set<string>()

  jobs.forEach((job) => {
    // Extract role from job title
    const title = job.job_title.toLowerCase()

    if (title.includes("developer") || title.includes("engineer")) {
      if (title.includes("frontend") || title.includes("front-end") || title.includes("front end")) {
        roleSet.add("Frontend Developer")
      } else if (title.includes("backend") || title.includes("back-end") || title.includes("back end")) {
        roleSet.add("Backend Developer")
      } else if (title.includes("fullstack") || title.includes("full-stack") || title.includes("full stack")) {
        roleSet.add("Fullstack Developer")
      } else if (title.includes("devops")) {
        roleSet.add("DevOps Engineer")
      } else if (title.includes("data")) {
        roleSet.add("Data Engineer")
      } else if (title.includes("software")) {
        roleSet.add("Software Engineer")
      } else {
        roleSet.add("Developer")
      }
    } else if (title.includes("designer") || title.includes("ux") || title.includes("ui")) {
      roleSet.add("Designer")
    } else if (title.includes("product manager") || title.includes("product owner")) {
      roleSet.add("Product Manager")
    } else if (title.includes("data scientist") || title.includes("machine learning")) {
      roleSet.add("Data Scientist")
    } else if (title.includes("analyst") || title.includes("analytics")) {
      roleSet.add("Data Analyst")
    } else {
      roleSet.add("Other")
    }
  })

  return Array.from(roleSet)
}

export function getTopLocations(jobs: JobData[], limit = 5): { location: string; count: number }[] {
  const locationCounts: Record<string, number> = {}

  jobs.forEach((job) => {
    const location =
      job.job_city && job.job_state
        ? `${job.job_city}, ${job.job_state}`
        : job.job_state || job.job_city || job.job_country || "Unknown"

    locationCounts[location] = (locationCounts[location] || 0) + 1
  })

  return Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function getRecentPostings(jobs: JobData[], days = 7): JobData[] {
  const now = new Date()
  const cutoffDate = new Date(now.setDate(now.getDate() - days))

  return jobs.filter((job) => {
    const postDate = new Date(job.job_posted_at_datetime_utc)
    // Filter out jobs with invalid dates (more than 5 years old)
    if (postDate.getFullYear() < now.getFullYear() - 5) {
      return false
    }
    return postDate >= cutoffDate
  })
}

export function calculateAverageSalary(jobs: JobData[]): number {
  const jobsWithSalary = jobs.filter((job) => job.job_salary_min !== undefined || job.job_salary_max !== undefined)

  if (jobsWithSalary.length === 0) return 0

  const totalSalary = jobsWithSalary.reduce((sum, job) => {
    const min = job.job_salary_min || 0
    const max = job.job_salary_max || min
    return sum + (min + max) / 2
  }, 0)

  return Math.round(totalSalary / jobsWithSalary.length)
}

export function filterJobsByRole(jobs: JobData[], role: string): JobData[] {
  if (role === "All Roles") return jobs

  return jobs.filter((job) => {
    const title = job.job_title.toLowerCase()

    switch (role) {
      case "Developer":
        return title.includes("developer") && !title.includes("devops")
      case "Data Engineer":
        return title.includes("data") && title.includes("engineer")
      case "Designer":
        return title.includes("designer") || title.includes("ux") || title.includes("ui")
      case "Product Manager":
        return title.includes("product manager") || title.includes("product owner")
      case "Data Scientist":
        return title.includes("data scientist") || title.includes("machine learning")
      case "DevOps Engineer":
        return title.includes("devops") || (title.includes("engineer") && title.includes("operations"))
      default:
        return false
    }
  })
}

export function getEmploymentTypes(jobs: JobData[]): { type: string; count: number }[] {
  const typeCounts: Record<string, number> = {}

  jobs.forEach((job) => {
    const type = job.job_employment_type || "Not specified"
    typeCounts[type] = (typeCounts[type] || 0) + 1
  })

  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
}

export function getSalaryRanges(jobs: JobData[]): { range: string; count: number }[] {
  const ranges = {
    "< $50k": 0,
    "$50k - $75k": 0,
    "$75k - $100k": 0,
    "$100k - $125k": 0,
    "$125k - $150k": 0,
    "> $150k": 0,
  }

  jobs.forEach((job) => {
    if (job.job_salary_min === undefined && job.job_salary_max === undefined) return

    const min = job.job_salary_min || 0
    const max = job.job_salary_max || min
    const avg = (min + max) / 2

    if (avg < 50000) ranges["< $50k"]++
    else if (avg < 75000) ranges["$50k - $75k"]++
    else if (avg < 100000) ranges["$75k - $100k"]++
    else if (avg < 125000) ranges["$100k - $125k"]++
    else if (avg < 150000) ranges["$125k - $150k"]++
    else ranges["> $150k"]++
  })

  return Object.entries(ranges)
    .map(([range, count]) => ({ range, count }))
    .filter((item) => item.count > 0)
}

export function getRequiredSkills(jobs: JobData[]): { skill: string; count: number }[] {
  const skillCounts: Record<string, number> = {}

  jobs.forEach((job) => {
    if (!job.job_required_skills) return

    job.job_required_skills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1
    })
  })

  return Object.entries(skillCounts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export function getPostingTrends(jobs: JobData[], days = 30): { date: string; count: number }[] {
  const now = new Date()
  const result: { date: string; count: number }[] = []

  // Create an array of the last 'days' days
  for (let i = 0; i < days; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split("T")[0]
    result.unshift({ date: dateString, count: 0 })
  }

  // Count jobs posted on each day
  jobs.forEach((job) => {
    // Skip jobs with invalid dates
    const postDate = new Date(job.job_posted_at_datetime_utc)
    if (postDate.getFullYear() < now.getFullYear() - 5) {
      return
    }

    const postDateString = postDate.toISOString().split("T")[0]
    const entry = result.find((item) => item.date === postDateString)
    if (entry) {
      entry.count++
    }
  })

  return result
}

// New function to get experience levels
export function getExperienceLevels(jobs: JobData[]): { level: string; count: number }[] {
  const levelCounts: Record<string, number> = {
    "No Experience": 0,
    "Entry Level": 0,
    "Mid Level": 0,
    "Senior Level": 0,
  }

  jobs.forEach((job) => {
    if (!job.job_required_experience) {
      levelCounts["Not Specified"]++
      return
    }

    if (job.job_required_experience.no_experience_required) {
      levelCounts["No Experience"]++
    } else if (job.job_required_experience.required_experience_in_months) {
      const months = job.job_required_experience.required_experience_in_months
      if (months <= 12) {
        levelCounts["Entry Level"]++
      } else if (months <= 36) {
        levelCounts["Mid Level"]++
      } else {
        levelCounts["Senior Level"]++
      }
    } else if (job.job_required_experience.minimum_experience) {
      const exp = job.job_required_experience.minimum_experience.toLowerCase()
      if (exp.includes("no experience") || exp.includes("entry")) {
        levelCounts["Entry Level"]++
      } else if (exp.includes("mid") || exp.includes("intermediate")) {
        levelCounts["Mid Level"]++
      } else if (exp.includes("senior") || exp.includes("experienced")) {
        levelCounts["Senior Level"]++
      } else {
        levelCounts["Not Specified"]++
      }
    } else {
      levelCounts["Not Specified"]++
    }
  })

  return Object.entries(levelCounts)
    .map(([level, count]) => ({ level, count }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
}

// New function to get remote vs. onsite jobs
export function getRemoteVsOnsite(jobs: JobData[]): { type: string; count: number }[] {
  const counts = {
    Remote: 0,
    Onsite: 0,
    Hybrid: 0,
    "Not Specified": 0,
  }

  jobs.forEach((job) => {
    const title = job.job_title.toLowerCase()
    const desc = job.job_description.toLowerCase()

    if (title.includes("remote") || desc.includes("remote work") || desc.includes("work from home")) {
      counts["Remote"]++
    } else if (desc.includes("hybrid")) {
      counts["Hybrid"]++
    } else if (desc.includes("onsite") || desc.includes("on-site") || desc.includes("in office")) {
      counts["Onsite"]++
    } else {
      counts["Not Specified"]++
    }
  })

  return Object.entries(counts)
    .map(([type, count]) => ({ type, count }))
    .filter((item) => item.count > 0)
}
