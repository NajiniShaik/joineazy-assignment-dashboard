import { useState } from 'react'
import AssignmentForm from '../components/AssignmentForm.jsx'
import Navbar from '../components/Navbar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import StatCard from '../components/StatCard.jsx'
import StudentSubmissionRow from '../components/StudentSubmissionRow.jsx'
import {
  getAssignments,
  getSubmissions,
  saveAssignmentWithStudentSubmissions,
  getUsers,
} from '../utils/storage.js'

function formatDueDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(new Date(`${date}T00:00:00`))
}

function AdminDashboard({ admin, onLogout }) {
  const [notice, setNotice] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [assignments, setAssignments] = useState(() =>
    getAssignments().filter((assignment) => assignment.createdBy === admin.id),
  )
  const [students] = useState(() =>
    getUsers().filter((user) => user.role === 'student'),
  )
  const [submissions, setSubmissions] = useState(() => getSubmissions())

  function getSubmissionForStudent(assignmentId, studentId) {
    return submissions.find(
      (submission) =>
        submission.assignmentId === assignmentId &&
        submission.studentId === studentId,
    )
  }

  function getAssignmentStats(assignment) {
    const submitted = students.filter((student) =>
      getSubmissionForStudent(assignment.id, student.id)?.submitted,
    ).length
    const pending = students.length - submitted
    const percentage = students.length
      ? Math.round((submitted / students.length) * 100)
      : 0

    return { submitted, pending, percentage }
  }

  const assignmentStats = assignments.map((assignment) => ({
    assignment,
    stats: getAssignmentStats(assignment),
  }))
  const totalSubmitted = assignmentStats.reduce(
    (total, { stats }) => total + stats.submitted,
    0,
  )
  const totalPending = assignmentStats.reduce(
    (total, { stats }) => total + stats.pending,
    0,
  )

  function handleCreateAssignment(values) {
    const assignment = {
      id: `assignment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...values,
      createdBy: admin.id,
    }
    const newSubmissions = saveAssignmentWithStudentSubmissions(
      assignment,
      students,
    )

    setAssignments((currentAssignments) => [...currentAssignments, assignment])
    setSubmissions((currentSubmissions) => [
      ...currentSubmissions,
      ...newSubmissions,
    ])
    setIsFormOpen(false)
    setNotice(`“${assignment.title}” was created successfully.`)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar user={admin} onLogout={onLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Professor overview
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {admin.name}!
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Monitor assignment progress and student submissions.
          </p>
        </section>

        <section
          aria-label="Admin statistics"
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard label="Total Assignments" value={assignments.length} />
          <StatCard label="Total Students" value={students.length} />
          <StatCard label="Submitted" value={totalSubmitted} />
          <StatCard label="Pending" value={totalPending} />
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Assignment management
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Review progress for the assignments created by you.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setNotice('')
                setIsFormOpen(true)
              }}
              className="min-h-11 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Create Assignment
            </button>
          </div>

          {notice && (
            <p
              aria-live="polite"
              className="mt-5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
            >
              {notice}
            </p>
          )}

          {assignments.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No assignments have been created yet.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6">
              {assignmentStats.map(({ assignment, stats }) => (
                <article
                  key={assignment.id}
                  className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                    <div className="min-w-0 lg:max-w-2xl">
                      <h3 className="text-xl font-bold text-slate-900">
                        {assignment.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {assignment.description}
                      </p>
                      <p className="mt-4 text-sm font-medium text-slate-500">
                        Due {formatDueDate(assignment.dueDate)}
                      </p>
                    </div>

                    <a
                      href={assignment.driveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 lg:self-start"
                    >
                      Open Drive
                    </a>
                  </div>

                  <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    <div>
                      <p className="text-sm text-slate-500">Submitted</p>
                      <p className="mt-1 text-2xl font-bold text-emerald-700">
                        {stats.submitted}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Pending</p>
                      <p className="mt-1 text-2xl font-bold text-amber-700">
                        {stats.pending}
                      </p>
                    </div>
                    <div className="sm:col-span-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-slate-500">Overall progress</p>
                        <p className="text-sm font-bold text-blue-600">
                          {stats.percentage}%
                        </p>
                      </div>
                      <div className="mt-3">
                        <ProgressBar percentage={stats.percentage} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <h4 className="text-base font-semibold text-slate-900">
                      Student submissions
                    </h4>
                    {students.length === 0 ? (
                      <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                        No students are available yet.
                      </p>
                    ) : (
                      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {students.map((student) => (
                          <StudentSubmissionRow
                            key={`${assignment.id}-${student.id}`}
                            student={student}
                            submission={getSubmissionForStudent(
                              assignment.id,
                              student.id,
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {isFormOpen && (
        <AssignmentForm
          onCancel={() => setIsFormOpen(false)}
          onCreate={handleCreateAssignment}
        />
      )}
    </div>
  )
}

export default AdminDashboard