function formatDueDate(date, time = '23:59') {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(`${date}T${time}`))
}

function AssignmentCard({ assignment, submission, group, onOpenDetails }) {
  const isSubmitted = submission?.submitted === true
  const isGroupAssignment = assignment.submissionType === 'group'
  const statusLabel = isSubmitted
    ? 'Acknowledged'
    : isGroupAssignment && !group
      ? 'Group needed'
      : isGroupAssignment && group.leaderId !== submission?.studentId
        ? 'Group submission'
        : 'Pending'

  return (
    <article className="flex h-full min-w-0 flex-col rounded-xl border border-[#e1e9e3] bg-white p-5 transition hover:border-[#bdcec2] sm:p-5">
      <div className="flex flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-7 text-[#203329]">
            {assignment.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              isSubmitted
                ? 'bg-[#e4f2e8] text-[#27654c]'
                : isGroupAssignment && !group
                  ? 'bg-[#fae9e3] text-[#914e3d]'
                  : 'bg-[#fbf0df] text-[#876129]'
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-6 text-[#68756e]">
          {assignment.description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#68756e]">
          <span className="rounded-md bg-[#f2f6f3] px-2.5 py-1.5">Due {formatDueDate(assignment.dueDate, assignment.dueTime)}</span>
          <span className="rounded-md bg-[#f2f6f3] px-2.5 py-1.5 capitalize">{assignment.submissionType || 'individual'}</span>
          {isGroupAssignment && group && <span className="rounded-md bg-[#f2f6f3] px-2.5 py-1.5">{group.name}</span>}
        </div>

        {isSubmitted && submission?.submittedAt && (
          <p className="mt-3 text-xs font-medium text-[#397254]">
            Acknowledged {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(submission.submittedAt))}
          </p>
        )}
        {!isSubmitted && isGroupAssignment && group && group.leaderId !== submission?.studentId && (
          <p className="mt-3 text-xs text-[#728078]">Only the group leader can acknowledge this submission.</p>
        )}
      </div>

      <button type="button" onClick={onOpenDetails} className="mt-5 flex min-h-11 items-center justify-between rounded-lg bg-[#f0f5f1] px-4 text-sm font-bold text-[#315d46] transition hover:bg-[#e3eee6] focus:outline-none focus:ring-2 focus:ring-[#5a9274] focus:ring-offset-2">
        View assignment details <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}

export default AssignmentCard