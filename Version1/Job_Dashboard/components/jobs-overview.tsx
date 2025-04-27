"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface JobsOverviewProps {
  jobs: any[]
  isLoading: boolean
}

export default function JobsOverview({ jobs, isLoading }: JobsOverviewProps) {
  if (isLoading) {
    return (
      <Card className="col-span-3 border-none shadow-md bg-gradient-to-br from-background to-muted">
        <CardHeader>
          <CardTitle>Jobs Overview</CardTitle>
          <CardDescription>Loading job data...</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading charts...</div>
        </CardContent>
      </Card>
    )
  }

  // Process data for charts
  const locationData = jobs.reduce((acc: any, job: any) => {
    const location = job.job_city || "Unknown"
    if (!acc[location]) {
      acc[location] = 0
    }
    acc[location]++
    return acc
  }, {})

  const locationChartData = Object.entries(locationData)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5)

  const employmentTypeData = jobs.reduce((acc: any, job: any) => {
    const type = job.job_employment_type || "Unknown"
    if (!acc[type]) {
      acc[type] = 0
    }
    acc[type]++
    return acc
  }, {})

  const employmentTypeChartData = Object.entries(employmentTypeData).map(([name, value]) => ({ name, value }))

  // Salary data
  const salaryData = jobs
    .filter((job) => job.job_min_salary)
    .map((job) => ({
      name: job.job_title.length > 20 ? job.job_title.substring(0, 20) + "..." : job.job_title,
      min: job.job_min_salary,
      max: job.job_max_salary || job.job_min_salary,
      avg: (job.job_min_salary + (job.job_max_salary || job.job_min_salary)) / 2,
    }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10)

  // Skills data
  const skillsData = jobs.reduce((acc: any, job: any) => {
    if (job.job_required_skills) {
      job.job_required_skills.forEach((skill: string) => {
        if (!acc[skill]) {
          acc[skill] = 0
        }
        acc[skill]++
      })
    }
    return acc
  }, {})

  const skillsChartData = Object.entries(skillsData)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 8)

  // Time-based data (posting dates)
  const timeData = jobs.reduce((acc: any, job: any) => {
    if (job.job_posted_at_datetime_utc) {
      const date = new Date(job.job_posted_at_datetime_utc).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date]++
    }
    return acc
  }, {})

  const timeChartData = Object.entries(timeData)
    .map(([name, value]) => ({ name, value }))
    .sort((a: any, b: any) => new Date(a.name).getTime() - new Date(b.name).getTime())
    .slice(-7) // Last 7 days

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-background to-muted">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Jobs Market Analysis</CardTitle>
            <CardDescription>Comprehensive overview of the job market</CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {jobs.length} Jobs Analyzed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="locations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="employment">Employment Types</TabsTrigger>
            <TabsTrigger value="salaries">Salary Ranges</TabsTrigger>
            <TabsTrigger value="skills">Required Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="mt-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} />
                  <RechartsTooltip
                    formatter={(value: any) => [`${value} jobs`, "Count"]}
                    labelFormatter={(label) => `Location: ${label}`}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                    {locationChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="employment" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={employmentTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {employmentTypeChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={employmentTypeChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                      {employmentTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="salaries" className="mt-4">
            <div className="h-[400px] w-full">
              {salaryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      domain={[0, "dataMax"]}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <YAxis type="category" dataKey="name" width={150} />
                    <RechartsTooltip
                      formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
                      labelFormatter={(label) => `Job: ${label}`}
                    />
                    <Bar dataKey="min" name="Minimum Salary" stackId="a" fill={COLORS[0]} />
                    <Bar dataKey="max" name="Maximum Salary" stackId="a" fill={COLORS[1]} />
                    <Legend verticalAlign="bottom" height={36} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No salary data available</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="mt-4">
            <div className="h-[400px] w-full">
              {skillsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsChartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No skills data available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Job Posting Trends</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

