import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import OnboardingModal from './components/OnboardingModal.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FilmProfile from './pages/FilmProfile.jsx'
import FestivalBrowser from './pages/FestivalBrowser.jsx'
import StrategyPlanner from './pages/StrategyPlanner.jsx'
import SubmissionTracker from './pages/SubmissionTracker.jsx'
import CalendarView from './pages/CalendarView.jsx'
import AIAdvisor from './pages/AIAdvisor.jsx'
import FestivalDetail from './pages/FestivalDetail.jsx'

export default function App() {
  const [profile, setProfile] = useState(null)
  const [profileLoaded, setProfileLoaded] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    fetch('/api/film-profile')
      .then(r => r.json())
      .then(data => {
        setProfile(data)
        setProfileLoaded(true)
        if (!data || !data.title) {
          setShowOnboarding(true)
        }
      })
      .catch(() => {
        setProfileLoaded(true)
        setShowOnboarding(true)
      })
  }, [])

  const handleProfileSave = (savedProfile) => {
    setProfile(savedProfile)
    setShowOnboarding(false)
  }

  if (!profileLoaded) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Greenlight AI...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy-900 flex">
        <Navbar profile={profile} />
        <main className="flex-1 ml-64 min-h-screen overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard profile={profile} />} />
            <Route path="/profile" element={<FilmProfile profile={profile} onSave={handleProfileSave} />} />
            <Route path="/festivals" element={<FestivalBrowser profile={profile} />} />
            <Route path="/strategy" element={<StrategyPlanner profile={profile} />} />
            <Route path="/submissions" element={<SubmissionTracker profile={profile} />} />
            <Route path="/calendar" element={<CalendarView profile={profile} />} />
            <Route path="/advisor" element={<AIAdvisor profile={profile} />} />
            <Route path="/festivals/:id" element={<FestivalDetail />} />
          </Routes>
        </main>
        {showOnboarding && (
          <OnboardingModal onClose={() => setShowOnboarding(false)} onSave={handleProfileSave} />
        )}
      </div>
    </BrowserRouter>
  )
}
