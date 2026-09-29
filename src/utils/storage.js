import {
  mockAssignments,
  mockCourses,
  mockGroups,
  mockSubmissions,
  mockUsers,
} from '../data/mockData.js'

const storageKeys = {
  users: 'assignment-dashboard-users',
  assignments: 'assignment-dashboard-assignments',
  submissions: 'assignment-dashboard-submissions',
  groups: 'assignment-dashboard-groups',
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

export function registerStudent(name, email) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    return null
  }

  const student = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    role: 'student',
  }
  const submissions = getAssignments().map((assignment) => ({
    id: `submission-${assignment.id}-${student.id}`,
    assignmentId: assignment.id,
    studentId: student.id,
    submitted: false,
    submittedAt: null,
  }))

  writeToStorage(storageKeys.users, [...users, student])
  saveSubmissions([...getSubmissions(), ...submissions])
  return student
}

export function getAssignments() {
  const assignments = readFromStorage(storageKeys.assignments, mockAssignments)
  return migratePlaceholderDriveLinks(assignments).map((assignment) => ({
    dueTime: '23:59',
    courseId: mockCourses[0].id,
    submissionType: 'individual',
    ...assignment,
  }))
}

export function getCourses() {
  return readFromStorage('assignment-dashboard-courses', mockCourses)
}

export function getGroups() {
  return readFromStorage(storageKeys.groups, mockGroups)
}

export function saveGroups(groups) {
  writeToStorage(storageKeys.groups, groups)
}

export function createGroup(group) {
  const newGroup = { id: `group-${Date.now()}`, ...group }
  const groups = [...getGroups(), newGroup]
  saveGroups(groups)
  return newGroup
}

export function joinGroup(groupId, studentId) {
  const groups = getGroups()
  const groupIndex = groups.findIndex((group) => group.id === groupId)

  if (groupIndex === -1) {
    return null
  }

  const group = groups[groupIndex]
  if (group.memberIds.includes(studentId)) {
    return group
  }

  const updatedGroup = { ...group, memberIds: [...group.memberIds, studentId] }
  groups[groupIndex] = updatedGroup
  saveGroups(groups)
  return updatedGroup
}

export function saveAssignments(assignments) {
  writeToStorage(storageKeys.assignments, assignments)
}

export function updateAssignment(assignmentId, updates) {
  const assignments = getAssignments()
  const assignmentIndex = assignments.findIndex(
    (assignment) => assignment.id === assignmentId,
  )

  if (assignmentIndex === -1) {
    return null
  }

  const updatedAssignment = { ...assignments[assignmentIndex], ...updates }
  assignments[assignmentIndex] = updatedAssignment
  saveAssignments(assignments)
  return updatedAssignment
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
  writeToStorage(storageKeys.groups, cloneData(mockGroups))
  clearCurrentUser()
}
