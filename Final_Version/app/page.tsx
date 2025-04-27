import { Suspense } from "react"
import Dashboard from "@/components/dashboard"

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
        <Dashboard />
      </Suspense>
    </main>
  )
}
