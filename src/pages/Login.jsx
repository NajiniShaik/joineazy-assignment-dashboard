import { useState } from 'react'
import { getUsers, registerStudent, saveCurrentUser } from '../utils/storage.js'

function Login({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [selectedUser, setSelectedUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const users = getUsers()

  function handleLogin() {
    if (!selectedUser) {
      return
    }

    saveCurrentUser(selectedUser)
    onLogin(selectedUser)
  }

  function handleRegister(event) {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    if (!cleanName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Enter your name and a valid email address.')
      return
    }

    const student = registerStudent(cleanName, cleanEmail)
    if (!student) {
      setError('An account with this email already exists. Sign in with that profile instead.')
      return
    }

    saveCurrentUser(student)
    onLogin(student)
  }

  return (
    <main className="min-h-screen bg-[#eaf0eb] p-3 text-[#203329] sm:grid sm:place-items-center sm:p-6">
      <section className="mx-auto grid min-h-[min(760px,calc(100vh-3rem))] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#dce6de] bg-white shadow-[0_24px_80px_-48px_rgba(28,57,40,0.45)] lg:grid-cols-[0.88fr_1.12fr]">
        <aside className="relative hidden overflow-hidden bg-[#294e3b] p-9 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(to right, #d9e9de 1px, transparent 1px), linear-gradient(to bottom, #d9e9de 1px, transparent 1px)', backgroundSize: '38px 38px' }} />
          <div className="relative">
            <div className="flex items-center gap-3"><span className="inline-flex size-10 items-center justify-center rounded-lg bg-white text-lg font-bold text-[#294e3b]">j.</span><span className="text-lg font-bold">Joineazy</span></div>
            <p className="mt-16 text-xs font-bold uppercase tracking-[0.18em] text-[#c7ddce]">Learning, in motion</p>
            <h1 className="mt-4 max-w-md text-4xl font-bold leading-tight">Make progress visible.</h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-[#d3e2d8]">One calm workspace for courses, assignments, and the teams you build along the way.</p>
          </div>
          <div className="relative border-t border-white/20 pt-5 text-sm text-[#c7ddce]">Fall semester · 2026</div>
        </aside>

        <div className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16">
          <div className="mb-8 flex items-center gap-3 lg:hidden"><span className="inline-flex size-9 items-center justify-center rounded-lg bg-[#294e3b] text-base font-bold text-white">j.</span><span className="font-bold">Joineazy</span></div>
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#668071]">Student & professor workspace</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#203329]">{mode === 'login' ? 'Welcome back' : 'Create your student profile'}</h2>
            <p className="mt-2 text-sm leading-6 text-[#718078]">{mode === 'login' ? 'Choose a demo profile to continue to your workspace.' : 'Your courses and pending assignments will be ready as soon as you join.'}</p>

            <div className="mt-7 inline-flex rounded-lg border border-[#e2e9e4] bg-[#f5f8f5] p-1" role="tablist" aria-label="Account access">
              <button type="button" role="tab" aria-selected={mode === 'login'} onClick={() => { setMode('login'); setError('') }} className={`min-h-10 rounded-md px-4 text-sm font-bold transition ${mode === 'login' ? 'bg-white text-[#27654c] shadow-sm' : 'text-[#738078] hover:text-[#203329]'}`}>Sign in</button>
              <button type="button" role="tab" aria-selected={mode === 'register'} onClick={() => { setMode('register'); setError('') }} className={`min-h-10 rounded-md px-4 text-sm font-bold transition ${mode === 'register' ? 'bg-white text-[#27654c] shadow-sm' : 'text-[#738078] hover:text-[#203329]'}`}>Register</button>
            </div>

            {mode === 'login' ? (
              <>
                <div className="mt-6 space-y-2.5">
                  {users.map((user) => {
                    const isSelected = selectedUser?.id === user.id
                    const isProfessor = user.role === 'admin'
                    return (
                      <button key={user.id} type="button" aria-pressed={isSelected} onClick={() => setSelectedUser(user)} className={`flex min-h-[72px] w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-[#5a9274] focus:ring-offset-2 ${isSelected ? 'border-[#6b9b7f] bg-[#f0f6f1]' : 'border-[#e3eae5] bg-white hover:border-[#a9c2b0] hover:bg-[#fafcfa]'}`}>
                        <span className="flex min-w-0 items-center gap-3">
                          <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isProfessor ? 'bg-[#f8e9dc] text-[#88583d]' : 'bg-[#e4f1e8] text-[#27654c]'}`}>{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                          <span className="min-w-0"><span className="block truncate text-sm font-bold text-[#203329]">{user.name}</span><span className="mt-0.5 block truncate text-xs text-[#7b877f]">{user.email}</span></span>
                        </span>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${isProfessor ? 'bg-[#f8efe7] text-[#805a40]' : 'bg-[#edf4ee] text-[#527362]'}`}>{isProfessor ? 'Professor' : 'Student'}</span>
                      </button>
                    )
                  })}
                </div>
                {error && <p role="alert" className="mt-4 text-sm font-medium text-[#a1473f]">{error}</p>}
                <button type="button" onClick={handleLogin} disabled={!selectedUser} className="mt-6 min-h-12 w-full rounded-lg bg-[#27654c] px-5 text-sm font-bold text-white transition hover:bg-[#1d523b] focus:outline-none focus:ring-2 focus:ring-[#5a9274] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#b9c8be]">Continue to workspace <span aria-hidden="true" className="ml-1">→</span></button>
                <p className="mt-4 text-center text-xs leading-5 text-[#87928b]">Demo access only. Select the professor profile to review class analytics.</p>
              </>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={handleRegister} noValidate>
                <div><label htmlFor="register-name" className="text-sm font-semibold text-[#34483b]">Full name</label><input id="register-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-[#d5dfd8] px-3 text-sm outline-none focus:border-[#5a9274] focus:ring-2 focus:ring-[#d5e7dc]" placeholder="Your name" /></div>
                <div><label htmlFor="register-email" className="text-sm font-semibold text-[#34483b]">Email address</label><input id="register-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-[#d5dfd8] px-3 text-sm outline-none focus:border-[#5a9274] focus:ring-2 focus:ring-[#d5e7dc]" placeholder="you@campus.edu" /></div>
                {error && <p role="alert" className="text-sm font-medium text-[#a1473f]">{error}</p>}
                <button type="submit" className="min-h-12 w-full rounded-lg bg-[#27654c] px-5 text-sm font-bold text-white transition hover:bg-[#1d523b] focus:outline-none focus:ring-2 focus:ring-[#5a9274] focus:ring-offset-2">Create student account <span aria-hidden="true" className="ml-1">→</span></button>
                <p className="text-center text-xs leading-5 text-[#87928b]">This frontend demo stores profile and progress data in this browser.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login
