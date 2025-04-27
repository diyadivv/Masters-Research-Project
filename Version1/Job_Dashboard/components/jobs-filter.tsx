"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Filter, Briefcase, Code, Palette, LineChart, Database, Megaphone, DollarSign } from "lucide-react"

interface JobsFilterProps {
  onRoleChange: (role: string) => void
  selectedRole: string
}

export default function JobsFilter({ onRoleChange, selectedRole }: JobsFilterProps) {
  const roles = [
    { value: "all", label: "All Roles", icon: Briefcase },
    { value: "developer", label: "Developer", icon: Code },
    { value: "designer", label: "Designer", icon: Palette },
    { value: "product manager", label: "Product Manager", icon: LineChart },
    { value: "data scientist", label: "Data Scientist", icon: Database },
    { value: "devops", label: "DevOps Engineer", icon: Code },
    { value: "marketing", label: "Marketing", icon: Megaphone },
    { value: "sales", label: "Sales", icon: DollarSign },
  ]

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-background to-muted">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Job Search Filters
            </CardTitle>
            <CardDescription>Filter jobs by role to find the perfect match</CardDescription>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {selectedRole === "all" ? "All Roles" : roles.find((r) => r.value === selectedRole)?.label || selectedRole}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Role
            </label>
            <Select value={selectedRole} onValueChange={onRoleChange}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => {
                  const Icon = role.icon
                  return (
                    <SelectItem key={role.value} value={role.value} className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {role.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <Tabs defaultValue="roles" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roles">Popular Roles</TabsTrigger>
              <TabsTrigger value="locations">Top Locations</TabsTrigger>
            </TabsList>
            <TabsContent value="roles" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {roles.slice(1, 6).map((role) => {
                  const Icon = role.icon
                  return (
                    <Badge
                      key={role.value}
                      variant={selectedRole === role.value ? "default" : "outline"}
                      className="cursor-pointer flex items-center gap-1 py-1"
                      onClick={() => onRoleChange(role.value)}
                    >
                      <Icon className="h-3 w-3" />
                      {role.label}
                    </Badge>
                  )
                })}
              </div>
            </TabsContent>
            <TabsContent value="locations" className="mt-2">
              <div className="flex flex-wrap gap-2">
                {["San Francisco", "New York", "Austin", "Seattle", "Remote"].map((location) => (
                  <Badge key={location} variant="outline" className="cursor-pointer py-1">
                    {location}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

