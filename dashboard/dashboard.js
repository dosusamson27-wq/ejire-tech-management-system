(() => {
  "use strict";

  // Preview identity only; replace with the authenticated-user interface during integration.
  const dashboardUser = Object.freeze({
    fullName: "Alex Morgan",
    roleLabel: "Administrator"
  });

  const classes = [
    { title: "Introduction to Product Design", category: "Design · UX foundations", instructor: "Olivia Chen", initials: "OC", tone: "lilac", date: "Today, Oct 26", time: "10:30 AM", status: "In progress", statusType: "live" },
    { title: "Frontend Development II", category: "Development · Intermediate", instructor: "Marcus Reed", initials: "MR", tone: "mint", date: "Today, Oct 26", time: "1:00 PM", status: "Upcoming", statusType: "upcoming" },
    { title: "Data Analytics Essentials", category: "Data · Beginner", instructor: "Amara Okafor", initials: "AO", tone: "peach", date: "Tue, Oct 27", time: "9:00 AM", status: "Upcoming", statusType: "upcoming" },
    { title: "Digital Marketing Strategy", category: "Marketing · Advanced", instructor: "Daniel Kim", initials: "DK", tone: "blue", date: "Tue, Oct 27", time: "2:30 PM", status: "Upcoming", statusType: "upcoming" },
    { title: "Business Communication", category: "Business · Foundations", instructor: "Leila Hassan", initials: "LH", tone: "rose", date: "Wed, Oct 28", time: "11:00 AM", status: "Upcoming", statusType: "upcoming" }
  ];

  const activities = [
    { initials: "LN", tone: "activity-lilac", name: "Liam Nelson", action: "submitted an assignment", subject: "Wireframing project", time: "12 min ago", icon: "↗" },
    { initials: "OC", tone: "activity-mint", name: "Olivia Chen", action: "published a new course", subject: "Product Design Systems", time: "48 min ago", icon: "＋" },
    { initials: "MJ", tone: "activity-peach", name: "Mia Johnson", action: "completed a course", subject: "HTML & CSS Fundamentals", time: "2 hours ago", icon: "✓" },
    { initials: "MR", tone: "activity-blue", name: "Marcus Reed", action: "scheduled a class", subject: "Frontend Development II", time: "3 hours ago", icon: "▦" },
    { initials: "ET", tone: "activity-rose", name: "Ejire Tech", action: "welcomed 24 new students", subject: "October intake", time: "Yesterday", icon: "✳" }
  ];

  const courses = [
    { title: "Product Design", category: "DESIGN", students: 248, progress: 82, tone: "course-lilac", symbol: "✳" },
    { title: "Frontend Development", category: "DEVELOPMENT", students: 196, progress: 74, tone: "course-mint", symbol: "</>" },
    { title: "Data Analytics", category: "DATA", students: 174, progress: 63, tone: "course-peach", symbol: "▥" }
  ];

  const notifications = [
    { title: "8 assignments due this week", detail: "Three courses have upcoming deadlines.", time: "10 min ago", tone: "notice-peach", unread: true },
    { title: "New course published", detail: "Olivia Chen added Product Design Systems.", time: "48 min ago", tone: "notice-lilac", unread: true },
    { title: "October enrollment is up", detail: "Student enrollment increased by 12.8%.", time: "2 hours ago", tone: "notice-mint", unread: true }
  ];

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
  let classOffset = 0;
  let classSearch = "";

  function renderClasses() {
    const filtered = classes.filter(item => `${item.title} ${item.category} ${item.instructor}`.toLocaleLowerCase().includes(classSearch));
    const visible = filtered.slice(classOffset, classOffset + 4);
    $("#classes-table-body").innerHTML = visible.length
      ? visible.map(item => `
        <tr>
          <td><div class="class-title">${escapeHTML(item.title)}<small>${escapeHTML(item.category)}</small></div></td>
          <td><span class="table-instructor"><span class="table-avatar avatar-${item.tone}">${escapeHTML(item.initials)}</span>${escapeHTML(item.instructor)}</span></td>
          <td><span class="table-date">${escapeHTML(item.date)}</span><small class="table-time">${escapeHTML(item.time)}</small></td>
          <td><span class="class-status status-${item.statusType}"><i></i>${escapeHTML(item.status)}</span></td>
        </tr>`).join("")
      : `<tr><td class="table-empty" colspan="4"><span>${classSearch ? "⌕" : "✳"}</span><strong>${classSearch ? "No matching classes" : "No more classes to show"}</strong><small>${classSearch ? "Try another instructor or class name." : "You've reached the end of the preview schedule."}</small></td></tr>`;
    $("#classes-count").textContent = classSearch
      ? `${filtered.length} matching session${filtered.length === 1 ? "" : "s"}`
      : `Showing ${Math.min(classOffset + 1, classes.length)}–${Math.min(classOffset + visible.length, classes.length)} of ${classes.length} sessions`;
    $("#table-next").disabled = classOffset + 4 >= filtered.length;
  }

  function renderActivities() {
    $("#activity-list").innerHTML = activities.map(item => `
      <article class="activity-item">
        <span class="activity-avatar ${item.tone}">${escapeHTML(item.initials)}<i>${escapeHTML(item.icon)}</i></span>
        <div class="activity-copy"><p><strong>${escapeHTML(item.name)}</strong> ${escapeHTML(item.action)} <b>${escapeHTML(item.subject)}</b></p><time>${escapeHTML(item.time)}</time></div>
      </article>`).join("");
  }

  function renderCourses() {
    $("#course-list").innerHTML = courses.map(course => `
      <article class="course-row">
        <span class="course-mark ${course.tone}">${escapeHTML(course.symbol)}</span>
        <div class="course-row-copy"><div><strong>${escapeHTML(course.title)}</strong><span>${escapeHTML(course.category)}</span></div><small>${course.students} students</small></div>
        <div class="course-row-progress"><strong>${course.progress}%</strong><span class="progress-track"><i style="width:${course.progress}%"></i></span></div>
      </article>`).join("");
  }

  function renderNotifications() {
    $("#notification-list").innerHTML = notifications.length
      ? notifications.map((item, index) => `
        <article class="notification-item ${item.unread ? "is-unread" : ""}" data-notification-index="${index}">
          <span class="notification-type ${item.tone}">✳</span>
          <div><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.detail)}</p><time>${escapeHTML(item.time)}</time></div>
          ${item.unread ? '<i class="unread-mark"></i>' : ""}
        </article>`).join("")
      : `<div class="notification-empty"><span>✓</span><strong>All caught up</strong><small>New workspace updates will show here.</small></div>`;
    const unread = notifications.filter(item => item.unread).length;
    $("#notification-badge").textContent = unread;
    $("#notification-badge").hidden = unread === 0;
    $("#mark-read-button").hidden = unread === 0;
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "dashboard-toast";
    toast.textContent = message;
    $("#toast-region").append(toast);
    window.setTimeout(() => toast.remove(), 3000);
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const isDark = theme === "dark";
    $("#theme-button").innerHTML = `<span aria-hidden="true">${isDark ? "☼" : "☾"}</span>`;
    $("#theme-button").setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  }

  function setComponentState(component, state, message = "") {
    const targets = {
      enrollment: $("#enrollment-panel"),
      attendance: $("#attendance-panel"),
      classes: $("#classes-panel"),
      activity: $("#activity-panel"),
      courses: $("#courses-panel"),
      assignments: $("#assignments-panel")
    };
    const host = targets[component];
    if (!host) throw new Error(`Unknown dashboard component: ${component}`);
    if (!["loading", "empty", "error", "ready"].includes(state)) {
      throw new Error(`Unknown dashboard state: ${state}`);
    }
    host.querySelector(":scope > .component-state")?.remove();
    host.setAttribute("aria-busy", String(state === "loading"));
    if (state === "ready") return;

    const labels = {
      loading: ["Loading dashboard data", message || "Please wait while this panel updates."],
      empty: ["Nothing to show yet", message || "Dashboard data will appear here when it is available."],
      error: ["This panel couldn't load", message || "Please try again later."]
    };
    const [title, description] = labels[state];
    const notice = document.createElement("div");
    notice.className = `component-state component-state-${state}`;
    notice.setAttribute("role", state === "error" ? "alert" : "status");
    const heading = document.createElement("strong");
    heading.textContent = title;
    const detail = document.createElement("span");
    detail.textContent = description;
    notice.append(heading, detail);
    host.append(notice);
  }

  function setUser(user) {
    if (!user || typeof user.fullName !== "string" || typeof user.roleLabel !== "string") {
      throw new TypeError("Dashboard user data requires fullName and roleLabel strings.");
    }
    const name = user.fullName.trim() || "Workspace member";
    const initials = name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    $$("[data-user-name]").forEach(element => { element.textContent = name; });
    $$("[data-user-role]").forEach(element => { element.textContent = user.roleLabel; });
    $$("[data-user-initials]").forEach(element => { element.textContent = initials; });
    $$("[data-first-name]").forEach(element => { element.textContent = name.split(/\s+/)[0]; });
  }

  function closeNotifications() {
    $("#notification-menu").hidden = true;
    $("#notification-button").setAttribute("aria-expanded", "false");
  }

  function setupEvents() {
    $("#menu-button").addEventListener("click", () => {
      if (window.matchMedia("(max-width: 850px)").matches) {
        const isOpen = $("#sidebar").classList.toggle("is-open");
        $("#mobile-scrim").classList.toggle("is-visible", isOpen);
        $("#menu-button").setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      } else {
        const isCollapsed = $("#dashboard-shell").classList.toggle("is-sidebar-collapsed");
        $("#menu-button").setAttribute("aria-label", isCollapsed ? "Expand sidebar" : "Collapse sidebar");
      }
    });
    $("#mobile-scrim").addEventListener("click", () => {
      $("#sidebar").classList.remove("is-open");
      $("#mobile-scrim").classList.remove("is-visible");
    });

    $("#notification-button").addEventListener("click", event => {
      event.stopPropagation();
      const menu = $("#notification-menu");
      menu.hidden = !menu.hidden;
      $("#notification-button").setAttribute("aria-expanded", String(!menu.hidden));
    });
    $("#notification-menu").addEventListener("click", event => event.stopPropagation());
    document.addEventListener("click", closeNotifications);

    $("#mark-read-button").addEventListener("click", () => {
      notifications.forEach(item => { item.unread = false; });
      renderNotifications();
      showToast("Notifications marked as read.");
    });
    $("#notification-list").addEventListener("click", event => {
      const item = event.target.closest("[data-notification-index]");
      if (!item) return;
      notifications[Number(item.dataset.notificationIndex)].unread = false;
      renderNotifications();
    });

    $("#theme-button").addEventListener("click", () => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
    $("#table-next").addEventListener("click", () => {
      classOffset = Math.min(classOffset + 1, classes.length - 1);
      renderClasses();
    });

    $("#dashboard-search").closest(".search-box").addEventListener("click", () => {
      if (window.matchMedia("(max-width: 650px)").matches) {
        $("#dashboard-search").closest(".search-box").classList.add("is-searching");
        $("#dashboard-search").focus();
      }
    });
    $("#dashboard-search").addEventListener("input", event => {
      classSearch = event.currentTarget.value.trim().toLocaleLowerCase();
      classOffset = 0;
      renderClasses();
    });
    $("#dashboard-search").addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.currentTarget.value = "";
        event.currentTarget.closest(".search-box").classList.remove("is-searching");
        classSearch = "";
        renderClasses();
      }
    });
    document.addEventListener("keydown", event => {
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        $("#dashboard-search").closest(".search-box").classList.add("is-searching");
        $("#dashboard-search").focus();
      }
      if (event.key === "Escape") closeNotifications();
    });

    $("#quick-action-button").addEventListener("click", () => showToast("Quick actions will be connected when the management modules are integrated."));
    $("#date-button").addEventListener("click", () => showToast("Showing this month's dashboard overview."));
    $("#chart-range-button").addEventListener("click", () => showToast("The chart is showing the last 7 months."));
    $("#activity-more").addEventListener("click", () => showToast("The activity log will be connected when workspace data is available."));
    $("#profile-button").addEventListener("click", () => showToast("Mock profile preview only. Authentication and profile screens belong to a separate module."));
    $("#topbar-profile").addEventListener("click", () => showToast("Mock profile preview only. Authentication and profile screens belong to a separate module."));
  }

  function initialize() {
    setUser(dashboardUser);
    renderClasses();
    renderActivities();
    renderCourses();
    renderNotifications();
    setupEvents();
    window.EjireDashboard = Object.freeze({ setComponentState, setUser });
  }

  initialize();
})();
