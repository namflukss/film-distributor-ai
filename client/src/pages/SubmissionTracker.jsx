import { useState, useEffect, useCallback } from 'react'
import { Trash2, ChevronDown, Award, AlertCircle } from 'lucide-react'

const COLUMNS = [
  { id: 'shortlist',  label: 'Shortlist',  color: 'border-slate-500', badge: 'bg-slate-700 text-slate-300' },
  { id: 'submitted',  label: 'Submitted',  color: 'border-blue-500',  badge: 'bg-blue-900 text-blue-300' },
  { id: 'accepted',   label: 'Accepted',   color: 'border-green-500', badge: 'bg-green-900 text-green-300' },
  { id: 'waitlisted', label: 'Waitlisted', color: 'border-yellow-500', badge: 'bg-yellow-900 text-yellow-300' },
  { id: 'rejected',   label: 'Rejected',   color: 'border-red-500',   badge: 'bg-red-900 text-red-300' },
  { id: 'withdrawn',  label: 'Withdrawn',  color: 'border-slate-600', badge: 'bg-slate-800 text-slate-400' },
]

const TIER_COLORS = {
  1: 'bg-amber-400 text-slate-900',
  2: 'bg-slate-400 text-slate-900',
  3: 'bg-amber-800 text-amber-100',
}

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="text-6xl animate-bounce">🎉</div>
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}
            className="absolute w-2 h-2 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#f59e0b','#10b981','#3b82f6','#ec4899'][i % 4],
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${0.5 + Math.random()}s`,
            }} />
        ))}
      </div>
    </div>
  )
}

function SubmissionCard({ sub, onStatusChange, onDelete }) {
  const [open, setOpen] = useState(false)
  const deadlineDays = sub.deadline
    ? Math.ceil((new Date(sub.deadline) - new Date()) / 86400000)
    : null

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 mb-2 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${TIER_COLORS[sub.festival_tier] || TIER_COLORS[3]}`}>
              T{sub.festival_tier}
            </span>
            <span className="text-white text-sm font-medium truncate">{sub.festival_name}</span>
          </div>
          {sub.deadline && (
            <div className={`text-xs mt-1 ${
              deadlineDays !== null && deadlineDays < 0 ? 'text-slate-500' :
              deadlineDays !== null && deadlineDays <= 7 ? 'text-red-400' :
              deadlineDays !== null && deadlineDays <= 14 ? 'text-yellow-400' : 'text-slate-400'
            }`}>
              {deadlineDays !== null && deadlineDays < 0 ? `Deadline passed ${Math.abs(deadlineDays)}d ago` :
               deadlineDays !== null ? `Deadline in ${deadlineDays}d` : sub.deadline}
            </div>
          )}
          {sub.fee_paid > 0 && (
            <div className="text-xs text-slate-500 mt-0.5">${sub.fee_paid} fee</div>
          )}
          {sub.category && (
            <div className="text-xs text-slate-500 mt-0.5 italic">{sub.category}</div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => setOpen(!open)}
            className="text-slate-500 hover:text-slate-300 p-1 rounded transition-colors">
            <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          <button onClick={() => onDelete(sub.id)}
            className="text-slate-600 hover:text-red-400 p-1 rounded transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-xs text-slate-400 mb-2 font-medium">Move to:</div>
          <div className="flex flex-wrap gap-1.5">
            {COLUMNS.filter(c => c.id !== sub.status).map(col => (
              <button key={col.id} onClick={() => onStatusChange(sub.id, col.id)}
                className={`text-xs px-2 py-1 rounded-full ${col.badge} hover:opacity-80 transition-opacity`}>
                {col.label}
              </button>
            ))}
          </div>
          {sub.notes && (
            <div className="mt-2 text-xs text-slate-500 italic">{sub.notes}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SubmissionTracker({ profile }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  const load = useCallback(() => {
    fetch('/api/submissions')
      .then(r => r.json())
      .then(data => { setSubmissions(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleStatusChange = async (id, newStatus) => {
    const wasAccepted = newStatus === 'accepted'
    await fetch(`/api/submissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    if (wasAccepted) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2500)
    }
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this submission?')) return
    await fetch(`/api/submissions/${id}`, { method: 'DELETE' })
    load()
  }

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col.id] = submissions.filter(s => s.status === col.id)
    return acc
  }, {})

  if (loading) return (
    <div className="p-8 text-slate-400 animate-pulse">Loading submissions...</div>
  )

  const total = submissions.length
  const accepted = grouped.accepted.length
  const submitted = grouped.submitted.length

  return (
    <div className="p-6">
      {showConfetti && <Confetti />}

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Submission Tracker</h2>
        <p className="text-slate-400 mt-1">
          {total} total · {submitted} submitted · {accepted} accepted
          {total > 0 && (accepted + grouped.rejected.length) > 0 && (
            <span className="ml-2 text-amber-400">
              {Math.round(accepted / (accepted + grouped.rejected.length) * 100)}% acceptance rate
            </span>
          )}
        </p>
      </div>

      {total === 0 && (
        <div className="text-center py-16">
          <AlertCircle size={40} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No submissions yet.</p>
          <p className="text-slate-500 text-sm mt-1">Browse festivals and add them to your shortlist.</p>
        </div>
      )}

      <div className="grid grid-cols-6 gap-3" style={{ minHeight: '70vh' }}>
        {COLUMNS.map(col => (
          <div key={col.id} className={`bg-slate-800/50 rounded-xl border-t-2 ${col.color} p-3`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">{col.label}</h3>
              <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${col.badge}`}>
                {grouped[col.id].length}
              </span>
            </div>
            <div>
              {col.id === 'accepted' && grouped.accepted.length > 0 && (
                <div className="flex items-center gap-1 mb-2 text-green-400 text-xs">
                  <Award size={12} /> Congratulations!
                </div>
              )}
              {grouped[col.id].map(sub => (
                <SubmissionCard key={sub.id} sub={sub}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete} />
              ))}
              {grouped[col.id].length === 0 && (
                <div className="text-slate-600 text-xs text-center py-4 border border-dashed border-slate-700 rounded-lg">
                  Empty
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
