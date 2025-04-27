import { Clock } from "lucide-react"

interface RateLimitInfoProps {
  retryTime: Date | null
}

export function RateLimitInfo({ retryTime }: RateLimitInfoProps) {
  if (!retryTime) return null

  // Calculate time remaining
  const now = new Date()
  if (now >= retryTime) return null

  const diffMs = retryTime.getTime() - now.getTime()
  const diffMins = Math.ceil(diffMs / (1000 * 60))

  return (
    <div className="flex items-center text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
      <Clock className="h-4 w-4 mr-2" />
      <div>
        <span className="font-medium">API Rate Limit:</span> You've reached the API request limit. Using sample data for
        now. Try again in approximately {diffMins} minute{diffMins !== 1 ? "s" : ""}.
      </div>
    </div>
  )
}
