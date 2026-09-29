
# Joineazy | Learning workspace

Joineazy is a responsive student, group, and assignment management frontend. It provides student and professor workspaces, course-based assignment navigation, group acknowledgement workflows, and class submission analytics. Demo data and account state persist in the browser with `localStorage`.

This project was built as the Joineazy Frontend Intern assignment using React, React Router, JavaScript, Vite, and Tailwind CSS.

## Features

### Student

- Demo sign-in plus validated student registration
- Semester overview with course, assignment, completed, and pending counts
- Course pages with assignment lists and progress
- Assignment details with description, exact deadline, submission type, and resource link
- Individual acknowledgement with a two-step confirmation and timestamp
- Group creation/joining with leader/member roles
- Group acknowledgement restricted to the leader and shared with all members
- Clear no-group prompt and direct access to group management

### Professor

- Course overview and course-specific assignment management
- Assignment creation and editing with field validation
- Search and course filtering
- Assignment details with submission roster and analytics
- Submitted/pending counts and progress bars
- New assignments create pending submission records for the student roster

## Tech Stack

- React.js
- React Router
- Vite
- JavaScript
- HTML
- CSS
- Tailwind CSS
- localStorage
- ESLint

## Demo Login

The sign-in screen offers the included professor/student demo profiles. Students can also create a local demo profile; neither flow provides production authentication.

### Professor / Admin

- Name: `Professor`
- Email: `professor@campus.edu`
- Role: `admin`

### Students

- Name: `Rahul`
- Email: `rahul@student.campus.edu`
- Role: `student`

- Name: `Akhil`
- Email: `akhil@student.campus.edu`
- Role: `student`

- Name: `Sara`
- Email: `sara@student.campus.edu`
- Role: `student`

These users and their roles are defined in `src/data/mockData.js`.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NajiniShaik/joineazy-assignment-dashboard.git
```

### 2. Navigate into the project

```bash
cd Assignment
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

### Validation commands

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

## Project Structure

```text
src/
├── components/
│   ├── AssignmentCard.jsx
│   ├── AssignmentForm.jsx
│   ├── ConfirmationModal.jsx
│   ├── CourseCard.jsx
│   ├── Navbar.jsx
│   ├── ProgressBar.jsx
│   ├── StatCard.jsx
│   └── StudentSubmissionRow.jsx
├── data/
│   └── mockData.js
├── pages/
│   ├── Login.jsx
│   ├── ProfessorWorkspace.jsx
│   └── StudentWorkspace.jsx
├── utils/
│   └── storage.js
├── App.jsx
├── index.css
└── main.jsx
```

## Architecture

The application uses a component-based React UI. `App.jsx` restores the current demo profile and renders its role-specific workspace:

- No current user: render `Login` with sign-in and student registration modes
- Student user: render `StudentWorkspace`
- Professor (`admin`) user: render `ProfessorWorkspace`

Course, assignment, student, group, and submission data use small helpers in `src/utils/storage.js`. Reusable components handle navigation, course and assignment cards, statistics, progress bars, forms, dialogs, and roster rows.

No backend is required for this assignment.

The main data relationship is:

```text
Course
├── Assignment
├── Student group
└── Submission
```

A submission connects an assignment and a student using `assignmentId` and `studentId`. Group acknowledgements update every member's submission record, while the UI exposes the action only to the group leader.

## Data Flow

### Student submission

```text
Student
→ selects assignment
→ completes two confirmation steps
→ storage updates the matching submission
→ dashboard recalculates progress
```

### Professor assignment management

Creating an assignment stores its course, deadline time, submission type, and resource link, then creates pending records for the roster. Editing updates the assignment while preserving acknowledgement records.

### Group acknowledgement

The leader confirms through the two-step dialog. The shared status and timestamp are written to each member's submission record and reflected in both workspaces.

## Design Decisions

- **localStorage instead of a backend:** The assignment does not require a backend, so localStorage provides simple client-side persistence for the demo.
- **Reusable components:** Shared UI components keep cards, dialogs, navigation, progress bars, and forms consistent.
- **Role-based routing:** React Router protects the `/student` and `/professor` workspaces and redirects unauthenticated or mismatched roles. Workspace sections keep local view state to avoid unnecessary nested routing in this prototype.
- **Separate submission records:** Assignment details and student submission state are separate so each student's progress can be tracked independently.
- **Responsive Tailwind styling:** Tailwind utilities provide consistent spacing, states, responsive layouts, and accessible focus styles without adding another styling system.

## Responsive Design

The dashboards, navigation, cards, forms, and dialogs use responsive Tailwind layouts. The group-management screen was checked at a 360px mobile viewport with no horizontal overflow.

## Validation

The project has been validated with:

- ESLint
- Production build
- Professor assignment creation and editing in the browser
- Student registration with pending submission records
- Individual acknowledgement timestamps and two-step group acknowledgement with member status propagation
- No-group prompt and group creation
- Role-guarded routes, role mismatch redirects, and logout
- Mobile group-management layout without horizontal overflow

## Notes

- Authentication is simulated. Registration creates a student profile; professor access uses the included demo profile.
- No backend or database is required by the assignment.
- The original demo dataset can be restored with the existing `resetDemoData()` utility in `src/utils/storage.js`.
- Browser storage is local to the current browser and is not suitable for production authentication or shared multi-user data.
- Repository: https://github.com/NajiniShaik/joineazy-assignment-dashboard (the changes in this workspace have not been pushed).
- A deployed demo, demo video, and submission PDF still need to be created and linked.

## Future Improvements

- Real authentication
- Backend/API integration
- Database persistence
- Course creation and enrollment management
- Assignment deletion
- Real authentication and shared API/database storage
- Production OneDrive integration
