
# Assignment Dashboard

Assignment Dashboard is a responsive React application for managing student assignments and reviewing submissions. It provides separate demo experiences for students and professors, with mock authentication, localStorage persistence, assignment creation, progress tracking, and a two-step submission confirmation flow.

This project was built as the Joineazy Frontend Intern assignment using React, JavaScript, Vite, and Tailwind CSS.

## Features

### Student

- Demo login and role selection
- Personal assignment dashboard
- Assignment title, description, due date, and status
- Submitted and pending assignment tracking
- Overall completion statistics and progress bar
- Google Drive/resource links
- Double-confirmation submission flow
- Submission dates after confirmation
- Submission persistence across refreshes
- Responsive mobile, tablet, and desktop UI

### Admin / Professor

- Professor dashboard
- Assignment creation with validation
- Assignment-level submitted/pending counts
- Assignment-level progress bars
- Individual student submission status
- Individual student progress bars
- Google Drive/resource links
- localStorage persistence
- Automatic pending submission records for every student when an assignment is created

## Tech Stack

- React.js
- Vite
- JavaScript
- HTML
- CSS
- Tailwind CSS
- localStorage
- ESLint

## Demo Login

The login screen uses demo role selection rather than real authentication. Select a user card and continue to enter that user's experience.

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
git clone <repository-url>
```

Replace `<repository-url>` with the GitHub repository URL.

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
│   ├── Navbar.jsx
│   ├── ProgressBar.jsx
│   ├── StatCard.jsx
│   └── StudentSubmissionRow.jsx
├── data/
│   └── mockData.js
├── pages/
│   ├── AdminDashboard.jsx
│   ├── Login.jsx
│   └── StudentDashboard.jsx
├── utils/
│   └── storage.js
├── App.jsx
├── index.css
└── main.jsx
```

## Architecture

The application uses a component-based React UI. `App.jsx` performs role-based conditional rendering:

- No current user: render `Login`
- Student user: render `StudentDashboard`
- Admin user: render `AdminDashboard`

Mock data provides the initial users, assignments, and submissions. `localStorage` acts as the persistence layer for users, assignments, submissions, and the selected demo user. Reusable components handle navigation, cards, statistics, progress bars, forms, dialogs, and student submission rows.

No backend is required for this assignment.

The main data relationship is:

```text
Assignment
└── Student
	└── Submission
```

A submission connects an assignment and a student using `assignmentId` and `studentId`. This allows the student dashboard to show only the logged-in student's records and the admin dashboard to show each student's status independently.

## Data Flow

### Student submission

```text
Student
→ selects assignment
→ completes two confirmation steps
→ storage updates the matching submission
→ dashboard recalculates progress
```

### Admin creation

```text
Admin
→ creates assignment
→ assignment is saved
→ pending submission is created for every student
→ admin and student dashboards update
```

## Design Decisions

- **localStorage instead of a backend:** The assignment does not require a backend, so localStorage provides simple client-side persistence for the demo.
- **Reusable components:** Shared UI components keep cards, dialogs, navigation, progress bars, and forms consistent.
- **Role-based rendering in `App.jsx`:** The application has only two demo roles and does not need React Router for conditional page selection.
- **Separate submission records:** Assignment details and student submission state are separate so each student's progress can be tracked independently.
- **Responsive Tailwind styling:** Tailwind utilities provide consistent spacing, states, responsive layouts, and accessible focus styles without adding another styling system.

## Responsive Design

The UI was tested at:

- 375px mobile width
- 768px tablet width
- 1440px desktop width

Horizontal overflow was checked at each size. The dashboards, assignment cards, student rows, and creation/submission dialogs adapt to smaller screens.

## Validation

The project has been validated with:

- ESLint
- Production build
- Professor/admin login flow
- Rahul, Akhil, and Sara student login flows
- Logout and refresh persistence
- Two-step student submission flow
- Admin assignment creation
- New assignment student submission records
- Admin progress updates after student submission
- Responsive checks at 375px, 768px, and 1440px
- Horizontal overflow checks

## Notes

- Authentication is simulated through demo role selection and is not real authentication.
- No backend or database is required by the assignment.
- The original demo dataset can be restored with the existing `resetDemoData()` utility in `src/utils/storage.js`.
- The clean demo dataset contains 1 admin, 3 students, 4 assignments, and 12 submission records.

## Future Improvements

- Real authentication
- Backend/API integration
- Database persistence
- Edit and delete assignments
- Real Google Drive integration
- More granular permissions
