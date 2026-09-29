const courseStyles = {
  mint: 'bg-[#dff1e8] text-[#24634c]',
  coral: 'bg-[#fae5de] text-[#8a4f3d]',
}

function CourseCard({ course, assignmentCount, progress, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-xl border border-[#e3e9e5] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#9ab5a6] hover:shadow-[0_12px_30px_-24px_rgba(31,67,50,0.45)] focus:outline-none focus:ring-2 focus:ring-[#27654c] focus:ring-offset-2 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`inline-flex size-11 items-center justify-center rounded-lg text-sm font-bold ${courseStyles[course.color] || courseStyles.mint}`}>
          {course.code.slice(0, 2)}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#718078]">
          {course.code}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-[#1d3026]">{course.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-[#68756e]">{course.description}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[#edf1ee] pt-4 text-sm">
        <span className="font-medium text-[#68756e]">{assignmentCount} assignments</span>
        <span className="font-bold text-[#27654c]">{progress}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf1ee]">
        <span className="block h-full rounded-full bg-[#65a486] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#27654c]">
        Open course <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </button>
  )
}

export default CourseCard