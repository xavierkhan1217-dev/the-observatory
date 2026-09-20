// Mobile menu
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("primary-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    document.body.classList.toggle("nav-open", !open);
  });
}

// Header shadow on scroll
const header = document.getElementById("site-header");
if (header) {
  const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Reveal on scroll
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealables = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealables.forEach((el) => el.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  revealables.forEach((el) => observer.observe(el));
}

// Archive search + category filters
const archive = document.querySelector("[data-archive]");

if (archive) {
  const input = archive.querySelector("[data-search-input]");
  const buttons = archive.querySelectorAll("[data-filter]");
  const rows = Array.from(archive.querySelectorAll("[data-search]"));
  const empty = archive.querySelector("[data-empty]");
  let activeCategory = "all";

  const apply = () => {
    const query = (input?.value || "").trim().toLowerCase();
    let shown = 0;

    rows.forEach((row) => {
      const matchesCategory =
        activeCategory === "all" || row.dataset.category === activeCategory;
      const matchesQuery =
        !query || row.dataset.search.toLowerCase().includes(query);
      const visible = matchesCategory && matchesQuery;
      row.hidden = !visible;
      if (visible) shown += 1;
    });

    if (empty) empty.hidden = shown !== 0;
  };

  input?.addEventListener("input", apply);

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      buttons.forEach((other) => other.classList.toggle("is-active", other === button));
      apply();
    });
  });

  // Deep link: /articles/?category=finance
  const requested = new URLSearchParams(window.location.search).get("category");
  if (requested) {
    const match = archive.querySelector(`[data-filter="${CSS.escape(requested)}"]`);
    if (match) match.click();
  }
}
