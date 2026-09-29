import { useState } from 'react'
import AssignmentForm from '../components/AssignmentForm.jsx'
import CourseCard from '../components/CourseCard.jsx'
import Navbar from '../components/Navbar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import StatCard from '../components/StatCard.jsx'
import StudentSubmissionRow from '../components/StudentSubmissionRow.jsx'
import {
  getAssignments,
  getCourses,
  getSubmissions,
  getUsers,
  saveAssignmentWithStudentSubmissions,
  updateAssignment,
} from '../utils/storage.js'

function formatDeadline(assignment) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(`${assignment.dueDate}T${assignment.dueTime || '23:59'}`))
}

function ProfessorWorkspace({ professor, onLogout }) {
  const [courses] = useState(() => getCourses().filter((course) => course.professorId === professor.id))
  const [assignments, setAssignments] = useState(() =>
    getAssignments().filter((assignment) => assignment.createdBy === professor.id),
  )
  const [students] = useState(() => getUsers().filter((user) => user.role === 'student'))
  const [submissions, setSubmissions] = useState(() => getSubmissions())
  const [activeView, setActiveView] = useState('overview')
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')

  const selectedCourse = courses.find((course) => course.id === selectedCourseId)
  const selectedAssignment = assignments.find((assignment) => assignment.id === selectedAssignmentId)

  function getSubmission(assignmentId, studentId) {
    return submissions.find(
      (submission) =>
        submission.assignmentId === assignmentId &&
        submission.studentId === studentId,
    )
  }

  function getStats(assignment) {
    const submitted = students.filter((student) =>
      getSubmission(assignment.id, student.id)?.submitted,
    ).length
    const pending = students.length - submitted
    return {
      submitted,
      pending,
      percentage: students.length ? Math.round((submitted / students.length) * 100) : 0,
    }
  }

  const totalSubmitted = assignments.reduce((total, assignment) => total + getStats(assignment).submitted, 0)
  const totalPending = assignments.length * students.length - totalSubmitted
  const overallProgress = assignments.length && students.length
    ? Math.round((totalSubmitted / (assignments.length * students.length)) * 100)
    : 0
  const visibleAssignments = assignments.filter((assignment) => {
    const matchesSearch = `${assignment.title} ${assignment.description}`.toLowerCase().includes(search.toLowerCase())
    const matchesCourse = courseFilter === 'all' || assignment.courseId === courseFilter
    return matchesSearch && matchesCourse
  })

  function openCourse(course) {
    setSelectedCourseId(course.id)
    setActiveView('course')
  }

  function openAssignment(assignment) {
    setSelectedAssignmentId(assignment.id)
    setActiveView('assignment')
  }

  function navigateTo(view) {
    setActiveView(view)
    if (view !== 'course') setSelectedCourseId(null)
    if (view !== 'assignment') setSelectedAssignmentId(null)
  }

  function openCreateForm() {
    setEditingAssignment(null)
    setIsFormOpen(true)
  }

  function openEditForm(assignment) {
    setEditingAssignment(assignment)
    setIsFormOpen(true)
  }

  function handleCreateAssignment(values) {
    const assignment = {
      id: `assignment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...values,
      createdBy: professor.id,
    }
    const newSubmissions = saveAssignmentWithStudentSubmissions(assignment, students)
    setAssignments((current) => [...current, assignment])
    setSubmissions((current) => [...current, ...newSubmissions])
    setIsFormOpen(false)
    setNotice(`“${assignment.title}” was created successfully.`)
  }

  function handleSaveAssignment(values) {
    if (!editingAssignment) return
    const updated = updateAssignment(editingAssignment.id, values)
    if (!updated) return
    setAssignments((current) => current.map((assignment) => assignment.id === updated.id ? updated : assignment))
    setIsFormOpen(false)
    setEditingAssignment(null)
    setNotice(`“${updated.title}” was updated successfully.`)
  }

  const courseCards = courses.map((course) => {
    const courseAssignments = assignments.filter((assignment) => assignment.courseId === course.id)
    const submitted = courseAssignments.reduce((total, assignment) => total + getStats(assignment).submitted, 0)
    const total = courseAssignments.length * students.length
    return {
      course,
      assignmentCount: courseAssignments.length,
      progress: total ? Math.round((submitted / total) * 100) : 0,
    }
  })

  function renderAssignmentList(items) {
    if (!items.length) {
      return <p className="rounded-xl border border-dashed border-[#cbd7cf] bg-white p-8 text-center text-sm text-[#68756e]">No assignments found. Create one to get started.</p>
    }

    return (
      <div className="space-y-3">
        {items.map((assignment) => {
          const stats = getStats(assignment)
          const course = courses.find((item) => item.id === assignment.courseId)
          return (
            <article key={assignment.id} className="rounded-xl border border-[#e1e9e3] bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#f1f5f2] px-2.5 py-1 text-xs font-bold text-[#62756a]">{course?.code || 'Course'}</span>
                    <span className="rounded-md bg-[#f1f5f2] px-2.5 py-1 text-xs font-bold capitalize text-[#62756a]">{assignment.submissionType || 'individual'}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-[#203329]">{assignment.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#68756e]">{assignment.description}</p>
                  <p className="mt-3 text-xs font-semibold text-[#748078]">Due {formatDeadline(assignment)}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" onClick={() => openAssignment(assignment)} className="min-h-10 rounded-lg border border-[#cbd8ce] px-4 text-sm font-bold text-[#425c4c] transition hover:bg-[#f5f8f5]">View</button>
                  <button type="button" onClick={() => openEditForm(assignment)} className="min-h-10 rounded-lg bg-[#27654c] px-4 text-sm font-bold text-white transition hover:bg-[#1d523b]">Edit</button>
                </div>
              </div>
              <div className="mt-5 grid gap-4 border-t border-[#edf1ee] pt-4 sm:grid-cols-[auto_auto_minmax(180px,1fr)] sm:items-center">
                <p className="text-sm text-[#65736a]"><strong className="text-[#27654c]">{stats.submitted}</strong> submitted</p>
                <p className="text-sm text-[#65736a]"><strong className="text-[#876129]">{stats.pending}</strong> pending</p>
                <div><div className="mb-2 flex justify-between gap-3 text-xs font-semibold text-[#68756e]"><span>Class progress</span><span>{stats.percentage}%</span></div><ProgressBar percentage={stats.percentage} /></div>
              </div>
            </article>
          )
        })}
      </div>
    )
  }

  function renderAssignmentDetails(assignment) {
    const course = courses.find((item) => item.id === assignment.courseId)
    const stats = getStats(assignment)
    return (
      <section>
        <button type="button" onClick={() => setActiveView(selectedCourse ? 'course' : 'assignments')} className="mb-5 min-h-10 text-sm font-bold text-[#527362] hover:text-[#203329]">← Back to {selectedCourse ? 'course' : 'assignments'}</button>
        <article className="rounded-xl border border-[#e1e9e3] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#668071]">{course?.code} · {course?.name}</p><h1 className="mt-2 text-2xl font-bold text-[#203329] sm:text-3xl">{assignment.title}</h1></div>
            <button type="button" onClick={() => openEditForm(assignment)} className="min-h-10 rounded-lg bg-[#27654c] px-4 text-sm font-bold text-white transition hover:bg-[#1d523b]">Edit assignment</button>
          </div>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#68756e]">{assignment.description}</p>
          <div className="mt-6 grid gap-4 border-t border-[#edf1ee] pt-5 sm:grid-cols-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#7a887f]">Deadline</p><p className="mt-2 text-sm font-bold text-[#203329]">{formatDeadline(assignment)}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.1em] text-[#7a887f]">Submission type</p><p className="mt-2 text-sm font-bold capitalize text-[#203329]">{assignment.submissionType || 'individual'}</p></div>
            <a href={assignment.driveLink} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center text-sm font-bold text-[#27654c] hover:underline">Open submission link ↗</a>
          </div>
          <div className="mt-6 rounded-lg bg-[#f5f8f5] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold text-[#203329]">Submission progress</p><p className="mt-1 text-xs text-[#728078]">{stats.submitted} submitted · {stats.pending} pending</p></div><p className="text-xl font-bold text-[#27654c]">{stats.percentage}%</p></div>
            <div className="mt-3"><ProgressBar percentage={stats.percentage} /></div>
          </div>
        </article>
        <div className="mb-4 mt-8 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#77847c]">Class roster</p><h2 className="mt-1 text-xl font-bold">Student submissions</h2></div><span className="text-sm text-[#728078]">{students.length} students</span></div>
        {students.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{students.map((student) => <StudentSubmissionRow key={student.id} student={student} submission={getSubmission(assignment.id, student.id)} />)}</div> : <p className="rounded-xl border border-dashed border-[#cbd7cf] bg-white p-6 text-sm text-[#68756e]">No students are enrolled yet.</p>}
      </section>
    )
  }

  const activeNav = activeView === 'course' ? 'courses'
    : activeView === 'assignment' ? 'assignments'
      : activeView

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#203329]">
      <Navbar user={professor} onLogout={onLogout} activeView={activeNav} onNavigate={navigateTo} />
      <main className="mx-auto max-w-7xl px-4 pb-14 pt-7 sm:px-6 lg:px-8 lg:pt-10">
        {notice && <div role="status" aria-live="polite" className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-[#c8dfd0] bg-[#eaf5ee] px-4 py-3 text-sm font-medium text-[#286346]"><span>{notice}</span><button type="button" aria-label="Dismiss message" onClick={() => setNotice('')} className="px-1 text-lg leading-none">×</button></div>}

        {activeView === 'overview' && (
          <>
            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#668071]">Fall 2026 · Professor workspace</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Good morning, {professor.name.split(' ')[0]}.</h1><p className="mt-2 text-base text-[#68756e]">Your courses and class progress, all in one place.</p></div><button type="button" onClick={openCreateForm} className="min-h-11 rounded-lg bg-[#27654c] px-5 text-sm font-bold text-white transition hover:bg-[#1d523b]">＋ Create assignment</button></section>
            <section aria-label="Professor statistics" className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Courses taught" value={courses.length} detail="This semester" /><StatCard label="Assignments" value={assignments.length} detail="Across your courses" /><StatCard label="Submitted" value={totalSubmitted} detail="Student acknowledgements" /><StatCard label="Pending" value={totalPending} detail="Awaiting acknowledgement" /></section>
            <section className="mt-5 rounded-xl border border-[#e0e8e2] bg-white p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#77847c]">Class pulse</p><h2 className="mt-2 text-xl font-bold">Submission progress</h2></div><p className="text-2xl font-bold text-[#27654c]">{overallProgress}%</p></div><div className="mt-4"><ProgressBar percentage={overallProgress} /></div><p className="mt-2 text-sm text-[#728078]">{totalSubmitted} of {totalSubmitted + totalPending} student submissions acknowledged</p></section>
            <section className="mt-9"><div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#77847c]">Teaching</p><h2 className="mt-1 text-xl font-bold">Your courses</h2></div><button type="button" onClick={() => navigateTo('courses')} className="text-sm font-bold text-[#27654c] hover:underline">View courses →</button></div><div className="grid gap-4 md:grid-cols-2">{courseCards.map(({ course, assignmentCount, progress }) => <CourseCard key={course.id} course={course} assignmentCount={assignmentCount} progress={progress} onClick={() => openCourse(course)} />)}</div></section>
            <section className="mt-9"><div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#77847c]">Latest work</p><h2 className="mt-1 text-xl font-bold">Assignment overview</h2></div><button type="button" onClick={() => navigateTo('assignments')} className="text-sm font-bold text-[#27654c] hover:underline">Manage assignments →</button></div>{renderAssignmentList(assignments.slice(0, 3))}</section>
          </>
        )}

        {activeView === 'courses' && <section><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#668071]">Teaching</p><h1 className="mt-2 text-3xl font-bold">Courses taught</h1><p className="mt-2 text-[#68756e]">Open a course to manage its assignments and review student progress.</p></div><div className="grid gap-4 md:grid-cols-2">{courseCards.map(({ course, assignmentCount, progress }) => <CourseCard key={course.id} course={course} assignmentCount={assignmentCount} progress={progress} onClick={() => openCourse(course)} />)}</div></section>}

        {activeView === 'course' && selectedCourse && <section><button type="button" onClick={() => navigateTo('courses')} className="mb-5 min-h-10 text-sm font-bold text-[#527362]">← All courses</button><div className="mb-7 rounded-xl border border-[#e0e8e2] bg-white p-5 sm:p-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#668071]">{selectedCourse.code} · {selectedCourse.term}</p><h1 className="mt-2 text-3xl font-bold">{selectedCourse.name}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#68756e]">{selectedCourse.description}</p></div><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#77847c]">Course management</p><h2 className="mt-1 text-xl font-bold">Assignments</h2></div><button type="button" onClick={openCreateForm} className="min-h-10 rounded-lg bg-[#27654c] px-4 text-sm font-bold text-white">＋ Create assignment</button></div>{renderAssignmentList(assignments.filter((assignment) => assignment.courseId === selectedCourse.id))}</section>}

        {activeView === 'assignments' && <section><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#668071]">Management</p><h1 className="mt-2 text-3xl font-bold">Assignments</h1><p className="mt-2 text-[#68756e]">Create, edit, and review class submissions.</p></div><button type="button" onClick={openCreateForm} className="min-h-11 rounded-lg bg-[#27654c] px-5 text-sm font-bold text-white transition hover:bg-[#1d523b]">＋ Create assignment</button></div><div className="my-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]"><label className="sr-only" htmlFor="assignment-search">Search assignments</label><input id="assignment-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search assignments..." className="min-h-11 rounded-lg border border-[#d5dfd8] bg-white px-4 text-sm outline-none focus:border-[#5a9274] focus:ring-2 focus:ring-[#d5e7dc]" /><label className="sr-only" htmlFor="course-filter">Filter by course</label><select id="course-filter" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)} className="min-h-11 rounded-lg border border-[#d5dfd8] bg-white px-3 text-sm outline-none focus:border-[#5a9274] focus:ring-2 focus:ring-[#d5e7dc]"><option value="all">All courses</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.code}</option>)}</select></div>{renderAssignmentList(visibleAssignments)}</section>}

        {activeView === 'assignment' && selectedAssignment && renderAssignmentDetails(selectedAssignment)}
      </main>

      {isFormOpen && <AssignmentForm key={editingAssignment?.id || 'new-assignment'} onCancel={() => setIsFormOpen(false)} onCreate={handleCreateAssignment} onSave={editingAssignment ? handleSaveAssignment : undefined} initialValues={editingAssignment || undefined} courses={courses} />}
    </div>
  )
}

export default ProfessorWorkspace