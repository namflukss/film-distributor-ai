import { useState } from 'react'
import { Film, X } from 'lucide-react'

const GENRES = ['drama', 'comedy', 'documentary', 'horror', 'thriller', 'sci-fi', 'experimental', 'animation', 'short']
const GOALS = ['distribution', 'sales_agent', 'awards', 'audience', 'press', 'international']
const SUBJECT_TAGS = ['lgbtq', 'race', 'immigration', 'environment', 'mental health', 'family', 'war', 'religion', 'politics', 'coming of age']

export default function OnboardingModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    logline: '',
    genres: [],
    runtime: 90,
    format: 'digital',
    budget_tier: 'micro',
    director_background: 'first-time',
    country: 'USA',
    languages: ['English'],
    premiere_status: 'world',
    awards_eligibility: [],
    submission_budget: 2000,
    goals: [],
    shooting_style: '',
    subject_tags: [],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const toggle = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val)
        ? f[field].filter(x => x !== val)
        : [...f[field], val],
    }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Please enter a film title.'); return }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/film-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      const data = await res.json()
      onSave(data)
    } catch (e) {
      setError('Failed to save. Please try again.')
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-navy-800 border border-navy-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Film className="w-5 h-5 text-navy-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome to Greenlight AI</h2>
                <p className="text-gray-400 text-sm mt-0.5">Tell us about your film to get a personalized festival strategy.</p>
              </div>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-gray-500 hover:text-white ml-4 mt-1">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-5 mt-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Film Title <span className="text-gold-400">*</span></label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none transition-colors"
                placeholder="Enter your film title"
              />
            </div>

            {/* Logline */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Logline</label>
              <textarea
                value={form.logline}
                onChange={e => setForm(f => ({ ...f, logline: e.target.value }))}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="One or two sentence description of your film"
              />
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggle('genres', g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                      form.genres.includes(g)
                        ? 'bg-gold-500 text-navy-900'
                        : 'bg-navy-700 text-gray-300 hover:bg-navy-600 hover:text-white'
                    }`}
                  >{g}</button>
                ))}
              </div>
            </div>

            {/* Runtime + Director Background */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Runtime (minutes)</label>
                <input
                  type="number"
                  value={form.runtime}
                  onChange={e => setForm(f => ({ ...f, runtime: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:border-gold-500 focus:outline-none transition-colors"
                  min={1} max={600}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Director Background</label>
                <select
                  value={form.director_background}
                  onChange={e => setForm(f => ({ ...f, director_background: e.target.value }))}
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:border-gold-500 focus:outline-none transition-colors"
                >
                  <option value="first-time">First-time Director</option>
                  <option value="emerging">Emerging Director</option>
                  <option value="established">Established Director</option>
                </select>
              </div>
            </div>

            {/* Format + Budget Tier */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Format</label>
                <select
                  value={form.format}
                  onChange={e => setForm(f => ({ ...f, format: e.target.value }))}
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:border-gold-500 focus:outline-none transition-colors"
                >
                  <option value="digital">Digital</option>
                  <option value="film">Film (35mm/16mm)</option>
                  <option value="short">Short Film</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Budget Tier</label>
                <select
                  value={form.budget_tier}
                  onChange={e => setForm(f => ({ ...f, budget_tier: e.target.value }))}
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:border-gold-500 focus:outline-none transition-colors"
                >
                  <option value="micro">Micro (&lt;$50k)</option>
                  <option value="low">Low ($50k–$500k)</option>
                  <option value="mid">Mid ($500k–$2M)</option>
                  <option value="high">High ($2M+)</option>
                </select>
              </div>
            </div>

            {/* Country + Premiere Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Country of Origin</label>
                <input
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none transition-colors"
                  placeholder="e.g. USA"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Premiere Status</label>
                <select
                  value={form.premiere_status}
                  onChange={e => setForm(f => ({ ...f, premiere_status: e.target.value }))}
                  className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:border-gold-500 focus:outline-none transition-colors"
                >
                  <option value="world">World Premiere Available</option>
                  <option value="north_american">North American Premiere</option>
                  <option value="already_screened">Already Screened</option>
                </select>
              </div>
            </div>

            {/* Submission Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Total Submission Budget ($)</label>
              <input
                type="number"
                value={form.submission_budget}
                onChange={e => setForm(f => ({ ...f, submission_budget: parseInt(e.target.value) || 0 }))}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:border-gold-500 focus:outline-none transition-colors"
                min={0}
                placeholder="e.g. 2000"
              />
              <p className="text-xs text-gray-500 mt-1">Total budget for all submission fees across festivals</p>
            </div>

            {/* Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Festival Goals</label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggle('goals', g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      form.goals.includes(g)
                        ? 'bg-gold-500 text-navy-900'
                        : 'bg-navy-700 text-gray-300 hover:bg-navy-600 hover:text-white'
                    }`}
                  >{g.replace('_', ' ')}</button>
                ))}
              </div>
            </div>

            {/* Subject Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject Tags <span className="text-gray-500 font-normal">(optional)</span></label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_TAGS.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggle('subject_tags', t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
                      form.subject_tags.includes(t)
                        ? 'bg-blue-600 text-white'
                        : 'bg-navy-700 text-gray-300 hover:bg-navy-600 hover:text-white'
                    }`}
                  >{t}</button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">{error}</div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
              className="flex-1 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-bold py-3 rounded-lg transition-colors text-sm"
            >
              {saving ? 'Saving...' : 'Start My Strategy →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
