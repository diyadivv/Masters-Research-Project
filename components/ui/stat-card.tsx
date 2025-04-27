import type { ReactNode } from "react"

interface StatCardProps {
  icon: ReactNode
  title: string
  value: string | number
  description: string
  isLoading?: boolean
}

export function StatCard({ icon, title, value, description, isLoading = false }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="flex items-center mb-2">
        <div className="mr-2 text-gray-500">{icon}</div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold mb-1">{value}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </>
      )}
    </div>
  )
}
