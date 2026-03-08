(function setActiveMenuElement() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  document.querySelectorAll("nav ul li a").forEach((el) => {
    const href = new URL(el.getAttribute("href"), window.location.origin).pathname.replace(/\/+$/, "") || "/";

    if (href === path) {
      const span = document.createElement("span");
      span.textContent = el.textContent;
      span.setAttribute("aria-current", "page");
      el.parentElement.replaceChild(span, el);
    }
  });
})();
