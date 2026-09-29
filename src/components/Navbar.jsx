function Navbar({ user, student, onLogout, activeView = 'overview', onNavigate = () => {} }) {
  const account = user || student
  const isProfessor = account.role === 'admin'
  const workspaceLabel = isProfessor ? 'Professor workspace' : 'Student workspace'
  const links = isProfessor
    ? [{ id: 'overview', label: 'Overview' }, { id: 'courses', label: 'Courses' }, { id: 'assignments', label: 'Assignments' }]
    : [{ id: 'overview', label: 'Overview' }, { id: 'courses', label: 'Courses' }, { id: 'groups', label: 'Groups' }]

  return (
    <header className="border-b border-[#dfe8e1] bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#294e3b] text-lg font-bold text-white">j.</span>
          <div className="min-w-0">
            <p className="text-base font-bold tracking-tight text-[#203329]">Joineazy</p>
            <p className="text-xs text-[#758179]">{workspaceLabel}</p>
          </div>
        </div>

        <nav aria-label="Main navigation" className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:ml-3 sm:w-auto">
          {links.map((link) => (
            <button
              key={link.id}
              type="button"
              aria-current={activeView === link.id ? 'page' : undefined}
              onClick={() => onNavigate(link.id)}
              className={`min-h-10 shrink-0 border-b-2 px-3 text-sm font-semibold transition ${activeView === link.id ? 'border-[#397254] text-[#27654c]' : 'border-transparent text-[#758179] hover:text-[#203329]'}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-[#203329]">{account.name}</p>
            <p className="text-xs capitalize text-[#758179]">{isProfessor ? 'Professor' : 'Student'}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="min-h-10 rounded-lg border border-[#d5dfd8] px-3 text-sm font-bold text-[#506057] transition hover:border-[#9bb5a5] hover:bg-[#f5f8f5] focus:outline-none focus:ring-2 focus:ring-[#5a9274] focus:ring-offset-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar