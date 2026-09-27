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

export const mockAssignments = [
  {
    id: 'assignment-001',
    title: 'Responsive Portfolio Landing Page',
    description:
      'Build a responsive portfolio landing page using semantic HTML, CSS Grid, and accessible navigation.',
    dueDate: '2026-10-02',
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
    submitted: true,
    submittedAt: '2026-10-05T09:15:00.000Z',
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
    submitted: true,
    submittedAt: '2026-10-07T13:05:00.000Z',
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
