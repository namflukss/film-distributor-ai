import React from 'react'
import { Clock } from 'lucide-react'

export default function DeadlineCountdown({ deadline }) {
  if (!deadline) return null

  const now = new Date()
  const due = new Date(deadline)
  const diffMs = due - now
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  let colorClass = 'text-green-400'
  let bgClass = 'bg-green-400/10'
  if (diffDays <= 3) { colorClass = 'text-red-400'; bgClass = 'bg-red-400/10' }
  else if (diffDays <= 7) { colorClass = 'text-orange-400'; bgClass = 'bg-orange-400/10' }
  else if (diffDays <= 14) { colorClass = 'text-yellow-400'; bgClass = 'bg-yellow-400/10' }

  if (diffDays < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400">
        <Clock className="w-3 h-3" />
        Passed
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ${bgClass} ${colorClass} font-medium`}>
      <Clock className="w-3 h-3" />
      {diffDays === 0 ? 'Today!' : diffDays === 1 ? 'Tomorrow' : `${diffDays}d`}
    </span>
  )
}
