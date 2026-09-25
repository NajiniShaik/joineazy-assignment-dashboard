import { useState } from 'react'
import { getUsers, saveCurrentUser } from '../utils/storage.js'

function Login({ onLogin }) {
  const [selectedUser, setSelectedUser] = useState(null)
  const users = getUsers()

  function handleLogin() {
    if (!selectedUser) {
      return
    }

    saveCurrentUser(selectedUser)
    onLogin(selectedUser)
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <section className="mx-auto w-full max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Welcome
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
            Assignment Dashboard
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Choose a demo user to explore the student and professor experiences.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {users.map((user) => {
            const isSelected = selectedUser?.id === user.id

            return (
              <button
                key={user.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedUser(user)}
                className={`rounded-xl border bg-white p-5 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {user.name}
                    </h2>
                    <p className="mt-1 break-all text-sm text-slate-600">
                      {user.email}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                    {user.role}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleLogin}
            disabled={!selectedUser}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto sm:min-w-48"
          >
            Continue
          </button>
        </div>
      </section>
    </main>
  )
}

export default Login
