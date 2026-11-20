(() => {
  const storageKey = "portfolio-page-transition";
  const duration = 720;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    if (sessionStorage.getItem(storageKey) === "enter" && !reduceMotion) {
      sessionStorage.removeItem(storageKey);
      root.classList.add("page-entering");
      window.setTimeout(() => root.classList.remove("page-entering"), duration + 100);
    } else {
      sessionStorage.removeItem(storageKey);
    }
  } catch (_) {}

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download") || reduceMotion) return;

    let target;
    try {
      target = new URL(link.href, window.location.href);
    } catch (_) {
      return;
    }

    if (target.origin !== window.location.origin || !target.pathname.endsWith(".html") || target.pathname === window.location.pathname) return;

    event.preventDefault();
    try {
      sessionStorage.setItem(storageKey, "enter");
    } catch (_) {}
    root.classList.add("page-leaving");
    window.setTimeout(() => window.location.assign(target.href), duration);
  });
})();
