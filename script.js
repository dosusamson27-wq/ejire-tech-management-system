const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (menuToggle && navigation) {
    const closeMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        navigation.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
        const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isExpanded));
        menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
        navigation.classList.toggle("is-open", !isExpanded);
    });

    navigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
            menuToggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) {
            closeMenu();
        }
    });
}

const revealItems = document.querySelectorAll(".section-heading, .feature-card, .about-visual, .about-copy, .access-panel, .page-intro, .course-item, .content-panel, .page-copy");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });
    revealItems.forEach((item) => {
        item.classList.add("reveal-on-scroll");
        revealObserver.observe(item);
    });
}
