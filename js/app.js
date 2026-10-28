import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const config = window.EJIRE_CONFIG;
const configured = config?.supabaseUrl && config?.supabaseAnonKey
  && !config.supabaseUrl.includes("YOUR-PROJECT")
  && !config.supabaseAnonKey.includes("YOUR_SUPABASE");
const supabase = configured ? createClient(config.supabaseUrl, config.supabaseAnonKey) : null;
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const state = { user: null, profile: null, theme: "light", page: "dashboard", courses: [], notifications: [], search: "", opening: false };

const navItems = [
  { label: "Overview", icon: "◫", page: "dashboard", roles: ["admin", "instructor", "student"] },
  { label: "My courses", icon: "▤", page: "courses", roles: ["admin", "instructor", "student"] },
  { label: "Class schedule", icon: "▦", page: "schedule", roles: ["admin", "instructor", "student"] },
  { label: "Announcements", icon: "◉", page: "announcements", roles: ["admin", "instructor", "student"] },
  { label: "Reports", icon: "▥", page: "reports", roles: ["admin", "instructor"] },
  { label: "My profile", icon: "◌", page: "profile", roles: ["admin", "instructor", "student"] },
  { label: "Settings", icon: "⚙", page: "settings", roles: ["admin", "instructor", "student"] }
];

const safe = (value = "") => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const initials = (name = "Ejire Tech") => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("");
const titleCase = value => value ? value[0].toUpperCase() + value.slice(1) : "";
const dateText = (value, options = { month: "short", day: "numeric" }) => value ? new Intl.DateTimeFormat(undefined, options).format(new Date(value)) : "Date to be announced";
const fullDate = value => value ? new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "Time to be announced";

function setAvatar(element, url, name) {
  element.replaceChildren();
  let imageUrl = "";
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.protocol === "https:") imageUrl = parsed.href;
  } catch {
    imageUrl = "";
  }
  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = "";
    element.append(image);
  } else {
    element.textContent = initials(name);
  }
}

function toast(message, kind = "success") {
  const node = document.createElement("div");
  node.className = `toast toast-${kind}`;
  node.textContent = message;
  $("#toast-region").append(node);
  window.setTimeout(() => node.remove(), 4200);
}

function showAuthError(message) {
  const error = $("#auth-error");
  error.textContent = message;
  error.hidden = false;
}

function setBusy(button, busy, label = "Please wait…") {
  if (busy) {
    button.dataset.label = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner"></span> ${label}`;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.label || button.innerHTML;
    delete button.dataset.label;
  }
}

function renderAuth(mode = "login") {
  $("#app-view").hidden = true;
  $("#auth-view").hidden = false;
  const register = mode === "register";
  const reset = mode === "reset";
  $("#name-field").hidden = !register;
  $("#auth-name").required = register;
  $("#confirm-password-field").hidden = !reset;
  $("#auth-confirm-password").required = reset;
  $("#auth-email").closest(".form-field").hidden = reset;
  $("#auth-email").required = !reset;
  $("#auth-password").autocomplete = register || reset ? "new-password" : "current-password";
  $("#auth-title").textContent = register ? "Create your account" : reset ? "Choose a new password" : "Welcome back";
  $("#auth-description").textContent = register ? "Start your learning journey with Ejire Tech." : reset ? "Choose a secure password for your account." : "Sign in to continue to your learning space.";
  $("#auth-submit").innerHTML = register ? 'Create account <span aria-hidden="true">→</span>' : reset ? 'Update password <span aria-hidden="true">→</span>' : 'Sign in <span aria-hidden="true">→</span>';
  $("#auth-switch-copy").textContent = register ? "Already have an account?" : "New to Ejire Tech?";
  $("#auth-switch").textContent = register ? "Sign in" : "Create an account";
  $("#auth-switch").hidden = reset;
  $("#auth-switch-copy").hidden = reset;
  $("#auth-note").hidden = !register;
  $("#forgot-link").hidden = register || reset;
  $("#auth-error").hidden = true;
  $("#auth-form").dataset.mode = mode;
}

async function authenticate(event) {
  event.preventDefault();
  if (!supabase) return showAuthError("Add your Supabase project URL and anon key in js/config.js to connect this app.");
  const form = event.currentTarget;
  const button = $("#auth-submit");
  const email = $("#auth-email").value.trim();
  const password = $("#auth-password").value;
  const register = form.dataset.mode === "register";
  const reset = form.dataset.mode === "reset";
  $("#auth-error").hidden = true;
  setBusy(button, true);
  try {
    if (reset) {
      if (password !== $("#auth-confirm-password").value) throw new Error("Your passwords don't match.");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast("Your password has been updated.");
      await openApp();
      return;
    }
    const result = register
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: $("#auth-name").value.trim() } } })
      : await supabase.auth.signInWithPassword({ email, password });
    if (result.error) throw result.error;
    if (register && !result.data.session) {
      showAuthError("Check your email to confirm your account, then sign in.");
      return;
    }
    state.user = result.data.user;
    await openApp();
  } catch (error) {
    showAuthError(error.message || "Unable to authenticate. Please try again.");
  } finally {
    setBusy(button, false);
  }
}

async function forgotPassword() {
  const email = $("#auth-email").value.trim();
  if (!email) return showAuthError("Enter your email address first.");
  if (!supabase) return showAuthError("Connect your Supabase project in js/config.js first.");
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    showAuthError("Password reset instructions have been sent to your email.");
  } catch (error) {
    showAuthError(error.message || "Unable to send a password reset email.");
  }
}

async function loadProfile() {
  const { data, error } = await supabase.from("profiles").select("id, full_name, email, phone, avatar_url, role, theme, sidebar_collapsed").eq("id", state.user.id).single();
  if (error) throw new Error(`Couldn't load your profile: ${error.message}. Apply supabase/schema.sql and check the profile setup.`);
  state.profile = data;
  state.theme = data.theme || "light";
  document.documentElement.dataset.theme = state.theme;
  $("#theme-toggle").innerHTML = `<span aria-hidden="true">${state.theme === "dark" ? "☀" : "☾"}</span>`;
  $("#sidebar-name").textContent = data.full_name || data.email || "Your account";
  $("#sidebar-role").textContent = titleCase(data.role);
  setAvatar($("#sidebar-avatar"), data.avatar_url, data.full_name || data.email);
  setAvatar($("#topbar-avatar"), data.avatar_url, data.full_name || data.email);
}

async function openApp() {
  if (state.opening) return;
  state.opening = true;
  try {
    await loadProfile();
    $("#auth-view").hidden = true;
    $("#app-view").hidden = false;
      $("#app-view").classList.toggle("sidebar-collapsed", Boolean(state.profile.sidebar_collapsed));
    renderNav();
    await Promise.all([loadNotifications(), renderPage(state.page)]);
  } catch (error) {
    console.error(error);
    toast(error.message, "error");
    if (error.message.includes("profile")) await signOut(false);
  } finally {
    state.opening = false;
  }
}

function renderNav() {
  const role = state.profile?.role || "student";
  const allowed = navItems.filter(item => item.roles.includes(role));
  $("#main-nav").innerHTML = allowed.map(item => `
    <button class="nav-item ${state.page === item.page ? "active" : ""}" data-page="${item.page}" type="button">
      <span class="nav-icon" aria-hidden="true">${item.icon}</span><span class="nav-label">${item.label}</span>
      ${item.page === "announcements" && state.notifications.filter(notification => !notification.read_at).length ? '<i class="nav-unread"></i>' : ""}
    </button>`).join("");
  $$("#main-nav [data-page]").forEach(button => button.addEventListener("click", () => navigate(button.dataset.page)));
}

function navigate(page) {
  state.page = page;
  renderNav();
  renderPage(page);
  $("#sidebar").classList.remove("sidebar-open");
  $("#sidebar-scrim").classList.remove("visible");
}

async function queryRows(table, columns = "*", configure = query => query) {
  const { data, error } = await configure(supabase.from(table).select(columns));
  if (error) throw new Error(`Couldn't load ${table.replaceAll("_", " ")}: ${error.message}`);
  return data || [];
}

async function loadDashboardData() {
  const role = state.profile.role;
  const isAdmin = role === "admin";
  const isInstructor = role === "instructor";
  const [courseRows, classRows, allClasses, announcements, attendance, enrollments, assignments, activities, directory] = await Promise.all([
    queryRows("courses", "id, title, description, category, status, instructor_id, created_at, duration_weeks", query => isInstructor ? query.eq("instructor_id", state.user.id) : query),
    queryRows("classes", "id, title, starts_at, ends_at, room, status, course_id, instructor_id, courses(title)", query => query.gte("starts_at", new Date().toISOString()).order("starts_at").limit(6)),
    queryRows("classes", "id"),
    queryRows("announcements", "id, title, body, created_at, target_role", query => query.order("created_at", { ascending: false }).limit(4)),
    queryRows("attendance", "id, status, class_id, student_id, created_at", query => query.order("created_at", { ascending: false }).limit(200)),
    queryRows("enrollments", "id, student_id, course_id, progress_percent, status, courses(title)"),
    queryRows("assignments", "id, title, due_at, course_id, courses(title), assignment_submissions(id, student_id, status)", query => query.order("due_at").limit(8)),
    queryRows("activities", "id, description, created_at, actor_name", query => query.order("created_at", { ascending: false }).limit(5)),
    queryRows("instructor_directory", "id, full_name, avatar_url")
  ]);
  const instructorNames = new Map(directory.map(person => [person.id, person.full_name]));
  const courses = courseRows.map(course => ({ ...course, profiles: { full_name: instructorNames.get(course.instructor_id) } }));
  const classes = classRows.map(item => ({ ...item, profiles: { full_name: instructorNames.get(item.instructor_id) } }));
  const students = isAdmin ? await queryRows("profiles", "id, role", query => query.eq("role", "student")) : [];
  const instructors = isAdmin ? await queryRows("profiles", "id, role", query => query.eq("role", "instructor")) : [];
  state.courses = courses;
  return { courses, classes, allClasses, announcements, attendance, enrollments, assignments, activities, students, instructors, isAdmin, isInstructor };
}

const statCard = (label, value, detail, icon, tone = "green") => `
  <article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon ${tone}">${icon}</span></div>
    <strong class="stat-value">${value}</strong><span class="stat-detail">${detail}</span></article>`;

function greeting() {
  const hour = new Date().getHours();
  const part = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  return `Good ${part}, ${(state.profile.full_name || "there").split(" ")[0]}.`;
}

function courseMarkup(course, showInstructor = true) {
  const colors = ["mint", "peach", "lavender", "blue"];
  const color = colors[Math.abs((course.title || "").length) % colors.length];
  const progress = Number(course.progress_percent || 0);
  return `<article class="course-card"><div class="course-cover ${color}"><span class="course-category">${safe(course.category || "Learning")}</span><span class="course-cover-icon">✳</span></div>
    <div class="course-card-content"><div class="course-meta"><span>${safe(course.duration_weeks ? `${course.duration_weeks} weeks` : "Self-paced")}</span><span class="status-dot ${safe(course.status || "active")}">${safe(titleCase(course.status || "active"))}</span></div>
    <h3>${safe(course.title)}</h3><p>${safe(course.description || "Explore course materials and activities.")}</p>
    ${showInstructor ? `<div class="course-instructor"><span class="avatar avatar-mini">${initials(course.profiles?.full_name || "ET")}</span><span>${safe(course.profiles?.full_name || "Ejire Tech instructor")}</span></div>` : ""}
    <div class="progress-row"><span>${progress ? "Your progress" : "Course progress"}</span><strong>${progress}%</strong></div><div class="progress-track"><span style="width:${Math.min(progress, 100)}%"></span></div></div></article>`;
}

function renderDashboard(data) {
  const role = state.profile.role;
  const stats = data.isAdmin
    ? [["Registered students", data.students.length, "Learners on the platform", "♙", "green"], ["Instructors", data.instructors.length, "Teaching the next generation", "♧", "lavender"], ["Active courses", data.courses.filter(item => item.status === "active").length, "Available for learning", "▤", "peach"], ["Total classes", data.allClasses.length, "Sessions in your workspace", "▦", "blue"]]
    : role === "instructor"
      ? [["My courses", data.courses.length, "Courses in your workspace", "▤", "green"], ["Enrolled students", new Set(data.enrollments.map(item => item.student_id)).size, "Across your courses", "♙", "lavender"], ["Upcoming classes", data.classes.length, "On your schedule", "▦", "blue"], ["Assignments", data.assignments.length, "Coming up", "✎", "peach"]]
      : [["My courses", data.enrollments.length, "Courses you're enrolled in", "▤", "green"], ["Upcoming classes", data.classes.length, "Ready for your next session", "▦", "blue"], ["Attendance", `${attendancePercent(data.attendance)}%`, "Attendance rate", "◷", "lavender"], ["Assignments", data.assignments.length, "To keep you on track", "✎", "peach"]];
  const assignments = data.assignments.slice(0, 4);
  const recentActivities = data.activities;
  const avgProgress = data.enrollments.length ? Math.round(data.enrollments.reduce((sum, row) => sum + Number(row.progress_percent || 0), 0) / data.enrollments.length) : 0;
  return `<section class="welcome-row"><div><span class="eyebrow">${safe(titleCase(role))} workspace</span><h1>${safe(greeting())}</h1><p>Here's what's happening in your learning community.</p></div><button class="button button-primary" data-page="courses" type="button"><span>＋</span> Explore courses</button></section>
    <section class="stats-grid">${stats.map(item => statCard(...item)).join("")}</section>
    <div class="dashboard-grid"><section class="panel attendance-panel"><div class="section-heading"><div><h2>Attendance overview</h2><p>Your community's attendance at a glance</p></div><span class="panel-period">Last 4 weeks <span>⌄</span></span></div>
        ${data.attendance.length ? `<div class="chart-legend"><span><i class="legend-dot present"></i>Attendance recorded</span><strong>${attendancePercent(data.attendance)}% <small>attendance</small></strong></div><div class="attendance-chart" role="img" aria-label="Attendance rate for the last 14 days">${attendanceChartMarkup(data.attendance)}</div>` : emptyState("No attendance records yet", "Attendance will appear here after classes are recorded.")}
      </section>
      <section class="panel schedule-panel"><div class="section-heading"><div><h2>Upcoming classes</h2><p>What's next on your schedule</p></div><button class="inline-button" data-page="schedule" type="button">View all <span>→</span></button></div>
        ${data.classes.length ? `<div class="schedule-list">${data.classes.slice(0, 4).map(item => `<article class="schedule-item"><div class="date-badge"><strong>${safe(new Date(item.starts_at).getDate())}</strong><span>${safe(new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(item.starts_at)))}</span></div><div class="schedule-copy"><strong>${safe(item.title || item.courses?.title || "Class session")}</strong><span>${safe(fullDate(item.starts_at))}</span><small>${safe(item.room || item.profiles?.full_name || "Room to be announced")}</small></div><span class="schedule-arrow">↗</span></article>`).join("")}</div>` : emptyState("Nothing on the calendar", "Your next class will show here.")}</section>
      <section class="panel courses-panel"><div class="section-heading"><div><h2>${role === "student" ? "Continue learning" : "Course overview"}</h2><p>Pick up where you left off</p></div><button class="inline-button" data-page="courses" type="button">All courses <span>→</span></button></div>
        <div class="course-grid">${(role === "student" ? data.enrollments.map(row => ({ ...row.courses, progress_percent: row.progress_percent })) : data.courses).slice(0, 2).map(course => courseMarkup(course)).join("") || emptyState("No courses to show", "Courses will appear once they're available.")}</div></section>
      <section class="panel assignments-panel"><div class="section-heading"><div><h2>Assignments</h2><p>Stay on top of your work</p></div><span class="eyebrow">UP NEXT</span></div>
        ${assignments.length ? `<div class="assignment-list">${assignments.map(item => `<article class="assignment-item"><span class="assignment-icon">✎</span><div><strong>${safe(item.title)}</strong><span>${safe(item.courses?.title || "Course assignment")}</span></div><time>${safe(dateText(item.due_at))}</time></article>`).join("")}</div>` : emptyState("No assignments yet", "New assignments will appear here.")}</section>
      ${role === "student" ? `<section class="panel progress-panel"><div class="section-heading"><div><h2>Learning progress</h2><p>Your average progress across enrolled courses</p></div></div><div class="progress-summary"><strong>${avgProgress}%</strong><div class="progress-track"><span style="width:${avgProgress}%"></span></div><span>${data.enrollments.length} course${data.enrollments.length === 1 ? "" : "s"} enrolled</span></div></section>` : ""}
      <section class="panel announcements-panel"><div class="section-heading"><div><h2>Latest announcements</h2><p>Notes from your community</p></div><button class="inline-button" data-page="announcements" type="button">See all <span>→</span></button></div>
        ${data.announcements.length ? `<div class="announcement-list">${data.announcements.slice(0, 3).map(item => `<article class="announcement-item"><span class="announcement-mark">↗</span><div><strong>${safe(item.title)}</strong><p>${safe(item.body)}</p><time>${safe(dateText(item.created_at, { month: "short", day: "numeric", year: "numeric" }))}</time></div></article>`).join("")}</div>` : emptyState("No announcements yet", "Important updates will appear here.")}</section>
      <section class="panel activities-panel"><div class="section-heading"><div><h2>Recent activity</h2><p>Latest updates from your workspace</p></div></div>${recentActivities.length ? `<div class="activity-list">${recentActivities.map(item => `<article class="activity-item"><span class="activity-dot"></span><div><strong>${safe(item.description)}</strong><time>${safe(dateText(item.created_at, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }))}</time></div></article>`).join("")}</div>` : emptyState("No recent activity", "New activity will appear here.")}</section>
    </div>`;
}

function attendanceChartMarkup(records) {
  const days = new Map();
  for (const record of records) {
    const day = new Date(record.created_at).toLocaleDateString();
    const count = days.get(day) || { total: 0, present: 0, date: record.created_at };
    count.total += 1;
    if (record.status === "present" || record.status === "late") count.present += 1;
    days.set(day, count);
  }
  return [...days.values()].slice(0, 14).reverse().map((item, index) => {
    const rate = Math.round(item.present / item.total * 100);
    return `<div class="chart-column" title="${safe(dateText(item.date, { month: "short", day: "numeric" }))}: ${rate}% (${item.total} record${item.total === 1 ? "" : "s"})"><span style="height:${Math.max(rate, 5)}%" class="bar-present"></span><small>${index % 2 === 0 ? dateText(item.date) : ""}</small></div>`;
  }).join("");
}

function attendancePercent(records) {
  if (!records.length) return 0;
  return Math.round(records.filter(record => record.status === "present" || record.status === "late").length / records.length * 100);
}

function emptyState(title, copy) {
  return `<div class="empty-state"><span>✳</span><strong>${safe(title)}</strong><p>${safe(copy)}</p></div>`;
}

async function renderPage(page) {
  if (!supabase || !state.profile) return;
  state.page = page;
  const heading = navItems.find(item => item.page === page)?.label || "Overview";
  $("#breadcrumb-current").textContent = heading;
  const content = $("#page-content");
  content.innerHTML = `<div class="page-loading"><span class="spinner"></span> Loading your workspace…</div>`;
  try {
    if (page === "dashboard") {
      content.innerHTML = renderDashboard(await loadDashboardData());
    } else if (page === "courses") {
      await renderCourses();
    } else if (page === "schedule") {
      await renderSchedule();
    } else if (page === "announcements") {
      await renderAnnouncements();
    } else if (page === "reports") {
      await renderReports();
    } else if (page === "profile") {
      renderProfile();
    } else if (page === "settings") {
      renderSettings();
    }
  } catch (error) {
    console.error(error);
    content.innerHTML = `<div class="page-error"><span>!</span><h2>We couldn't load this page</h2><p>${safe(error.message)}</p><button id="retry-page" class="button button-secondary" type="button">Try again</button></div>`;
    $("#retry-page").addEventListener("click", () => renderPage(page));
  }
}

async function renderCourses() {
  const role = state.profile.role;
  const [courseRows, enrollments, directory] = await Promise.all([
    queryRows("courses", "id, title, description, category, status, instructor_id, duration_weeks", query => {
      const scoped = role === "instructor" ? query.eq("instructor_id", state.user.id) : query;
      return scoped.order("title");
    }),
    role === "student" ? queryRows("enrollments", "id, course_id, progress_percent, status", query => query.eq("student_id", state.user.id)) : Promise.resolve([]),
    queryRows("instructor_directory", "id, full_name, avatar_url")
  ]);
  const instructorNames = new Map(directory.map(person => [person.id, person.full_name]));
  const courses = courseRows.map(course => ({ ...course, profiles: { full_name: instructorNames.get(course.instructor_id) } }));
  state.courses = courses;
  const enrolled = new Map(enrollments.map(item => [item.course_id, item]));
  $("#page-content").innerHTML = `<section class="welcome-row page-welcome"><div><span class="eyebrow">YOUR LEARNING LIBRARY</span><h1>Explore courses</h1><p>Find your next skill and keep moving forward.</p></div><span id="course-result-count" class="result-count"></span></section><section class="filter-row"><label class="page-search"><span>⌕</span><input id="course-search" type="search" value="${safe(state.search)}" placeholder="Search by course or category"></label><select id="course-category" aria-label="Filter by category"><option value="">All categories</option>${[...new Set(courses.map(item => item.category).filter(Boolean))].map(category => `<option value="${safe(category)}">${safe(category)}</option>`).join("")}</select></section><div id="course-grid" class="course-grid course-grid-page"></div>`;
  const updateCourseGrid = () => {
    const category = $("#course-category").value;
    const list = courses.filter(course => {
      const matchSearch = `${course.title} ${course.description || ""} ${course.category || ""}`.toLowerCase().includes(state.search.toLowerCase());
      const matchCategory = !category || course.category === category;
      return matchSearch && matchCategory && (role !== "student" || course.status === "active" || enrolled.has(course.id));
    });
    $("#course-result-count").textContent = `${list.length} course${list.length === 1 ? "" : "s"}`;
    $("#course-grid").innerHTML = list.map(course => courseMarkup({ ...course, progress_percent: enrolled.get(course.id)?.progress_percent || 0 })).join("") || emptyState("No courses found", "Try changing your search or category filter.");
  };
  $("#course-search").addEventListener("input", event => { state.search = event.target.value; updateCourseGrid(); });
  $("#course-category").addEventListener("change", updateCourseGrid);
  updateCourseGrid();
}

async function renderSchedule() {
  const [classRows, directory] = await Promise.all([
    queryRows("classes", "id, title, starts_at, ends_at, room, status, course_id, instructor_id, courses(title)", query => query.gte("starts_at", new Date().toISOString()).order("starts_at")),
    queryRows("instructor_directory", "id, full_name, avatar_url")
  ]);
  const instructorNames = new Map(directory.map(person => [person.id, person.full_name]));
  const classes = classRows.map(item => ({ ...item, profiles: { full_name: instructorNames.get(item.instructor_id) } }));
  $("#page-content").innerHTML = `<section class="welcome-row page-welcome"><div><span class="eyebrow">PLAN YOUR WEEK</span><h1>Class schedule</h1><p>All your upcoming sessions in one place.</p></div><span class="result-count">${classes.length} upcoming</span></section><section class="panel full-panel"><div class="section-heading"><div><h2>Upcoming sessions</h2><p>Times are shown in your local timezone</p></div></div>${classes.length ? `<div class="schedule-list schedule-list-full">${classes.map(item => `<article class="schedule-item"><div class="date-badge"><strong>${safe(new Date(item.starts_at).getDate())}</strong><span>${safe(new Intl.DateTimeFormat(undefined, { month: "short" }).format(new Date(item.starts_at)))}</span></div><div class="schedule-copy"><strong>${safe(item.title || item.courses?.title || "Class session")}</strong><span>${safe(fullDate(item.starts_at))}${item.ends_at ? ` – ${safe(new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(item.ends_at)))}` : ""}</span><small>${safe(item.room || "Room to be announced")} · ${safe(item.profiles?.full_name || "Instructor to be announced")}</small></div><span class="status-dot ${safe(item.status || "scheduled")}">${safe(titleCase(item.status || "scheduled"))}</span></article>`).join("")}</div>` : emptyState("No upcoming classes", "Scheduled classes will appear here.")}</section>`;
}

async function renderAnnouncements() {
  const announcements = await queryRows("announcements", "id, title, body, created_at, target_role", query => query.order("created_at", { ascending: false }));
  $("#page-content").innerHTML = `<section class="welcome-row page-welcome"><div><span class="eyebrow">STAY IN THE LOOP</span><h1>Announcements</h1><p>Updates and news from your learning community.</p></div></section><section class="announcement-page-list">${announcements.map(item => `<article class="panel announcement-full"><div class="announcement-head"><span class="announcement-mark">↗</span><time>${safe(dateText(item.created_at, { month: "short", day: "numeric", year: "numeric" }))}</time></div><h2>${safe(item.title)}</h2><p>${safe(item.body)}</p><span class="announcement-author">Posted by ${safe(item.profiles?.full_name || "Ejire Tech")}</span></article>`).join("") || emptyState("No announcements yet", "Updates will appear here when they're posted.")}</section>`;
}

async function renderReports() {
  const role = state.profile.role;
  const [courses, enrollments, attendance, assignments] = await Promise.all([
    queryRows("courses", "id, title, status, instructor_id", query => role === "instructor" ? query.eq("instructor_id", state.user.id) : query),
    queryRows("enrollments", "id, course_id, progress_percent, status"),
    queryRows("attendance", "id, status"),
    queryRows("assignments", "id, title, due_at, assignment_submissions(id, status)")
  ]);
  const active = courses.filter(item => item.status === "active").length;
  const done = assignments.reduce((sum, item) => sum + (item.assignment_submissions || []).filter(sub => sub.status === "submitted" || sub.status === "graded").length, 0);
  const completion = assignments.length ? Math.round(done / Math.max(enrollments.length, 1) / assignments.length * 100) : 0;
  $("#page-content").innerHTML = `<section class="welcome-row page-welcome"><div><span class="eyebrow">${safe(titleCase(role))} INSIGHTS</span><h1>Reports &amp; progress</h1><p>A snapshot of learning activity across your workspace.</p></div><button id="download-report" class="button button-secondary" type="button">↓ Download report</button></section><section class="stats-grid">${statCard("Active courses", active, "Available to learners", "▤", "green")}${statCard("Course enrollments", enrollments.length, "Current enrollments", "♙", "lavender")}${statCard("Attendance rate", `${attendancePercent(attendance)}%`, "Across recorded classes", "◷", "blue")}${statCard("Assignment completion", `${completion}%`, "Submitted or graded", "✎", "peach")}</section><section class="panel full-panel report-panel"><div class="section-heading"><div><h2>Enrollment by course</h2><p>Current learner enrollment across your courses</p></div></div>${courses.length ? `<div class="report-bars">${courses.map(course => { const count = enrollments.filter(enrollment => enrollment.course_id === course.id).length; const max = Math.max(1, ...courses.map(item => enrollments.filter(enrollment => enrollment.course_id === item.id).length)); return `<div class="report-bar-row"><span>${safe(course.title)}</span><div class="progress-track"><span style="width:${count / max * 100}%"></span></div><strong>${count}</strong></div>`; }).join("")}</div>` : emptyState("No report data yet", "Course analytics will show after learners enroll.")}</section>`;
  $("#download-report").addEventListener("click", () => {
    const rows = [["Course", "Status", "Enrollments"], ...courses.map(course => [course.title, course.status, enrollments.filter(enrollment => enrollment.course_id === course.id).length])];
    const csv = rows.map(row => row.map(value => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    link.download = "ejire-tech-report.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  });
}

function renderProfile() {
  const profile = state.profile;
  const imageUrl = profile.avatar_url && /^https:\/\//i.test(profile.avatar_url) ? safe(profile.avatar_url) : "";
  $("#page-content").innerHTML = `<section class="welcome-row page-welcome"><div><span class="eyebrow">YOUR ACCOUNT</span><h1>My profile</h1><p>Manage the personal information linked to your account.</p></div></section><section class="profile-layout"><section class="panel profile-card"><div class="profile-cover"></div><div class="profile-avatar avatar">${imageUrl ? `<img src="${imageUrl}" alt="">` : initials(profile.full_name || profile.email)}</div><h2>${safe(profile.full_name || "Your name")}</h2><span class="role-badge">${safe(titleCase(profile.role))}</span><p>${safe(profile.email)}</p></section><form id="profile-form" class="panel profile-form"><div class="section-heading"><div><h2>Personal information</h2><p>Your profile is only visible to authorized members.</p></div></div><div class="avatar-upload-row"><span class="avatar avatar-upload-preview">${imageUrl ? `<img src="${imageUrl}" alt="">` : initials(profile.full_name || profile.email)}</span><label class="button button-secondary upload-button">Upload photo<input id="avatar-file" type="file" accept="image/jpeg,image/png,image/webp"></label><span class="upload-hint">JPG, PNG, or WebP · up to 2 MB</span></div><label class="form-field"><span>Full name</span><input name="full_name" value="${safe(profile.full_name || "")}" required maxlength="100"></label><label class="form-field"><span>Email address</span><input value="${safe(profile.email || state.user.email)}" disabled><small>Email changes are managed through account security.</small></label><label class="form-field"><span>Phone number</span><input name="phone" value="${safe(profile.phone || "")}" type="tel" maxlength="30" placeholder="+1 555 000 0000"></label><button class="button button-primary" type="submit">Save changes</button></form></section>`;
  $("#profile-form").addEventListener("submit", saveProfile);
  $("#avatar-file").addEventListener("change", uploadAvatar);
}

async function uploadAvatar(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    toast("Choose a JPG, PNG, or WebP image.", "error");
    input.value = "";
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    toast("Your profile picture must be 2 MB or smaller.", "error");
    input.value = "";
    return;
  }
  input.disabled = true;
  try {
    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const objectPath = `${state.user.id}/avatar-${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(objectPath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(objectPath);
    const { data, error } = await supabase.from("profiles").update({ avatar_url: publicUrl })
      .eq("id", state.user.id).select("id, full_name, email, phone, avatar_url, role, theme, sidebar_collapsed").single();
    if (error) {
      const { error: cleanupError } = await supabase.storage.from("avatars").remove([objectPath]);
      if (cleanupError) console.error("Unable to clean up unlinked avatar:", cleanupError);
      throw error;
    }
    state.profile = data;
    setAvatar($("#sidebar-avatar"), data.avatar_url, data.full_name || data.email);
    setAvatar($("#topbar-avatar"), data.avatar_url, data.full_name || data.email);
    await renderPage("profile");
    toast("Your profile picture has been updated.");
  } catch (error) {
    toast(`Couldn't upload your profile picture: ${error.message}`, "error");
  } finally {
    input.disabled = false;
    input.value = "";
  }
}

async function saveProfile(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = $("button[type=submit]", form);
  setBusy(button, true, "Saving…");
  try {
    const formData = new FormData(form);
    const update = { full_name: formData.get("full_name").trim(), phone: formData.get("phone").trim() || null };
    const { data, error } = await supabase.from("profiles").update(update).eq("id", state.user.id).select("id, full_name, email, phone, avatar_url, role, theme, sidebar_collapsed").single();
    if (error) throw error;
    state.profile = data;
    $("#sidebar-name").textContent = data.full_name;
    $(".profile-card h2").textContent = data.full_name || "Your name";
    setAvatar($("#sidebar-avatar"), data.avatar_url, data.full_name || data.email);
    setAvatar($("#topbar-avatar"), data.avatar_url, data.full_name || data.email);
    toast("Your profile has been updated.");
  } catch (error) {
    toast(error.message || "Unable to save your profile.", "error");
  } finally {
    setBusy(button, false);
  }
}

function renderSettings() {
  $("#page-content").innerHTML = `<section class="welcome-row page-welcome"><div><span class="eyebrow">MAKE IT YOURS</span><h1>Settings</h1><p>Adjust your workspace experience.</p></div></section><section class="panel settings-panel"><div class="section-heading"><div><h2>Appearance</h2><p>Choose the look that feels right for you.</p></div></div><div class="setting-row"><div class="setting-icon">☼</div><div class="setting-copy"><strong>Dark mode</strong><span>Use a darker color palette across the dashboard.</span></div><button id="theme-switch" class="toggle ${state.theme === "dark" ? "on" : ""}" type="button" role="switch" aria-checked="${state.theme === "dark"}" aria-label="Toggle dark mode"><span></span></button></div><div class="setting-row"><div class="setting-icon">☰</div><div class="setting-copy"><strong>Compact sidebar</strong><span>Keep navigation icons visible and save workspace space.</span></div><button id="sidebar-switch" class="toggle ${state.profile.sidebar_collapsed ? "on" : ""}" type="button" role="switch" aria-checked="${Boolean(state.profile.sidebar_collapsed)}" aria-label="Toggle compact sidebar"><span></span></button></div></section><section class="panel settings-panel account-settings"><div class="section-heading"><div><h2>Account</h2><p>Signed in as ${safe(state.user.email)}</p></div></div><button id="settings-signout" class="button button-secondary" type="button">Sign out of your account</button></section>`;
  $("#theme-switch").addEventListener("click", toggleTheme);
  $("#sidebar-switch").addEventListener("click", toggleSidebar);
  $("#settings-signout").addEventListener("click", () => signOut());
}

async function toggleSidebar() {
  const next = !state.profile.sidebar_collapsed;
  try {
    const { error } = await supabase.from("profiles").update({ sidebar_collapsed: next }).eq("id", state.user.id);
    if (error) throw error;
    state.profile.sidebar_collapsed = next;
    $("#app-view").classList.toggle("sidebar-collapsed", next);
    const control = $("#sidebar-switch");
    if (control) {
      control.classList.toggle("on", next);
      control.setAttribute("aria-checked", String(next));
    }
  } catch (error) {
    toast(`Couldn't save your sidebar preference: ${error.message}`, "error");
  }
}

async function toggleTheme() {
  const next = state.theme === "dark" ? "light" : "dark";
  try {
    const { error } = await supabase.from("profiles").update({ theme: next }).eq("id", state.user.id);
    if (error) throw error;
    state.theme = next;
    document.documentElement.dataset.theme = next;
    $("#theme-toggle").innerHTML = `<span aria-hidden="true">${next === "dark" ? "☀" : "☾"}</span>`;
    const toggle = $("#theme-switch");
    if (toggle) {
      toggle.classList.toggle("on", next === "dark");
      toggle.setAttribute("aria-checked", String(next === "dark"));
    }
  } catch (error) {
    toast(`Couldn't save your theme preference: ${error.message}`, "error");
  }
}

async function loadNotifications() {
  try {
    state.notifications = await queryRows("notifications", "id, title, body, read_at, created_at", query => query.order("created_at", { ascending: false }).limit(10));
    const unread = state.notifications.filter(item => !item.read_at).length;
    $("#notification-count").textContent = unread > 9 ? "9+" : unread;
    $("#notification-count").hidden = unread === 0;
    $("#notification-subtitle").textContent = unread ? `${unread} unread notification${unread === 1 ? "" : "s"}` : "You're all caught up";
    $("#notification-list").innerHTML = state.notifications.length ? state.notifications.map(item => `<article class="notification-item ${item.read_at ? "" : "unread"}" data-notification="${safe(item.id)}"><span class="notification-mark">✳</span><div><strong>${safe(item.title)}</strong><p>${safe(item.body)}</p><time>${safe(dateText(item.created_at))}</time></div></article>`).join("") : emptyState("All caught up", "You'll find new notifications here.");
    $$(".notification-item[data-notification]").forEach(item => item.addEventListener("click", () => markNotificationRead(item.dataset.notification)));
    renderNav();
  } catch (error) {
    console.error("Unable to load notifications:", error);
    toast(`Couldn't load notifications: ${error.message}`, "error");
  }
}

async function markNotificationRead(id) {
  try {
    const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    if (error) throw error;
    await loadNotifications();
  } catch (error) {
    toast(`Couldn't mark notification as read: ${error.message}`, "error");
  }
}

async function markAllRead() {
  const unreadIds = state.notifications.filter(item => !item.read_at).map(item => item.id);
  if (!unreadIds.length) return;
  try {
    const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).in("id", unreadIds);
    if (error) throw error;
    await loadNotifications();
    toast("Notifications marked as read.");
  } catch (error) {
    toast(`Couldn't update notifications: ${error.message}`, "error");
  }
}

async function signOut(showMessage = true) {
  if (supabase) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast(`Couldn't sign out: ${error.message}`, "error");
      return;
    }
  }
  state.user = null;
  state.profile = null;
  $("#app-view").hidden = true;
  renderAuth("login");
  if (showMessage) toast("You've been signed out.");
}

function closePopover() {
  $("#notification-popover").hidden = true;
}

function setupEvents() {
  $("#auth-form").addEventListener("submit", authenticate);
  $("#auth-switch").addEventListener("click", () => renderAuth($("#auth-form").dataset.mode === "register" ? "login" : "register"));
  $("#forgot-link").addEventListener("click", forgotPassword);
  $("#password-toggle").addEventListener("click", () => {
    const password = $("#auth-password");
    password.type = password.type === "password" ? "text" : "password";
    $("#password-toggle").textContent = password.type === "password" ? "Show" : "Hide";
  });
  $("#menu-toggle").addEventListener("click", () => {
    if (window.matchMedia("(max-width: 820px)").matches) {
      $("#sidebar").classList.add("sidebar-open");
      $("#sidebar-scrim").classList.add("visible");
    } else {
      toggleSidebar();
    }
  });
  $("#sidebar-close").addEventListener("click", () => {
    $("#sidebar").classList.remove("sidebar-open");
    $("#sidebar-scrim").classList.remove("visible");
  });
  $("#sidebar-scrim").addEventListener("click", () => {
    $("#sidebar").classList.remove("sidebar-open");
    $("#sidebar-scrim").classList.remove("visible");
  });
  $("#sidebar-profile").addEventListener("click", () => navigate("profile"));
  $("#topbar-avatar").addEventListener("click", () => navigate("profile"));
  $("#theme-toggle").addEventListener("click", toggleTheme);
  $("#theme-toggle").innerHTML = `<span aria-hidden="true">${state.theme === "dark" ? "☀" : "☾"}</span>`;
  $("#notifications-toggle").addEventListener("click", event => {
    event.stopPropagation();
    $("#notification-popover").hidden = !$("#notification-popover").hidden;
  });
  $("#notification-popover").addEventListener("click", event => event.stopPropagation());
  $("#mark-all-read").addEventListener("click", markAllRead);
  document.addEventListener("click", closePopover);
  $("#global-search").addEventListener("input", event => {
    state.search = event.target.value;
    if (state.page === "courses") renderCourses();
    else if (event.target.value.trim()) navigate("courses");
  });
  $("#global-search").addEventListener("keydown", event => {
    if (event.key === "Enter") navigate("courses");
    if (event.key === "Escape") { event.target.value = ""; state.search = ""; }
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      $("#global-search").focus();
    }
  });
  $("#page-content").addEventListener("click", event => {
    const button = event.target.closest("[data-page]");
    if (button) navigate(button.dataset.page);
  });
}

async function init() {
  setupEvents();
  if (!configured) {
    renderAuth();
    showAuthError("Connect Supabase first: set your project URL and anon key in js/config.js.");
    return;
  }
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    state.user = session.user;
    await openApp();
  } else {
    renderAuth();
  }
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      state.user = null;
      state.profile = null;
      renderAuth();
    } else if (event === "PASSWORD_RECOVERY") {
      state.user = session.user;
      renderAuth("reset");
      $("#auth-email").value = session?.user?.email || "";
    } else if (session && !state.profile) {
      state.user = session.user;
      window.setTimeout(() => openApp(), 0);
    }
  });
}

init();
