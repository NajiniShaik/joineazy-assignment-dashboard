import {
  mockAssignments,
  mockSubmissions,
  mockUsers,
} from '../data/mockData.js'

const storageKeys = {
  users: 'assignment-dashboard-users',
  assignments: 'assignment-dashboard-assignments',
  submissions: 'assignment-dashboard-submissions',
  currentUser: 'assignment-dashboard-current-user',
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data))
}

function readFromStorage(key, fallbackValue) {
  const storedValue = localStorage.getItem(key)

  if (!storedValue) {
    const initialValue = cloneData(fallbackValue)
    localStorage.setItem(key, JSON.stringify(initialValue))
    return initialValue
  }

  try {
    return JSON.parse(storedValue)
  } catch {
    const initialValue = cloneData(fallbackValue)
    localStorage.setItem(key, JSON.stringify(initialValue))
    return initialValue
  }
}

function writeToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function migratePlaceholderDriveLinks(assignments) {
  let hasChanges = false

  const migratedAssignments = assignments.map((assignment) => {
    const titleSlug = assignment.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const oldPlaceholderLink = `https://drive.google.com/drive/folders/${titleSlug}`

    if (assignment.driveLink !== oldPlaceholderLink) {
      return assignment
    }

    hasChanges = true
    const searchUrl = new URL('https://drive.google.com/drive/u/0/search')
    searchUrl.searchParams.set('q', assignment.title)

    return { ...assignment, driveLink: searchUrl.toString() }
  })

  if (hasChanges) {
    saveAssignments(migratedAssignments)
  }

  return migratedAssignments
}

export function getUsers() {
  return readFromStorage(storageKeys.users, mockUsers)
}

export function getAssignments() {
  const assignments = readFromStorage(storageKeys.assignments, mockAssignments)
  return migratePlaceholderDriveLinks(assignments)
}

export function saveAssignments(assignments) {
  writeToStorage(storageKeys.assignments, assignments)
}

export function getSubmissions() {
  return readFromStorage(storageKeys.submissions, mockSubmissions)
}

export function saveSubmissions(submissions) {
  writeToStorage(storageKeys.submissions, submissions)
}

export function saveAssignmentWithStudentSubmissions(assignment, students) {
  const submissions = students.map((student) => ({
    id: `submission-${assignment.id}-${student.id}`,
    assignmentId: assignment.id,
    studentId: student.id,
    submitted: false,
    submittedAt: null,
  }))

  saveAssignments([...getAssignments(), assignment])
  saveSubmissions([...getSubmissions(), ...submissions])

  return submissions
}

export function updateSubmission(studentId, assignmentId, updates) {
  const submissions = getSubmissions()
  const submissionIndex = submissions.findIndex(
    (submission) =>
      submission.studentId === studentId &&
      submission.assignmentId === assignmentId,
  )

  if (submissionIndex === -1) {
    return null
  }

  const updatedSubmission = {
    ...submissions[submissionIndex],
    ...updates,
  }
  const updatedSubmissions = [...submissions]
  updatedSubmissions[submissionIndex] = updatedSubmission
  saveSubmissions(updatedSubmissions)

  return updatedSubmission
}

export function getCurrentLoggedInUser() {
  const storedUser = localStorage.getItem(storageKeys.currentUser)
  return storedUser ? JSON.parse(storedUser) : null
}

export function saveCurrentLoggedInUser(user) {
  writeToStorage(storageKeys.currentUser, user)
}

export function saveCurrentUser(user) {
  saveCurrentLoggedInUser(user)
}

export function clearCurrentUser() {
  localStorage.removeItem(storageKeys.currentUser)
}

export function resetDemoData() {
  writeToStorage(storageKeys.users, cloneData(mockUsers))
  writeToStorage(storageKeys.assignments, cloneData(mockAssignments))
  writeToStorage(storageKeys.submissions, cloneData(mockSubmissions))
  clearCurrentUser()
}
