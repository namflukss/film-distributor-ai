import { useState } from 'react'
import { Brain, Sparkles, BarChart3, AlertCircle, ChevronDown, ChevronUp, Star } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import LoadingSpinner from '../components/LoadingSpinner'

const tierColors = {
  1: 'text-gold-400 border-gold-500/30 bg-gold-500/10',
  2: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  3: 'text-gray-400 border-gray-500/20 bg-gray-500/10',
}

export default function StrategyPlanner({ profile }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [ranked, setRanked] = useState([])
  const [aiText, setAiText] = useState('')
  const [error, setError] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const runAnalysis = async () => {
    if (!profile?.title) {
      setError('Please complete your Film Profile before running analysis.')
      return
    }
    setAnalyzing(true)
    setError(null)
    setAiText('')
    setRanked([])

    try {
      const res = await fetch('/api/strategy/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })

      if (!res.ok) throw new Error('Analysis failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (raw === '[DONE]') { setAnalyzing(false); return }

          try {
            const parsed = JSON.parse(raw)
            if (parsed.type === 'done') { setAnalyzing(false); return }
            if (parsed.ranked) {
              setRanked(parsed.ranked)
            } else if (parsed.type === 'text' && parsed.content) {
              setAiText(prev => prev + parsed.content)
            } else if (parsed.content) {
              setAiText(prev => prev + parsed.content)
            } else if (parsed.error || parsed.type === 'error') {
              setError(parsed.error || 'Analysis error')
            }
          } catch (e) {
            // ignore parse errors
          }
        }
      }
    } catch (e) {
      setError('Analysis failed. Make sure the server is running.')
    }
    setAnalyzing(false)
  }

  const displayRanked = showAll ? ranked : ranked.slice(0, 10)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Brain className="w-8 h-8 text-gold-400" />
          Strategy Planner
        </h2>
        <p className="text-gray-400 mt-1">AI-powered festival analysis tailored to your film.</p>
      </div>

      {/* Profile Summary */}
      {profile?.title ? (
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white">"{profile.title}"</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-400">
                {profile.genres?.length > 0 && <span>{profile.genres.join(', ')}</span>}
                {profile.runtime > 0 && <span>{profile.runtime} min</span>}
                <span className="capitalize">{profile.director_background} director</span>
                <span className="capitalize">{profile.budget_tier} budget</span>
                <span className="capitalize">{profile.premiere_status?.replace('_', ' ')}</span>
              </div>
              {profile.logline && (
                <p className="text-gray-500 text-sm mt-2 italic">"{profile.logline}"</p>
              )}
            </div>
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-navy-900 font-bold px-6 py-3 rounded-lg transition-colors text-sm flex-shrink-0 ml-4"
            >
              {analyzing ? (
                <><LoadingSpinner size="sm" className="border-navy-900" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Analyze My Film</>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-navy-800 border border-amber-700/40 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 text-amber-400 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Film Profile Required</span>
          </div>
          <p className="text-gray-400 text-sm">Please complete your <a href="/profile" className="text-gold-400 hover:underline">Film Profile</a> before running strategy analysis.</p>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Analyzing indicator */}
      {analyzing && aiText === '' && ranked.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm animate-pulse">Scoring {' '} festivals against your profile...</p>
        </div>
      )}

      {/* Ranked Festivals */}
      {ranked.length > 0 && (
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gold-400" />
            Algorithmic Festival Ranking
            <span className="text-gray-500 text-sm font-normal">({ranked.length} festivals scored)</span>
          </h3>
          <div className="space-y-2">
            {displayRanked.map((r, i) => (
              <div key={r.festival.id} className="flex items-center gap-3 p-3 bg-navy-900/50 rounded-lg hover:bg-navy-900/80 transition-colors">
                <span className="text-gray-500 text-sm w-6 text-center font-mono">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-medium truncate">{r.festival.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${tierColors[r.festival.tier] || tierColors[3]}`}>
                      T{r.festival.tier}
                    </span>
                    {r.festival.prestige >= 9 && (
                      <Star className="w-3 h-3 text-gold-400 fill-gold-400" />
                    )}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5">{r.festival.location} · {r.festival.month}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-24 h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${r.score}%`,
                        background: r.score >= 70 ? '#f59e0b' : r.score >= 50 ? '#3b82f6' : '#6b7280',
                      }}
                    />
                  </div>
                  <span className={`text-sm font-bold w-10 text-right ${
                    r.score >= 70 ? 'text-gold-400' : r.score >= 50 ? 'text-blue-400' : 'text-gray-500'
                  }`}>{r.score}</span>
                </div>
              </div>
            ))}
          </div>
          {ranked.length > 10 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-3 flex items-center gap-1 text-sm text-gray-400 hover:text-white mx-auto transition-colors"
            >
              {showAll ? <><ChevronUp className="w-4 h-4" />Show less</> : <><ChevronDown className="w-4 h-4" />Show all {ranked.length} results</>}
            </button>
          )}
        </div>
      )}

      {/* AI Strategy Text */}
      {(aiText || (analyzing && ranked.length > 0)) && (
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-gold-400" />
            AI Strategy Analysis
            {analyzing && <LoadingSpinner size="sm" />}
          </h3>
          <div className="prose prose-sm prose-invert max-w-none
            prose-headings:text-gold-400 prose-headings:font-semibold
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-white
            prose-li:text-gray-300
            prose-a:text-blue-400">
            <ReactMarkdown>{aiText}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Empty state (no analysis run yet) */}
      {!analyzing && !aiText && ranked.length === 0 && !error && profile?.title && (
        <div className="text-center py-16 bg-navy-800 border border-navy-700 rounded-xl">
          <Brain className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h3 className="text-white font-semibold mb-2">Ready to Analyze</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            Click "Analyze My Film" to score all festivals against your profile and get a personalized strategy.
          </p>
          <button
            onClick={runAnalysis}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold px-8 py-3 rounded-lg transition-colors mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            Analyze My Film
          </button>
        </div>
      )}
    </div>
  )
}
