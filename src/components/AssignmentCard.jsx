function formatDueDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(`${date}T00:00:00`))
}

function formatSubmissionDate(date) {
  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(date))
}

function AssignmentCard({ assignment, submission, onConfirmSubmission }) {
  const isSubmitted = submission?.submitted === true

  return (
    <article className="flex h-full min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-7 text-slate-900">
            {assignment.title}
          </h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isSubmitted
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {isSubmitted ? 'Submitted' : 'Not Submitted'}
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
          {assignment.description}
        </p>

        <p className="mt-5 text-sm font-medium text-slate-500">
          Due {formatDueDate(assignment.dueDate)}
        </p>

        {isSubmitted && submission.submittedAt && (
          <p className="mt-1 text-sm text-emerald-700">
            Submitted {formatSubmissionDate(submission.submittedAt)}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={assignment.driveLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex-1"
        >
          Open Assignment
        </a>

        {isSubmitted ? (
          <span className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 sm:flex-1">
            ✓ Submitted
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onConfirmSubmission(assignment)}
            className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex-1"
          >
            Confirm Submission
          </button>
        )}
      </div>
    </article>
  )
}

export default AssignmentCard