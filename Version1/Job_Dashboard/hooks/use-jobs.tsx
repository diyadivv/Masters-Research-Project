"use client"

import { useState, useEffect } from "react"

export function useJobs(role: string) {
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // If role is "all", we'll fetch a variety of roles
        const query = role === "all" ? "jobs in us" : `${role} jobs in us`

        const response = await fetch(`/api/jobs?query=${encodeURIComponent(query)}`)

        if (!response.ok) {
          throw new Error(`Error fetching jobs: ${response.status}`)
        }

        const data = await response.json()
        setJobs(data.jobs || [])
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
        // Use sample data as fallback
        setJobs(getSampleJobs(role))
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [role])

  return { jobs, isLoading, error }
}

// Sample data for fallback
function getSampleJobs(role: string) {
  // For "all" role, we'll return a mix of different job types
  if (role === "all") {
    return [
      // Developer jobs
      {
        job_id: "1",
        job_title: "Senior Frontend Developer",
        employer_name: "Acme Inc",
        employer_logo: "/placeholder.svg?height=48&width=48",
        job_employment_type: "Full-time",
        job_city: "San Francisco",
        job_country: "US",
        job_description:
          "We are looking for a talented frontend developer to join our team. You will be responsible for designing and implementing new features and functionality.",
        job_apply_link: "#",
        job_posted_at_datetime_utc: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        job_min_salary: 120000,
        job_max_salary: 160000,
        job_required_skills: ["JavaScript", "React", "TypeScript"],
      },
      // Designer jobs
      {
        job_id: "2",
        job_title: "UX/UI Designer",
        employer_name: "Design Solutions",
        employer_logo: "/placeholder.svg?height=48&width=48",
        job_employment_type: "Full-time",
        job_city: "New York",
        job_country: "US",
        job_description:
          "Join our team as a UX/UI designer and help us create beautiful and functional user interfaces.",
        job_apply_link: "#",
        job_posted_at_datetime_utc: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        job_min_salary: 90000,
        job_max_salary: 120000,
        job_required_skills: ["Figma", "Adobe XD", "UI Design"],
      },
      // Product Manager jobs
      {
        job_id: "3",
        job_title: "Product Manager",
        employer_name: "Tech Innovations",
        employer_logo: "/placeholder.svg?height=48&width=48",
        job_employment_type: "Full-time",
        job_city: "Austin",
        job_country: "US",
        job_description: "Lead product development and strategy for our flagship product.",
        job_apply_link: "#",
        job_posted_at_datetime_utc: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        job_min_salary: 110000,
        job_max_salary: 150000,
        job_required_skills: ["Product Strategy", "Agile", "User Research"],
      },
      // Data Scientist jobs
      {
        job_id: "4",
        job_title: "Senior Data Scientist",
        employer_name: "Data Corp",
        employer_logo: "/placeholder.svg?height=48&width=48",
        job_employment_type: "Full-time",
        job_city: "Seattle",
        job_country: "US",
        job_description: "Analyze complex data sets and build predictive models to drive business decisions.",
        job_apply_link: "#",
        job_posted_at_datetime_utc: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        job_min_salary: 130000,
        job_max_salary: 170000,
        job_required_skills: ["Python", "Machine Learning", "SQL"],
      },
      // Marketing jobs
      {
        job_id: "5",
        job_title: "Digital Marketing Manager",
        employer_name: "Marketing Solutions",
        employer_logo: "/placeholder.svg?height=48&width=48",
        job_employment_type: "Full-time",
        job_city: "Chicago",
        job_country: "US",
        job_description: "Lead digital marketing campaigns and strategies to drive customer acquisition and retention.",
        job_apply_link: "#",
        job_posted_at_datetime_utc: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        job_min_salary: 85000,
        job_max_salary: 110000,
        job_required_skills: ["SEO", "SEM", "Content Marketing"],
      },
      // Sales jobs
      {
        job_id: "6",
        job_title: "Sales Representative",
        employer_name: "Sales Inc",
        employer_logo: "/placeholder.svg?height=48&width=48",
        job_employment_type: "Full-time",
        job_city: "Miami",
        job_country: "US",
        job_description: "Drive sales growth through prospecting, client relationship management, and closing deals.",
        job_apply_link: "#",
        job_posted_at_datetime_utc: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        job_min_salary: 70000,
        job_max_salary: 100000,
        job_required_skills: ["Sales", "CRM", "Negotiation"],
      },
      // DevOps jobs
      {
        job_id: "7",
        job_title: "DevOps Engineer",
        employer_name: "Cloud Solutions",
        employer_logo: "/placeholder.svg?height=48&width=48",
        job_employment_type: "Full-time",
        job_city: "Denver",
        job_country: "US",
        job_description: "Build and maintain CI/CD pipelines and cloud infrastructure.",
        job_apply_link: "#",
        job_posted_at_datetime_utc: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        job_min_salary: 115000,
        job_max_salary: 145000,
        job_required_skills: ["AWS", "Docker", "Kubernetes"],
      },
      // More developer jobs
      {
        job_id: "8",
        job_title: "Backend Developer",
        employer_name: "Tech Startup",
        employer_logo: "/placeholder.svg?height=48&width=48",
        job_employment_type: "Full-time",
        job_city: "Boston",
        job_country: "US",
        job_description: "Build scalable and maintainable backend services and APIs.",
        job_apply_link: "#",
        job_posted_at_datetime_utc: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        job_min_salary: 100000,
        job_max_salary: 130000,
        job_required_skills: ["Node.js", "Express", "MongoDB"],
      },
    ]
  }

  const baseJobs = [
    {
      job_id: "1",
      job_title: `Senior ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      employer_name: "Acme Inc",
      employer_logo: "/placeholder.svg?height=48&width=48",
      job_employment_type: "Full-time",
      job_city: "San Francisco",
      job_country: "US",
      job_description: `We are looking for a talented ${role} to join our team. You will be responsible for designing and implementing new features and functionality.`,
      job_apply_link: "#",
      job_posted_at_datetime_utc: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      job_min_salary: 120000,
      job_max_salary: 160000,
      job_required_skills: ["JavaScript", "React", "TypeScript"],
    },
    {
      job_id: "2",
      job_title: `${role.charAt(0).toUpperCase() + role.slice(1)} II`,
      employer_name: "Tech Solutions",
      employer_logo: "/placeholder.svg?height=48&width=48",
      job_employment_type: "Contract",
      job_city: "New York",
      job_country: "US",
      job_description: `Join our team as a ${role} and help us build amazing products.`,
      job_apply_link: "#",
      job_posted_at_datetime_utc: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      job_min_salary: 90000,
      job_max_salary: 120000,
      job_required_skills: ["CSS", "HTML", "JavaScript"],
    },
    {
      job_id: "3",
      job_title: `Junior ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      employer_name: "Startup Co",
      employer_logo: "/placeholder.svg?height=48&width=48",
      job_employment_type: "Full-time",
      job_city: "Austin",
      job_country: "US",
      job_description: `Great opportunity for a junior ${role} to grow and learn.`,
      job_apply_link: "#",
      job_posted_at_datetime_utc: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      job_min_salary: 70000,
      job_max_salary: 90000,
      job_required_skills: ["React", "Node.js"],
    },
    {
      job_id: "4",
      job_title: `${role.charAt(0).toUpperCase() + role.slice(1)} Lead`,
      employer_name: "Enterprise Corp",
      employer_logo: "/placeholder.svg?height=48&width=48",
      job_employment_type: "Full-time",
      job_city: "Seattle",
      job_country: "US",
      job_description: `Lead our ${role} team and drive innovation.`,
      job_apply_link: "#",
      job_posted_at_datetime_utc: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      job_min_salary: 150000,
      job_max_salary: 180000,
      job_required_skills: ["Leadership", "Architecture", "TypeScript"],
    },
    {
      job_id: "5",
      job_title: `Remote ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      employer_name: "Remote First Inc",
      employer_logo: "/placeholder.svg?height=48&width=48",
      job_employment_type: "Full-time",
      job_city: "Remote",
      job_country: "US",
      job_description: `Work from anywhere as a ${role} with our distributed team.`,
      job_apply_link: "#",
      job_posted_at_datetime_utc: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      job_min_salary: 100000,
      job_max_salary: 140000,
      job_required_skills: ["Communication", "Self-management", "React"],
    },
    {
      job_id: "6",
      job_title: `${role.charAt(0).toUpperCase() + role.slice(1)} Consultant`,
      employer_name: "Consulting Group",
      employer_logo: "/placeholder.svg?height=48&width=48",
      job_employment_type: "Contract",
      job_city: "Chicago",
      job_country: "US",
      job_description: `Join our consulting team as a ${role} specialist.`,
      job_apply_link: "#",
      job_posted_at_datetime_utc: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      job_min_salary: 110000,
      job_max_salary: 130000,
      job_required_skills: ["Consulting", "Client Management", "JavaScript"],
    },
    {
      job_id: "7",
      job_title: `${role.charAt(0).toUpperCase() + role.slice(1)} Intern`,
      employer_name: "Tech Internships",
      employer_logo: "/placeholder.svg?height=48&width=48",
      job_employment_type: "Internship",
      job_city: "Boston",
      job_country: "US",
      job_description: `Great internship opportunity for aspiring ${role}s.`,
      job_apply_link: "#",
      job_posted_at_datetime_utc: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      job_min_salary: 50000,
      job_max_salary: 60000,
      job_required_skills: ["Entry-level", "JavaScript"],
    },
    {
      job_id: "8",
      job_title: `${role.charAt(0).toUpperCase() + role.slice(1)} (Hybrid)`,
      employer_name: "Hybrid Tech",
      employer_logo: "/placeholder.svg?height=48&width=48",
      job_employment_type: "Full-time",
      job_city: "Denver",
      job_country: "US",
      job_description: `Hybrid role for a ${role} with 2-3 days in office.`,
      job_apply_link: "#",
      job_posted_at_datetime_utc: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      job_min_salary: 95000,
      job_max_salary: 125000,
      job_required_skills: ["Collaboration", "React", "Node.js"],
    },
  ]

  return baseJobs
}

