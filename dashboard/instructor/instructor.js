(() => {
  "use strict";

  const dateOffset = days => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };
  const dayKey = value => new Date(value).toLocaleDateString("en-CA");
  const initials = name => String(name || "").trim().split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
  const mockInstructor = { fullName: "Olivia Chen", roleLabel: "Instructor" };

  const data = {
    instructor: { ...mockInstructor, email: "olivia.chen@ejiretech.com", phone: "+1 (555) 218-4062", category: "Product Design", bio: "Product designer and educator helping emerging designers turn thoughtful ideas into useful experiences.", skills: ["Product design", "Figma", "User research"], avatarUrl: "" },
    courses: [
      { id: "ux", title: "Introduction to Product Design", category: "Design", description: "Explore user-centered design, research methods, wireframing, and high-fidelity prototyping.", duration: 10, status: "Active", progress: 68, students: ["st1", "st2", "st3", "st4", "st5"], modules: ["Design thinking", "User research", "Information architecture", "Wireframing", "Prototyping"] },
      { id: "systems", title: "Product Design Systems", category: "Design", description: "Build and maintain flexible design systems, reusable components, and team-wide design language.", duration: 8, status: "Active", progress: 42, students: ["st1", "st2", "st6", "st7"], modules: ["Foundations", "Tokens", "Components", "Documentation"] },
      { id: "research", title: "UX Research Essentials", category: "Research", description: "Plan effective research, interview participants, synthesize insights, and share findings.", duration: 6, status: "Upcoming", progress: 0, students: ["st3", "st5", "st8"], modules: ["Research planning", "Interviewing", "Synthesis"] },
      { id: "portfolio", title: "Design Portfolio Studio", category: "Career development", description: "Shape your project stories and create a compelling portfolio for your next opportunity.", duration: 5, status: "Completed", progress: 100, students: ["st2", "st4", "st6"], modules: ["Storytelling", "Case studies", "Portfolio review"] }
    ],
    students: [
      { id: "st1", studentId: "ET-24031", name: "Liam Nelson", email: "liam.nelson@example.com", courseIds: ["ux", "systems"], progress: 82, attendance: 96, averageGrade: 91, status: "On track", completedModules: 8, feedback: "" },
      { id: "st2", studentId: "ET-24032", name: "Mia Johnson", email: "mia.johnson@example.com", courseIds: ["ux", "systems", "portfolio"], progress: 74, attendance: 92, averageGrade: 86, status: "On track", completedModules: 7, feedback: "" },
      { id: "st3", studentId: "ET-24033", name: "Noah Williams", email: "noah.williams@example.com", courseIds: ["ux", "research"], progress: 38, attendance: 78, averageGrade: 71, status: "Needs support", completedModules: 4, feedback: "" },
      { id: "st4", studentId: "ET-24034", name: "Ava Patel", email: "ava.patel@example.com", courseIds: ["ux", "portfolio"], progress: 91, attendance: 98, averageGrade: 94, status: "On track", completedModules: 10, feedback: "" },
      { id: "st5", studentId: "ET-24035", name: "Ethan Brooks", email: "ethan.brooks@example.com", courseIds: ["ux", "research"], progress: 55, attendance: 89, averageGrade: 79, status: "On track", completedModules: 6, feedback: "" },
      { id: "st6", studentId: "ET-24036", name: "Zara Ahmed", email: "zara.ahmed@example.com", courseIds: ["systems", "portfolio"], progress: 67, attendance: 85, averageGrade: 83, status: "On track", completedModules: 5, feedback: "" },
      { id: "st7", studentId: "ET-24037", name: "Caleb Rivera", email: "caleb.rivera@example.com", courseIds: ["systems"], progress: 29, attendance: 66, averageGrade: 64, status: "Needs support", completedModules: 3, feedback: "" },
      { id: "st8", studentId: "ET-24038", name: "Amara Okafor", email: "amara.okafor@example.com", courseIds: ["research"], progress: 44, attendance: 90, averageGrade: 88, status: "On track", completedModules: 3, feedback: "" }
    ],
    classes: [
      { id: "cl1", courseId: "ux", title: "User Research Workshop", startsAt: dateOffset(0), time: "10:30", duration: 90, room: "Studio 02", mode: "In person", status: "Upcoming" },
      { id: "cl2", courseId: "systems", title: "Design Tokens & Foundations", startsAt: dateOffset(0), time: "14:00", duration: 75, room: "Online · Meet link", mode: "Online", status: "Upcoming" },
      { id: "cl3", courseId: "ux", title: "Wireframing & Flows", startsAt: dateOffset(1), time: "11:00", duration: 90, room: "Studio 02", mode: "In person", status: "Upcoming" },
      { id: "cl4", courseId: "systems", title: "Component Documentation", startsAt: dateOffset(2), time: "13:00", duration: 75, room: "Online · Meet link", mode: "Online", status: "Upcoming" },
      { id: "cl5", courseId: "research", title: "Research Planning", startsAt: dateOffset(3), time: "09:30", duration: 60, room: "Studio 01", mode: "In person", status: "Upcoming" }
    ],
    assignments: [
      { id: "as1", courseId: "ux", title: "User Interview Findings", instructions: "Submit a concise synthesis of three user interviews. Include themes, supporting quotes, and a short design opportunity statement.", dueAt: dateOffset(2), status: "Published", submissions: [
        { id: "su1", studentId: "st1", status: "Submitted", submittedAt: dateOffset(-1), score: null, feedback: "" },
        { id: "su2", studentId: "st2", status: "Submitted", submittedAt: dateOffset(0), score: null, feedback: "" },
        { id: "su3", studentId: "st3", status: "In progress", submittedAt: null, score: null, feedback: "" },
        { id: "su4", studentId: "st4", status: "Submitted", submittedAt: dateOffset(-1), score: null, feedback: "" },
        { id: "su5", studentId: "st5", status: "Late", submittedAt: dateOffset(1), score: null, feedback: "" }
      ] },
      { id: "as2", courseId: "systems", title: "Create a Color Token Set", instructions: "Create semantic color tokens and show them in a small accessible color palette.", dueAt: dateOffset(4), status: "Published", submissions: [
        { id: "su6", studentId: "st1", status: "Submitted", submittedAt: dateOffset(0), score: null, feedback: "" },
        { id: "su7", studentId: "st2", status: "Graded", submittedAt: dateOffset(-2), score: 88, feedback: "Clear naming. Check the contrast of the secondary text token." },
        { id: "su8", studentId: "st6", status: "In progress", submittedAt: null, score: null, feedback: "" },
        { id: "su9", studentId: "st7", status: "In progress", submittedAt: null, score: null, feedback: "" }
      ] },
      { id: "as3", courseId: "ux", title: "Wireframe Your Core Flow", instructions: "Upload a low-fidelity prototype that demonstrates the primary task flow.", dueAt: dateOffset(-3), status: "Published", submissions: [
        { id: "su10", studentId: "st1", status: "Graded", submittedAt: dateOffset(-5), score: 94, feedback: "Excellent hierarchy and thoughtful flow." },
        { id: "su11", studentId: "st2", status: "Submitted", submittedAt: dateOffset(-2), score: null, feedback: "" },
        { id: "su12", studentId: "st3", status: "In progress", submittedAt: null, score: null, feedback: "" },
        { id: "su13", studentId: "st5", status: "Submitted", submittedAt: dateOffset(-1), score: null, feedback: "" }
      ] },
      { id: "as4", courseId: "systems", title: "Component Library Reflection", instructions: "Describe how your library supports product consistency and future changes.", dueAt: dateOffset(6), status: "Draft", submissions: [] }
    ],
    materials: [
      { id: "ma1", courseId: "ux", title: "Interview planning worksheet", description: "Template for planning moderated user interviews.", fileName: "interview-planning.pdf", size: "1.2 MB", type: "PDF", visibility: "Published", addedAt: dateOffset(-5) },
      { id: "ma2", courseId: "ux", title: "Research synthesis guide", description: "A practical guide to themes and affinity mapping.", fileName: "research-synthesis.pdf", size: "2.4 MB", type: "PDF", visibility: "Published", addedAt: dateOffset(-3) },
      { id: "ma3", courseId: "systems", title: "Design token starter kit", description: "Editable design token examples for the next workshop.", fileName: "token-starter.fig", size: "860 KB", type: "FIG", visibility: "Draft", addedAt: dateOffset(-1) }
    ],
    announcements: [
      { id: "an1", courseId: "ux", title: "Workshop preparation for this week", body: "Please bring one example of a recent product experience that surprised you. We’ll use it to practice turning observations into interview questions.", createdAt: dateOffset(-1), status: "Published" },
      { id: "an2", courseId: "systems", title: "Design token office hours", body: "I’ll be available after Thursday’s session for questions about naming and organizing your color tokens.", createdAt: dateOffset(-2), status: "Published" }
    ],
    notifications: [
      { id: "no1", title: "New submission to review", detail: "Liam Nelson submitted User Interview Findings.", createdAt: dateOffset(0), read: false },
      { id: "no2", title: "Upcoming class reminder", detail: "User Research Workshop starts today at 10:30 AM.", createdAt: dateOffset(0), read: false },
      { id: "no3", title: "Student needs support", detail: "Caleb Rivera's progress is below the course average.", createdAt: dateOffset(-1), read: false },
      { id: "no4", title: "Course materials updated", detail: "Research Synthesis Guide was published.", createdAt: dateOffset(-2), read: true }
    ],
    attendance: [],
    activity: [
      { id: "ac1", title: "Assignment submitted", detail: "Liam Nelson · User Interview Findings", createdAt: dateOffset(0), icon: "↗" },
      { id: "ac2", title: "Class scheduled", detail: "User Research Workshop · Today", createdAt: dateOffset(0), icon: "▧" },
      { id: "ac3", title: "Material published", detail: "Research Synthesis Guide · Introduction to Product Design", createdAt: dateOffset(-1), icon: "▤" },
      { id: "ac4", title: "Assignment graded", detail: "Mia Johnson · Create a Color Token Set · 88%", createdAt: dateOffset(-2), icon: "✓" },
      { id: "ac5", title: "Announcement published", detail: "Workshop preparation for this week", createdAt: dateOffset(-3), icon: "◉" }
    ],
    settings: { theme: "light", emailNotifications: true, deadlineReminders: true, studentAlerts: true, weeklyDigest: false },
    pageStates: {},
    query: ""
  };

  const navigation = [
    { key: "dashboard", label: "Dashboard", group: "MAIN" },
    { key: "courses", label: "My Courses", group: "MAIN" },
    { key: "students", label: "My Students", group: "MAIN" },
    { key: "schedule", label: "Class Schedule", group: "MAIN" },
    { key: "attendance", label: "Attendance", group: "TEACHING" },
    { key: "assignments", label: "Assignments", group: "TEACHING" },
    { key: "materials", label: "Learning Materials", group: "TEACHING" },
    { key: "progress", label: "Student Progress", group: "TEACHING" },
    { key: "announcements", label: "Announcements", group: "COMMUNICATION" },
    { key: "notifications", label: "Notifications", group: "COMMUNICATION" },
    { key: "reports", label: "Reports & Analytics", group: "ACCOUNT" },
    { key: "activity", label: "Activity Log", group: "ACCOUNT" },
    { key: "profile", label: "My Profile", group: "ACCOUNT" },
    { key: "settings", label: "Settings", group: "ACCOUNT" }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  const courseById = id => data.courses.find(course => course.id === id);
  const studentById = id => data.students.find(student => student.id === id);
  const initialsFor = id => initials(studentById(id)?.name || "ET");
  const activePage = () => (location.hash.replace(/^#\/?/, "") || "dashboard").split("?")[0];
  const countStudents = courseId => new Set(data.courses.filter(course => !courseId || course.id === courseId).flatMap(course => course.students)).size;
  const allSubmissions = () => data.assignments.flatMap(assignment => assignment.submissions.map(submission => ({ ...submission, assignment, student: studentById(submission.studentId) })));
  const pendingReviews = () => allSubmissions().filter(item => item.status === "Submitted").length;
  const formatDate = (value, options = { month: "short", day: "numeric" }) => value ? new Intl.DateTimeFormat(undefined, options).format(new Date(value)) : "No date";
  const formatDateTime = value => value ? new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "Time to be confirmed";
  const dateInputValue = value => {
    const date = value ? new Date(value) : new Date();
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };
  const dateTimeInputValue = value => {
    const date = new Date(value);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  };
  const courseLabel = id => courseById(id)?.title || "Course";
  const getCourseStudents = courseId => data.students.filter(student => student.courseIds.includes(courseId));
  const getUnreadCount = () => data.notifications.filter(notification => !notification.read).length;
  let currentPage = null;
  let preserveQueryOnNextPage = false;
  const setHash = (page, query = "") => {
    data.query = query;
    preserveQueryOnNextPage = Boolean(query);
    const next = page === "dashboard" ? "dashboard" : page;
    if (activePage() === next) renderPage();
    else location.hash = next;
  };

  function rerenderWithFocus(render) {
    const active = document.activeElement;
    const id = active?.id;
    const start = typeof active?.selectionStart === "number" ? active.selectionStart : null;
    render();
    const replacement = id ? document.getElementById(id) : null;
    if (replacement) {
      replacement.focus();
      if (start !== null && typeof replacement.setSelectionRange === "function") replacement.setSelectionRange(start, start);
    }
  }

  function addActivity(title, detail, icon = "↻") {
    data.activity.unshift({ id: crypto.randomUUID(), title, detail, createdAt: new Date().toISOString(), icon });
  }

  function toast(message, type = "success") {
    const item = document.createElement("div");
    item.className = `instructor-toast ${type === "error" ? "toast-error" : ""}`;
    item.textContent = message;
    $("#instructor-toast-region").append(item);
    setTimeout(() => item.remove(), 3400);
  }

  function emptyState(title, message, icon = "✳") {
    return `<div class="empty-state"><span>${icon}</span><strong>${escapeHTML(title)}</strong><small>${escapeHTML(message)}</small></div>`;
  }

  function heading(kicker, title, description, actions = "") {
    return `<header class="page-heading-row"><div><span class="page-kicker">${escapeHTML(kicker)}</span><h1>${escapeHTML(title)}</h1><p>${escapeHTML(description)}</p></div><div class="page-heading-actions">${actions}</div></header>`;
  }

  function panelHeading(kicker, title, description, action = "") {
    return `<div class="panel-heading"><div><span class="panel-kicker">${escapeHTML(kicker)}</span><h2>${escapeHTML(title)}</h2><p>${escapeHTML(description)}</p></div>${action}</div>`;
  }

  function statCard(label, value, note, icon, tone, trend = "") {
    return `<article class="instructor-stat"><div class="instructor-stat-top"><span>${escapeHTML(label)}</span><span class="instructor-stat-icon tone-${tone}">${icon}</span></div><div class="instructor-stat-value"><strong>${escapeHTML(value)}</strong>${trend ? `<span class="stat-trend">${escapeHTML(trend)}</span>` : ""}</div><div class="stat-note"><span>${escapeHTML(note)}</span></div></article>`;
  }

  function renderChart() {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const current = [56, 76, 64, 87, 71, 92, 83];
    const previous = [42, 59, 52, 70, 61, 76, 68];
    return `<div class="performance-chart" role="img" aria-label="Weekly average assignment performance chart"><div class="chart-scale"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div class="chart-area"><div class="chart-lines" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="chart-columns">${labels.map((label, index) => `<div class="chart-day"><i style="--height:${previous[index]}%"></i><i style="--height:${current[index]}%"></i><small>${label}</small></div>`).join("")}</div></div></div><div class="chart-legend"><span><i></i>This week</span><span><i></i>Last week</span></div>`;
  }

  function renderDashboard() {
    const todaysClasses = data.classes.filter(item => dayKey(item.startsAt) === dayKey(new Date()));
    const students = countStudents();
    const averageAttendance = data.students.length ? Math.round(data.students.reduce((sum, student) => sum + student.attendance, 0) / data.students.length) : 0;
    const averagePerformance = data.students.length ? Math.round(data.students.reduce((sum, student) => sum + student.averageGrade, 0) / data.students.length) : 0;
    const dueSoon = data.assignments.filter(assignment => assignment.status === "Published" && new Date(assignment.dueAt) >= new Date() && new Date(assignment.dueAt) < new Date(Date.now() + 8 * 86400000));
    const submissions = allSubmissions().filter(item => item.status === "Submitted").slice(0, 4);
    const recentActivities = data.activity.slice(0, 5);
    return `${heading("YOUR TEACHING WORKSPACE", `Good morning, ${data.instructor.fullName.split(/\s+/)[0]}.`, "Here's your teaching overview. Your course and student sample data is for preview only.", `<button class="button button-secondary" data-action="today" type="button">▦ &nbsp;Today</button><button class="button button-primary" data-action="create-assignment" type="button"><span class="button-icon">＋</span> New assignment</button>`)}
      <section class="stats-grid" aria-label="Teaching summary">
        ${statCard("Assigned courses", data.courses.filter(course => course.status === "Active").length, `${data.courses.length} assigned in total`, "▤", "green", "↗ 2 this term")}
        ${statCard("Assigned students", students, "Across your assigned courses", "♙", "lilac", "↗ 8 this month")}
        ${statCard("Pending reviews", pendingReviews(), "Submissions waiting for your feedback", "▱", "peach", dueSoon.length ? `${dueSoon.length} deadlines soon` : "")}
        ${statCard("Average attendance", `${averageAttendance}%`, "Across your assigned students", "◷", "blue", "+3% this month")}
      </section>
      <section class="instructor-grid">
        <article class="instructor-panel">${panelHeading("STUDENT PERFORMANCE", "Learning at a glance", "Average assignment performance · this week")}<div class="chart-total"><strong>${averagePerformance}%</strong><span>↗ 6.4%</span><small>overall class average</small></div>${renderChart()}</article>
        <article class="instructor-panel">${panelHeading("CLASS PARTICIPATION", "Attendance overview", "Average student attendance")}<div class="attendance-overview"><div class="attendance-donut" role="img" aria-label="Average attendance ${averageAttendance}%"><div class="attendance-donut-hole"><strong>${averageAttendance}%</strong><small>attendance</small></div></div><div class="attendance-legend"><div><span><i class="legend-dot legend-present"></i>Present</span><b>92%</b></div><div><span><i class="legend-dot legend-late"></i>Late</span><b>5%</b></div><div><span><i class="legend-dot legend-absent"></i>Absent</span><b>3%</b></div></div></div><div class="panel-footer-note">Calculated for your assigned students</div></article>
      </section>
      <section class="instructor-grid">
        <article class="instructor-panel">${panelHeading("ON YOUR CALENDAR", "Today's classes", `${todaysClasses.length} session${todaysClasses.length === 1 ? "" : "s"} scheduled today`, `<button class="text-link" data-route="schedule" type="button">Full schedule →</button>`)}
          ${todaysClasses.length ? `<div class="today-classes">${todaysClasses.map((item, index) => `<div class="today-class"><span class="class-time-block"><strong>${escapeHTML(item.time)}</strong><small>${item.duration} min</small></span><i class="class-color-bar ${index ? "lilac" : ""}"></i><span class="today-class-info"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(courseLabel(item.courseId))} · ${escapeHTML(item.room)}</small></span>${index === 0 ? '<span class="live-pill"><i></i>Today</span>' : ""}</div>`).join("")}</div>` : emptyState("No classes scheduled today", "Your next classes will appear on your schedule.", "▧")}
        </article>
        <article class="instructor-panel">${panelHeading("NEEDS YOUR ATTENTION", "Assignments to review", `${pendingReviews()} submissions need grading`, `<button class="text-link" data-route="assignments" type="button">View all →</button>`)}
          ${submissions.length ? `<div class="submission-list">${submissions.map(item => `<div class="submission-row"><span class="mini-avatar">${escapeHTML(initials(item.student?.name))}</span><span class="submission-row-copy"><strong>${escapeHTML(item.student?.name || "Student")}</strong><small>${escapeHTML(item.assignment.title)}</small></span><time>${escapeHTML(formatDate(item.submittedAt))}</time></div>`).join("")}</div>` : emptyState("Nothing to grade", "New submissions will appear here.", "✓")}
        </article>
      </section>
      <section class="instructor-grid">
        <article class="instructor-panel">${panelHeading("YOUR COURSES", "Course progress", "Current learning progress across assigned courses", `<button class="text-link" data-route="courses" type="button">All courses →</button>`)}
          <div class="assignment-rows">${data.courses.slice(0, 4).map(course => `<div class="assignment-row"><span class="assignment-row-icon">▤</span><span class="assignment-row-copy"><strong>${escapeHTML(course.title)}</strong><small>${course.students.length} enrolled · ${course.duration} weeks</small></span><span class="progress-percent"><span class="progress-track"><i style="width:${course.progress}%"></i></span><strong>${course.progress}%</strong></span></div>`).join("")}</div>
        </article>
        <article class="instructor-panel">${panelHeading("YOUR NEXT DEADLINES", "Upcoming assignments", "Due over the next 7 days")}
          ${dueSoon.length ? `<div class="assignment-rows">${dueSoon.slice(0, 4).map(assignment => `<div class="assignment-row"><span class="assignment-row-icon">▱</span><span class="assignment-row-copy"><strong>${escapeHTML(assignment.title)}</strong><small>${escapeHTML(courseLabel(assignment.courseId))}</small></span><span class="assignment-row-count">Due ${escapeHTML(formatDate(assignment.dueAt))}</span></div>`).join("")}</div>` : emptyState("No upcoming deadlines", "Your upcoming assignment deadlines will show here.", "✓")}
        </article>
      </section>
      <section class="instructor-grid">
        <article class="instructor-panel">${panelHeading("QUICK ACCESS", "Quick actions", "Jump straight into your teaching tasks")}<div class="quick-actions">
          ${quickAction("＋", "New assignment", "Create course work", "create-assignment")}${quickAction("◷", "Take attendance", "Record a class", "attendance")}${quickAction("▧", "Upload materials", "Share a resource", "upload-material")}${quickAction("◉", "Post announcement", "Reach your students", "create-announcement")}
        </div></article>
        <article class="instructor-panel">${panelHeading("COMMUNITY UPDATES", "Recent announcements", "Updates for your assigned courses", `<button class="text-link" data-route="announcements" type="button">See all →</button>`)}
          ${data.announcements.slice(0, 2).map(item => `<article class="announcement-card"><span class="announcement-icon">◉</span><div class="announcement-copy"><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.body)}</p><small>${escapeHTML(courseLabel(item.courseId))} · ${escapeHTML(formatDate(item.createdAt))}</small></div></article>`).join("") || emptyState("No announcements yet", "Share an update with your students.", "◉")}
        </article>
      </section>
      <section class="instructor-panel">${panelHeading("RECENT TEACHING ACTIVITY", "Activity log", "Your latest teaching updates", `<button class="text-link" data-route="activity" type="button">Full activity log →</button>`)}${renderActivityRows(recentActivities)}</section>`;
  }

  function quickAction(icon, title, note, action) {
    return `<button class="quick-action" data-action="${action}" type="button"><span class="quick-action-icon">${icon}</span><span><strong>${title}</strong><small>${note}</small></span></button>`;
  }

  function renderActivityRows(items) {
    return items.length ? `<div class="activity-timeline">${items.map(item => `<article class="activity-log-item"><time class="activity-log-time">${escapeHTML(formatDateTime(item.createdAt))}</time><i class="activity-log-dot"></i><div class="activity-log-copy"><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.detail)}</p></div></article>`).join("")}</div>` : emptyState("No activity recorded yet", "Teaching activity will appear here.");
  }

  function renderCourses() {
    const query = data.query.toLocaleLowerCase();
    const status = $("#instructor-content").dataset.status || "All";
    const courses = data.courses.filter(course => {
      const match = `${course.title} ${course.category} ${course.description}`.toLocaleLowerCase().includes(query);
      return match && (status === "All" || course.status === status);
    });
    const actions = `<button class="button button-secondary" data-action="course-filters" type="button">⚑ &nbsp;Filter</button>`;
    $("#instructor-content").innerHTML = `${heading("TEACHING / COURSE LIBRARY", "My Courses", "Courses assigned to you by your administrator.", actions)}
      <div class="toolbar"><div class="toolbar-start"><label class="field-search"><span>⌕</span><input id="course-search" type="search" value="${escapeHTML(data.query)}" placeholder="Search assigned courses"></label><select id="course-status-filter" aria-label="Filter course status">${["All", "Active", "Upcoming", "Completed"].map(option => `<option ${status === option ? "selected" : ""}>${option}</option>`).join("")}</select></div><div class="toolbar-end"><span class="status-pill">${courses.length} assigned</span></div></div>
      <div class="course-grid">${courses.map(course => `<article class="course-card"><div class="course-card-cover course-cover-${course.id === "ux" ? "lilac" : course.id === "systems" ? "mint" : course.id === "research" ? "blue" : "peach"}"><span class="course-cover-tag">${escapeHTML(course.category.toUpperCase())}</span><span class="course-cover-icon">${course.id === "systems" ? "◈" : course.id === "research" ? "⌕" : course.id === "portfolio" ? "✳" : "✦"}</span></div><div class="course-card-body"><div class="course-card-top"><span>${course.duration} weeks</span><span class="status-pill ${course.status === "Upcoming" ? "status-upcoming" : course.status === "Completed" ? "status-completed" : ""}">${escapeHTML(course.status)}</span></div><h3>${escapeHTML(course.title)}</h3><p>${escapeHTML(course.description)}</p><div class="course-instructor-line"><span class="mini-avatar">${escapeHTML(initials(data.instructor.fullName))}</span>${escapeHTML(data.instructor.fullName)} · ${course.students.length} students</div><div class="course-card-footer"><span>${course.modules.length} modules</span><strong>${course.progress}% complete</strong></div><div class="progress-track" style="margin-top:7px"><i style="width:${course.progress}%"></i></div><div class="table-actions" style="margin-top:9px"><button class="small-action" data-action="course-details" data-id="${course.id}" type="button">Course details</button><button class="small-action" data-action="course-students" data-id="${course.id}" type="button">View students</button></div></div></article>`).join("") || emptyState("No assigned courses found", "Try changing the search or status filter.", "▤")}</div>`;
    $("#course-search").addEventListener("input", event => { data.query = event.target.value; rerenderWithFocus(renderCourses); });
    $("#course-status-filter").addEventListener("change", event => { $("#instructor-content").dataset.status = event.target.value; renderCourses(); });
  }

  function renderStudents() {
    const query = data.query.toLocaleLowerCase();
    const courseFilter = $("#instructor-content").dataset.course || "all";
    const students = data.students.filter(student => {
      const text = `${student.name} ${student.studentId} ${student.email}`.toLocaleLowerCase();
      return text.includes(query) && (courseFilter === "all" || student.courseIds.includes(courseFilter));
    });
    const rows = students.map(student => `<tr><td><span class="person-cell"><span class="mini-avatar">${escapeHTML(initials(student.name))}</span><span><strong>${escapeHTML(student.name)}</strong><small>${escapeHTML(student.studentId)}</small></span></span></td><td>${student.courseIds.map(id => `<span class="status-pill">${escapeHTML(courseById(id)?.category || "")}</span>`).join(" ")}</td><td><span class="progress-percent"><span class="progress-track"><i style="width:${student.progress}%"></i></span><strong>${student.progress}%</strong></span></td><td>${student.attendance}%</td><td>${student.averageGrade}%</td><td><span class="${student.status === "Needs support" ? "risk-badge" : "status-pill"}">${escapeHTML(student.status)}</span></td><td><button class="small-action" data-action="student-details" data-id="${student.id}" type="button">View</button></td></tr>`).join("");
    $("#instructor-content").innerHTML = `${heading("TEACHING / LEARNER DIRECTORY", "My Students", `${data.students.length} students across your assigned courses.`, `<button class="button button-secondary" data-action="export-students" type="button">↓ &nbsp;Export CSV</button>`)}
      <div class="toolbar"><div class="toolbar-start"><label class="field-search"><span>⌕</span><input id="student-search" type="search" value="${escapeHTML(data.query)}" placeholder="Search by name or student ID"></label><select id="student-course-filter" aria-label="Filter students by course"><option value="all">All assigned courses</option>${data.courses.map(course => `<option value="${course.id}" ${courseFilter === course.id ? "selected" : ""}>${escapeHTML(course.title)}</option>`).join("")}</select></div><div class="toolbar-end"><button class="button button-secondary" data-action="reset-student-filters" type="button">Reset filters</button></div></div>
      <article class="instructor-panel data-panel"><div class="data-panel-heading">${panelHeading("ASSIGNED LEARNERS", "Student directory", "Student data is scoped to your assigned courses.")}</div><div class="instructor-table-wrap"><table class="instructor-table"><thead><tr><th>STUDENT</th><th>COURSES</th><th>PROGRESS</th><th>ATTENDANCE</th><th>AVG. GRADE</th><th>STATUS</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="7" class="table-empty"><strong>No matching students</strong><small>Try another name, ID, or course filter.</small></td></tr>`}</tbody></table></div><div class="table-footer"><span>Showing ${students.length} of ${data.students.length} assigned students</span></div></article>`;
    $("#student-search").addEventListener("input", event => { data.query = event.target.value; rerenderWithFocus(renderStudents); });
    $("#student-course-filter").addEventListener("change", event => { $("#instructor-content").dataset.course = event.target.value; rerenderWithFocus(renderStudents); });
  }

  function renderSchedule() {
    const selectedCourse = $("#instructor-content").dataset.course || "all";
    const classes = data.classes.filter(item => selectedCourse === "all" || item.courseId === selectedCourse).sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
    const rows = classes.map(item => `<div class="schedule-row"><div class="schedule-date"><strong>${escapeHTML(formatDate(item.startsAt, { weekday: "short", month: "short", day: "numeric" }))}</strong><small>${escapeHTML(item.time)} · ${item.duration} min</small></div><div class="schedule-copy"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(courseLabel(item.courseId))}</small></div><span class="schedule-course">${escapeHTML(getCourseStudents(item.courseId).length)} students</span><span class="schedule-location">${escapeHTML(item.mode)} · ${escapeHTML(item.room)}</span><button class="small-action" data-action="request-reschedule" data-id="${item.id}" type="button">Request change</button></div>`).join("");
    $("#instructor-content").innerHTML = `${heading("MAIN / TEACHING CALENDAR", "Class Schedule", "Your upcoming classes across assigned courses.", `<button class="button button-secondary" data-action="export-schedule" type="button">↓ &nbsp;Export schedule</button>`)}
      <div class="toolbar"><div class="toolbar-start"><span class="status-pill">${data.classes.length} upcoming classes</span><select id="schedule-course-filter" aria-label="Filter schedule by course"><option value="all">All assigned courses</option>${data.courses.map(course => `<option value="${course.id}" ${selectedCourse === course.id ? "selected" : ""}>${escapeHTML(course.title)}</option>`).join("")}</select></div><span class="cell-secondary">Official schedule changes require administrator approval.</span></div>
      <article class="instructor-panel data-panel"><div class="data-panel-heading">${panelHeading("UPCOMING", "Teaching timetable", "Class time is shown in your local timezone.")}</div>${rows ? `<div class="schedule-list">${rows}</div>` : emptyState("No scheduled classes", "Your assigned classes will appear here.", "▧")}</article>
      <div class="instructor-panel" style="margin-top:11px">${panelHeading("SCHEDULE GUIDANCE", "Schedule change requests", "Instructors can request changes; the administrator controls official schedules.")}<p class="cell-secondary">Use “Request change” on a session to send a suggested replacement time and reason to the scheduling team.</p></div>`;
    $("#schedule-course-filter").addEventListener("change", event => { $("#instructor-content").dataset.course = event.target.value; renderSchedule(); });
  }

  function attendanceFor(classId, studentId, date) {
    return data.attendance.find(record => record.classId === classId && record.studentId === studentId && record.date === date)?.status || "";
  }

  function renderAttendanceRows() {
    const classId = $("#attendance-class")?.value;
    const date = $("#attendance-date")?.value;
    const body = $("#attendance-body");
    if (!body) return;
    const session = data.classes.find(item => item.id === classId);
    const students = session ? getCourseStudents(session.courseId) : [];
    body.innerHTML = students.length ? students.map(student => `<tr><td><span class="person-cell"><span class="mini-avatar">${escapeHTML(initials(student.name))}</span><span><strong>${escapeHTML(student.name)}</strong><small>${escapeHTML(student.studentId)}</small></span></span></td><td>${escapeHTML(courseLabel(session.courseId))}</td><td><select class="attendance-select-status" data-attendance-student="${student.id}" aria-label="Attendance for ${escapeHTML(student.name)}"><option value="">Not marked</option>${["Present", "Absent", "Late"].map(status => `<option ${attendanceFor(classId, student.id, date) === status ? "selected" : ""}>${status}</option>`).join("")}</select></td><td><span class="cell-secondary">${student.attendance}% overall</span></td></tr>`).join("") : `<tr><td colspan="4" class="table-empty"><strong>No students enrolled</strong><small>Choose a session with enrolled students.</small></td></tr>`;
    updateAttendanceSummary();
  }

  function updateAttendanceSummary() {
    const records = $$("[data-attendance-student]").map(select => select.value).filter(Boolean);
    $("#attendance-marked-count").innerHTML = `<strong>${records.length}</strong> of <strong>${$$("[data-attendance-student]").length}</strong> marked`;
    $("#attendance-present-count").textContent = `${records.filter(status => status === "Present").length} present`;
    $("#attendance-absent-count").textContent = `${records.filter(status => status === "Absent").length} absent`;
    $("#attendance-late-count").textContent = `${records.filter(status => status === "Late").length} late`;
  }

  function renderAttendance() {
    const firstClass = data.classes[0]?.id || "";
    $("#instructor-content").innerHTML = `${heading("TEACHING / CLASS REGISTER", "Attendance", "Record attendance for your assigned classes.", `<button class="button button-secondary" data-action="export-attendance" type="button">↓ &nbsp;Export CSV</button>`)}
      <div class="attendance-controls"><label class="form-field">Class session<select class="form-control" id="attendance-class">${data.classes.map(item => `<option value="${item.id}">${escapeHTML(courseLabel(item.courseId))} · ${escapeHTML(item.title)}</option>`).join("")}</select></label><label class="form-field">Attendance date<input class="form-control" id="attendance-date" type="date" value="${dateInputValue(new Date())}"></label><label class="form-field">Course<select class="form-control" id="attendance-course">${data.courses.map(course => `<option value="${course.id}" ${course.id === data.classes.find(item => item.id === firstClass)?.courseId ? "selected" : ""}>${escapeHTML(course.title)}</option>`).join("")}</select></label><button class="button button-secondary" data-action="mark-all-present" type="button">✓ &nbsp;Mark all present</button><button class="button button-primary" data-action="save-attendance" type="button">Save register</button></div>
      <article class="instructor-panel data-panel"><div class="data-panel-heading">${panelHeading("DAILY REGISTER", "Class attendance", "Only students enrolled in this course are shown.")}<div class="attendance-mark-summary"><span id="attendance-marked-count"></span><span id="attendance-present-count"></span><span id="attendance-absent-count"></span><span id="attendance-late-count"></span></div></div><div class="instructor-table-wrap"><table class="instructor-table"><thead><tr><th>STUDENT</th><th>COURSE</th><th>ATTENDANCE</th><th>OVERALL RATE</th></tr></thead><tbody id="attendance-body"></tbody></table></div></article>
      <div class="instructor-panel" style="margin-top:11px">${panelHeading("ATTENDANCE HISTORY", "Recent class records", "Attendance entries saved in this preview session.")}${renderAttendanceHistory()}</div>`;
    $("#attendance-class").addEventListener("change", renderAttendanceRows);
    $("#attendance-date").addEventListener("change", renderAttendanceRows);
    $("#attendance-course").addEventListener("change", event => {
      const choices = data.classes.filter(item => item.courseId === event.target.value);
      if (choices.length) $("#attendance-class").value = choices[0].id;
      renderAttendanceRows();
    });
    renderAttendanceRows();
  }

  function renderAttendanceHistory() {
    const recent = [...data.attendance].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
    return recent.length ? `<div class="assignment-rows">${recent.map(record => `<div class="assignment-row"><span class="assignment-row-icon">${record.status === "Present" ? "✓" : record.status === "Late" ? "◷" : "!"}</span><span class="assignment-row-copy"><strong>${escapeHTML(studentById(record.studentId)?.name || "Student")} · ${escapeHTML(record.status)}</strong><small>${escapeHTML(courseLabel(data.classes.find(item => item.id === record.classId)?.courseId))} · ${escapeHTML(record.date)}</small></span></div>`).join("")}</div>` : emptyState("No attendance saved yet", "Mark and save a register to see attendance history.", "◷");
  }

  function renderAssignments() {
    const filter = $("#instructor-content").dataset.filter || "All";
    const query = data.query.toLocaleLowerCase();
    const assignments = data.assignments.filter(item => {
      const matches = `${item.title} ${courseLabel(item.courseId)}`.toLocaleLowerCase().includes(query);
      return matches && (filter === "All" || item.status === filter);
    });
    const actions = `<button class="button button-primary" data-action="create-assignment" type="button"><span class="button-icon">＋</span> Create assignment</button>`;
    const rows = assignments.map(item => {
      const submitted = item.submissions.filter(submission => ["Submitted", "Graded", "Returned"].includes(submission.status)).length;
      const pending = item.submissions.filter(submission => submission.status === "Submitted").length;
      return `<tr><td><span class="person-cell"><span class="assignment-row-icon">▱</span><span><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(courseLabel(item.courseId))}</small></span></span></td><td>${escapeHTML(formatDate(item.dueAt, { month: "short", day: "numeric", year: "numeric" }))}</td><td>${submitted}/${getCourseStudents(item.courseId).length}</td><td>${pending ? `<span class="risk-badge">${pending} to grade</span>` : `<span class="status-pill">Up to date</span>`}</td><td><span class="status-pill ${item.status === "Draft" ? "status-draft" : ""}">${escapeHTML(item.status)}</span></td><td><div class="table-actions"><button class="small-action" data-action="review-assignment" data-id="${item.id}" type="button">Review</button><button class="small-action" data-action="edit-assignment" data-id="${item.id}" type="button">Edit</button>${item.status === "Published" ? `<button class="small-action" data-action="close-assignment" data-id="${item.id}" type="button">Close</button>` : ""}</div></td></tr>`;
    }).join("");
    $("#instructor-content").innerHTML = `${heading("TEACHING / COURSEWORK", "Assignments", "Create work, review student submissions, and provide feedback.", actions)}
      <div class="toolbar"><div class="toolbar-start"><label class="field-search"><span>⌕</span><input id="assignment-search" type="search" value="${escapeHTML(data.query)}" placeholder="Search assignments"></label><div class="filter-tabs">${["All", "Published", "Draft", "Closed"].map(option => `<button class="filter-tab ${filter === option ? "is-active" : ""}" data-assignment-filter="${option}" type="button">${option}</button>`).join("")}</div></div><span class="status-pill">${pendingReviews()} pending review</span></div>
      <article class="instructor-panel data-panel"><div class="data-panel-heading">${panelHeading("ASSIGNED COURSEWORK", "Assignment history", "Submission counts are scoped to your assigned students.")}</div><div class="instructor-table-wrap"><table class="instructor-table"><thead><tr><th>ASSIGNMENT</th><th>DUE DATE</th><th>SUBMISSIONS</th><th>REVIEW STATUS</th><th>STATUS</th><th></th></tr></thead><tbody>${rows || `<tr><td colspan="6" class="table-empty"><strong>No assignments found</strong><small>Create an assignment or update the current filters.</small></td></tr>`}</tbody></table></div></article>`;
    $("#assignment-search").addEventListener("input", event => { data.query = event.target.value; rerenderWithFocus(renderAssignments); });
  }

  function renderMaterials() {
    const courseFilter = $("#instructor-content").dataset.course || "all";
    const filteredMaterials = data.materials.filter(item => {
      const matchesQuery = `${item.title} ${item.description}`.toLocaleLowerCase().includes(data.query.toLocaleLowerCase());
      return matchesQuery && (courseFilter === "all" || item.courseId === courseFilter);
    });
    $("#instructor-content").innerHTML = `${heading("TEACHING / RESOURCE LIBRARY", "Learning Materials", "Organize and share resources with students in your assigned courses.", `<button class="button button-primary" data-action="upload-material" type="button"><span class="button-icon">↑</span> Add material</button>`)}
      <article class="instructor-panel"><div class="materials-drop"><span>↑</span><strong>Share a learning resource</strong><small>PDF, Word, presentation, image, ZIP, or code file · up to 25 MB</small><button class="button button-secondary" data-action="upload-material" type="button">Choose a file</button><small>Preview only: files are not uploaded or saved to a server.</small></div></article>
      <div class="toolbar" style="margin-top:12px"><div class="toolbar-start"><label class="field-search"><span>⌕</span><input id="material-search" type="search" value="${escapeHTML(data.query)}" placeholder="Search materials"></label><select id="material-course-filter" aria-label="Filter materials by course"><option value="all">All courses</option>${data.courses.map(course => `<option value="${course.id}" ${courseFilter === course.id ? "selected" : ""}>${escapeHTML(course.title)}</option>`).join("")}</select></div><span class="status-pill">${filteredMaterials.length} resources</span></div>
      <article class="instructor-panel data-panel"><div class="data-panel-heading">${panelHeading("YOUR TEACHING RESOURCES", "Course materials", "Published resources are intended for your enrolled students.")}</div>
        ${data.materials.length ? `<div class="assignment-rows">${filteredMaterials.map(item => `<div class="material-row"><span class="file-type-icon type-${escapeHTML(item.type.toLocaleLowerCase())}">${escapeHTML(item.type)}</span><span class="material-copy"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.fileName)} · ${escapeHTML(item.size)} · ${escapeHTML(courseLabel(item.courseId))}</small></span><span class="status-pill ${item.visibility === "Draft" ? "status-draft" : ""}">${escapeHTML(item.visibility)}</span><div class="material-actions"><button class="small-action" data-action="edit-material" data-id="${item.id}" type="button">Edit</button><button class="small-action" data-action="delete-material" data-id="${item.id}" type="button">Delete</button></div></div>`).join("") || emptyState("No materials match your filters", "Try a different title or course.")}</div>` : emptyState("No learning materials yet", "Add a resource to share it with your assigned students.", "▤")}
      </article>`;
    $("#material-search").addEventListener("input", event => { data.query = event.target.value; rerenderWithFocus(renderMaterials); });
    $("#material-course-filter").addEventListener("change", event => { $("#instructor-content").dataset.course = event.target.value; rerenderWithFocus(renderMaterials); });
  }

  function renderProgress() {
    const courseId = $("#instructor-content").dataset.course || data.courses[0]?.id;
    const students = getCourseStudents(courseId);
    const average = students.length ? Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length) : 0;
    const needsHelp = students.filter(student => student.progress < 45 || student.attendance < 75);
    const course = courseById(courseId);
    $("#instructor-content").innerHTML = `${heading("TEACHING / LEARNER OUTCOMES", "Student Progress", "Monitor learning progress and identify students who may need extra support.", `<button class="button button-secondary" data-action="export-progress" type="button">↓ &nbsp;Export CSV</button>`)}
      <div class="toolbar"><div class="toolbar-start"><label class="form-field">Assigned course<select id="progress-course-filter" class="form-control">${data.courses.map(item => `<option value="${item.id}" ${item.id === courseId ? "selected" : ""}>${escapeHTML(item.title)}</option>`).join("")}</select></label></div><span class="risk-badge">${needsHelp.length} students may need support</span></div>
      <section class="student-progress-hero"><article class="progress-overview-card"><span class="panel-kicker">${escapeHTML(course?.category || "")} · COURSE COHORT</span><div class="progress-overview-value"><strong>${average}%</strong><span>average course progress · ${students.length} students</span></div><span class="progress-track"><i style="width:${average}%"></i></span><div class="module-progress-list">${(course?.modules || []).map((module, index) => { const progress = Math.max(12, Math.min(100, Math.round(average + (index - 2) * 13))); return `<div class="module-progress-row"><span>${escapeHTML(module)}</span><span class="progress-track"><i style="width:${progress}%"></i></span><b>${progress}%</b></div>`; }).join("")}</div></article>
      <article class="progress-overview-card"><span class="panel-kicker">COURSE HEALTH</span><h2 style="margin:8px 0;font:700 12px Manrope,sans-serif">${escapeHTML(course?.title || "")}</h2><div class="assignment-rows"><div class="assignment-row"><span class="assignment-row-icon">♙</span><span class="assignment-row-copy"><strong>${students.length} learners enrolled</strong><small>Assigned by your administrator</small></span></div><div class="assignment-row"><span class="assignment-row-icon">◷</span><span class="assignment-row-copy"><strong>${students.length ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length) : 0}% average attendance</strong><small>Across this assigned course</small></span></div><div class="assignment-row"><span class="assignment-row-icon">▱</span><span class="assignment-row-copy"><strong>${students.length ? Math.round(students.reduce((sum, student) => sum + student.averageGrade, 0) / students.length) : 0}% average grade</strong><small>Across graded work</small></span></div></div></article></section>
      <article class="instructor-panel data-panel"><div class="data-panel-heading">${panelHeading("INDIVIDUAL LEARNER SUMMARY", "Student progress", "Add private teaching feedback for a student.")}</div><div class="instructor-table-wrap"><table class="instructor-table"><thead><tr><th>STUDENT</th><th>COMPLETED MODULES</th><th>COURSE PROGRESS</th><th>ATTENDANCE</th><th>AVG. GRADE</th><th>STATUS</th><th></th></tr></thead><tbody>${students.map(student => `<tr><td><span class="person-cell"><span class="mini-avatar">${escapeHTML(initials(student.name))}</span><span><strong>${escapeHTML(student.name)}</strong><small>${escapeHTML(student.studentId)}</small></span></span></td><td>${student.completedModules}/${course.modules.length}</td><td><span class="progress-percent"><span class="progress-track"><i style="width:${student.progress}%"></i></span><strong>${student.progress}%</strong></span></td><td>${student.attendance}%</td><td>${student.averageGrade}%</td><td>${student.status === "Needs support" ? '<span class="risk-badge">Needs support</span>' : '<span class="status-pill">On track</span>'}</td><td><button class="small-action" data-action="student-feedback" data-id="${student.id}" type="button">Feedback</button></td></tr>`).join("") || `<tr><td colspan="7" class="table-empty"><strong>No learners enrolled</strong></td></tr>`}</tbody></table></div></article>`;
    $("#progress-course-filter").addEventListener("change", event => { $("#instructor-content").dataset.course = event.target.value; renderProgress(); });
  }

  function renderAnnouncements() {
    $("#instructor-content").innerHTML = `${heading("COMMUNICATION / CLASS UPDATES", "Announcements", "Share important updates with students in your assigned courses.", `<button class="button button-primary" data-action="create-announcement" type="button"><span class="button-icon">＋</span> New announcement</button>`)}
      <div class="toolbar"><span class="cell-secondary">${data.announcements.length} announcements · visible to the selected assigned course</span></div>
      <div class="announcement-list-page">${data.announcements.map(item => `<article class="instructor-panel announcement-entry"><div class="announcement-entry-head"><span class="announcement-icon">◉</span><span class="status-pill">${escapeHTML(item.status)}</span></div><h2>${escapeHTML(item.title)}</h2><p>${escapeHTML(item.body)}</p><div class="announcement-entry-foot"><span>${escapeHTML(courseLabel(item.courseId))} · ${escapeHTML(formatDate(item.createdAt, { month: "short", day: "numeric", year: "numeric" }))}</span><span class="table-actions"><button class="small-action" data-action="edit-announcement" data-id="${item.id}" type="button">Edit</button><button class="small-action" data-action="delete-announcement" data-id="${item.id}" type="button">Delete</button></span></div></article>`).join("") || emptyState("No announcements yet", "Post a note for students in one of your assigned courses.", "◉")}</div>`;
  }

  function renderNotifications() {
    $("#instructor-content").innerHTML = `${heading("COMMUNICATION / WORKSPACE UPDATES", "Notifications", `${getUnreadCount()} unread updates`, `<button class="button button-secondary" data-action="mark-all-notifications" type="button">✓ &nbsp;Mark all read</button>`)}
      <div class="notification-page-list">${data.notifications.map(item => `<article class="notification-page-item ${item.read ? "" : "is-unread"}"><span class="notification-type tone-${item.id === "no3" ? "peach" : "green"}">✳</span><div><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.detail)}</p><time>${escapeHTML(formatDateTime(item.createdAt))}</time></div>${item.read ? '<span class="status-pill">Read</span>' : `<button class="small-action" data-action="mark-notification-read" data-id="${item.id}" type="button">Mark read</button>`}</article>`).join("") || emptyState("You're all caught up", "New course and student updates will appear here.", "✓")}</div>`;
  }

  function renderReports() {
    const selectedCourse = $("#instructor-content").dataset.course || "all";
    const courses = data.courses.filter(course => selectedCourse === "all" || course.id === selectedCourse);
    const students = data.students.filter(student => selectedCourse === "all" || student.courseIds.includes(selectedCourse));
    const avgGrade = students.length ? Math.round(students.reduce((sum, student) => sum + student.averageGrade, 0) / students.length) : 0;
    const avgAttendance = students.length ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length) : 0;
    const avgProgress = students.length ? Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length) : 0;
    $("#instructor-content").innerHTML = `${heading("ACCOUNT / TEACHING INSIGHTS", "Reports & Analytics", "Performance summaries for your assigned courses.", `<button class="button button-secondary" data-action="export-report" type="button">↓ &nbsp;Download CSV</button><button class="button button-secondary" data-action="print-report" type="button">⎙ &nbsp;Print</button>`)}
      <div class="toolbar"><div class="toolbar-start"><label class="form-field">Course scope<select id="report-course-filter" class="form-control"><option value="all">All assigned courses</option>${data.courses.map(course => `<option value="${course.id}" ${selectedCourse === course.id ? "selected" : ""}>${escapeHTML(course.title)}</option>`).join("")}</select></label></div><span class="cell-secondary">Preview analytics calculated from sample data.</span></div>
      <div class="report-kpis"><article class="report-kpi"><small>Assigned students</small><strong>${students.length}</strong></article><article class="report-kpi"><small>Average attendance</small><strong>${avgAttendance}%</strong></article><article class="report-kpi"><small>Average assignment grade</small><strong>${avgGrade}%</strong></article></div>
      <article class="instructor-panel">${panelHeading("COURSE PERFORMANCE", "Student progress by course", "Average learner progress in your assigned courses")}<div class="report-bars">${courses.map(course => { const assigned = getCourseStudents(course.id); const progress = assigned.length ? Math.round(assigned.reduce((sum, student) => sum + student.progress, 0) / assigned.length) : 0; return `<div class="report-bar-row"><span>${escapeHTML(course.title)}</span><span class="progress-track"><i style="width:${progress}%"></i></span><strong>${progress}%</strong></div>`; }).join("") || emptyState("No report data", "Course data will appear when it is available.")}</div></article>
      <article class="instructor-panel" style="margin-top:11px">${panelHeading("ENGAGEMENT", "Assignment completion", "Submitted or graded work compared with assigned learners")}<div class="report-bars">${courses.map(course => { const assignedIds = new Set(course.students); const courseAssignments = data.assignments.filter(item => item.courseId === course.id && item.status !== "Draft"); const submissions = courseAssignments.flatMap(item => item.submissions).filter(item => assignedIds.has(item.studentId)); const done = submissions.filter(item => ["Submitted", "Graded", "Returned"].includes(item.status)).length; const total = courseAssignments.length * assignedIds.size; const percent = total ? Math.round(done / total * 100) : 0; return `<div class="report-bar-row"><span>${escapeHTML(course.title)}</span><span class="progress-track"><i style="width:${percent}%"></i></span><strong>${percent}%</strong></div>`; }).join("")}</div><p class="cell-secondary" style="margin-top:12px">Filtered cohort averages: ${avgProgress}% progress · ${avgAttendance}% attendance · ${avgGrade}% average grade.</p></article>`;
    $("#report-course-filter").addEventListener("change", event => { $("#instructor-content").dataset.course = event.target.value; renderReports(); });
  }

  function renderActivity() {
    const query = data.query.toLocaleLowerCase();
    const period = $("#instructor-content").dataset.period || "all";
    const days = period === "today" ? 1 : period === "week" ? 7 : Infinity;
    const cutoff = Date.now() - days * 86400000;
    const activities = data.activity.filter(item => `${item.title} ${item.detail}`.toLocaleLowerCase().includes(query) && new Date(item.createdAt).getTime() >= cutoff);
    $("#instructor-content").innerHTML = `${heading("ACCOUNT / AUDIT TRAIL", "Activity Log", "A preview of recent teaching actions in this workspace.", `<button class="button button-secondary" data-action="export-activity" type="button">↓ &nbsp;Export log</button>`)}
      <div class="toolbar"><div class="toolbar-start"><label class="field-search"><span>⌕</span><input id="activity-search" type="search" value="${escapeHTML(data.query)}" placeholder="Search activity"></label><select id="activity-period" aria-label="Filter by period"><option value="all" ${period === "all" ? "selected" : ""}>All activity</option><option value="today" ${period === "today" ? "selected" : ""}>Today</option><option value="week" ${period === "week" ? "selected" : ""}>Last 7 days</option></select></div></div>
      <article class="instructor-panel">${panelHeading("INSTRUCTOR ACTIONS", "Teaching activity", `${activities.length} recent actions`)}${renderActivityRows(activities)}</article>`;
    $("#activity-search").addEventListener("input", event => { data.query = event.target.value; rerenderWithFocus(renderActivity); });
    $("#activity-period").addEventListener("change", event => {
      $("#instructor-content").dataset.period = event.target.value;
      renderActivity();
    });
  }

  function renderProfile() {
    const instructor = data.instructor;
    $("#instructor-content").innerHTML = `${heading("ACCOUNT / TEACHING IDENTITY", "My Profile", "Update the instructor details displayed in this local preview.", `<span class="status-pill">Instructor</span>`)}
      <section class="profile-layout"><article class="profile-summary-card"><span class="profile-large-avatar" id="profile-initials">${instructor.avatarUrl ? `<img src="${escapeHTML(instructor.avatarUrl)}" alt="">` : escapeHTML(initials(instructor.fullName))}</span><h2 id="profile-card-name">${escapeHTML(instructor.fullName)}</h2><p>${escapeHTML(instructor.email)}</p><span class="status-pill">Instructor · ${escapeHTML(instructor.category)}</span><small class="cell-secondary">${data.courses.length} assigned courses · ${countStudents()} assigned students</small><label class="button button-secondary profile-photo-button" for="profile-picture">Upload profile photo</label><input id="profile-picture" class="visually-hidden" type="file" accept="image/*" aria-label="Choose profile photo"><small class="cell-secondary">Preview only; the image is not uploaded or saved.</small></article>
      <form class="instructor-panel profile-form" id="profile-form">${panelHeading("INSTRUCTOR INFORMATION", "Personal profile", "Password changes and account credentials are managed by Authentication.")}<div class="profile-form-grid"><label class="form-field">Full name<input class="form-control" name="fullName" required maxlength="100" value="${escapeHTML(instructor.fullName)}"></label><label class="form-field">Email address<input class="form-control" value="${escapeHTML(instructor.email)}" disabled></label><label class="form-field">Phone number<input class="form-control" name="phone" type="tel" maxlength="32" value="${escapeHTML(instructor.phone)}"></label><label class="form-field">Instructor category<input class="form-control" name="category" maxlength="80" value="${escapeHTML(instructor.category)}"></label><label class="form-field span-all">Professional biography<textarea class="form-control" name="bio" maxlength="500">${escapeHTML(instructor.bio)}</textarea></label><label class="form-field span-all">Skills and specializations<input class="form-control" name="skills" value="${escapeHTML(instructor.skills.join(", "))}" placeholder="Product design, Figma, user research"></label></div><div class="dialog-actions"><button class="button button-primary" type="submit">Save profile preview</button></div></form></section>`;
  }

  function renderSettings() {
    $("#instructor-content").innerHTML = `${heading("ACCOUNT / PREFERENCES", "Settings", "Tune the instructor dashboard experience.", "")}
      <article class="instructor-panel" style="max-width:760px">${panelHeading("DISPLAY", "Appearance", "Adjust dashboard colors and layout")}
        <div class="settings-list">${settingRow("☾", "Dark theme", "Use a darker palette in this browser preview.", "theme", data.settings.theme === "dark")}${settingRow("☰", "Compact sidebar", "Keep section icons visible and save workspace space.", "compact", document.querySelector("#instructor-shell").classList.contains("is-sidebar-collapsed"))}</div>
      </article>
      <article class="instructor-panel" style="max-width:760px;margin-top:11px">${panelHeading("COMMUNICATION", "Notification preferences", "Preview-only preferences; no email settings are changed.")}<div class="settings-list">${settingRow("♧", "Email notifications", "Get notified about course activity.", "emailNotifications", data.settings.emailNotifications)}${settingRow("◷", "Assignment deadlines", "Remind me about upcoming due dates.", "deadlineReminders", data.settings.deadlineReminders)}${settingRow("♙", "Student support alerts", "Highlight learners who may need help.", "studentAlerts", data.settings.studentAlerts)}${settingRow("▤", "Weekly teaching digest", "Receive a weekly teaching summary.", "weeklyDigest", data.settings.weeklyDigest)}</div></article>
      <article class="instructor-panel" style="max-width:760px;margin-top:11px">${panelHeading("ACCOUNT", "Authentication handoff", "This dashboard does not manage login, passwords, sessions, or sign-out.")}<p class="cell-secondary">Connect the sign-out control to the Authentication module. Password changes and account security should remain in that module.</p></article>`;
  }

  function settingRow(icon, title, detail, key, enabled) {
    return `<div class="setting-row"><span class="setting-row-icon">${icon}</span><span class="setting-row-copy"><strong>${escapeHTML(title)}</strong><small>${escapeHTML(detail)}</small></span><button class="switch" type="button" role="switch" aria-checked="${enabled}" aria-label="${escapeHTML(title)}" data-setting="${key}"><i></i></button></div>`;
  }

  function renderPage() {
    const page = navigation.some(item => item.key === activePage()) ? activePage() : "dashboard";
    if (page !== currentPage) {
      if (!preserveQueryOnNextPage) data.query = "";
      $("#instructor-content").dataset.course = "";
      $("#instructor-content").dataset.filter = "All";
      currentPage = page;
    }
    preserveQueryOnNextPage = false;
    const unread = getUnreadCount();
    $("#current-page-label").textContent = navigation.find(item => item.key === page)?.label || "Dashboard";
    $("#nav-unread-count").textContent = unread;
    $("#nav-unread-count").hidden = unread === 0;
    $("#topbar-unread-count").textContent = unread;
    $("#topbar-unread-count").hidden = unread === 0;
    $$(".instructor-nav-link").forEach(link => {
      const active = link.dataset.page === page;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    const renderers = {
      dashboard: renderDashboard, courses: renderCourses, students: renderStudents, schedule: renderSchedule,
      attendance: renderAttendance, assignments: renderAssignments, materials: renderMaterials, progress: renderProgress,
      announcements: renderAnnouncements, notifications: renderNotifications, reports: renderReports,
      activity: renderActivity, profile: renderProfile, settings: renderSettings
    };
    const pageState = data.pageStates[page];
    if (pageState?.status === "loading") {
      $("#instructor-content").innerHTML = `<section class="page-state-card" aria-label="Loading ${escapeHTML(navigation.find(item => item.key === page)?.label || "dashboard")}"><span class="page-state-spinner" aria-hidden="true"></span><strong>Loading dashboard data</strong><small>${escapeHTML(pageState.message || "Please wait while this section refreshes.")}</small></section>`;
    } else if (pageState?.status === "empty" || pageState?.status === "error") {
      const error = pageState.status === "error";
      $("#instructor-content").innerHTML = `${heading("INSTRUCTOR WORKSPACE", navigation.find(item => item.key === page)?.label || "Dashboard", error ? "This section could not be loaded." : "This section has no data to show yet.")}<section class="page-state-card ${error ? "page-state-error" : ""}" ${error ? 'role="alert"' : ""}><span aria-hidden="true">${error ? "!" : "▤"}</span><strong>${error ? "Unable to load this section" : "No data available"}</strong><small>${escapeHTML(pageState.message || (error ? "Please try again later." : "Content will appear when it is available."))}</small></section>`;
    } else {
      const content = renderers[page]();
      if (typeof content === "string") $("#instructor-content").innerHTML = content;
    }
    $("#instructor-sidebar").classList.remove("is-open");
    $("#instructor-scrim").classList.remove("is-visible");
  }

  function courseOptions(selected = "") {
    return data.courses.map(course => `<option value="${course.id}" ${course.id === selected ? "selected" : ""}>${escapeHTML(course.title)}</option>`).join("");
  }

  function showDialog(title, description, fields, submitLabel = "Save") {
    $("#dialog-content").innerHTML = `<form id="action-form" class="dialog-body"><h2 id="dialog-title">${escapeHTML(title)}</h2><p class="dialog-description">${escapeHTML(description)}</p><div class="dialog-fields">${fields}</div><div class="dialog-actions"><button class="button button-secondary" type="button" data-action="close-dialog">Cancel</button><button class="button button-primary" type="submit">${escapeHTML(submitLabel)}</button></div></form>`;
    $("#action-form").dataset.formKind = "";
    $("#instructor-dialog").showModal();
  }

  function openAssignmentDialog(existing = null) {
    const assignment = existing || {};
    showDialog(existing ? "Edit assignment" : "Create assignment", "Set course work for learners enrolled in one of your assigned courses.", `
      <label class="form-field">Assignment title<input class="form-control" name="title" required maxlength="120" value="${escapeHTML(assignment.title || "")}" placeholder="e.g. User research synthesis"></label>
      <label class="form-field">Assigned course<select class="form-control" name="courseId" required>${courseOptions(assignment.courseId)}</select></label>
      <label class="form-field">Instructions<textarea class="form-control" name="instructions" required maxlength="3000" placeholder="Explain the task, requirements, and submission format.">${escapeHTML(assignment.instructions || "")}</textarea></label>
      <label class="form-field">Due date<input class="form-control" name="dueAt" type="datetime-local" required value="${assignment.dueAt ? dateTimeInputValue(assignment.dueAt) : ""}"></label>
      <label class="form-field">Status<select class="form-control" name="status"><option ${assignment.status === "Published" ? "selected" : ""}>Published</option><option ${assignment.status === "Draft" || !existing ? "selected" : ""}>Draft</option><option ${assignment.status === "Closed" ? "selected" : ""}>Closed</option></select></label>`, existing ? "Save changes" : "Create assignment");
    $("#action-form").dataset.formKind = existing ? "edit-assignment" : "create-assignment";
    $("#action-form").dataset.id = existing?.id || "";
  }

  function openReviewDialog(assignment) {
    const submissions = assignment.submissions.map(submission => {
      const student = studentById(submission.studentId);
      return `<div class="assignment-row"><span class="mini-avatar">${escapeHTML(initials(student?.name))}</span><span class="assignment-row-copy"><strong>${escapeHTML(student?.name || "Student")} · ${escapeHTML(submission.status)}</strong><small>${submission.submittedAt ? `Submitted ${escapeHTML(formatDateTime(submission.submittedAt))}` : "No submission received"}</small>${submission.status === "Submitted" || submission.status === "Graded" || submission.status === "Returned" ? `<button class="small-action" type="button" data-action="grade-submission" data-assignment-id="${assignment.id}" data-submission-id="${submission.id}">${submission.status === "Submitted" ? "Grade & return" : "Edit feedback"}${submission.score !== null ? ` · ${submission.score}%` : ""}</button>` : ""}</span></div>`;
    }).join("");
    showDialog(assignment.title, `${courseLabel(assignment.courseId)} · Due ${formatDate(assignment.dueAt, { month: "short", day: "numeric", year: "numeric" })}`, `${assignment.instructions ? `<p class="cell-secondary">${escapeHTML(assignment.instructions)}</p>` : ""}<div class="assignment-rows">${submissions || emptyState("No submissions yet", "Students will appear here after submitting work.")}</div>`, "Close");
    $("#action-form").querySelector('[type="submit"]').hidden = true;
  }

  function openGradeDialog(assignment, submission) {
    const student = studentById(submission.studentId);
    showDialog(`Grade ${student?.name || "student"}`, `${assignment.title} · ${courseLabel(assignment.courseId)}`, `
      <label class="form-field">Grade (%)<input class="form-control" name="score" type="number" min="0" max="100" step="1" required value="${submission.score ?? ""}" placeholder="0–100"></label>
      <label class="form-field">Feedback<textarea class="form-control" name="feedback" required maxlength="2000" placeholder="Give specific, constructive feedback.">${escapeHTML(submission.feedback || "")}</textarea></label>`, "Return grade");
    $("#action-form").dataset.formKind = "grade-submission";
    $("#action-form").dataset.assignmentId = assignment.id;
    $("#action-form").dataset.submissionId = submission.id;
  }

  function openAnnouncementDialog(existing = null) {
    const item = existing || {};
    showDialog(existing ? "Edit announcement" : "New announcement", "This announcement is limited to students in one of your assigned courses.", `
      <label class="form-field">Announcement title<input class="form-control" name="title" required maxlength="120" value="${escapeHTML(item.title || "")}"></label>
      <label class="form-field">Assigned course<select class="form-control" name="courseId" required>${courseOptions(item.courseId)}</select></label>
      <label class="form-field">Message<textarea class="form-control" name="body" required maxlength="2000" placeholder="Write an update for your students.">${escapeHTML(item.body || "")}</textarea></label>`, existing ? "Save changes" : "Publish announcement");
    $("#action-form").dataset.formKind = existing ? "edit-announcement" : "create-announcement";
    $("#action-form").dataset.id = existing?.id || "";
  }

  function openMaterialDialog(existing = null) {
    const item = existing || {};
    showDialog(existing ? "Edit material details" : "Add learning material", "For this preview, file details are kept in memory only. They are not uploaded or shared with students.", `
      <label class="form-field">Material title<input class="form-control" name="title" required maxlength="120" value="${escapeHTML(item.title || "")}"></label>
      <label class="form-field">Assigned course<select class="form-control" name="courseId" required>${courseOptions(item.courseId)}</select></label>
      <label class="form-field">Description<textarea class="form-control" name="description" maxlength="500">${escapeHTML(item.description || "")}</textarea></label>
      ${existing ? "" : '<label class="form-field">Resource file<input class="form-control" name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.zip,.js,.html,.css,.py,.txt" required></label>'}
      <label class="form-field">Visibility<select class="form-control" name="visibility"><option>Draft</option><option>Published</option></select></label>`, existing ? "Save details" : "Add preview material");
    $("#action-form").dataset.formKind = existing ? "edit-material" : "create-material";
    $("#action-form").dataset.id = existing?.id || "";
  }

  function openRescheduleDialog(item) {
    showDialog("Request a schedule change", `${item.title} · ${formatDate(item.startsAt, { weekday: "long", month: "short", day: "numeric" })} at ${item.time}. Official schedules are controlled by your administrator.`, `
      <label class="form-field">Suggested date<input class="form-control" name="suggestedDate" type="date" required min="${dateInputValue(new Date())}"></label>
      <label class="form-field">Suggested time<input class="form-control" name="suggestedTime" type="time" required value="${item.time}"></label>
      <label class="form-field">Reason<textarea class="form-control" name="reason" required maxlength="500" placeholder="Explain why a schedule change is needed."></textarea></label>`, "Send request");
    $("#action-form").dataset.formKind = "request-reschedule";
    $("#action-form").dataset.id = item.id;
  }

  function openStudentDialog(student) {
    const feedback = student.feedback || "";
    showDialog(student.name, `${student.studentId} · ${student.email}`, `
      <div class="report-kpis"><div class="report-kpi"><small>Progress</small><strong>${student.progress}%</strong></div><div class="report-kpi"><small>Attendance</small><strong>${student.attendance}%</strong></div><div class="report-kpi"><small>Average grade</small><strong>${student.averageGrade}%</strong></div></div>
      <p class="dialog-description">Assigned courses: ${escapeHTML(student.courseIds.map(courseLabel).join(", "))}. Completed modules: ${student.completedModules}.</p>
      <label class="form-field">Instructor feedback<textarea class="form-control" name="feedback" maxlength="1000" placeholder="Private feedback in this preview only.">${escapeHTML(feedback)}</textarea></label>`, "Save feedback");
    $("#action-form").dataset.formKind = "student-feedback";
    $("#action-form").dataset.id = student.id;
  }

  function openFeedbackDialog(student) {
    openStudentDialog(student);
  }

  function exportCSV(filename, rows) {
    const csv = rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function exportAttendance() {
    exportCSV("instructor-attendance-preview.csv", [["Student", "Student ID", "Course", "Class", "Date", "Attendance"], ...data.attendance.map(record => [studentById(record.studentId)?.name, studentById(record.studentId)?.studentId, courseLabel(data.classes.find(item => item.id === record.classId)?.courseId), data.classes.find(item => item.id === record.classId)?.title, record.date, record.status])]);
  }

  function runAction(action, id, element) {
    if (action === "create-assignment") return openAssignmentDialog();
    if (action === "edit-assignment") return openAssignmentDialog(data.assignments.find(item => item.id === id));
    if (action === "close-assignment") {
      const assignment = data.assignments.find(item => item.id === id);
      if (!assignment) return;
      return confirmAction("Close assignment submissions?", "Students will no longer be able to submit this assignment.", () => {
        assignment.status = "Closed";
        addActivity("Assignment closed", assignment.title, "▱");
        renderAssignments();
        toast("Assignment closed in this preview session.");
      });
    }
    if (action === "review-assignment") return openReviewDialog(data.assignments.find(item => item.id === id));
    if (action === "grade-submission") return openGradeDialog(data.assignments.find(item => item.id === element.dataset.assignmentId), data.assignments.find(item => item.id === element.dataset.assignmentId)?.submissions.find(item => item.id === element.dataset.submissionId));
    if (action === "create-announcement") return openAnnouncementDialog();
    if (action === "edit-announcement") return openAnnouncementDialog(data.announcements.find(item => item.id === id));
    if (action === "create-material" || action === "upload-material") return openMaterialDialog();
    if (action === "edit-material") return openMaterialDialog(data.materials.find(item => item.id === id));
    if (action === "request-reschedule") return openRescheduleDialog(data.classes.find(item => item.id === id));
    if (action === "student-details" || action === "student-feedback") return openStudentDialog(data.students.find(item => item.id === id));
    if (action === "attendance") return setHash("attendance");
    if (action === "mark-all-present") {
      $$("[data-attendance-student]").forEach(select => { select.value = "Present"; });
      return updateAttendanceSummary();
    }
    if (action === "save-attendance") {
      const classId = $("#attendance-class").value;
      const date = $("#attendance-date").value;
      const session = data.classes.find(item => item.id === classId);
      if (!date || !session) return toast("Choose a class and attendance date.", "error");
      $$("[data-attendance-student]").forEach(select => {
        const existing = data.attendance.find(record => record.classId === classId && record.studentId === select.dataset.attendanceStudent && record.date === date);
        if (select.value) {
          if (existing) existing.status = select.value;
          else data.attendance.push({ id: crypto.randomUUID(), classId, studentId: select.dataset.attendanceStudent, date, status: select.value });
        } else if (existing) {
          data.attendance = data.attendance.filter(record => record !== existing);
        }
      });
      addActivity("Attendance recorded", `${session.title} · ${date}`, "◷");
      toast("Attendance saved in this preview session.");
      return renderAttendance();
    }
    if (action === "export-attendance") return exportAttendance();
    if (action === "export-students") return exportCSV("assigned-students-preview.csv", [["Name", "Student ID", "Email", "Courses", "Progress", "Attendance", "Average grade", "Status"], ...data.students.map(student => [student.name, student.studentId, student.email, student.courseIds.map(courseLabel).join("; "), student.progress, student.attendance, student.averageGrade, student.status])]);
    if (action === "export-progress") return exportCSV("student-progress-preview.csv", [["Student", "Student ID", "Courses", "Progress", "Attendance", "Average grade", "Status"], ...getCourseStudents($("#progress-course-filter").value).map(student => [student.name, student.studentId, student.courseIds.map(courseLabel).join("; "), student.progress, student.attendance, student.averageGrade, student.status])]);
    if (action === "export-report") return exportCSV("instructor-report-preview.csv", [["Course", "Students", "Average progress", "Attendance", "Average grade"], ...data.courses.map(course => { const students = getCourseStudents(course.id); return [course.title, students.length, students.length ? Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length) : 0, students.length ? Math.round(students.reduce((sum, student) => sum + student.attendance, 0) / students.length) : 0, students.length ? Math.round(students.reduce((sum, student) => sum + student.averageGrade, 0) / students.length) : 0]; })]);
    if (action === "print-report") return window.print();
    if (action === "export-activity") return exportCSV("instructor-activity-preview.csv", [["Date", "Action", "Details"], ...data.activity.map(item => [formatDateTime(item.createdAt), item.title, item.detail])]);
    if (action === "export-schedule") return exportCSV("instructor-schedule-preview.csv", [["Date", "Time", "Class", "Course", "Duration", "Location"], ...data.classes.map(item => [formatDate(item.startsAt), item.time, item.title, courseLabel(item.courseId), item.duration, item.room])]);
    if (action === "reset-student-filters") {
      data.query = "";
      $("#instructor-content").dataset.course = "all";
      return renderStudents();
    }
    if (action === "course-details") return showDialog(data.courses.find(item => item.id === id).title, "Assigned course overview.", `<p class="dialog-description">${escapeHTML(data.courses.find(item => item.id === id).description)}</p><div class="assignment-rows">${data.courses.find(item => item.id === id).modules.map((module, index) => `<div class="assignment-row"><span class="assignment-row-icon">${index + 1}</span><span class="assignment-row-copy"><strong>${escapeHTML(module)}</strong><small>Learning module · ${index < 2 ? "Available" : "In progress"}</small></span></div>`).join("")}</div>`, "Close");
    if (action === "course-students") {
      $("#instructor-content").dataset.course = id;
      data.query = "";
      return setHash("students");
    }
    if (action === "today") return toast(`Today · ${formatDate(new Date(), { weekday: "long", month: "long", day: "numeric" })}`);
    if (action === "clear-query") { data.query = ""; return renderPage(); }
    if (action === "delete-material") return confirmAction("Remove this material?", "This preview item will be removed for the current page session.", () => { data.materials = data.materials.filter(item => item.id !== id); addActivity("Material removed", "Removed a preview resource.", "▤"); renderMaterials(); });
    if (action === "delete-announcement") return confirmAction("Delete this announcement?", "This preview announcement will be removed for this session.", () => { data.announcements = data.announcements.filter(item => item.id !== id); renderAnnouncements(); toast("Announcement removed from preview."); });
    if (action === "mark-notification-read") { const item = data.notifications.find(notification => notification.id === id); if (item) item.read = true; return renderPage(); }
    if (action === "mark-all-notifications") { data.notifications.forEach(item => { item.read = true; }); return renderPage(); }
    if (action === "theme" || action === "compact" || action === "emailNotifications" || action === "deadlineReminders" || action === "studentAlerts" || action === "weeklyDigest") return toggleSetting(action, element);
    if (action === "close-dialog") return $("#instructor-dialog").close();
    if (action === "course-filters") { $("#course-status-filter").focus(); return; }
    if (action === "upload-material") return openMaterialDialog();
  }

  function confirmAction(title, message, onConfirm) {
    showDialog(title, message, "", "Confirm");
    $("#action-form").dataset.formKind = "confirm";
    $("#action-form").addEventListener("submit", event => { event.preventDefault(); $("#instructor-dialog").close(); onConfirm(); }, { once: true });
  }

  function toggleSetting(key, button) {
    if (key === "theme") {
      data.settings.theme = data.settings.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = data.settings.theme;
      $("#instructor-theme-button").innerHTML = `<span>${data.settings.theme === "dark" ? "☼" : "☾"}</span>`;
      return renderSettings();
    }
    if (key === "compact") {
      const collapsed = document.querySelector("#instructor-shell").classList.toggle("is-sidebar-collapsed");
      button?.setAttribute("aria-checked", String(collapsed));
      return;
    }
    data.settings[key] = !data.settings[key];
    button?.setAttribute("aria-checked", String(data.settings[key]));
  }

  function handleFormSubmit(event) {
    const form = event.target.closest("#action-form, #profile-form");
    if (!form) return;
    event.preventDefault();
    const values = new FormData(form);
    const kind = form.dataset.formKind;
    if (kind === "create-assignment" || kind === "edit-assignment") {
      const assignment = { title: String(values.get("title")).trim(), courseId: values.get("courseId"), instructions: String(values.get("instructions")).trim(), dueAt: new Date(values.get("dueAt")).toISOString(), status: values.get("status") };
      if (kind === "edit-assignment") Object.assign(data.assignments.find(item => item.id === form.dataset.id), assignment);
      else data.assignments.unshift({ id: crypto.randomUUID(), ...assignment, submissions: [] });
      addActivity(kind === "edit-assignment" ? "Assignment updated" : "Assignment created", `${assignment.title} · ${courseLabel(assignment.courseId)}`, "▱");
      $("#instructor-dialog").close();
      renderAssignments();
      return toast("Assignment saved in this preview session.");
    }
    if (kind === "grade-submission") {
      const assignment = data.assignments.find(item => item.id === form.dataset.assignmentId);
      const submission = assignment?.submissions.find(item => item.id === form.dataset.submissionId);
      if (!submission) return toast("That submission is no longer available.", "error");
      submission.score = Number(values.get("score"));
      submission.feedback = String(values.get("feedback")).trim();
      submission.status = "Graded";
      addActivity("Submission graded", `${studentById(submission.studentId)?.name} · ${assignment.title} · ${submission.score}%`, "✓");
      $("#instructor-dialog").close();
      renderAssignments();
      return toast("Grade and feedback saved in this preview session.");
    }
    if (kind === "create-announcement" || kind === "edit-announcement") {
      const announcement = { title: String(values.get("title")).trim(), courseId: values.get("courseId"), body: String(values.get("body")).trim(), createdAt: new Date().toISOString(), status: "Published" };
      if (kind === "edit-announcement") Object.assign(data.announcements.find(item => item.id === form.dataset.id), announcement);
      else data.announcements.unshift({ id: crypto.randomUUID(), ...announcement });
      if (kind === "create-announcement") data.notifications.unshift({ id: crypto.randomUUID(), title: "New course announcement", detail: announcement.title, createdAt: new Date().toISOString(), read: false });
      addActivity("Announcement published", `${announcement.title} · ${courseLabel(announcement.courseId)}`, "◉");
      $("#instructor-dialog").close();
      renderAnnouncements();
      return toast("Announcement published to the preview.");
    }
    if (kind === "create-material" || kind === "edit-material") {
      const file = values.get("file");
      const material = { title: String(values.get("title")).trim(), courseId: values.get("courseId"), description: String(values.get("description")).trim(), visibility: values.get("visibility") };
      if (kind === "create-material") {
        const allowed = /\.(pdf|doc|docx|ppt|pptx|png|jpe?g|webp|zip|js|html|css|py|txt)$/i;
        if (!file || !allowed.test(file.name)) return toast("Choose a supported learning resource file.", "error");
        if (file.size > 25 * 1024 * 1024) return toast("Choose a file smaller than 25 MB.", "error");
        const type = file.name.split(".").pop().toUpperCase();
        data.materials.unshift({ id: crypto.randomUUID(), ...material, fileName: file.name, size: file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`, type, addedAt: new Date().toISOString() });
        addActivity("Learning material added", `${material.title} · ${courseLabel(material.courseId)}`, "▤");
      } else {
        Object.assign(data.materials.find(item => item.id === form.dataset.id), material);
        addActivity("Material details updated", material.title, "▤");
      }
      $("#instructor-dialog").close();
      renderMaterials();
      return toast("Material details saved in this preview session; no file was uploaded.");
    }
    if (kind === "request-reschedule") {
      const item = data.classes.find(session => session.id === form.dataset.id);
      addActivity("Schedule change requested", `${item?.title || "Class"} · ${values.get("suggestedDate")} ${values.get("suggestedTime")}`, "▧");
      $("#instructor-dialog").close();
      return toast("Schedule change request drafted. Connect the administrator scheduling workflow to submit it.");
    }
    if (kind === "student-feedback") {
      const student = studentById(form.dataset.id);
      if (student) student.feedback = String(values.get("feedback")).trim();
      addActivity("Student feedback updated", student?.name || "Student", "✎");
      $("#instructor-dialog").close();
      return toast("Feedback saved in this preview session.");
    }
    if (form.id === "profile-form") {
      data.instructor.fullName = String(values.get("fullName")).trim();
      data.instructor.phone = String(values.get("phone")).trim();
      data.instructor.category = String(values.get("category")).trim();
      data.instructor.bio = String(values.get("bio")).trim();
      data.instructor.skills = String(values.get("skills")).split(",").map(skill => skill.trim()).filter(Boolean);
      $("#sidebar-name").textContent = data.instructor.fullName;
      $("#sidebar-initials").textContent = initials(data.instructor.fullName);
      $("#topbar-profile").textContent = initials(data.instructor.fullName);
      addActivity("Instructor profile updated", "Updated profile details in the local preview.", "◌");
      renderProfile();
      return toast("Profile preview updated. Connect profile saving through the profile module.");
    }
  }

  function setupEvents() {
    $("#instructor-menu-button").addEventListener("click", () => {
      if (matchMedia("(max-width: 850px)").matches) {
        const open = $("#instructor-sidebar").classList.toggle("is-open");
        $("#instructor-scrim").classList.toggle("is-visible", open);
        $("#instructor-menu-button").setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      } else {
        const collapsed = $("#instructor-shell").classList.toggle("is-sidebar-collapsed");
        $("#instructor-menu-button").setAttribute("aria-label", collapsed ? "Expand navigation" : "Collapse navigation");
      }
    });
    $("#instructor-scrim").addEventListener("click", () => {
      $("#instructor-sidebar").classList.remove("is-open");
      $("#instructor-scrim").classList.remove("is-visible");
    });
    $("#instructor-theme-button").addEventListener("click", () => {
      data.settings.theme = data.settings.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = data.settings.theme;
      $("#instructor-theme-button").innerHTML = `<span>${data.settings.theme === "dark" ? "☼" : "☾"}</span>`;
      if (activePage() === "settings") renderSettings();
    });
    $("#topbar-profile").addEventListener("click", () => setHash("profile"));
    $("#logout-button").addEventListener("click", () => toast("Sign-out will be connected by the Authentication developer."));
    $("#topbar-notifications").addEventListener("click", () => setHash("notifications"));
    $("#global-search").addEventListener("keydown", event => {
      if (event.key === "Escape") event.currentTarget.value = "";
      if (event.key === "Enter") {
        const target = activePage() === "courses" || activePage() === "assignments" || activePage() === "materials" ? activePage() : "students";
        setHash(target, event.currentTarget.value.trim());
        requestAnimationFrame(() => {
          const localSearch = { students: "#student-search", courses: "#course-search", assignments: "#assignment-search", materials: "#material-search" }[target];
          $(localSearch)?.focus();
        });
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        const search = $("#global-search");
        search.focus();
      }
      if (event.key === "Escape" && $("#instructor-dialog").open) $("#instructor-dialog").close();
    });
    $("#instructor-content").addEventListener("click", event => {
      const route = event.target.closest("[data-route]")?.dataset.route;
      if (route) { setHash(route); return; }
      const actionElement = event.target.closest("[data-action]");
      if (actionElement) runAction(actionElement.dataset.action, actionElement.dataset.id, actionElement);
      const filter = event.target.closest("[data-assignment-filter]")?.dataset.assignmentFilter;
      if (filter) { $("#instructor-content").dataset.filter = filter; renderAssignments(); }
    });
    $("#instructor-content").addEventListener("change", event => {
      const setting = event.target.closest("[data-setting]");
      if (setting) toggleSetting(setting.dataset.setting, setting);
      if (event.target.matches("[data-attendance-student]")) updateAttendanceSummary();
      if (event.target.id === "profile-picture") {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return toast("Choose an image smaller than 5 MB.", "error");
        if (data.instructor.avatarUrl.startsWith("blob:")) URL.revokeObjectURL(data.instructor.avatarUrl);
        data.instructor.avatarUrl = URL.createObjectURL(file);
        renderProfile();
        toast("Profile photo preview updated. It has not been uploaded.");
      }
    });
    $("#instructor-content").addEventListener("submit", handleFormSubmit);
    $("#dialog-content").addEventListener("submit", handleFormSubmit);
    $("#dialog-content").addEventListener("click", event => {
      const action = event.target.closest('[data-action="close-dialog"]');
      if (action) $("#instructor-dialog").close();
    });
    $("#instructor-dialog").addEventListener("click", event => {
      if (event.target === $("#instructor-dialog")) $("#instructor-dialog").close();
    });
    window.addEventListener("hashchange", renderPage);
  }

  function setInstructor(user) {
    if (!user || typeof user.fullName !== "string") throw new TypeError("Instructor display data requires a fullName string.");
    data.instructor.fullName = user.fullName.trim() || mockInstructor.fullName;
    for (const key of ["email", "phone", "category", "bio"]) {
      if (typeof user[key] === "string") data.instructor[key] = user[key];
    }
    $("#sidebar-name").textContent = data.instructor.fullName;
    $("#sidebar-initials").textContent = initials(data.instructor.fullName);
    $("#topbar-profile").textContent = initials(data.instructor.fullName);
    renderPage();
  }

  function setAssignedData(partialData) {
    if (!partialData || typeof partialData !== "object") throw new TypeError("Assigned data must be an object.");
    for (const key of ["courses", "students", "classes", "assignments", "materials", "announcements", "notifications", "attendance", "activity"]) {
      if (key in partialData && !Array.isArray(partialData[key])) throw new TypeError(`${key} must be an array.`);
    }
    for (const key of ["courses", "students", "classes", "assignments", "materials", "announcements", "notifications", "attendance", "activity"]) {
      if (Array.isArray(partialData[key])) data[key] = structuredClone(partialData[key]);
    }
    renderPage();
  }

  function setPageState(page, status, message = "") {
    if (!navigation.some(item => item.key === page)) throw new TypeError(`Unknown instructor page: ${page}`);
    if (!["loading", "empty", "error", "ready"].includes(status)) throw new TypeError(`Unsupported page state: ${status}`);
    if (status === "ready") delete data.pageStates[page];
    else data.pageStates[page] = { status, message: String(message) };
    if (activePage() === page) renderPage();
  }

  function initialize() {
    document.documentElement.dataset.theme = data.settings.theme;
    $("#instructor-theme-button").innerHTML = `<span>☾</span>`;
    $("#instructor-menu-button").setAttribute("aria-label", "Collapse navigation");
    setupEvents();
    renderPage();
    window.EjireInstructorDashboard = Object.freeze({ setInstructor, setAssignedData, setPageState, showToast: toast, setPage: setHash });
  }

  initialize();
})();
