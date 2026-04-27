import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Film, Globe, Lightbulb,
  ClipboardList, Calendar, MessageSquare, Clapperboard
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile', icon: Film, label: 'Film Profile' },
  { to: '/festivals', icon: Globe, label: 'Festival Browser' },
  { to: '/strategy', icon: Lightbulb, label: 'Strategy Planner' },
  { to: '/submissions', icon: ClipboardList, label: 'Submission Tracker' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/advisor', icon: MessageSquare, label: 'AI Advisor' },
]

export default function Navbar({ profile }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-navy-800 border-r border-navy-700 flex flex-col z-50">
      <div className="p-6 border-b border-navy-700">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <Clapperboard className="w-4 h-4 text-navy-900" />
          </div>
          <span className="font-bold text-lg text-white">Greenlight AI</span>
        </div>
        {profile?.title && (
          <p className="text-xs text-gold-400 mt-2 truncate font-medium pl-11">
            {profile.title}
          </p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-navy-700'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-navy-700">
        <div className="text-xs text-gray-500 text-center">
          Film Festival Strategy AI
        </div>
      </div>
    </aside>
  )
}
