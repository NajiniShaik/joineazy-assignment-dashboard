export const mockUsers = [
  {
    id: 'user-001',
    name: 'Professor',
    email: 'professor@campus.edu',
    role: 'admin',
  },
  {
    id: 'user-002',
    name: 'Rahul',
    email: 'rahul@student.campus.edu',
    role: 'student',
  },
  {
    id: 'user-003',
    name: 'Akhil',
    email: 'akhil@student.campus.edu',
    role: 'student',
  },
  {
    id: 'user-004',
    name: 'Sara',
    email: 'sara@student.campus.edu',
    role: 'student',
  },
]

export const mockCourses = [
  {
    id: 'course-001',
    name: 'Front-end Studio',
    code: 'WEB 204',
    term: 'Fall 2026',
    professorId: 'user-001',
    description: 'Build thoughtful, accessible web experiences from the first wireframe to the final interaction.',
    color: 'mint',
  },
  {
    id: 'course-002',
    name: 'Interface Engineering',
    code: 'UI 310',
    term: 'Fall 2026',
    professorId: 'user-001',
    description: 'Turn component systems, interaction patterns, and product thinking into polished interfaces.',
    color: 'coral',
  },
]

export const mockAssignments = [
  {
    id: 'assignment-001',
    title: 'Responsive Portfolio Landing Page',
    description:
      'Build a responsive portfolio landing page using semantic HTML, CSS Grid, and accessible navigation.',
    dueDate: '2026-10-02',
    dueTime: '23:59',
    courseId: 'course-001',
    submissionType: 'individual',
    driveLink:
      'https://drive.google.com/drive/u/0/search?q=Responsive%20Portfolio%20Landing%20Page',
    createdBy: 'user-001',
  },
  {
    id: 'assignment-002',
    title: 'JavaScript Form Validator',
    description:
      'Create a client-side registration form with reusable validation rules and clear error messages.',
    dueDate: '2026-10-09',
    dueTime: '23:59',
    courseId: 'course-001',
    submissionType: 'group',
    driveLink:
      'https://drive.google.com/drive/u/0/search?q=JavaScript%20Form%20Validator',
    createdBy: 'user-001',
  },
  {
    id: 'assignment-003',
    title: 'React Component Library',
    description:
      'Design a small set of reusable React components and document their supported props and states.',
    dueDate: '2026-10-16',
    dueTime: '23:59',
    courseId: 'course-002',
    submissionType: 'individual',
    driveLink:
      'https://drive.google.com/drive/u/0/search?q=React%20Component%20Library',
    createdBy: 'user-001',
  },
  {
    id: 'assignment-004',
    title: 'Dashboard Usability Review',
    description:
      'Evaluate a dashboard interface and submit a short report with findings, evidence, and recommendations.',
    dueDate: '2026-10-23',
    dueTime: '23:59',
    courseId: 'course-002',
    submissionType: 'group',
    driveLink:
      'https://drive.google.com/drive/u/0/search?q=Dashboard%20Usability%20Review',
    createdBy: 'user-001',
  },
]

export const mockSubmissions = [
  {
    id: 'submission-001',
    assignmentId: 'assignment-001',
    studentId: 'user-002',
    submitted: true,
    submittedAt: '2026-09-28T14:30:00.000Z',
  },
  {
    id: 'submission-002',
    assignmentId: 'assignment-002',
    studentId: 'user-002',
    submitted: false,
    submittedAt: null,
  },
  {
    id: 'submission-003',
    assignmentId: 'assignment-003',
    studentId: 'user-002',
    submitted: false,
    submittedAt: null,
  },
  {
    id: 'submission-004',
    assignmentId: 'assignment-004',
    studentId: 'user-002',
    submitted: false,
    submittedAt: null,
  },
  {
    id: 'submission-005',
    assignmentId: 'assignment-001',
    studentId: 'user-003',
    submitted: true,
    submittedAt: '2026-09-30T16:45:00.000Z',
  },
  {
    id: 'submission-006',
    assignmentId: 'assignment-002',
    studentId: 'user-003',
    submitted: false,
    submittedAt: null,
  },
  {
    id: 'submission-007',
    assignmentId: 'assignment-003',
    studentId: 'user-003',
    submitted: false,
    submittedAt: null,
  },
  {
    id: 'submission-008',
    assignmentId: 'assignment-004',
    studentId: 'user-003',
    submitted: false,
    submittedAt: null,
  },
  {
    id: 'submission-009',
    assignmentId: 'assignment-001',
    studentId: 'user-004',
    submitted: true,
    submittedAt: '2026-09-29T11:20:00.000Z',
  },
  {
    id: 'submission-010',
    assignmentId: 'assignment-002',
    studentId: 'user-004',
    submitted: false,
    submittedAt: null,
  },
  {
    id: 'submission-011',
    assignmentId: 'assignment-003',
    studentId: 'user-004',
    submitted: true,
    submittedAt: '2026-10-14T10:40:00.000Z',
  },
  {
    id: 'submission-012',
    assignmentId: 'assignment-004',
    studentId: 'user-004',
    submitted: false,
    submittedAt: null,
  },
]

export const mockGroups = [
  {
    id: 'group-001',
    name: 'Pixel Pioneers',
    courseId: 'course-001',
    leaderId: 'user-002',
    memberIds: ['user-002', 'user-003'],
  },
]
