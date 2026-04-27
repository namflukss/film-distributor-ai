import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Filter, RefreshCw, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import FestivalCard from '../components/FestivalCard'
import LoadingSpinner from '../components/LoadingSpinner'

const GENRE_OPTIONS = ['drama', 'comedy', 'documentary', 'horror', 'thriller', 'sci-fi', 'experimental', 'animation', 'short']
const SUBJECT_OPTIONS = ['LGBTQ+', 'social justice', 'immigration', 'mental health', 'identity', 'political', 'human rights', 'environment', 'horror', 'technology', 'Latin America', 'Indigenous', 'Southern', 'outdoor', 'Oscar qualifier', 'short film']

export default function FestivalBrowser({ profile }) {
  const [festivals, setFestivals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [tier, setTier] = useState('')
  const [genre, setGenre] = useState('')
  const [subject, setSubject] = useState('')
  const [freeOnly, setFreeOnly] = useState(false)
  const [notification, setNotification] = useState(null)
  const [showGoogleSuggest, setShowGoogleSuggest] = useState(false)
  const searchRef = useRef(null)

  const googleSearchUrl = (q) =>
    `https://www.google.com/search?q=${encodeURIComponent(q + ' film festival')}`

  const fetchFestivals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      if (tier) params.set('tier', tier)
      if (genre) params.set('genre', genre)
      if (subject) params.set('subject', subject)
      const res = await fetch(`/api/festivals?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      let data = await res.json()
      if (freeOnly) data = data.filter(f => f.fee_regular === 0)
      setFestivals(data)
    } catch (e) {
      setError('Failed to load festivals. Make sure the server is running.')
    }
    setLoading(false)
  }, [search, tier, genre, subject, freeOnly])

  useEffect(() => {
    const timer = setTimeout(fetchFestivals, 300)
    return () => clearTimeout(timer)
  }, [fetchFestivals])

  const handleAddToShortlist = async (festivalId) => {
    const festival = festivals.find(f => f.id === festivalId)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ festival_id: festivalId, status: 'shortlist' }),
      })
      if (!res.ok) throw new Error('Failed to add')
      setNotification({ type: 'success', message: `"${festival?.name}" added to shortlist!` })
      setTimeout(() => setNotification(null), 3000)
    } catch (e) {
      setNotification({ type: 'error', message: 'Failed to add to shortlist.' })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Festival Browser</h2>
          <p className="text-gray-400 mt-1">
            {loading ? 'Loading...' : `${festivals.length} festival${festivals.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button
          onClick={fetchFestivals}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm px-3 py-2 bg-navy-800 border border-navy-700 rounded-lg hover:bg-navy-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`mb-4 flex items-center gap-2 p-3 rounded-lg text-sm ${
          notification.type === 'success'
            ? 'bg-green-900/40 border border-green-800 text-green-300'
            : 'bg-red-900/40 border border-red-800 text-red-300'
        }`}>
          {notification.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {notification.message}
        </div>
      )}

      {/* Filters */}
      <div className="bg-navy-800 border border-navy-700 rounded-xl p-4 mb-6 flex gap-3 flex-wrap">
        <div className="flex-1 min-w-48 relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none z-10" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setShowGoogleSuggest(e.target.value.length > 1) }}
            onFocus={() => search.length > 1 && setShowGoogleSuggest(true)}
            onBlur={() => setTimeout(() => setShowGoogleSuggest(false), 150)}
            placeholder="Search festivals..."
            className="w-full bg-navy-900 border border-navy-600 rounded-lg pl-9 pr-4 py-2 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none text-sm transition-colors"
          />
          {showGoogleSuggest && search.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Local results hint */}
              <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-700">
                {festivals.length > 0
                  ? `${festivals.length} result${festivals.length !== 1 ? 's' : ''} in database`
                  : 'No results in database'}
              </div>
              {/* Google Search options */}
              <a
                href={googleSearchUrl(search)}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 transition-colors group"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-200">Search Google for </span>
                  <span className="text-sm text-amber-400 font-medium">"{search} film festival"</span>
                </div>
                <ExternalLink size={13} className="text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
              </a>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(search + ' film festival submission deadline 2025')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 transition-colors group"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-200">Search </span>
                  <span className="text-sm text-amber-400 font-medium">"{search} festival submission deadline"</span>
                </div>
                <ExternalLink size={13} className="text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
              </a>
              <a
                href={`https://filmfreeway.com/search?utf8=%E2%9C%93&q=${encodeURIComponent(search)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-700 transition-colors group border-t border-slate-700"
              >
                <span className="text-xs font-bold text-orange-400 w-4 flex-shrink-0">FF</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-200">Search FilmFreeway for </span>
                  <span className="text-sm text-orange-400 font-medium">"{search}"</span>
                </div>
                <ExternalLink size={13} className="text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={tier}
            onChange={e => setTier(e.target.value)}
            className="bg-navy-900 border border-navy-600 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-500 focus:outline-none transition-colors"
          >
            <option value="">All Tiers</option>
            <option value="1">Tier 1 (Major)</option>
            <option value="2">Tier 2 (Significant)</option>
            <option value="3">Tier 3 (Specialty)</option>
          </select>
        </div>

        <select
          value={genre}
          onChange={e => setGenre(e.target.value)}
          className="bg-navy-900 border border-navy-600 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-500 focus:outline-none transition-colors"
        >
          <option value="">All Genres</option>
          {GENRE_OPTIONS.map(g => (
            <option key={g} value={g} className="capitalize">{g}</option>
          ))}
        </select>

        <select
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="bg-navy-900 border border-navy-600 rounded-lg px-3 py-2 text-sm text-white focus:border-gold-500 focus:outline-none transition-colors"
        >
          <option value="">All Subjects</option>
          {SUBJECT_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors whitespace-nowrap">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={e => setFreeOnly(e.target.checked)}
            className="accent-amber-400 w-3.5 h-3.5"
          />
          Free only
        </label>

        {(search || tier || genre || subject || freeOnly) && (
          <button
            onClick={() => { setSearch(''); setTier(''); setGenre(''); setSubject(''); setFreeOnly(false) }}
            className="text-gray-400 hover:text-white text-sm px-3 py-2 bg-navy-700 rounded-lg hover:bg-navy-600 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Tier legend */}
      <div className="flex gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-gold-500"></span>
          Tier 1: Major (Sundance, Cannes, etc.)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          Tier 2: Significant regional/specialty
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-400"></span>
          Tier 3: Niche and emerging
        </span>
      </div>

      {/* Content */}
      {error ? (
        <div className="flex items-center gap-2 p-6 bg-red-900/20 border border-red-800 rounded-xl text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : festivals.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg text-slate-300">No festivals found in database</p>
          <p className="text-sm mt-1 mb-6">Try adjusting your filters, or search externally:</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {search && (
              <>
                <a
                  href={googleSearchUrl(search)}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-sm text-slate-200 transition-colors"
                >
                  <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
                  Search Google for "{search} film festival"
                  <ExternalLink size={13} className="text-slate-500" />
                </a>
                <a
                  href={`https://filmfreeway.com/search?utf8=%E2%9C%93&q=${encodeURIComponent(search)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-sm text-slate-200 transition-colors"
                >
                  <span className="text-xs font-bold text-orange-400">FF</span>
                  Search FilmFreeway
                  <ExternalLink size={13} className="text-slate-500" />
                </a>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {festivals.map(festival => (
            <FestivalCard
              key={festival.id}
              festival={festival}
              onAddToShortlist={handleAddToShortlist}
            />
          ))}
        </div>
      )}
    </div>
  )
}
