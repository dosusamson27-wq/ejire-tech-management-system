(() => {
  "use strict";

  let installPrompt;
  const installButton = document.querySelector("#pwa-install");
  const scriptUrl = document.currentScript?.src || new URL("./pwa.js", window.location.href).href;

  if ("serviceWorker" in navigator && /^https?:$/.test(window.location.protocol)) {
    window.addEventListener("load", () => {
      const appRoot = new URL("./", scriptUrl);
      navigator.serviceWorker.register(new URL("service-worker.js", appRoot), { scope: appRoot.pathname })
        .catch(error => console.error("Dashboard offline support could not be registered:", error));
    }, { once: true });
  }

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    if (installButton) installButton.hidden = false;
  });

  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    if (installButton) installButton.hidden = true;
  });

  installButton?.addEventListener("click", async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
  });
})();
