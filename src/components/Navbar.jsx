function Navbar({ user, student, onLogout }) {
  const account = user || student
  const workspaceLabel = account.role === 'admin' ? 'Admin workspace' : 'Student workspace'

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-bold tracking-tight text-slate-900">
            Assignment Dashboard
          </p>
          <p className="text-sm text-slate-500">{workspaceLabel}</p>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="text-left sm:text-right">
            <p className="font-semibold text-slate-900">{account.name}</p>
            <p className="text-sm capitalize text-slate-500">{account.role}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar