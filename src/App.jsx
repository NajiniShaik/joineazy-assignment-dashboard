import { useState } from 'react'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Login from './pages/Login.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import {
  clearCurrentUser,
  getCurrentLoggedInUser,
} from './utils/storage.js'
import './index.css'

function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    getCurrentLoggedInUser(),
  )

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />
  }

  function handleLogout() {
    clearCurrentUser()
    setCurrentUser(null)
  }

  if (currentUser.role === 'student') {
    return <StudentDashboard student={currentUser} onLogout={handleLogout} />
  }

  if (currentUser.role === 'admin') {
    return <AdminDashboard admin={currentUser} onLogout={handleLogout} />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16 text-slate-900">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          {currentUser.name}
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Dashboard unavailable
        </h1>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Logout
        </button>
      </section>
    </main>
  )
}

export default App
