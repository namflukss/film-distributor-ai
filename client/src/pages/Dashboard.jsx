import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Film, Clock, Award, Activity, AlertCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Dashboard({ profile }) {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => setError('Failed to load dashboard stats.'))
  }, [])

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-400 p-8">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center p-20">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statCards = [
    { label: 'Total Submissions', value: stats.total, icon: Film, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Acceptance Rate', value: `${stats.acceptanceRate}%`, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Fees Spent', value: `$${stats.feesSpent.toLocaleString()}`, icon: DollarSign, color: 'text-gold-400', bg: 'bg-gold-500/10' },
    {
      label: 'Budget Remaining',
      value: `$${Math.max(0, stats.budgetRemaining).toLocaleString()}`,
      icon: DollarSign,
      color: stats.budgetRemaining < 0 ? 'text-red-400' : 'text-emerald-400',
      bg: stats.budgetRemaining < 0 ? 'bg-red-500/10' : 'bg-emerald-500/10',
    },
    { label: 'Accepted', value: stats.accepted, icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Momentum Score', value: `${stats.momentum}/100`, icon: Activity, color: 'text-gold-400', bg: 'bg-gold-500/10' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">
          {profile?.title ? `"${profile.title}"` : 'Dashboard'}
        </h2>
        <p className="text-gray-400 mt-1">Festival strategy overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-navy-800 border border-navy-700 rounded-xl p-5 hover:border-navy-600 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{label}</span>
              <div className={`${bg} p-2 rounded-lg`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Momentum Bar */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-sm font-medium text-gray-300">Festival Momentum Score</span>
            <p className="text-xs text-gray-500 mt-0.5">Based on submissions, acceptances, and activity</p>
          </div>
          <span className="text-2xl font-bold text-gold-400">{stats.momentum}<span className="text-sm text-gray-500">/100</span></span>
        </div>
        <div className="h-3 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${stats.momentum}%`,
              background: 'linear-gradient(to right, #d97706, #fbbf24)',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1.5">
          <span>Starting Out</span>
          <span>Building Buzz</span>
          <span>On Fire</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold-400" />
            Upcoming Deadlines
            <span className="text-xs text-gray-500 font-normal">(30 days)</span>
          </h3>
          {stats.upcoming.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No upcoming deadlines</p>
              <p className="text-gray-600 text-xs mt-1">Add deadlines in Submission Tracker</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.upcoming.map(s => {
                const days = Math.ceil((new Date(s.deadline) - new Date()) / 86400000)
                return (
                  <div key={s.id} className="flex justify-between items-center p-2.5 bg-navy-900/50 rounded-lg">
                    <div>
                      <div className="text-white text-sm font-medium">{s.festival_name}</div>
                      <div className="text-gray-500 text-xs">{s.deadline}</div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      days <= 7
                        ? 'bg-red-900/60 text-red-300 border border-red-800'
                        : days <= 14
                        ? 'bg-yellow-900/60 text-yellow-300 border border-yellow-800'
                        : 'bg-green-900/60 text-green-300 border border-green-800'
                    }`}>
                      {days}d
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-gold-400" />
            Recent Activity
          </h3>
          {stats.recent.length === 0 ? (
            <div className="text-center py-6">
              <Film className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No submissions yet</p>
              <p className="text-gray-600 text-xs mt-1">Start by browsing festivals!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recent.map(s => (
                <div key={s.id} className="flex justify-between items-center p-2.5 bg-navy-900/50 rounded-lg">
                  <span className="text-white text-sm">{s.festival_name || 'Unknown Festival'}</span>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    s.status === 'accepted'
                      ? 'bg-green-900/60 text-green-300 border border-green-800'
                      : s.status === 'rejected'
                      ? 'bg-red-900/60 text-red-300 border border-red-800'
                      : s.status === 'submitted'
                      ? 'bg-blue-900/60 text-blue-300 border border-blue-800'
                      : s.status === 'waitlisted'
                      ? 'bg-yellow-900/60 text-yellow-300 border border-yellow-800'
                      : 'bg-navy-700 text-gray-400'
                  }`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Getting Started Tips */}
      {stats.total === 0 && (
        <div className="mt-6 bg-gold-500/5 border border-gold-500/20 rounded-xl p-5">
          <h3 className="font-semibold text-gold-400 mb-3">Getting Started</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-navy-800/50 rounded-lg p-3">
              <div className="text-white font-medium mb-1">1. Complete Film Profile</div>
              <div className="text-gray-400 text-xs">Make sure your film profile is filled out with genres, runtime, and goals.</div>
            </div>
            <div className="bg-navy-800/50 rounded-lg p-3">
              <div className="text-white font-medium mb-1">2. Run Strategy Analysis</div>
              <div className="text-gray-400 text-xs">Go to Strategy Planner and run an AI analysis to get festival recommendations.</div>
            </div>
            <div className="bg-navy-800/50 rounded-lg p-3">
              <div className="text-white font-medium mb-1">3. Add to Shortlist</div>
              <div className="text-gray-400 text-xs">Browse festivals and add promising ones to your shortlist to track submissions.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
