import { useState } from 'react'
import AssignmentCard from '../components/AssignmentCard.jsx'
import ConfirmationModal from '../components/ConfirmationModal.jsx'
import Navbar from '../components/Navbar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import StatCard from '../components/StatCard.jsx'
import {
  getAssignments,
  getSubmissions,
  updateSubmission,
} from '../utils/storage.js'

function StudentDashboard({ student, onLogout }) {
  const [assignments] = useState(() => getAssignments())
  const [submissions, setSubmissions] = useState(() =>
    getSubmissions().filter((submission) => submission.studentId === student.id),
  )
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [confirmationStep, setConfirmationStep] = useState(1)
  const [notice, setNotice] = useState('')

  const submittedAssignments = assignments.filter((assignment) =>
    submissions.some(
      (submission) =>
        submission.assignmentId === assignment.id && submission.submitted,
    ),
  ).length
  const totalAssignments = assignments.length
  const pendingAssignments = totalAssignments - submittedAssignments
  const completionPercentage = totalAssignments
    ? Math.round((submittedAssignments / totalAssignments) * 100)
    : 0

  function getSubmissionForAssignment(assignmentId) {
    return submissions.find(
      (submission) => submission.assignmentId === assignmentId,
    )
  }

  function handleConfirmSubmission(assignment) {
    const submission = getSubmissionForAssignment(assignment.id)

    if (!submission) {
      setNotice(
        'We could not find a submission record for this assignment. Please contact your professor.',
      )
      return
    }

    if (submission.submitted) {
      setNotice('This assignment has already been submitted.')
      return
    }

    setNotice('')
    setSelectedAssignment(assignment)
    setConfirmationStep(1)
  }

  function handleCancelConfirmation() {
    setSelectedAssignment(null)
    setConfirmationStep(1)
  }

  function handleFinalConfirmation() {
    if (!selectedAssignment) {
      return
    }

    const updatedSubmission = updateSubmission(
      student.id,
      selectedAssignment.id,
      {
        submitted: true,
        submittedAt: new Date().toISOString(),
      },
    )

    if (!updatedSubmission) {
      setNotice(
        'We could not find a submission record for this assignment. Please contact your professor.',
      )
      handleCancelConfirmation()
      return
    }

    setSubmissions((currentSubmissions) =>
      currentSubmissions.map((submission) =>
        submission.id === updatedSubmission.id
          ? updatedSubmission
          : submission,
      ),
    )
    setNotice(`“${selectedAssignment.title}” is now marked as submitted.`)
    handleCancelConfirmation()
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar user={student} onLogout={onLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Student overview
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {student.name}!
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Track your assignments and submission progress.
          </p>
        </section>

        <section
          aria-label="Assignment statistics"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard label="Total Assignments" value={totalAssignments} />
          <StatCard label="Submitted" value={submittedAssignments} />
          <StatCard label="Pending" value={pendingAssignments} />
          <StatCard label="Completion" value={`${completionPercentage}%`} />
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
                Overall progress
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Assignment Progress
              </h2>
            </div>
            <p className="text-3xl font-bold text-blue-600">
              {completionPercentage}%
            </p>
          </div>
          <div className="mt-6">
            <ProgressBar percentage={completionPercentage} />
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {submittedAssignments} of {totalAssignments} assignments completed
          </p>
        </section>

        {notice && (
          <p
            aria-live="polite"
            className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
          >
            {notice}
          </p>
        )}

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Your assignments</h2>
              <p className="mt-1 text-sm text-slate-600">
                Review your work and submit each assignment before its due date.
              </p>
            </div>
          </div>

          {assignments.length === 0 ? (
            <p className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No assignments are available yet.
            </p>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  submission={getSubmissionForAssignment(assignment.id)}
                  onConfirmSubmission={handleConfirmSubmission}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <ConfirmationModal
        assignment={selectedAssignment}
        step={confirmationStep}
        onCancel={handleCancelConfirmation}
        onNext={() => setConfirmationStep(2)}
        onBack={() => setConfirmationStep(1)}
        onConfirm={handleFinalConfirmation}
      />
    </div>
  )
}

export default StudentDashboard