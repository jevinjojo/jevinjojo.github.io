const navbar = document.querySelector(".navbar");
const revealTargets = document.querySelectorAll(".section-reveal");
const navLinks = document.querySelectorAll(".nav-menu a");

function setNavbarState() {
  if (!navbar) {
    return;
  }

  if (window.scrollY > 10) {
    navbar.style.boxShadow = "0 18px 40px rgba(0, 0, 0, 0.22)";
    navbar.style.background = "rgba(10, 17, 29, 0.9)";
  } else {
    navbar.style.boxShadow = "none";
    navbar.style.background = "rgba(10, 17, 29, 0.78)";
  }
}

function setActiveNav() {
  const sections = ["about", "grants", "projects", "contributions", "skills", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const offset = 140;
  let activeId = "home";

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top - offset <= 0) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px",
  },
);

revealTargets.forEach((target) => revealObserver.observe(target));

window.addEventListener("scroll", () => {
  setNavbarState();
  setActiveNav();
});

window.addEventListener("load", () => {
  setNavbarState();
  setActiveNav();
});
