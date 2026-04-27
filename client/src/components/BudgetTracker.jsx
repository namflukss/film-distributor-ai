import React from 'react'
import { DollarSign } from 'lucide-react'

export default function BudgetTracker({ spent, budget }) {
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0
  let barColor = 'bg-green-500'
  if (pct > 75) barColor = 'bg-red-500'
  else if (pct > 50) barColor = 'bg-yellow-500'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          ${spent.toLocaleString()} spent
        </span>
        <span>${budget.toLocaleString()} budget</span>
      </div>
      <div className="h-2 bg-navy-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-right text-gray-500">{pct}% used</div>
    </div>
  )
}
