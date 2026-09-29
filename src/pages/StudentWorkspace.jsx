import { useMemo, useState } from 'react'
import AssignmentCard from '../components/AssignmentCard.jsx'
import ConfirmationModal from '../components/ConfirmationModal.jsx'
import CourseCard from '../components/CourseCard.jsx'
import Navbar from '../components/Navbar.jsx'
import ProgressBar from '../components/ProgressBar.jsx'
import StatCard from '../components/StatCard.jsx'
import {
  createGroup,
  getAssignments,
  getCourses,
  getGroups,
  getSubmissions,
  getUsers,
  joinGroup,
  updateSubmission,
} from '../utils/storage.js'

function formatDeadline(assignment) {
  const deadline = new Date(`${assignment.dueDate}T${assignment.dueTime || '23:59'}`)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(deadline)
}

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

function StudentWorkspace({ student, onLogout }) {
  const [assignments] = useState(() => getAssignments())
  const [courses] = useState(() => getCourses())
  const [users] = useState(() => getUsers())
  const [submissions, setSubmissions] = useState(() => getSubmissions())
  const [groups, setGroups] = useState(() => getGroups())
  const [activeView, setActiveView] = useState('overview')
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
  const [confirmationAssignment, setConfirmationAssignment] = useState(null)
  const [confirmationStep, setConfirmationStep] = useState(1)
  const [notice, setNotice] = useState('')
  const [groupName, setGroupName] = useState('')
  const [groupCourseId, setGroupCourseId] = useState(courses[0]?.id || '')
  const [groupError, setGroupError] = useState('')

  const selectedCourse = courses.find((course) => course.id === selectedCourseId)
  const selectedAssignment = assignments.find(
    (assignment) => assignment.id === selectedAssignmentId,
  )
  const submittedCount = assignments.filter((assignment) =>
    submissions.some(
      (submission) =>
        submission.assignmentId === assignment.id &&
        submission.studentId === student.id &&
        submission.submitted,
    ),
  ).length
  const pendingCount = assignments.length - submittedCount
  const completion = assignments.length
    ? Math.round((submittedCount / assignments.length) * 100)
    : 0

  const myGroups = groups.filter((group) => group.memberIds.includes(student.id))
  const openGroups = groups.filter(
    (group) =>
      !group.memberIds.includes(student.id) &&
      !groups.some(
        (ownGroup) =>
          ownGroup.courseId === group.courseId &&
          ownGroup.memberIds.includes(student.id),
      ),
  )
  const courseAssignments = selectedCourse
    ? assignments.filter((assignment) => assignment.courseId === selectedCourse.id)
    : []

  function getSubmission(assignmentId, studentId = student.id) {
    return submissions.find(
      (submission) =>
        submission.assignmentId === assignmentId &&
        submission.studentId === studentId,
    )
  }

  function getGroupForAssignment(assignment) {
    return groups.find(
      (group) =>
        group.courseId === assignment.courseId &&
        group.memberIds.includes(student.id),
    )
  }

  function openCourse(course) {
    setSelectedCourseId(course.id)
    setActiveView('course')
  }

  function openAssignment(assignment) {
    setSelectedAssignmentId(assignment.id)
    setActiveView('assignment')
  }

  function handleStartConfirmation(assignment) {
    const group = assignment.submissionType === 'group'
      ? getGroupForAssignment(assignment)
      : null

    if (assignment.submissionType === 'group' && !group) {
      setNotice('You are not part of any group. Form or join one to submit this assignment.')
      setActiveView('groups')
      return
    }
    if (group && group.leaderId !== student.id) {
      setNotice('Only your group leader can acknowledge this submission.')
      return
    }
    if (getSubmission(assignment.id)?.submitted) {
      setNotice('This assignment has already been acknowledged.')
      return
    }

    setNotice('')
    setConfirmationAssignment(assignment)
    setConfirmationStep(1)
  }

  function closeConfirmation() {
    setConfirmationAssignment(null)
    setConfirmationStep(1)
  }

  function handleConfirmSubmission() {
    if (!confirmationAssignment) return

    const group = confirmationAssignment.submissionType === 'group'
      ? getGroupForAssignment(confirmationAssignment)
      : null
    const studentIds = group ? group.memberIds : [student.id]
    const acknowledgedAt = new Date().toISOString()
    const updatedSubmissions = studentIds
      .map((studentId) =>
        updateSubmission(studentId, confirmationAssignment.id, {
          submitted: true,
          submittedAt: acknowledgedAt,
        }),
      )
      .filter(Boolean)

    setSubmissions((current) =>
      current.map((submission) =>
        updatedSubmissions.find((updated) => updated.id === submission.id) || submission,
      ),
    )
    setNotice(`“${confirmationAssignment.title}” has been acknowledged successfully.`)
    closeConfirmation()
  }

  function handleCreateGroup(event) {
    event.preventDefault()
    const cleanName = groupName.trim()
    if (!cleanName || !groupCourseId) {
      setGroupError('Add a group name and choose a course.')
      return
    }
    if (myGroups.some((group) => group.courseId === groupCourseId)) {
      setGroupError('You already belong to a group in this course.')
      return
    }

    const group = createGroup({
      name: cleanName,
      courseId: groupCourseId,
      leaderId: student.id,
      memberIds: [student.id],
    })
    setGroups((current) => [...current, group])
    setGroupName('')
    setGroupError('')
    setNotice(`${group.name} is ready. You are the group leader.`)
  }

  function handleJoinGroup(group) {
    const updatedGroup = joinGroup(group.id, student.id)
    if (!updatedGroup) return
    setGroups((current) => current.map((item) => item.id === group.id ? updatedGroup : item))
    setNotice(`You joined ${group.name}.`)
  }

  const courseCards = useMemo(() => courses.map((course) => {
    const courseWork = assignments.filter((assignment) => assignment.courseId === course.id)
    const courseSubmitted = courseWork.filter((assignment) =>
      submissions.some((submission) =>
        submission.assignmentId === assignment.id &&
        submission.studentId === student.id &&
        submission.submitted,
      ),
    ).length
    return {
      course,
      assignments: courseWork,
      progress: courseWork.length ? Math.round((courseSubmitted / courseWork.length) * 100) : 0,
    }
  }), [assignments, courses, submissions, student.id])

  function navigateTo(view) {
    setActiveView(view)
    if (view !== 'course') setSelectedCourseId(null)
    if (view !== 'assignment') setSelectedAssignmentId(null)
  }

  function renderCourseCards() {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {courseCards.map(({ course, assignments: courseWork, progress }) => (
          <CourseCard
            key={course.id}
            course={course}
            assignmentCount={courseWork.length}
            progress={progress}
            onClick={() => openCourse(course)}
          />
        ))}
      </div>
    )
  }

  function renderGroups() {
    return (
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#77847c]">Your teams</p>
            <h2 className="mt-1 text-xl font-bold text-[#203329]">Groups you belong to</h2>
          </div>
          {myGroups.length ? myGroups.map((group) => {
            const course = courses.find((item) => item.id === group.courseId)
            const leader = group.leaderId === student.id
            return (
              <article key={group.id} className="rounded-xl border border-[#e1e9e3] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#203329]">{group.name}</h3>
                    <p className="mt-1 text-sm text-[#728078]">{course?.code} · {course?.name}</p>
                  </div>
                  <span className="rounded-full bg-[#e6f2eb] px-3 py-1 text-xs font-bold text-[#27654c]">
                    {leader ? 'Group leader' : 'Member'}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.memberIds.map((memberId) => {
                    const member = users.find((item) => item.id === memberId)
                    return <span key={memberId} className="rounded-md bg-[#f3f6f4] px-3 py-1.5 text-xs font-semibold text-[#57665d]">{member?.name || 'Student'}{memberId === group.leaderId ? ' · Leader' : ''}</span>
                  })}
                </div>
              </article>
            )
          }) : (
            <p className="rounded-xl border border-dashed border-[#cbd7cf] bg-white p-6 text-sm text-[#68756e]">You have not joined a group yet.</p>
          )}

          <div className="pt-3">
            <h2 className="text-xl font-bold text-[#203329]">Groups looking for members</h2>
            <div className="mt-3 space-y-3">
              {openGroups.length ? openGroups.map((group) => {
                const course = courses.find((item) => item.id === group.courseId)
                const leader = users.find((item) => item.id === group.leaderId)
                return (
                  <div key={group.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e1e9e3] bg-white p-4">
                    <div><p className="font-semibold text-[#203329]">{group.name}</p><p className="mt-1 text-sm text-[#728078]">{course?.code} · Led by {leader?.name}</p></div>
                    <button type="button" onClick={() => handleJoinGroup(group)} className="min-h-10 rounded-lg border border-[#9ab5a6] px-4 text-sm font-bold text-[#27654c] transition hover:bg-[#edf5ef]">Join group</button>
                  </div>
                )
              }) : <p className="rounded-xl border border-dashed border-[#cbd7cf] bg-white p-5 text-sm text-[#68756e]">No other groups are open right now.</p>}
            </div>
          </div>
        </section>

        <section className="h-fit rounded-xl border border-[#dce8df] bg-[#eef5ef] p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#527362]">Start a team</p>
          <h2 className="mt-2 text-xl font-bold text-[#203329]">Create a group</h2>
          <p className="mt-2 text-sm leading-6 text-[#68756e]">You will be the leader and can invite classmates to join.</p>
          <form className="mt-5 space-y-4" onSubmit={handleCreateGroup}>
            <div>
              <label htmlFor="group-name" className="text-sm font-semibold text-[#34483b]">Group name</label>
              <input id="group-name" value={groupName} onChange={(event) => setGroupName(event.target.value)} placeholder="e.g. Studio North" className="mt-2 min-h-11 w-full rounded-lg border border-[#d4dfd7] bg-white px-3 text-sm outline-none focus:border-[#5a9274] focus:ring-2 focus:ring-[#d5e7dc]" />
            </div>
            <div>
              <label htmlFor="group-course" className="text-sm font-semibold text-[#34483b]">Course</label>
              <select id="group-course" value={groupCourseId} onChange={(event) => setGroupCourseId(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-[#d4dfd7] bg-white px-3 text-sm outline-none focus:border-[#5a9274] focus:ring-2 focus:ring-[#d5e7dc]">
                {courses.map((course) => <option key={course.id} value={course.id}>{course.code} · {course.name}</option>)}
              </select>
            </div>
            {groupError && <p role="alert" className="text-sm font-medium text-[#a1473f]">{groupError}</p>}
            <button type="submit" className="min-h-11 w-full rounded-lg bg-[#27654c] px-4 text-sm font-bold text-white transition hover:bg-[#1d523b]">Create group</button>
          </form>
        </section>
      </div>
    )
  }

  function renderAssignmentDetails(assignment) {
    const course = courses.find((item) => item.id === assignment.courseId)
    const submission = getSubmission(assignment.id)
    const group = assignment.submissionType === 'group' ? getGroupForAssignment(assignment) : null
    const isLeader = group?.leaderId === student.id
    const isAcknowledged = assignment.submissionType === 'group'
      ? group?.memberIds.some((memberId) => getSubmission(assignment.id, memberId)?.submitted)
      : submission?.submitted

    return (
      <div className="mx-auto max-w-4xl">
        <button type="button" onClick={() => setActiveView(selectedCourse ? 'course' : 'overview')} className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#527362] hover:text-[#203329]">← Back to {selectedCourse ? 'course' : 'overview'}</button>
        <article className="overflow-hidden rounded-xl border border-[#e0e8e2] bg-white">
          <div className="border-b border-[#e9efea] bg-[#f8faf8] px-5 py-6 sm:px-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#668071]">{course?.code} · {course?.name}</p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
              <h1 className="max-w-2xl text-2xl font-bold leading-tight text-[#203329] sm:text-3xl">{assignment.title}</h1>
              <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${isAcknowledged ? 'bg-[#e4f2e8] text-[#27654c]' : 'bg-[#fbf0df] text-[#876129]'}`}>{isAcknowledged ? 'Acknowledged' : 'Pending submission'}</span>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#65736a]">{assignment.description}</p>
          </div>
          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-b border-[#e9efea] p-5 sm:p-7 md:border-r">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a887f]">Deadline</p>
              <p className="mt-2 font-bold text-[#203329]">{formatDeadline(assignment)}</p>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-[#7a887f]">Submission type</p>
              <p className="mt-2 font-bold capitalize text-[#203329]">{assignment.submissionType || 'individual'}</p>
            </div>
            <div className="p-5 sm:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a887f]">Submission progress</p>
              <div className="mt-3"><ProgressBar percentage={isAcknowledged ? 100 : 0} /></div>
              <p className="mt-2 text-sm text-[#65736a]">{isAcknowledged ? 'Submission acknowledged' : 'Waiting for submission acknowledgement'}</p>
              {isAcknowledged && submission?.submittedAt && <p className="mt-2 text-xs font-medium text-[#397254]">Acknowledged {formatTimestamp(submission.submittedAt)}</p>}
            </div>
          </div>
          <div className="border-t border-[#e9efea] px-5 py-5 sm:px-7">
            <a href={assignment.driveLink} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#b9c9bf] px-4 text-sm font-bold text-[#315d46] transition hover:bg-[#f3f8f4]">Open submission link <span aria-hidden="true">↗</span></a>
            {assignment.submissionType === 'group' && !group && (
              <div className="mt-5 rounded-lg border border-[#ead9b7] bg-[#fcf7eb] p-4">
                <p className="text-sm font-semibold leading-6 text-[#765a2d]">You are not part of any group. Form or join one to submit this assignment.</p>
                <button type="button" onClick={() => navigateTo('groups')} className="mt-3 text-sm font-bold text-[#27654c] underline underline-offset-4">Go to group management</button>
              </div>
            )}
            {assignment.submissionType === 'group' && group && !isLeader && (
              <p className="mt-5 rounded-lg bg-[#f2f6f3] p-4 text-sm leading-6 text-[#53645a]">{isAcknowledged ? `${group.name} has acknowledged this assignment.` : `${group.name} has not acknowledged this assignment yet. Your group leader, ${users.find((item) => item.id === group.leaderId)?.name}, will submit the acknowledgement.`}</p>
            )}
            {assignment.submissionType === 'group' && group && isLeader && isAcknowledged && (
              <p className="mt-5 rounded-lg bg-[#eaf4ed] p-4 text-sm font-semibold text-[#27654c]">Your group has acknowledged this assignment. All {group.memberIds.length} members can see this status.</p>
            )}
            {assignment.submissionType === 'individual' && isAcknowledged && (
              <p className="mt-5 rounded-lg bg-[#eaf4ed] p-4 text-sm font-semibold text-[#27654c]">You acknowledged this submission on {formatTimestamp(submission.submittedAt)}.</p>
            )}
            {!isAcknowledged && (assignment.submissionType === 'individual' || isLeader) && (
              <button type="button" onClick={() => handleStartConfirmation(assignment)} className="mt-5 min-h-11 rounded-lg bg-[#27654c] px-5 text-sm font-bold text-white transition hover:bg-[#1d523b]">Yes, I have submitted</button>
            )}
          </div>
        </article>
      </div>
    )
  }

  const greetingName = student.name.split(' ')[0]
  const viewHeading = activeView === 'courses' ? 'Your courses'
    : activeView === 'groups' ? 'Group workspace'
      : activeView === 'course' ? selectedCourse?.name
        : activeView === 'assignment' ? 'Assignment details'
          : 'Your semester, in focus'

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#203329]">
      <Navbar user={student} onLogout={onLogout} activeView={activeView} onNavigate={navigateTo} />
      <main className="mx-auto max-w-7xl px-4 pb-14 pt-7 sm:px-6 lg:px-8 lg:pt-10">
        {notice && (
          <div role="status" aria-live="polite" className="mb-6 flex items-start justify-between gap-3 rounded-lg border border-[#c8dfd0] bg-[#eaf5ee] px-4 py-3 text-sm font-medium text-[#286346]">
            <span>{notice}</span>
            <button type="button" aria-label="Dismiss message" onClick={() => setNotice('')} className="px-1 text-lg leading-none">×</button>
          </div>
        )}

        {(activeView === 'overview' || activeView === 'courses') && (
          <>
            <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#668071]">Fall 2026 · Student workspace</p>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#203329] sm:text-4xl">{activeView === 'overview' ? `Good to see you, ${greetingName}.` : 'Your courses'}</h1>
                <p className="mt-2 text-base text-[#68756e]">{activeView === 'overview' ? 'A clear view of what is moving and what is next.' : 'Your classes and assignment progress for this semester.'}</p>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-[#e0e8e2] bg-white px-4 py-3">
                <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#e4f1e8] text-sm font-bold text-[#27654c]">{student.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                <div><p className="text-sm font-bold text-[#203329]">{student.name}</p><p className="text-xs text-[#718078]">Student · Fall 2026</p></div>
              </div>
            </section>

            {activeView === 'overview' && (
              <>
                <section aria-label="Assignment summary" className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard label="Courses enrolled" value={courses.length} detail="This semester" />
                  <StatCard label="Total assignments" value={assignments.length} detail="Across your courses" />
                  <StatCard label="Completed" value={submittedCount} detail="Acknowledged submissions" />
                  <StatCard label="Still to submit" value={pendingCount} detail="Keep your momentum" />
                </section>
                <section className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_0.8fr]">
                  <div className="rounded-xl border border-[#dfe8e1] bg-white p-5 sm:p-6">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div><p className="text-xs font-bold uppercase tracking-[0.13em] text-[#77847c]">Semester progress</p><h2 className="mt-2 text-xl font-bold text-[#203329]">You’re building a strong rhythm</h2></div>
                      <p className="text-3xl font-bold text-[#27654c]">{completion}<span className="text-base">%</span></p>
                    </div>
                    <div className="mt-5"><ProgressBar percentage={completion} /></div>
                    <p className="mt-3 text-sm text-[#728078]">{submittedCount} of {assignments.length} assignments acknowledged</p>
                  </div>
                  <div className="rounded-xl bg-[#294e3b] p-5 text-white sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#c4ddcd]">Next step</p>
                    <h2 className="mt-2 text-xl font-bold">Stay in sync with your team</h2>
                    <p className="mt-2 text-sm leading-6 text-[#d3e2d8]">Group submissions are shared, but only the group leader can acknowledge them.</p>
                    <button type="button" onClick={() => navigateTo('groups')} className="mt-5 min-h-10 rounded-lg bg-white px-4 text-sm font-bold text-[#294e3b] transition hover:bg-[#e9f2ec]">Open groups</button>
                  </div>
                </section>
              </>
            )}

            <section className="mt-9">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#77847c]">Coursework</p><h2 className="mt-1 text-xl font-bold text-[#203329]">{activeView === 'overview' ? 'Your courses' : 'All courses'}</h2></div>
                {activeView === 'overview' && <button type="button" onClick={() => navigateTo('courses')} className="text-sm font-bold text-[#27654c] hover:underline">View all courses →</button>}
              </div>
              {renderCourseCards()}
            </section>

            {activeView === 'overview' && (
              <section className="mt-9">
                <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#77847c]">Keep moving</p><h2 className="mt-1 text-xl font-bold text-[#203329]">Assignments to review</h2></div><span className="text-sm text-[#728078]">{pendingCount} pending</span></div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {assignments.filter((assignment) => !getSubmission(assignment.id)?.submitted).slice(0, 4).map((assignment) => (
                    <AssignmentCard key={assignment.id} assignment={assignment} submission={getSubmission(assignment.id)} group={getGroupForAssignment(assignment)} onOpenDetails={() => openAssignment(assignment)} />
                  ))}
                  {pendingCount === 0 && <p className="rounded-xl border border-dashed border-[#cbd7cf] bg-white p-6 text-sm text-[#68756e]">Everything is submitted. You’re all caught up.</p>}
                </div>
              </section>
            )}
          </>
        )}

        {activeView === 'groups' && (
          <section><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#668071]">Collaborate</p><h1 className="mt-2 text-3xl font-bold tracking-tight">{viewHeading}</h1><p className="mt-2 text-[#68756e]">Create a team or join classmates for group assignments.</p></div>{renderGroups()}</section>
        )}

        {activeView === 'course' && selectedCourse && (
          <section>
            <button type="button" onClick={() => navigateTo('courses')} className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#527362] hover:text-[#203329]">← All courses</button>
            <div className="rounded-xl border border-[#e0e8e2] bg-white p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#668071]">{selectedCourse.code} · {selectedCourse.term}</p><h1 className="mt-2 text-3xl font-bold text-[#203329]">{selectedCourse.name}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#68756e]">{selectedCourse.description}</p></div><div className="min-w-36 rounded-lg bg-[#eef5ef] px-4 py-3"><p className="text-xs font-semibold text-[#62756a]">Course progress</p><p className="mt-1 text-2xl font-bold text-[#27654c]">{courseCards.find((item) => item.course.id === selectedCourse.id)?.progress || 0}%</p></div></div>
            </div>
            <div className="mb-4 mt-8 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#77847c]">Coursework</p><h2 className="mt-1 text-xl font-bold">Assignments</h2></div><span className="text-sm text-[#728078]">{courseAssignments.length} total</span></div>
            {courseAssignments.length ? <div className="grid gap-4 lg:grid-cols-2">{courseAssignments.map((assignment) => <AssignmentCard key={assignment.id} assignment={assignment} submission={getSubmission(assignment.id)} group={getGroupForAssignment(assignment)} onOpenDetails={() => openAssignment(assignment)} />)}</div> : <p className="rounded-xl border border-dashed border-[#cbd7cf] bg-white p-8 text-center text-sm text-[#68756e]">No assignments have been posted for this course yet.</p>}
          </section>
        )}

        {activeView === 'assignment' && selectedAssignment && renderAssignmentDetails(selectedAssignment)}
      </main>

      <ConfirmationModal assignment={confirmationAssignment} step={confirmationStep} onCancel={closeConfirmation} onNext={() => setConfirmationStep(2)} onBack={() => setConfirmationStep(1)} onConfirm={handleConfirmSubmission} />
    </div>
  )
}

export default StudentWorkspace