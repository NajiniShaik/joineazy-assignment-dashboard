import ProgressBar from './ProgressBar.jsx'

function StudentSubmissionRow({ student, submission }) {
  const isSubmitted = submission?.submitted === true
  const percentage = isSubmitted ? 100 : 0

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-slate-900">{student.name}</p>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isSubmitted
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {isSubmitted ? 'Submitted' : 'Pending'}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <ProgressBar percentage={percentage} />
        </div>
        <span className="w-10 text-right text-sm font-semibold text-slate-600">
          {percentage}%
        </span>
      </div>
    </div>
  )
}

export default StudentSubmissionRow