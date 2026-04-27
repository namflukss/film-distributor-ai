import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Calendar, DollarSign, Star, TrendingUp,
  ExternalLink, Clock, Film, Tag, Users, Target, Globe,
  CheckCircle, AlertCircle, Plus, Layers
} from 'lucide-react'

const TIER_STYLES = {
  1: { badge: 'bg-amber-400/20 text-amber-400 border-amber-400/40', label: 'Tier 1 — Major Festival', dot: 'bg-amber-400' },
  2: { badge: 'bg-blue-400/20 text-blue-400 border-blue-400/40',   label: 'Tier 2 — Significant',   dot: 'bg-blue-400' },
  3: { badge: 'bg-slate-400/20 text-slate-400 border-slate-400/40', label: 'Tier 3 — Specialty',      dot: 'bg-slate-400' },
}

const IMPACT_STYLES = {
  'very high': 'text-green-400 bg-green-400/10 border-green-400/20',
  'high':      'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'medium':    'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  'low':       'text-slate-400 bg-slate-400/10 border-slate-400/20',
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
        <Icon size={15} className="text-amber-400" />
        {title}
      </h3>
      {children}
    </div>
  )
}

function Pill({ children, className = '' }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${className}`}>
      {children}
    </span>
  )
}

export default function FestivalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [festival, setFestival] = useState(null)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetch(`/api/festivals/${id}`)
      .then(r => r.json())
      .then(data => { setFestival(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleShortlist = async () => {
    setAdding(true)
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ festival_id: id, status: 'shortlist' })
      })
      setAdded(true)
    } catch {}
    setAdding(false)
  }

  if (loading) return (
    <div className="p-8 text-slate-400 animate-pulse">Loading festival...</div>
  )
  if (!festival) return (
    <div className="p-8">
      <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white flex items-center gap-2 mb-4">
        <ArrowLeft size={16} /> Back
      </button>
      <p className="text-red-400">Festival not found.</p>
    </div>
  )

  const tier = TIER_STYLES[festival.tier] || TIER_STYLES[3]
  const feeDisplay = festival.fee_regular === 0 ? 'Free to Submit' : `$${festival.fee_early} – $${festival.fee_late}`

  return (
    <div className="p-6 max-w-5xl">
      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Browser
      </button>

      {/* Hero */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tier.badge}`}>
                {tier.label}
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(festival.prestige, 10) }).map((_, i) => (
                  <Star key={i} size={12} className={i < Math.round(festival.prestige / 2) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'} />
                ))}
                <span className="text-xs text-slate-500 ml-1">Prestige {festival.prestige}/10</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{festival.name}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{festival.location}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} />{festival.month}</span>
              <span className="flex items-center gap-1.5"><DollarSign size={14} />{feeDisplay}</span>
              {festival.platform && (
                <span className="flex items-center gap-1.5"><Globe size={14} />{festival.platform}</span>
              )}
              {festival.festival_start && (
                <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                  🎬 {new Date(festival.festival_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {festival.festival_end && ` → ${new Date(festival.festival_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            {festival.website && (
              <a href={festival.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-colors">
                <ExternalLink size={14} /> Official Website
              </a>
            )}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(festival.name + ' film festival')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-colors">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Search Google
            </a>
            <button onClick={handleShortlist} disabled={adding || added}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                added
                  ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                  : 'bg-amber-400 hover:bg-amber-500 text-slate-900'
              } disabled:opacity-60`}>
              {added ? <><CheckCircle size={14} /> Added to Shortlist</> : adding ? 'Adding...' : <><Plus size={14} /> Add to Shortlist</>}
            </button>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {festival.acceptance_rate ? `${(festival.acceptance_rate * 100).toFixed(1)}%` : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Acceptance Rate</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold px-3 py-1 rounded-lg border inline-block ${IMPACT_STYLES[festival.distribution_impact] || IMPACT_STYLES['low']}`}>
              {festival.distribution_impact || '—'}
            </div>
            <div className="text-xs text-slate-500 mt-1">Distribution Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {festival.runtime_min === 0 && festival.runtime_max <= 40
                ? `≤${festival.runtime_max}min`
                : festival.runtime_min && festival.runtime_max
                  ? `${festival.runtime_min}–${festival.runtime_max}min`
                  : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">Runtime Range</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">T{festival.tier}</div>
            <div className="text-xs text-slate-500 mt-0.5">Festival Tier</div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Description */}
          <Section icon={Film} title="About">
            <p className="text-slate-300 text-sm leading-relaxed">{festival.description}</p>
          </Section>

          {/* Strategy Notes */}
          {festival.notes && (
            <Section icon={Target} title="Strategy Notes">
              <div className="bg-amber-400/5 border border-amber-400/20 rounded-lg p-4">
                <p className="text-slate-300 text-sm leading-relaxed">{festival.notes}</p>
              </div>
            </Section>
          )}

          {/* Deadlines */}
          <Section icon={Clock} title="Submission Deadlines">
            <div className="mb-3 text-xs text-slate-500">
              Submissions open: <span className="text-slate-300">{festival.submission_opens || 'TBA'}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-center">
                <div className="text-green-400 font-semibold text-sm mb-1">Early</div>
                <div className="text-white font-medium">{festival.early_deadline || 'TBA'}</div>
                <div className="text-slate-400 text-sm mt-1">
                  {festival.fee_early === 0 ? <span className="text-green-400">Free</span> : `$${festival.fee_early}`}
                </div>
                <div className="text-xs text-slate-500 mt-1">Best rate</div>
              </div>
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 text-center">
                <div className="text-yellow-400 font-semibold text-sm mb-1">Regular</div>
                <div className="text-white font-medium">{festival.regular_deadline || 'TBA'}</div>
                <div className="text-slate-400 text-sm mt-1">
                  {festival.fee_regular === 0 ? <span className="text-green-400">Free</span> : `$${festival.fee_regular}`}
                </div>
                <div className="text-xs text-slate-500 mt-1">Standard rate</div>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-center">
                <div className="text-red-400 font-semibold text-sm mb-1">Late</div>
                <div className="text-white font-medium">{festival.late_deadline || 'TBA'}</div>
                <div className="text-slate-400 text-sm mt-1">
                  {festival.fee_late === 0 ? <span className="text-green-400">Free</span> : `$${festival.fee_late}`}
                </div>
                <div className="text-xs text-slate-500 mt-1">Last chance</div>
              </div>
            </div>
          </Section>

          {/* Categories */}
          {festival.categories?.length > 0 && (
            <Section icon={Layers} title="Competition Categories">
              <div className="flex flex-wrap gap-2">
                {festival.categories.map(c => (
                  <Pill key={c} className="bg-slate-700 border-slate-600 text-slate-300">{c}</Pill>
                ))}
              </div>
            </Section>
          )}

          {/* Notable Films */}
          {festival.notable_alumni?.length > 0 && (
            <Section icon={Star} title="Notable Alumni Films">
              <div className="flex flex-wrap gap-2">
                {festival.notable_alumni.map(f => (
                  <span key={f} className="text-sm text-slate-300 bg-slate-700/60 border border-slate-600 rounded-lg px-3 py-1.5 italic">
                    "{f}"
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Genres */}
          {festival.genres?.length > 0 && (
            <Section icon={Tag} title="Accepted Genres">
              <div className="flex flex-wrap gap-1.5">
                {festival.genres.map(g => (
                  <Pill key={g} className="bg-slate-700 border-slate-600 text-slate-300 capitalize">{g}</Pill>
                ))}
              </div>
            </Section>
          )}

          {/* Subject Tags */}
          {festival.subject_tags?.length > 0 && (
            <Section icon={Users} title="Subject Affinities">
              <div className="flex flex-wrap gap-1.5">
                {festival.subject_tags.map(t => (
                  <Pill key={t} className="bg-amber-400/10 border-amber-400/20 text-amber-300 capitalize">{t}</Pill>
                ))}
              </div>
            </Section>
          )}

          {/* At a glance */}
          <Section icon={TrendingUp} title="At a Glance">
            <div className="space-y-3">
              {[
                { label: 'Acceptance Rate', value: festival.acceptance_rate ? `~${(festival.acceptance_rate * 100).toFixed(1)}%` : 'Unknown' },
                { label: 'Prestige Score', value: `${festival.prestige} / 10` },
                { label: 'Distribution Impact', value: festival.distribution_impact || '—' },
                { label: 'Submission Platform', value: festival.platform || '—' },
                { label: 'Runtime Min', value: festival.runtime_min > 0 ? `${festival.runtime_min} min` : 'Any' },
                { label: 'Runtime Max', value: festival.runtime_max ? `${festival.runtime_max} min` : 'Any' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-slate-200 font-medium text-right max-w-32">{value}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Add to shortlist CTA */}
          {!added && (
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-4 text-center">
              <p className="text-sm text-slate-400 mb-3">Ready to submit to {festival.name}?</p>
              <button onClick={handleShortlist} disabled={adding}
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold py-2.5 rounded-lg text-sm transition-all disabled:opacity-50">
                {adding ? 'Adding...' : '+ Add to Shortlist'}
              </button>
            </div>
          )}
          {added && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
              <CheckCircle size={20} className="text-green-400 mx-auto mb-2" />
              <p className="text-sm text-green-400 font-medium">Added to your shortlist!</p>
              <button onClick={() => navigate('/submissions')}
                className="text-xs text-slate-400 hover:text-white mt-1 underline">View in Tracker →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
