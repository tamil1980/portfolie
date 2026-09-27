(function () {
  var root = document.documentElement;
  var storeKey = "portfolio-theme";

  function readTheme() {
    try {
      var saved = localStorage.getItem(storeKey);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.textContent = theme === "dark" ? "\u2600" : "\u263D";
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    });
    try { localStorage.setItem(storeKey, theme); } catch (e) {}
  }

  applyTheme(readTheme());

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest("[data-theme-toggle]");
    if (toggle) {
      applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      return;
    }

    var burger = e.target.closest("[data-menu-toggle]");
    if (burger) {
      var nav = document.getElementById("primary-nav");
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      return;
    }

    if (e.target.closest("#primary-nav a")) {
      var n = document.getElementById("primary-nav");
      if (n && n.classList.contains("open")) {
        n.classList.remove("open");
        var b = document.querySelector("[data-menu-toggle]");
        if (b) b.setAttribute("aria-expanded", "false");
      }
    }
  });

  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  document.addEventListener("submit", function (e) {
    var form = e.target.closest("form[data-mailto]");
    if (!form) return;
    e.preventDefault();
    var data = new FormData(form);
    var to = form.getAttribute("data-mailto");
    var subject = data.get("subject") || "Portfolio enquiry";
    var body = "Name: " + (data.get("name") || "") + "\n" +
               "Email: " + (data.get("email") || "") + "\n" +
               "Organisation: " + (data.get("organisation") || "-") + "\n\n" +
               (data.get("message") || "");
    window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) +
                           "&body=" + encodeURIComponent(body);
  });

  var copy = document.querySelector("[data-copy-email]");
  if (copy) {
    copy.addEventListener("click", function () {
      var value = copy.getAttribute("data-copy-email");
      navigator.clipboard && navigator.clipboard.writeText(value);
      var original = copy.textContent;
      copy.textContent = "Copied";
      setTimeout(function () { copy.textContent = original; }, 1600);
    });
  }
})();
