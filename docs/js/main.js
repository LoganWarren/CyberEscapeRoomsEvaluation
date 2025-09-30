document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Mobile menu toggle
     ========================= */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector("#nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* =========================
     Active nav link highlight
     ========================= */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav .links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });

  /* =========================
     Smooth Page Transitions
     - Adds a quick fade-in on load
     - Adds a quick fade-out before navigating
     - Respects Reduced Motion
     ========================= */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fade-in on load
  if (!prefersReduced) {
    document.body.classList.add("page-enter");
    // Remove the class after the animation completes (keep DOM clean)
    setTimeout(() => document.body.classList.remove("page-enter"), 300);
  }

  // Intercept internal navigations for fade-out
  document.addEventListener("click", (e) => {
    // Only left-clicks without modifier keys
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Find anchor
    const anchor = e.target.closest("a");
    if (!anchor) return;

    // Ignore external links, new tabs, downloads, and anchors
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#") || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

    // Same-origin check
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    // We only fade for HTML page navigations (keep as needed)
    const isHtml = url.pathname.endsWith(".html") || url.pathname === "/" || url.pathname.endsWith("/docs") || url.pathname.endsWith("/docs/");
    if (!isHtml) return;

    // If reduced motion, let the browser navigate normally
    if (prefersReduced) return;

    // Perform fade-out then navigate
    e.preventDefault();
    document.body.classList.add("page-exit");
    // Close mobile menu if open so it doesn't flash on next page
    if (links && links.classList.contains("open")) {
      links.classList.remove("open");
      toggle && toggle.setAttribute("aria-expanded", "false");
    }

    // Match the CSS fade-out duration (keep in sync with CSS)
    setTimeout(() => {
      window.location.href = url.href;
    }, 170);
  }, { capture: true });
});
