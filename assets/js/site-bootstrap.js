/* Load assets/data/site.json — section visibility, projects (bento + filters), reviews, resume. */
(function () {
  var DATA_URL = "assets/data/site.json";

  var CARD_ACCENTS = [
    "#0f766e",
    "#2563eb",
    "#7c3aed",
    "#db2777",
    "#ea580c",
    "#0891b2",
    "#65a30d",
    "#4f46e5",
    "#be123c",
    "#0d9488",
  ];

  var FILTER_LABELS = {
    all: "All",
    "live-demo": "Live demos",
    "full-stack": "Full-stack",
    architecture: "Architecture",
    automation: "Automation",
    "open-source": "Open source",
    "client-work": "Client work",
    data: "Data & APIs",
  };

  var FILTER_ORDER = [
    "all",
    "live-demo",
    "full-stack",
    "architecture",
    "automation",
    "data",
    "open-source",
    "client-work",
  ];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function accentForIndex(i) {
    return CARD_ACCENTS[i % CARD_ACCENTS.length];
  }

  function applySectionVisibility(sections) {
    if (!sections) return;
    Object.keys(sections).forEach(function (key) {
      if (sections[key] !== false) return;
      document.querySelectorAll('[data-section="' + key + '"]').forEach(function (el) {
        el.setAttribute("hidden", "");
        el.classList.add("section--hidden");
      });
    });
  }

  function applyResumePath(resume) {
    if (!resume || !resume.pdf) return;
    var pdf = resume.pdf;
    document.querySelectorAll("[data-resume-link]").forEach(function (a) {
      a.setAttribute("href", pdf);
    });
    var iframe = document.getElementById("resume-preview-iframe");
    if (iframe) iframe.setAttribute("src", pdf);
  }

  function buildPreview(p) {
    var title = esc(p.title || "Project");
    var url = esc(p.liveUrl || "");
    var img = p.previewImage ? esc(p.previewImage) : "";

    if (img) {
      return (
        '<div class="project-card__preview project-card__preview--image">' +
        '<a href="' +
        url +
        '" target="_blank" rel="noopener noreferrer" class="project-card__preview-link">' +
        '<img src="' +
        img +
        '" alt="' +
        title +
        ' preview" class="project-card__preview-img" loading="lazy"/>' +
        '<span class="project-card__preview-badge">Preview</span>' +
        "</a></div>"
      );
    }

    if (!url) return '<div class="project-card__preview project-card__preview--empty"></div>';

    return (
      '<div class="project-card__preview">' +
      '<div class="project-card__iframe-wrap">' +
      '<iframe class="project-card__iframe" src="' +
      url +
      '" title="' +
      title +
      ' live preview" loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerpolicy="no-referrer"></iframe>' +
      "</div>" +
      '<div class="project-card__preview-fallback" hidden>' +
      "<p>Preview unavailable — site may block embedding.</p>" +
      '<a href="' +
      url +
      '" class="button button--small project-card__cta" target="_blank" rel="noopener noreferrer">' +
      '<span>Visit live website</span><i class="bx bx-link-external" aria-hidden="true"></i></a>' +
      "</div></div>"
    );
  }

  function buildCta(p) {
    var url = esc(p.liveUrl || "");
    if (!url) return "";
    var linkText = esc(p.linkText || "Visit live website");
    return (
      '<a href="' +
      url +
      '" class="button button--primary project-card__cta" target="_blank" rel="noopener noreferrer">' +
      "<span>" +
      linkText +
      '</span><i class="bx bx-link-external" aria-hidden="true"></i></a>'
    );
  }

  function collectFilterKeys(projects) {
    var keys = { all: true };
    projects.forEach(function (p) {
      (p.categories || []).forEach(function (c) {
        keys[c] = true;
      });
    });
    return FILTER_ORDER.filter(function (k) {
      return keys[k];
    });
  }

  function renderProjectFilters(projects) {
    var wrap = document.getElementById("portfolio-filters-wrap");
    var nav = document.getElementById("portfolio-filters");
    if (!wrap || !nav) return;

    var keys = collectFilterKeys(projects);
    if (keys.length <= 2) {
      wrap.setAttribute("hidden", "");
      return;
    }

    nav.innerHTML = keys
      .map(function (key, idx) {
        var label = FILTER_LABELS[key] || key;
        var active = key === "all" ? " active-portfolio" : "";
        var selected = key === "all" ? "true" : "false";
        var tabIdx = key === "all" ? "0" : "-1";
        return (
          '<button type="button" class="portfolio__item' +
          active +
          '" data-filter="' +
          esc(key) +
          '" role="tab" aria-selected="' +
          selected +
          '" tabindex="' +
          tabIdx +
          '">' +
          esc(label) +
          "</button>"
        );
      })
      .join("");

    wrap.removeAttribute("hidden");
  }

  function applyProjectFilter(filterKey) {
    var cards = document.querySelectorAll(".project-card");
    var emptyEl = document.getElementById("portfolio-filter-empty");
    var visible = 0;

    cards.forEach(function (card) {
      var cats = (card.getAttribute("data-categories") || "").split(/\s+/);
      var show = filterKey === "all" || cats.indexOf(filterKey) !== -1;
      card.classList.toggle("project-card--filtered-out", !show);
      card.toggleAttribute("hidden", !show);
      if (show) visible++;
    });

    if (emptyEl) {
      if (visible === 0) emptyEl.removeAttribute("hidden");
      else emptyEl.setAttribute("hidden", "");
    }
  }

  function wireProjectFilters() {
    var nav = document.getElementById("portfolio-filters");
    if (!nav) return;

    nav.querySelectorAll(".portfolio__item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filterKey = btn.getAttribute("data-filter") || "all";
        nav.querySelectorAll(".portfolio__item").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("active-portfolio", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
          b.setAttribute("tabindex", on ? "0" : "-1");
        });
        applyProjectFilter(filterKey);
      });
    });
  }

  function renderProjects(projects) {
    var container = document.querySelector(".portfolio__container");
    if (!container || !projects || !projects.length) return;

    container.innerHTML = projects
      .map(function (p, idx) {
        var slug = esc(p.slug || "");
        var title = esc(p.title || "Project");
        var bento = p.bento || "standard";
        var categories = p.categories || [];
        var catAttr = categories.map(esc).join(" ");
        var accent = accentForIndex(idx);
        var highlights = (p.highlights || []).slice(0, 3);
        var listHtml = highlights
          .map(function (h) {
            return "<li>" + esc(h) + "</li>";
          })
          .join("");

        return (
          '<article class="project-card project-card--' +
          esc(bento) +
          '" data-project-slug="' +
          slug +
          '" data-categories="' +
          catAttr +
          '" style="--card-accent:' +
          accent +
          '">' +
          '<div class="project-card__accent-bar" aria-hidden="true"></div>' +
          buildPreview(p) +
          '<div class="project-card__body">' +
          (categories.length
            ? '<div class="project-card__tags">' +
              categories
                .map(function (c) {
                  return (
                    '<span class="project-card__tag">' +
                    esc(FILTER_LABELS[c] || c) +
                    "</span>"
                  );
                })
                .join("") +
              "</div>"
            : "") +
          '<h3 class="project-card__title">' +
          title +
          "</h3>" +
          (listHtml ? '<ul class="project-card__highlights">' + listHtml + "</ul>" : "") +
          buildCta(p) +
          "</div></article>"
        );
      })
      .join("");

    container.querySelectorAll(".project-card__iframe").forEach(function (frame) {
      frame.addEventListener("error", function () {
        var wrap = frame.closest(".project-card__preview");
        if (!wrap) return;
        var iframeWrap = wrap.querySelector(".project-card__iframe-wrap");
        if (iframeWrap) iframeWrap.setAttribute("hidden", "");
        var fb = wrap.querySelector(".project-card__preview-fallback");
        if (fb) fb.removeAttribute("hidden");
      });
    });

    renderProjectFilters(projects);
    wireProjectFilters();
  }

  function renderReviews(reviews) {
    var el = document.getElementById("reviews-source");
    if (!el || !reviews || !reviews.length) return;
    el.innerHTML = reviews
      .map(function (r) {
        var cc = (r.countryCode || "").toLowerCase();
        var flag = cc
          ? '<img src="https://flagcdn.com/w20/' +
            esc(cc) +
            '.png" alt="' +
            esc(r.country || "") +
            '" class="flag"/>'
          : "";
        return (
          '<article class="review-card">' +
          '<img src="' +
          esc(r.avatar) +
          '" alt="' +
          esc(r.avatarAlt || r.name || "") +
          '" class="review-card__avatar"/>' +
          '<h3 class="review-card__name">' +
          esc(r.name) +
          "</h3>" +
          '<span class="review-card__loc">' +
          flag +
          "<span> " +
          esc(r.country || "") +
          " </span></span>" +
          '<div class="review-card__stars">' +
          (r.stars || "⭐⭐⭐⭐⭐") +
          "</div>" +
          '<p class="review-card__text">' +
          esc(r.text) +
          "</p>" +
          '<a href="' +
          esc(r.sourceUrl || "#") +
          '" target="_blank" rel="noopener noreferrer" class="review-card__link">Check Source ⬈</a>' +
          "</article>"
        );
      })
      .join("");
  }

  function onDataReady(data) {
    applySectionVisibility(data.sections || {});
    applyResumePath(data.resume || {});
    renderProjects(data.projects || []);
    renderReviews(data.reviews || []);
    window.SITE_DATA = data;
    document.dispatchEvent(new CustomEvent("site-data-ready", { detail: data }));
  }

  function showPortfolioError() {
    var c = document.querySelector(".portfolio__container");
    if (c)
      c.innerHTML =
        '<p class="portfolio__load-error" role="alert">Could not load project data. Run: node scripts/sync-site-data.js after editing assets/data/site.json, then refresh.</p>';
  }

  function startFromPayload(data) {
    if (!data || !Array.isArray(data.projects)) {
      showPortfolioError();
      return;
    }
    onDataReady(data);
  }

  if (window.__SITE_DATA__) {
    startFromPayload(window.__SITE_DATA__);
  } else {
    fetch(DATA_URL)
      .then(function (r) {
        if (!r.ok) throw new Error("bad status");
        return r.json();
      })
      .then(startFromPayload)
      .catch(function () {
        showPortfolioError();
      });
  }
})();
