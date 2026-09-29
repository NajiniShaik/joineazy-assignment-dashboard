import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import ProfessorWorkspace from './pages/ProfessorWorkspace.jsx'
import StudentDashboard from './pages/StudentWorkspace.jsx'
import {
  clearCurrentUser,
  getCurrentLoggedInUser,
} from './utils/storage.js'
import './index.css'

function App() {
  const [currentUser, setCurrentUser] = useState(() =>
    getCurrentLoggedInUser(),
  )
  const navigate = useNavigate()

  function getDashboardPath(user) {
    if (user?.role === 'student') return '/student'
    if (user?.role === 'admin') return '/professor'
    return '/login'
  }

  function handleLogin(user) {
    setCurrentUser(user)
    navigate(getDashboardPath(user), { replace: true })
  }

  function handleLogout() {
    clearCurrentUser()
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to={getDashboardPath(currentUser)} replace /> : <Login onLogin={handleLogin} />}
      />
      <Route
        path="/student/*"
        element={currentUser?.role === 'student' ? <StudentDashboard student={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/professor/*"
        element={currentUser?.role === 'admin' ? <ProfessorWorkspace professor={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={getDashboardPath(currentUser)} replace />} />
    </Routes>
  )
}

export default App
