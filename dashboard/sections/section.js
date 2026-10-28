(() => {
  "use strict";

  const sections = {
    courses: {
      label: "Courses",
      icon: "▤",
      group: "WORKSPACE",
      description: "Browse the course catalog, explore learning paths, and follow course progress.",
      features: ["Course catalog and categories", "Instructor and course details", "Enrollment and progress"]
    },
    classes: {
      label: "Classes",
      icon: "▧",
      group: "WORKSPACE",
      description: "Browse upcoming sessions, class details, and their assigned instructors.",
      features: ["Upcoming class schedule", "Class time and location", "Assigned instructor"]
    },
    students: {
      label: "Students",
      icon: "♙",
      group: "WORKSPACE",
      description: "Browse learner profiles, course enrollment, and learning progress.",
      features: ["Student directory", "Course enrollment", "Learning progress"]
    },
    instructors: {
      label: "Instructors",
      icon: "♧",
      group: "WORKSPACE",
      description: "Meet the instructors leading courses across the Ejire Tech learning community.",
      features: ["Instructor directory", "Assigned courses", "Teaching schedule"]
    },
    attendance: {
      label: "Attendance",
      icon: "◷",
      group: "INSIGHTS",
      description: "Review attendance records and participation trends across classes.",
      features: ["Class attendance records", "Participation trends", "Attendance summaries"]
    },
    assignments: {
      label: "Assignments",
      icon: "▱",
      group: "INSIGHTS",
      description: "A dedicated workspace for assignment deadlines and learner submissions.",
      features: ["Assignment deadlines", "Submission status", "Course-level progress"]
    },
    reports: {
      label: "Reports",
      icon: "▥",
      group: "INSIGHTS",
      description: "Review learning activity and workspace performance reports.",
      features: ["Enrollment overview", "Attendance summaries", "Learning activity"]
    }
  };
  const nav = [
    { key: "courses", label: "Courses", icon: "▤", group: "WORKSPACE" },
    { key: "classes", label: "Classes", icon: "▧", group: "WORKSPACE" },
    { key: "students", label: "Students", icon: "♙", group: "WORKSPACE" },
    { key: "instructors", label: "Instructors", icon: "♧", group: "WORKSPACE" },
    { key: "attendance", label: "Attendance", icon: "◷", group: "INSIGHTS" },
    { key: "assignments", label: "Assignments", icon: "▱", group: "INSIGHTS" },
    { key: "reports", label: "Reports", icon: "▥", group: "INSIGHTS" }
  ];
  const instructors = [
    { name: "Olivia Chen", initials: "OC", specialty: "Product Design", course: "Introduction to Product Design" },
    { name: "Marcus Reed", initials: "MR", specialty: "Frontend Development", course: "Frontend Development II" },
    { name: "Amara Okafor", initials: "AO", specialty: "Data Analytics", course: "Data Analytics Essentials" },
    { name: "Daniel Kim", initials: "DK", specialty: "Digital Marketing", course: "Digital Marketing Strategy" },
    { name: "Leila Hassan", initials: "LH", specialty: "Business Communication", course: "Business Communication" }
  ];
  const students = [
    { id: "ET-24031", name: "Liam Nelson", email: "liam.nelson@example.com", courses: ["Introduction to Product Design", "Product Design Systems"], progress: 82, attendance: 96, status: "On track" },
    { id: "ET-24032", name: "Mia Johnson", email: "mia.johnson@example.com", courses: ["Introduction to Product Design", "Product Design Systems", "Design Portfolio Studio"], progress: 74, attendance: 92, status: "On track" },
    { id: "ET-24033", name: "Noah Williams", email: "noah.williams@example.com", courses: ["Introduction to Product Design", "UX Research Essentials"], progress: 38, attendance: 78, status: "Needs support" },
    { id: "ET-24034", name: "Ava Patel", email: "ava.patel@example.com", courses: ["Introduction to Product Design", "Design Portfolio Studio"], progress: 91, attendance: 98, status: "On track" },
    { id: "ET-24035", name: "Ethan Brooks", email: "ethan.brooks@example.com", courses: ["Introduction to Product Design", "UX Research Essentials"], progress: 55, attendance: 89, status: "On track" },
    { id: "ET-24036", name: "Zara Ahmed", email: "zara.ahmed@example.com", courses: ["Product Design Systems", "Design Portfolio Studio"], progress: 67, attendance: 85, status: "On track" },
    { id: "ET-24037", name: "Caleb Rivera", email: "caleb.rivera@example.com", courses: ["Product Design Systems"], progress: 29, attendance: 66, status: "Needs support" },
    { id: "ET-24038", name: "Amara Okafor", email: "amara.okafor@example.com", courses: ["UX Research Essentials"], progress: 44, attendance: 90, status: "On track" }
  ];
  const classes = [
    { title: "Introduction to Product Design", category: "Design · UX foundations", instructor: "Olivia Chen", initials: "OC", tone: "lilac", date: "Today, Oct 26", time: "10:30 AM", status: "In progress", statusType: "live" },
    { title: "Frontend Development II", category: "Development · Intermediate", instructor: "Marcus Reed", initials: "MR", tone: "mint", date: "Today, Oct 26", time: "1:00 PM", status: "Upcoming", statusType: "upcoming" },
    { title: "Data Analytics Essentials", category: "Data · Beginner", instructor: "Amara Okafor", initials: "AO", tone: "peach", date: "Tue, Oct 27", time: "9:00 AM", status: "Upcoming", statusType: "upcoming" },
    { title: "Digital Marketing Strategy", category: "Marketing · Advanced", instructor: "Daniel Kim", initials: "DK", tone: "blue", date: "Tue, Oct 27", time: "2:30 PM", status: "Upcoming", statusType: "upcoming" },
    { title: "Business Communication", category: "Business · Foundations", instructor: "Leila Hassan", initials: "LH", tone: "rose", date: "Wed, Oct 28", time: "11:00 AM", status: "Upcoming", statusType: "upcoming" }
  ];
  const courses = [
    { title: "Introduction to Product Design", category: "Design", instructor: "Olivia Chen", status: "Active", duration: "10 weeks", description: "Explore user-centered design, research methods, wireframing, and high-fidelity prototyping." },
    { title: "Frontend Development II", category: "Development", instructor: "Marcus Reed", status: "Active", duration: "12 weeks", description: "Build on frontend fundamentals with modern development workflows and hands-on projects." },
    { title: "Data Analytics Essentials", category: "Data", instructor: "Amara Okafor", status: "Active", duration: "8 weeks", description: "Develop practical skills for exploring data and communicating useful insights." },
    { title: "Digital Marketing Strategy", category: "Marketing", instructor: "Daniel Kim", status: "Active", duration: "8 weeks", description: "Learn to plan and evaluate digital campaigns for a range of audiences and goals." },
    { title: "Business Communication", category: "Business", instructor: "Leila Hassan", status: "Active", duration: "6 weeks", description: "Strengthen clear, confident communication for professional settings." },
    { title: "Product Design Systems", category: "Design", instructor: "Olivia Chen", status: "Active", duration: "8 weeks", description: "Build flexible design systems, reusable components, and a shared team design language." },
    { title: "UX Research Essentials", category: "Research", instructor: "Olivia Chen", status: "Upcoming", duration: "6 weeks", description: "Plan research, interview participants, synthesize insights, and share findings." },
    { title: "Design Portfolio Studio", category: "Career development", instructor: "Olivia Chen", status: "Completed", duration: "5 weeks", description: "Shape project stories and create a compelling professional portfolio." }
  ];
  const assignments = [
    { title: "User Interview Findings", course: "Introduction to Product Design", due: "Due in 2 days", status: "Published", submissions: 5, submitted: 3, needsReview: 3 },
    { title: "Create a Color Token Set", course: "Product Design Systems", due: "Due in 4 days", status: "Published", submissions: 4, submitted: 2, needsReview: 1 },
    { title: "Wireframe Your Core Flow", course: "Introduction to Product Design", due: "Past due", status: "Published", submissions: 4, submitted: 3, needsReview: 2 },
    { title: "Component Library Reflection", course: "Product Design Systems", due: "Due in 6 days", status: "Draft", submissions: 0, submitted: 0, needsReview: 0 }
  ];
  const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  function renderAttendanceReport() {
    const average = Math.round(students.reduce((total, student) => total + student.attendance, 0) / students.length);
    return `
      <section class="insight-section" aria-label="Attendance summary">
        <div class="insight-metrics">
          <article class="insight-metric"><span>Average attendance</span><strong>${average}%</strong><small>Across ${students.length} preview students</small></article>
          <article class="insight-metric"><span>Present</span><strong>86%</strong><small>Workspace preview summary</small></article>
          <article class="insight-metric"><span>Late</span><strong>9%</strong><small>Workspace preview summary</small></article>
          <article class="insight-metric"><span>Absent</span><strong>5%</strong><small>Workspace preview summary</small></article>
        </div>
        <div class="insight-panel">
          <div class="insight-panel-heading"><div><h2>Attendance by student</h2><p>Review the attendance rates included in the learner preview.</p></div><span>${students.length} students</span></div>
          <div class="insight-table-wrap"><table class="insight-table">
            <thead><tr><th scope="col">Student</th><th scope="col">Student ID</th><th scope="col">Attendance</th><th scope="col">Learning status</th></tr></thead>
            <tbody>${students.map(student => `
              <tr><td><strong>${escapeHTML(student.name)}</strong><small>${escapeHTML(student.email)}</small></td><td>${escapeHTML(student.id)}</td><td><span class="insight-progress"><span><i style="width:${student.attendance}%"></i></span><strong>${student.attendance}%</strong></span></td><td><span class="student-directory-status ${student.status === "Needs support" ? "is-support" : ""}"><i></i>${escapeHTML(student.status)}</span></td></tr>`).join("")}</tbody>
          </table></div>
        </div>
        <p class="insight-note">Preview data only. Attendance records are not connected to live class check-ins.</p>
      </section>`;
  }

  function renderAssignments() {
    const published = assignments.filter(assignment => assignment.status === "Published").length;
    const submissionCount = assignments.reduce((total, assignment) => total + assignment.submissions, 0);
    const reviewCount = assignments.reduce((total, assignment) => total + assignment.needsReview, 0);
    return `
      <section class="insight-section" aria-label="Assignment overview">
        <div class="insight-metrics">
          <article class="insight-metric"><span>Total assignments</span><strong>${assignments.length}</strong><small>Across the instructor preview</small></article>
          <article class="insight-metric"><span>Published</span><strong>${published}</strong><small>Available to students</small></article>
          <article class="insight-metric"><span>Submissions</span><strong>${submissionCount}</strong><small>Across all listed assignments</small></article>
          <article class="insight-metric"><span>Needs review</span><strong>${reviewCount}</strong><small>Submitted work awaiting review</small></article>
        </div>
        <div class="insight-panel">
          <div class="insight-panel-heading"><div><h2>Assignments and submissions</h2><p>Check due dates, publishing status, and submission progress.</p></div><span>${assignments.length} assignments</span></div>
          <div class="insight-table-wrap"><table class="insight-table">
            <thead><tr><th scope="col">Assignment</th><th scope="col">Course</th><th scope="col">Due</th><th scope="col">Submissions</th><th scope="col">Status</th></tr></thead>
            <tbody>${assignments.map(assignment => `
              <tr><td><strong>${escapeHTML(assignment.title)}</strong></td><td>${escapeHTML(assignment.course)}</td><td>${escapeHTML(assignment.due)}</td><td>${assignment.submissions}</td><td><span class="insight-tag ${assignment.status === "Draft" ? "is-draft" : ""}">${escapeHTML(assignment.status)}</span></td></tr>`).join("")}</tbody>
          </table></div>
        </div>
        <p class="insight-note">Preview data only. Assignment and submission records are not connected to live courses.</p>
      </section>`;
  }

  function renderLearningReport() {
    const enrollmentCount = students.reduce((total, student) => total + student.courses.length, 0);
    const averageProgress = Math.round(students.reduce((total, student) => total + student.progress, 0) / students.length);
    const averageAttendance = Math.round(students.reduce((total, student) => total + student.attendance, 0) / students.length);
    return `
      <section class="insight-section" aria-label="Learning reports">
        <div class="insight-metrics">
          <article class="insight-metric"><span>Courses</span><strong>${courses.length}</strong><small>Across the preview catalog</small></article>
          <article class="insight-metric"><span>Students</span><strong>${students.length}</strong><small>In the learner preview</small></article>
          <article class="insight-metric"><span>Enrollments</span><strong>${enrollmentCount}</strong><small>Course registrations in preview</small></article>
          <article class="insight-metric"><span>Average progress</span><strong>${averageProgress}%</strong><small>${averageAttendance}% average attendance</small></article>
        </div>
        <div class="insight-panel">
          <div class="insight-panel-heading"><div><h2>Course performance</h2><p>Enrollment and learner averages by course.</p></div><span>${courses.length} courses</span></div>
          <div class="insight-table-wrap"><table class="insight-table">
            <thead><tr><th scope="col">Course</th><th scope="col">Instructor</th><th scope="col">Enrollments</th><th scope="col">Avg. progress</th><th scope="col">Avg. attendance</th><th scope="col">Status</th></tr></thead>
            <tbody>${courses.map(course => {
              const enrolled = students.filter(student => student.courses.includes(course.title));
              const progress = enrolled.length ? Math.round(enrolled.reduce((total, student) => total + student.progress, 0) / enrolled.length) : 0;
              const attendance = enrolled.length ? Math.round(enrolled.reduce((total, student) => total + student.attendance, 0) / enrolled.length) : 0;
              return `<tr><td><strong>${escapeHTML(course.title)}</strong></td><td>${escapeHTML(course.instructor)}</td><td>${enrolled.length}</td><td>${enrolled.length ? `${progress}%` : "—"}</td><td>${enrolled.length ? `${attendance}%` : "—"}</td><td><span class="insight-tag ${course.status !== "Active" ? "is-draft" : ""}">${escapeHTML(course.status)}</span></td></tr>`;
            }).join("")}</tbody>
          </table></div>
        </div>
        <p class="insight-note">Preview data only. Report values are calculated from the sample student and course records.</p>
      </section>`;
  }

  function renderCourseCatalog() {
    return `
      <section class="course-catalog" aria-label="Course catalog">
        <div class="course-catalog-heading">
          <div><h2>Course catalog</h2><p>Explore every course currently featured across this dashboard preview.</p></div>
          <span class="course-catalog-count">${courses.length} courses</span>
        </div>
        <div class="course-catalog-grid">
          ${courses.map(course => {
            const enrolled = students.filter(student => student.courses.includes(course.title)).length;
            return `
              <article class="course-catalog-card">
                <div class="course-catalog-card-top"><span class="course-catalog-category">${escapeHTML(course.category)}</span><span class="course-catalog-status status-${course.status.toLowerCase()}">${escapeHTML(course.status)}</span></div>
                <h3>${escapeHTML(course.title)}</h3>
                <p>${escapeHTML(course.description)}</p>
                <div class="course-catalog-meta"><span><small>Instructor</small><strong>${escapeHTML(course.instructor)}</strong></span><span><small>Duration</small><strong>${escapeHTML(course.duration)}</strong></span><span><small>Enrolled</small><strong>${enrolled} ${enrolled === 1 ? "student" : "students"}</strong></span></div>
              </article>`;
          }).join("")}
        </div>
        <p class="course-catalog-note">Preview data only. This catalog is not connected to live course records.</p>
      </section>`;
  }

  function renderClassSchedule() {
    return `
      <section class="class-directory" aria-label="Class schedule">
        <div class="class-directory-heading">
          <div><h2>Class schedule</h2><p>Review every class session currently featured in this preview.</p></div>
          <span class="class-directory-count">${classes.length} classes</span>
        </div>
        <div class="class-directory-table-wrap">
          <table class="class-directory-table">
            <thead><tr><th scope="col">Class</th><th scope="col">Instructor</th><th scope="col">Date and time</th><th scope="col">Status</th></tr></thead>
            <tbody>${classes.map(item => `
              <tr>
                <td><span class="class-directory-title"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.category)}</small></span></td>
                <td><span class="class-directory-instructor"><span class="class-directory-avatar tone-${escapeHTML(item.tone)}">${escapeHTML(item.initials)}</span>${escapeHTML(item.instructor)}</span></td>
                <td><span class="class-directory-date">${escapeHTML(item.date)}<small>${escapeHTML(item.time)}</small></span></td>
                <td><span class="class-directory-status status-${escapeHTML(item.statusType)}"><i></i>${escapeHTML(item.status)}</span></td>
              </tr>`).join("")}</tbody>
          </table>
        </div>
        <p class="class-directory-note">Preview data only. This schedule is not connected to live class records.</p>
      </section>`;
  }

  function renderStudentDirectory() {
    return `
      <section class="student-directory" aria-label="Student directory">
        <div class="student-directory-heading">
          <div><h2>Student directory</h2><p>Review enrollment and learning progress for each student in this preview.</p></div>
          <span class="student-directory-count">${students.length} students</span>
        </div>
        <div class="student-directory-table-wrap">
          <table class="student-directory-table">
            <thead><tr><th scope="col">Student</th><th scope="col">Student ID</th><th scope="col">Enrolled courses</th><th scope="col">Progress</th><th scope="col">Attendance</th><th scope="col">Status</th></tr></thead>
            <tbody>${students.map(student => `
              <tr>
                <td><span class="student-directory-person"><span class="student-directory-avatar" aria-hidden="true">${escapeHTML(student.name.split(/\s+/).slice(0, 2).map(part => part[0]).join(""))}</span><span><strong>${escapeHTML(student.name)}</strong><small>${escapeHTML(student.email)}</small></span></span></td>
                <td>${escapeHTML(student.id)}</td>
                <td>${student.courses.length}</td>
                <td><span class="student-directory-progress"><span><i style="width:${student.progress}%"></i></span><strong>${student.progress}%</strong></span></td>
                <td>${student.attendance}%</td>
                <td><span class="student-directory-status ${student.status === "Needs support" ? "is-support" : ""}"><i></i>${escapeHTML(student.status)}</span></td>
              </tr>`).join("")}</tbody>
          </table>
        </div>
        <p class="student-directory-note">Preview data only. This list is not connected to live student accounts.</p>
      </section>`;
  }

  function renderInstructorDirectory() {
    return `
      <section class="instructor-directory" aria-label="Instructor directory">
        <div class="instructor-directory-heading">
          <div><h2>Instructor directory</h2><p>Browse the instructors and courses featured in this preview.</p></div>
          <span class="instructor-directory-count">${instructors.length} instructors</span>
        </div>
        <div class="instructor-directory-grid">
          ${instructors.map(instructor => `
            <article class="instructor-directory-card">
              <div class="instructor-directory-card-top">
                <span class="instructor-directory-avatar" aria-hidden="true">${escapeHTML(instructor.initials)}</span>
                <span class="instructor-directory-role">Instructor</span>
              </div>
              <h3>${escapeHTML(instructor.name)}</h3>
              <p class="instructor-directory-specialty">${escapeHTML(instructor.specialty)}</p>
              <div class="instructor-directory-course"><span aria-hidden="true">▤</span><span><small>Featured course</small><strong>${escapeHTML(instructor.course)}</strong></span></div>
            </article>`).join("")}
        </div>
        <p class="instructor-directory-note">Preview data only. This directory is not connected to live instructor accounts.</p>
      </section>`;
  }

  function sectionLink(item, active) {
    return `<a class="section-nav-link ${active ? "is-active" : ""}" href="${item.key}.html" ${active ? 'aria-current="page"' : ""} aria-label="${item.label}"><span class="section-nav-icon" aria-hidden="true">${item.icon}</span><span class="section-nav-label">${item.label}</span></a>`;
  }

  function renderSection() {
    const key = document.body.dataset.section;
    const section = sections[key];
    if (!section) {
      document.title = "Section unavailable · Ejire Tech";
      document.querySelector("#section-app").innerHTML = `<main class="section-not-found"><h1>Section unavailable</h1><p>This dashboard section doesn't exist.</p><a class="section-primary-link" href="../index.html">Return to dashboard</a></main>`;
      return;
    }

    document.title = `${section.label} · Ejire Tech`;
    const sectionContent = key === "courses"
      ? renderCourseCatalog()
      : key === "classes"
        ? renderClassSchedule()
        : key === "students"
          ? renderStudentDirectory()
          : key === "instructors"
            ? renderInstructorDirectory()
            : key === "attendance"
              ? renderAttendanceReport()
              : key === "assignments"
                ? renderAssignments()
                : key === "reports"
                  ? renderLearningReport()
                  : `
        <section class="section-empty-card">
          <div class="section-empty-art"><span class="empty-art-ring"></span><span class="empty-art-icon">${section.icon}</span><i class="empty-art-dot"></i></div>
          <span class="section-status"><i></i> READY FOR INTEGRATION</span>
          <h2>This section has its own page</h2>
          <p>The dashboard links here directly. The ${escapeHTML(section.label.toLowerCase())} module's data and workflows can be connected here by its owner without crowding the overview.</p>
          <ul class="section-feature-list">${section.features.map(feature => `<li><span>✓</span>${escapeHTML(feature)}</li>`).join("")}</ul>
          <div class="section-empty-actions"><a class="section-primary-link" href="../index.html">Return to overview <span aria-hidden="true">→</span></a><span class="section-handoff-note">No module data is mocked on this page.</span></div>
        </section>`;
    const groupedNav = ["WORKSPACE", "INSIGHTS"].map(group => `
      <p class="section-nav-caption">${group}</p>
      <nav class="section-nav" aria-label="${group === "WORKSPACE" ? "Workspace sections" : "Insights sections"}">
        ${nav.filter(item => item.group === group).map(item => sectionLink(item, item.key === key)).join("")}
      </nav>`).join("");

    document.querySelector("#section-app").innerHTML = `
      <div class="section-shell" id="section-shell">
        <aside class="section-sidebar" id="section-sidebar" aria-label="Workspace navigation">
          <a class="section-brand" href="../index.html" aria-label="Ejire Tech dashboard"><span class="section-brand-mark">e</span><span>ejire<span>tech</span></span></a>
          <a class="section-back-link" href="../index.html"><span aria-hidden="true">←</span> Dashboard overview</a>
          ${groupedNav}
          <div class="section-sidebar-bottom">
            <div class="section-profile"><span class="section-profile-avatar">AM</span><span><strong>Alex Morgan</strong><small>Preview user</small></span></div>
            <span class="section-preview-label">Dashboard section preview</span>
          </div>
        </aside>
        <button class="section-scrim" id="section-scrim" aria-label="Close navigation" type="button"></button>
        <main class="section-main">
          <header class="section-topbar">
            <div class="section-topbar-start"><button class="section-menu-toggle" id="section-menu-toggle" type="button" aria-label="Open navigation"><span></span><span></span><span></span></button><div class="section-breadcrumb"><span>Workspace</span><span>/</span><strong>${escapeHTML(section.label)}</strong></div></div>
            <div class="section-topbar-end"><span class="section-preview-badge"><i></i> Preview data</span><button class="button button-secondary section-install" id="pwa-install" type="button" hidden>Install app</button><a class="section-home-link" href="../index.html">Back to dashboard <span aria-hidden="true">↗</span></a></div>
          </header>
          <div class="section-content">
            <header class="section-page-heading">
              <span class="section-eyebrow">${key === "courses" ? "WORKSPACE / COURSE CATALOG" : key === "classes" ? "WORKSPACE / CLASS SCHEDULE" : key === "students" ? "WORKSPACE / STUDENT DIRECTORY" : key === "instructors" ? "WORKSPACE / INSTRUCTOR DIRECTORY" : key === "attendance" ? "INSIGHTS / ATTENDANCE SUMMARY" : key === "assignments" ? "INSIGHTS / ASSIGNMENT TRACKER" : key === "reports" ? "INSIGHTS / LEARNING REPORTS" : `${escapeHTML(section.group)} / MODULE HANDOFF`}</span>
              <h1><span class="section-title-icon" aria-hidden="true">${section.icon}</span>${escapeHTML(section.label)}</h1>
              <p>${escapeHTML(section.description)}</p>
            </header>
            ${sectionContent}
            <footer class="section-footer"><span>© 2026 Ejire Tech</span><span>Standalone dashboard section</span></footer>
          </div>
        </main>
      </div>`;
    setupNavigation();
  }

  function setupNavigation() {
    const toggle = document.querySelector("#section-menu-toggle");
    const sidebar = document.querySelector("#section-sidebar");
    const scrim = document.querySelector("#section-scrim");
    toggle.addEventListener("click", () => {
      const open = sidebar.classList.toggle("is-open");
      scrim.classList.toggle("is-visible", open);
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    scrim.addEventListener("click", () => {
      sidebar.classList.remove("is-open");
      scrim.classList.remove("is-visible");
    });
  }

  renderSection();
})();
