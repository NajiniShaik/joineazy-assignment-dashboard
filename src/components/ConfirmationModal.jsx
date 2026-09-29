import { useEffect } from 'react'

function ConfirmationModal({
  assignment,
  step,
  onCancel,
  onNext,
  onBack,
  onConfirm,
}) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onCancel])

  if (!assignment) {
    return null
  }

  const titleId = `confirmation-title-${assignment.id}`
  const isFirstStep = step === 1

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#668071]">
          Submission confirmation {step} of 2
        </p>
        <h2 id={titleId} className="mt-3 text-2xl font-bold text-slate-900">
          {isFirstStep ? 'Have you submitted this assignment?' : 'Are you sure?'}
        </h2>
        <p className="mt-4 text-sm font-semibold text-slate-800">
          {assignment.title}
        </p>
        <p className="mt-2 leading-6 text-slate-600">
          {isFirstStep
            ? 'Confirm that you have completed and submitted your work for this assignment.'
            : 'Once you confirm, this assignment will be marked as submitted.'}
        </p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={isFirstStep ? onCancel : onBack}
            className="min-h-11 rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isFirstStep ? 'Cancel' : 'Back'}
          </button>
          <button
            type="button"
            onClick={isFirstStep ? onNext : onConfirm}
            className="min-h-11 rounded-lg bg-[#27654c] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#1d523b] focus:outline-none focus:ring-2 focus:ring-[#5a9274] focus:ring-offset-2"
          >
            {isFirstStep ? 'Yes, I have submitted' : 'Confirm Submission'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal