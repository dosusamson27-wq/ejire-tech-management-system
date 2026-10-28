# Ejire Tech Dashboard Module

This folder is an isolated dashboard preview. It contains the dashboard, installable PWA shell, and separate section preview pages. No authentication or backend workflows are implemented here.

## Run locally

Serve this folder over localhost or HTTPS (for example, open `dashboard/index.html` with VS Code Live Server). Service workers and PWA installation are not available from `file://`.

## Install and offline support

- `manifest.webmanifest` describes the installable app and its icon.
- `service-worker.js` precaches the dashboard and section shell and serves a cached shell or offline page when navigation is offline.
- The browser's install button is shown only when the browser emits `beforeinstallprompt`. iOS users can use the browser's **Add to Home Screen** action.
- The app shell is cached; live/authenticated data is not included in the offline cache.

## Separate section routes

- `sections/courses.html`
- `sections/classes.html`
- `sections/students.html`
- `sections/instructors.html`
- `sections/attendance.html`
- `sections/assignments.html`
- `sections/reports.html`

These pages are isolated integration previews. The Courses page displays eight illustrative courses; the Classes page displays five illustrative scheduled sessions; the Students page displays eight illustrative learner records; the Instructors page displays five illustrative instructor profiles; and the Attendance, Assignments, and Reports pages summarize the sample teaching and learner records. These pages are not connected to live records. The other section pages remain integration placeholders, and their feature modules and data can be supplied by their respective owners.

## Instructor Portal

Open `instructor/dashboard.html` to preview the instructor workspace. Its courses, students, classes, assignments, materials, attendance, announcements, notifications, profile, and settings use illustrative in-memory data. Preview actions do not persist across reloads or devices. Material and profile-photo pickers display preview metadata only; they do not upload content.

The Instructor Portal has its own PWA manifest and is included in the dashboard service worker's offline shell. Serve the dashboard folder over localhost or HTTPS to test installation and offline navigation.

An authentication/backend integration can supply display identity and instructor-scoped data after authentication is complete:

```js
window.EjireInstructorDashboard.setInstructor({
  fullName: instructor.fullName,
  email: instructor.email,
  phone: instructor.phone,
  category: instructor.category,
  bio: instructor.bio
});

window.EjireInstructorDashboard.setAssignedData({
  courses: assignedCourses,
  students: assignedStudents,
  classes: assignedClasses,
  assignments: assignmentsForAssignedCourses,
  materials: materialsForAssignedCourses,
  announcements: announcementsForAssignedCourses,
  notifications: instructorNotifications,
  attendance: attendanceForAssignedClasses,
  activity: instructorActivity
});

window.EjireInstructorDashboard.setPageState("courses", "loading");
window.EjireInstructorDashboard.setPageState("courses", "ready");
window.EjireInstructorDashboard.setPageState("courses", "empty", "No courses are assigned yet.");
window.EjireInstructorDashboard.setPageState("courses", "error", "Course data could not be loaded.");
```

The records should use the field names shown in the preview module. Course records need `id`, `title`, `category`, `description`, `duration`, `status`, `progress`, `students` (student IDs), and `modules`; student records need `id`, `studentId`, `name`, `email`, `courseIds`, `progress`, `attendance`, `averageGrade`, and `status`. Assignments should include a `submissions` array whose items reference student IDs. The integration must supply only records in the signed-in instructor's assigned scope; client-side filtering is not an authorization boundary.

`setInstructor` and `setAssignedData` are display/data integration hooks only. They do not authenticate users, enforce access, save changes, or upload files. Backend APIs and Row Level Security must enforce instructor access. The sign-out button is intentionally a placeholder for the Authentication module; password changes and official schedule/course assignment controls also remain outside this dashboard module.

## Authentication integration

The dashboard preview currently uses a clearly labeled mock display identity. An integration can update it after authentication loads:

```js
window.EjireDashboard.setUser({
  fullName: authenticatedUser.fullName,
  roleLabel: authenticatedUser.roleLabel
});
```

This interface accepts display information only. Authentication, sessions, and permissions remain the responsibility of the authentication/backend modules.

Dashboard panel state can be shown by the integration layer when real data loads:

```js
window.EjireDashboard.setComponentState("courses", "loading");
window.EjireDashboard.setComponentState("courses", "empty", "No courses are available yet.");
window.EjireDashboard.setComponentState("courses", "error", "Course data could not be loaded.");
window.EjireDashboard.setComponentState("courses", "ready");
```
