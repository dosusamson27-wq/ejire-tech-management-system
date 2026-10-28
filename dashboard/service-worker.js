const CACHE_NAME = "ejire-dashboard-v12";
const APP_SHELL = [
  "./index.html",
  "./dashboard.css",
  "./dashboard.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./icons/ejire-icon.svg",
  "./offline.html",
  "./sections/section.css",
  "./sections/section.js",
  "./sections/courses.html",
  "./sections/classes.html",
  "./sections/students.html",
  "./sections/instructors.html",
  "./sections/attendance.html",
  "./sections/assignments.html",
  "./sections/reports.html",
  "./instructor/dashboard.html",
  "./instructor/instructor.css",
  "./instructor/instructor.js",
  "./instructor/manifest.webmanifest"
];
const CACHEABLE_PAGES = new Set([
  "index.html",
  "offline.html",
  "sections/courses.html",
  "sections/classes.html",
  "sections/students.html",
  "sections/instructors.html",
  "sections/attendance.html",
  "sections/assignments.html",
  "sections/reports.html",
  "instructor/dashboard.html"
].map(path => new URL(path, self.registration.scope).href));

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(name => name.startsWith("ejire-dashboard-") && name !== CACHE_NAME).map(name => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && CACHEABLE_PAGES.has(url.href)) {
          await (await caches.open(CACHE_NAME)).put(request, response.clone());
        }
        return response;
      } catch {
        const cachedPage = CACHEABLE_PAGES.has(url.href) ? await caches.match(request) : null;
        if (cachedPage) return cachedPage;
        const offlinePage = await caches.match("./offline.html");
        return offlinePage || Response.error();
      }
    })());
    return;
  }

  event.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(async response => {
      if (response.ok && response.type === "basic") {
        await (await caches.open(CACHE_NAME)).put(request, response.clone());
      }
      return response;
    });
  }));
});
