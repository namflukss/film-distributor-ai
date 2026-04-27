import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, DollarSign, Star, TrendingUp, ChevronDown, ChevronUp, Plus, ExternalLink } from 'lucide-react'

const tierColors = {
  1: 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  2: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  3: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const tierLabels = { 1: 'Tier 1', 2: 'Tier 2', 3: 'Tier 3' }

const impactColors = {
  'very high': 'text-green-400',
  'high': 'text-emerald-400',
  'medium': 'text-yellow-400',
  'low': 'text-gray-400',
}

export default function FestivalCard({ festival, onAddToShortlist }) {
  const [expanded, setExpanded] = useState(false)
  const [adding, setAdding] = useState(false)
  const navigate = useNavigate()

  const feeDisplay = festival.fee_regular === 0
    ? <span className="text-green-400 font-medium">Free</span>
    : <span>${festival.fee_early}–${festival.fee_late}</span>

  const handleAdd = async () => {
    setAdding(true)
    try {
      await onAddToShortlist(festival.id)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="bg-navy-800 border border-navy-700 rounded-xl overflow-hidden hover:border-navy-600 transition-all duration-200">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded border ${tierColors[festival.tier] || tierColors[3]}`}>
                {tierLabels[festival.tier] || 'Tier ?'}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(festival.prestige, 5) }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-gold-400 fill-gold-400" />
                ))}
              </div>
            </div>
            <h3 className="font-semibold text-white text-sm leading-tight">{festival.name}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{festival.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>{festival.month}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 flex-shrink-0" />
            {feeDisplay}
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 flex-shrink-0" />
            <span className={impactColors[festival.distribution_impact] || 'text-gray-400'}>
              {festival.distribution_impact || 'unknown'}
            </span>
          </div>
        </div>

        {festival.acceptance_rate && (
          <div className="text-xs text-gray-500 mb-3">
            Acceptance: ~{(festival.acceptance_rate * 100).toFixed(1)}%
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          {(festival.genres || []).slice(0, 4).map(g => (
            <span key={g} className="text-xs px-2 py-0.5 bg-navy-700 text-gray-400 rounded-full">{g}</span>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center justify-center gap-1.5 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-xs font-medium px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Plus className="w-3.5 h-3.5" />
            {adding ? 'Adding...' : 'Shortlist'}
          </button>
          <button
            onClick={() => navigate(`/festivals/${festival.id}`)}
            className="flex-1 flex items-center justify-center gap-1 text-slate-300 hover:text-white text-xs px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors font-medium"
          >
            View Details
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1 text-gray-400 hover:text-white text-xs px-2 py-2 rounded-lg bg-navy-700 hover:bg-navy-600 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-navy-700 pt-3 space-y-3">
          <p className="text-xs text-gray-300 leading-relaxed">{festival.description}</p>

          {festival.notes && (
            <div className="bg-navy-900/50 rounded-lg p-3">
              <p className="text-xs text-gold-400 font-medium mb-1">Strategy Notes</p>
              <p className="text-xs text-gray-300">{festival.notes}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">Deadlines</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-green-500/10 border border-green-500/20 rounded p-2 text-center">
                <div className="text-green-400 font-medium">Early</div>
                <div className="text-gray-400">{festival.early_deadline}</div>
                {festival.fee_early === 0 ? <div className="text-green-400">Free</div> : <div className="text-gray-300">${festival.fee_early}</div>}
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-2 text-center">
                <div className="text-yellow-400 font-medium">Regular</div>
                <div className="text-gray-400">{festival.regular_deadline}</div>
                {festival.fee_regular === 0 ? <div className="text-green-400">Free</div> : <div className="text-gray-300">${festival.fee_regular}</div>}
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-center">
                <div className="text-red-400 font-medium">Late</div>
                <div className="text-gray-400">{festival.late_deadline}</div>
                {festival.fee_late === 0 ? <div className="text-green-400">Free</div> : <div className="text-gray-300">${festival.fee_late}</div>}
              </div>
            </div>
          </div>

          {festival.categories?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Categories</p>
              <div className="flex flex-wrap gap-1">
                {festival.categories.map(c => (
                  <span key={c} className="text-xs px-2 py-0.5 bg-navy-700 text-gray-300 rounded">{c}</span>
                ))}
              </div>
            </div>
          )}

          {festival.notable_alumni?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Notable Films</p>
              <p className="text-xs text-gray-400">{festival.notable_alumni.join(' · ')}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Platform: {festival.platform}</span>
            {festival.website && (
              <a href={festival.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                <ExternalLink className="w-3 h-3" />
                Website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
