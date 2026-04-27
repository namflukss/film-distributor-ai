import { useState, useEffect } from 'react'
import { Film, Save, Check, AlertCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const GENRES = ['drama', 'comedy', 'documentary', 'horror', 'thriller', 'sci-fi', 'experimental', 'animation', 'short']
const GOALS = ['distribution', 'sales_agent', 'awards', 'audience', 'press', 'international']
const AWARDS = ['oscar', 'bafta', 'spirit_awards', 'gotham', 'cannes', 'berlinale', 'venice']
const SUBJECT_TAGS = ['lgbtq', 'race', 'immigration', 'environment', 'mental health', 'family', 'war', 'religion', 'politics', 'coming of age']
const SHOOTING_STYLES = ['', 'vérité', 'narrative', 'experimental', 'hybrid doc', 'animation', 'found footage', 'mockumentary']

const defaultForm = {
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
}

export default function FilmProfile({ profile, onSave }) {
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (profile) {
      setForm({
        ...defaultForm,
        ...profile,
        genres: profile.genres || [],
        goals: profile.goals || [],
        awards_eligibility: profile.awards_eligibility || [],
        subject_tags: profile.subject_tags || [],
        languages: profile.languages || ['English'],
      })
    }
  }, [profile])

  const toggle = (field, val) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val)
        ? f[field].filter(x => x !== val)
        : [...f[field], val],
    }))
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Film title is required.'); return }
    setSaving(true)
    setSaved(false)
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
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError('Failed to save profile. Please try again.')
    }
    setSaving(false)
  }

  const TagButton = ({ field, value, activeClass = 'bg-gold-500 text-navy-900', label }) => (
    <button
      type="button"
      onClick={() => toggle(field, value)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all capitalize ${
        form[field].includes(value)
          ? activeClass
          : 'bg-navy-700 text-gray-300 hover:bg-navy-600 hover:text-white'
      }`}
    >
      {label || value.replace('_', ' ')}
    </button>
  )

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Film className="w-8 h-8 text-gold-400" />
            Film Profile
          </h2>
          <p className="text-gray-400 mt-1">Complete your profile for accurate festival matching and AI strategy.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-gold-500 hover:bg-gold-600 text-navy-900'
          } disabled:opacity-50`}
        >
          {saving ? (
            <><LoadingSpinner size="sm" /> Saving...</>
          ) : saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Profile</>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-5">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Film Title <span className="text-gold-400">*</span>
              </label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none transition-colors"
                placeholder="Your film title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Logline</label>
              <textarea
                value={form.logline}
                onChange={e => setForm(f => ({ ...f, logline: e.target.value }))}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="A compelling one or two sentence description of your film"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => <TagButton key={g} field="genres" value={g} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-5">Technical Details</h3>
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
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Shooting Style</label>
              <select
                value={form.shooting_style}
                onChange={e => setForm(f => ({ ...f, shooting_style: e.target.value }))}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:border-gold-500 focus:outline-none transition-colors"
              >
                {SHOOTING_STYLES.map(s => (
                  <option key={s} value={s}>{s || 'Not specified'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Country of Origin</label>
              <input
                value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-gold-500 focus:outline-none transition-colors"
                placeholder="e.g. USA, UK, France"
              />
            </div>
          </div>
        </div>

        {/* Production Context */}
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-5">Production Context</h3>
          <div className="grid grid-cols-2 gap-4 mb-5">
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Premiere Status</label>
              <select
                value={form.premiere_status}
                onChange={e => setForm(f => ({ ...f, premiere_status: e.target.value }))}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:border-gold-500 focus:outline-none transition-colors"
              >
                <option value="world">World Premiere Available</option>
                <option value="north_american">North American Premiere Available</option>
                <option value="already_screened">Already Screened Publicly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Submission Budget ($)</label>
              <input
                type="number"
                value={form.submission_budget}
                onChange={e => setForm(f => ({ ...f, submission_budget: parseInt(e.target.value) || 0 }))}
                className="w-full bg-navy-900 border border-navy-600 rounded-lg px-4 py-2.5 text-white focus:border-gold-500 focus:outline-none transition-colors"
                min={0}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Awards Eligibility</label>
            <div className="flex flex-wrap gap-2">
              {AWARDS.map(a => <TagButton key={a} field="awards_eligibility" value={a} activeClass="bg-purple-600 text-white" label={a.replace('_', ' ').toUpperCase()} />)}
            </div>
          </div>
        </div>

        {/* Strategy Goals & Tags */}
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-5">Strategy Goals & Tags</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Festival Goals</label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map(g => <TagButton key={g} field="goals" value={g} />)}
              </div>
              <p className="text-xs text-gray-500 mt-2">Select all that apply — this shapes AI recommendations</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject Tags</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_TAGS.map(t => <TagButton key={t} field="subject_tags" value={t} activeClass="bg-blue-600 text-white" />)}
              </div>
              <p className="text-xs text-gray-500 mt-2">Helps match with thematically-focused festivals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-gold-500 hover:bg-gold-600 text-navy-900'
          } disabled:opacity-50`}
        >
          {saving ? (
            <><LoadingSpinner size="sm" /> Saving...</>
          ) : saved ? (
            <><Check className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Profile</>
          )}
        </button>
      </div>
    </div>
  )
}
