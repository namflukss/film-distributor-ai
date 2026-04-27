import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// Parse "Month DD" → { month: 0-indexed, day }
function parseMonthDay(str) {
  if (!str) return null
  const parts = str.trim().split(' ')
  if (parts.length < 2) return null
  const m = MONTHS.findIndex(m => m.toLowerCase().startsWith(parts[0].toLowerCase()))
  const d = parseInt(parts[1])
  if (m < 0 || isNaN(d)) return null
  return { month: m, day: d }
}

// Parse "YYYY-MM-DD"
function parseDate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  if (!y || !m || !d) return null
  return { year: y, month: m - 1, day: d }
}

const DEADLINE_STYLES = {
  early:    { bg: 'bg-green-700',  text: 'text-green-100',  label: 'Early' },
  regular:  { bg: 'bg-yellow-700', text: 'text-yellow-100', label: 'Regular' },
  late:     { bg: 'bg-red-700',    text: 'text-red-100',    label: 'Late' },
  festival: { bg: 'bg-amber-600',  text: 'text-amber-100',  label: 'Festival' },
  your_sub: { bg: 'bg-blue-700',   text: 'text-blue-100',   label: 'Your deadline' },
}

export default function CalendarView() {
  const today = new Date()
  const [year, setYear]         = useState(today.getFullYear())
  const [month, setMonth]       = useState(today.getMonth())
  const [festivals, setFestivals]   = useState([])
  const [submissions, setSubmissions] = useState([])
  const [selected, setSelected] = useState(null) // { day, events[] }
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetch('/api/festivals').then(r => r.json()),
      fetch('/api/submissions').then(r => r.json()),
    ]).then(([f, s]) => { setFestivals(f); setSubmissions(s) })
      .catch(() => {})
  }, [])

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0);  setYear(y => y + 1) } else setMonth(m => m + 1) }

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Build event map: { day -> event[] }
  const eventMap = {}

  const addEvent = (day, event) => {
    if (!eventMap[day]) eventMap[day] = []
    eventMap[day].push(event)
  }

  festivals.forEach(f => {
    // Deadline events (annual, use current year for month/day)
    ;[
      { key: 'early_deadline',   kind: 'early' },
      { key: 'regular_deadline', kind: 'regular' },
      { key: 'late_deadline',    kind: 'late' },
    ].forEach(({ key, kind }) => {
      const parsed = parseMonthDay(f[key])
      if (parsed && parsed.month === month) {
        addEvent(parsed.day, { type: kind, festival: f, label: f[key] })
      }
    })

    // Festival run dates (use actual stored year)
    ;[
      { key: 'festival_start', kind: 'festival' },
      { key: 'festival_end',   kind: 'festival' },
    ].forEach(({ key, kind }) => {
      const parsed = parseDate(f[key])
      if (parsed && parsed.month === month && parsed.year === year) {
        addEvent(parsed.day, { type: kind, festival: f, label: key === 'festival_start' ? 'Opens' : 'Closes' })
      }
    })
  })

  // User submission deadlines
  submissions.forEach(s => {
    if (!s.deadline) return
    const d = new Date(s.deadline)
    if (d.getFullYear() === year && d.getMonth() === month) {
      addEvent(d.getDate(), { type: 'your_sub', festival: { name: s.festival_name, id: s.festival_id }, label: 'Your deadline' })
    }
  })

  const isToday = (day) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Calendar</h2>
          <p className="text-slate-400 mt-1 text-sm">Festival deadlines, runs, and your submission dates</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
            <ChevronLeft size={17} className="text-slate-300" />
          </button>
          <span className="text-white font-semibold text-lg min-w-44 text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
            <ChevronRight size={17} className="text-slate-300" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(DEADLINE_STYLES).map(([k, s]) => (
          <div key={k} className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className={`w-2.5 h-2.5 rounded-sm ${s.bg}`} />
            {s.label}
          </div>
        ))}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-slate-500 py-2">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          const events = day ? (eventMap[day] || []) : []
          return (
            <div key={idx}
              onClick={() => day && events.length && setSelected({ day, events })}
              className={`min-h-28 rounded-lg p-1.5 border transition-colors ${
                !day ? 'bg-transparent border-transparent' :
                isToday(day) ? 'bg-amber-400/10 border-amber-400/40' :
                events.length ? 'bg-slate-800 border-slate-600 hover:border-slate-500 cursor-pointer' :
                'bg-slate-800/40 border-slate-700/50'
              }`}>
              {day && (
                <>
                  <div className={`text-sm font-medium mb-1.5 w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday(day) ? 'bg-amber-400 text-slate-900' : 'text-slate-400'
                  }`}>{day}</div>
                  <div className="space-y-0.5">
                    {events.slice(0, 3).map((ev, i) => {
                      const s = DEADLINE_STYLES[ev.type]
                      return (
                        <div key={i} className={`text-xs px-1.5 py-0.5 rounded truncate ${s.bg} ${s.text}`}
                          title={`${ev.festival.name} — ${ev.label}`}>
                          {ev.festival.name.split(' ').slice(0, 2).join(' ')}
                        </div>
                      )
                    })}
                    {events.length > 3 && (
                      <div className="text-xs text-slate-500 pl-1">+{events.length - 3} more</div>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-slate-600 mt-4 text-center">
        Deadline months are annual. Festival run dates reflect the next scheduled edition. Always verify on official websites.
      </p>

      {/* Day detail panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold text-lg mb-4">
              {MONTHS[month]} {selected.day}, {year}
              <span className="text-slate-500 font-normal text-sm ml-2">— {selected.events.length} event{selected.events.length !== 1 ? 's' : ''}</span>
            </h3>
            <div className="space-y-3">
              {selected.events.map((ev, i) => {
                const s = DEADLINE_STYLES[ev.type]
                return (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
                    <span className={`text-xs font-bold px-2 py-1 rounded flex-shrink-0 ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                    <div className="min-w-0">
                      <button
                        onClick={() => { setSelected(null); navigate(`/festivals/${ev.festival.id}`) }}
                        className="text-white text-sm font-medium hover:text-amber-400 transition-colors text-left">
                        {ev.festival.name}
                      </button>
                      {ev.festival.location && (
                        <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                          <MapPin size={10} /> {ev.festival.location}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <button onClick={() => setSelected(null)}
              className="mt-4 w-full text-sm text-slate-400 hover:text-white border border-slate-600 rounded-lg py-2 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
