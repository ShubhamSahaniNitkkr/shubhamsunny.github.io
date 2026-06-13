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

  var IFRAME_LOAD_TIMEOUT_MS = 15000;

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

  function canUseIframe(liveUrl) {
    if (!liveUrl) return false;
    var host = location.hostname;
    if (
      location.protocol === "http:" &&
      host !== "localhost" &&
      host !== "127.0.0.1"
    ) {
      return false;
    }
    try {
      var u = new URL(liveUrl, location.href);
      if (u.protocol !== "https:" && u.protocol !== "http:") return false;
      if (u.hostname === host) return false;
      var h = u.hostname.toLowerCase();
      if (
        h.indexOf("github.com") !== -1 ||
        h.indexOf("npmjs.com") !== -1 ||
        h.indexOf("drive.google.com") !== -1 ||
        h.indexOf("google.com") !== -1
      ) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  function buildPreviewPlaceholder(title, url, note) {
    return (
      '<div class="project-card__preview project-card__preview--placeholder">' +
      "<p>" +
      esc(note || "Live preview opens in a new tab.") +
      "</p>" +
      '<a href="' +
      url +
      '" class="button button--primary project-card__cta" target="_blank" rel="noopener noreferrer">' +
      "<span>Visit live website</span>" +
      '<i class="bx bx-link-external" aria-hidden="true"></i></a>' +
      "</div>"
    );
  }

  function buildPreview(p, opts) {
    opts = opts || {};
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

    if (!canUseIframe(p.liveUrl || "")) {
      return buildPreviewPlaceholder(
        title,
        url,
        "Embedded preview unavailable — open the live site in a new tab."
      );
    }

    var iframeSrcAttr = opts.lazyIframe
      ? ' data-src="' + url + '"'
      : ' src="' + url + '"';
    var wrapStateClass = opts.lazyIframe
      ? " project-card__iframe-wrap--idle"
      : " project-card__iframe-wrap--loading";
    var loadingHidden = opts.lazyIframe ? " hidden" : "";

    return (
      '<div class="project-card__preview">' +
      '<div class="project-card__iframe-wrap' +
      wrapStateClass +
      '">' +
      '<div class="project-card__iframe-loading"' +
      loadingHidden +
      ' aria-live="polite">' +
      '<span class="project-card__iframe-spinner" aria-hidden="true"></span>' +
      '<span class="project-card__iframe-loading-text">Loading preview</span>' +
      "</div>" +
      '<iframe class="project-card__iframe' +
      (opts.lazyIframe ? " project-card__iframe--idle" : " project-card__iframe--loading") +
      '"' +
      iframeSrcAttr +
      ' title="' +
      title +
      ' live preview" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" referrerpolicy="no-referrer"></iframe>' +
      "</div>" +
      '<div class="project-card__preview-fallback" hidden>' +
      "<p>Preview unavailable — site may block embedding.</p>" +
      '<a href="' +
      url +
      '" class="button button--primary project-card__cta" target="_blank" rel="noopener noreferrer">' +
      "<span>Visit live website</span>" +
      '<i class="bx bx-link-external" aria-hidden="true"></i></a>' +
      "</div></div>"
    );
  }

  function buildProjectCardHtml(p, idx, opts) {
    opts = opts || {};
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
      buildPreview(p, opts) +
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
  }

  function getIframeWrap(frame) {
    return frame ? frame.closest(".project-card__iframe-wrap") : null;
  }

  function getIframeLoadingEl(wrap) {
    return wrap ? wrap.querySelector(".project-card__iframe-loading") : null;
  }

  function clearIframeLoadTimer(frame) {
    if (!frame || !frame.dataset.loadTimer) return;
    clearTimeout(Number(frame.dataset.loadTimer));
    delete frame.dataset.loadTimer;
  }

  function setIframeLoadingUi(wrap, visible) {
    if (!wrap) return;
    var loadingEl = getIframeLoadingEl(wrap);
    if (!loadingEl) return;
    if (visible) loadingEl.removeAttribute("hidden");
    else loadingEl.setAttribute("hidden", "");
  }

  function showIframeFallback(frame) {
    if (!frame || frame.dataset.previewFailed === "1") return;
    frame.dataset.previewFailed = "1";
    clearIframeLoadTimer(frame);

    var preview = frame.closest(".project-card__preview");
    if (!preview) return;

    var wrap = getIframeWrap(frame);
    if (wrap) {
      wrap.setAttribute("hidden", "");
      wrap.classList.remove(
        "project-card__iframe-wrap--idle",
        "project-card__iframe-wrap--loading",
        "project-card__iframe-wrap--ready"
      );
      wrap.classList.add("project-card__iframe-wrap--failed");
      setIframeLoadingUi(wrap, false);
    }

    frame.removeAttribute("src");
    frame.classList.remove(
      "project-card__iframe--idle",
      "project-card__iframe--loading",
      "project-card__iframe--loaded"
    );

    var fb = preview.querySelector(".project-card__preview-fallback");
    if (fb) fb.removeAttribute("hidden");
  }

  function markIframeLoaded(frame) {
    if (!frame || !frame.getAttribute("src") || frame.dataset.previewFailed === "1") return;
    clearIframeLoadTimer(frame);

    frame.classList.remove("project-card__iframe--idle", "project-card__iframe--loading");
    frame.classList.add("project-card__iframe--loaded");

    var wrap = getIframeWrap(frame);
    if (wrap) {
      wrap.classList.remove("project-card__iframe-wrap--idle", "project-card__iframe-wrap--loading");
      wrap.classList.add("project-card__iframe-wrap--ready");
      setIframeLoadingUi(wrap, false);
    }
  }

  function wireIframeLifecycle(container) {
    if (!container) return;
    container.querySelectorAll(".project-card__iframe").forEach(function (frame) {
      if (frame.dataset.lifecycleBound === "1") return;

      frame.addEventListener("load", function () {
        if (!frame.getAttribute("src")) return;
        if (frame.classList.contains("project-card__iframe--loading")) {
          markIframeLoaded(frame);
        }
      });

      frame.addEventListener("error", function () {
        showIframeFallback(frame);
      });

      frame.dataset.lifecycleBound = "1";
    });
  }

  function loadLazyIframe(frame) {
    if (!frame || frame.dataset.previewFailed === "1") return;
    var src = frame.getAttribute("data-src");
    if (!src || frame.getAttribute("src")) return;

    var wrap = getIframeWrap(frame);
    if (wrap) {
      wrap.classList.remove("project-card__iframe-wrap--idle", "project-card__iframe-wrap--ready");
      wrap.classList.add("project-card__iframe-wrap--loading");
      setIframeLoadingUi(wrap, true);
    }

    frame.classList.remove("project-card__iframe--idle", "project-card__iframe--loaded");
    frame.classList.add("project-card__iframe--loading");
    frame.setAttribute("src", src);

    clearIframeLoadTimer(frame);
    frame.dataset.loadTimer = String(
      setTimeout(function () {
        if (frame.classList.contains("project-card__iframe--loading")) {
          showIframeFallback(frame);
        }
      }, IFRAME_LOAD_TIMEOUT_MS)
    );
  }

  function unloadLazyIframe(frame) {
    if (!frame) return;
    clearIframeLoadTimer(frame);

    frame.classList.remove("project-card__iframe--loading", "project-card__iframe--loaded");
    frame.classList.add("project-card__iframe--idle");

    if (frame.getAttribute("src")) {
      frame.removeAttribute("src");
    }

    var wrap = getIframeWrap(frame);
    if (wrap) {
      wrap.classList.remove("project-card__iframe-wrap--loading", "project-card__iframe-wrap--ready");
      wrap.classList.add("project-card__iframe-wrap--idle");
      setIframeLoadingUi(wrap, false);
    }
  }

  function unloadAllLazyIframes(container) {
    if (!container) return;
    container.querySelectorAll(".project-card__iframe[src]").forEach(unloadLazyIframe);
  }

  function activateAllLazyIframes(container) {
    if (!container) return;
    container.querySelectorAll(".project-card__iframe[data-src]").forEach(loadLazyIframe);
  }

  /** Load/unload live previews only for cards near the scroll viewport (prevents modal crash). */
  function createViewportIframeLoader(options) {
    options = options || {};
    var scrollRoot = options.root || null;
    var container = options.container;
    var maxLoaded = options.maxLoaded == null ? 4 : options.maxLoaded;
    var rootMargin = options.rootMargin || "160px 0px 160px 0px";
    var loadDelayMs = options.loadDelayMs == null ? 120 : options.loadDelayMs;
    var minVisibleRatio = options.minVisibleRatio == null ? 0.08 : options.minVisibleRatio;

    var observer = null;
    var visibleCards = new Map();
    var loadTimer = null;
    var rafId = null;

    function getIframe(card) {
      return card ? card.querySelector(".project-card__iframe[data-src]") : null;
    }

    function syncLoads() {
      if (!container) return;

      var visible = [];
      visibleCards.forEach(function (ratio, card) {
        if (ratio >= minVisibleRatio && !card.hasAttribute("hidden")) {
          visible.push({ card: card, ratio: ratio });
        }
      });
      visible.sort(function (a, b) {
        return b.ratio - a.ratio;
      });

      var visibleSet = new Set(visible.map(function (v) {
        return v.card;
      }));

      container.querySelectorAll(".project-card__iframe[src][data-src]").forEach(function (frame) {
        var card = frame.closest(".project-card");
        if (!card || !visibleSet.has(card)) unloadLazyIframe(frame);
      });

      var loadedVisible = [];
      container.querySelectorAll(".project-card__iframe[src][data-src]").forEach(function (frame) {
        var card = frame.closest(".project-card");
        if (card && visibleSet.has(card)) {
          loadedVisible.push({ frame: frame, ratio: visibleCards.get(card) || 0 });
        }
      });

      var slots = maxLoaded - loadedVisible.length;
      if (slots > 0) {
        for (var i = 0; i < visible.length && slots > 0; i++) {
          var frame = getIframe(visible[i].card);
          if (frame && !frame.getAttribute("src")) {
            loadLazyIframe(frame);
            slots--;
          }
        }
      }

      if (loadedVisible.length > maxLoaded) {
        loadedVisible.sort(function (a, b) {
          return a.ratio - b.ratio;
        });
        for (var j = 0; j < loadedVisible.length - maxLoaded; j++) {
          unloadLazyIframe(loadedVisible[j].frame);
        }
      }
    }

    function scheduleSyncLoads() {
      if (loadTimer) clearTimeout(loadTimer);
      loadTimer = setTimeout(function () {
        loadTimer = null;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function () {
          rafId = null;
          syncLoads();
        });
      }, loadDelayMs);
    }

    function onIntersect(entries) {
      var needsSync = false;
      entries.forEach(function (entry) {
        var card = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= minVisibleRatio) {
          visibleCards.set(card, entry.intersectionRatio);
          needsSync = true;
        } else {
          if (visibleCards.has(card)) needsSync = true;
          visibleCards.delete(card);
          unloadLazyIframe(getIframe(card));
        }
      });
      if (needsSync) scheduleSyncLoads();
    }

    function observeCards() {
      if (!container) return;
      container.querySelectorAll(".project-card__iframe[data-src]").forEach(function (frame) {
        if (!frame.getAttribute("src")) frame.classList.add("project-card__iframe--idle");
      });
      container.querySelectorAll(".project-card:not([hidden])").forEach(function (card) {
        observer.observe(card);
      });
    }

    function start() {
      stop(false);
      if (!container) return;
      if (!("IntersectionObserver" in window)) {
        activateAllLazyIframes(container);
        return;
      }
      observer = new IntersectionObserver(onIntersect, {
        root: scrollRoot,
        rootMargin: rootMargin,
        threshold: [0, 0.05, 0.15, 0.35, 0.6, 1],
      });
      observeCards();
      scheduleSyncLoads();
    }

    function refresh() {
      if (!observer || !container) return;
      observer.disconnect();
      visibleCards.clear();
      observeCards();
      scheduleSyncLoads();
    }

    function stop(unload) {
      if (loadTimer) {
        clearTimeout(loadTimer);
        loadTimer = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      visibleCards.clear();
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (unload !== false) unloadAllLazyIframes(container);
    }

    return { start: start, stop: stop, refresh: refresh };
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

  function renderProjectFilters(projects, navId, wrapId) {
    var wrap = document.getElementById(wrapId || "portfolio-filters-wrap");
    var nav = document.getElementById(navId || "portfolio-filters");
    if (!wrap || !nav) return;

    var keys = collectFilterKeys(projects);
    if (keys.length <= 2) {
      wrap.setAttribute("hidden", "");
      return;
    }

    nav.innerHTML = keys
      .map(function (key) {
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

  function applyProjectFilter(filterKey, gridSelector, emptyId) {
    var grid = document.querySelector(gridSelector || "#portfolio-grid");
    if (!grid) return;
    var cards = grid.querySelectorAll(".project-card");
    var emptyEl = document.getElementById(emptyId || "portfolio-filter-empty");
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

    if (emptyId === "projects-modal-filter-empty") {
      var modalBody = document.getElementById("projects-modal-body");
      if (modalBody) modalBody.scrollTop = 0;
      document.dispatchEvent(new CustomEvent("projects-modal-filtered"));
    } else if (emptyId === "portfolio-filter-empty") {
      document.dispatchEvent(new CustomEvent("portfolio-filtered"));
    }
  }

  function wireProjectFilters(navId, gridSelector, emptyId) {
    var nav = document.getElementById(navId || "portfolio-filters");
    if (!nav) return;

    nav.querySelectorAll(".portfolio__item").forEach(function (btn) {
      if (btn.dataset.filterBound === "1") return;
      btn.addEventListener("click", function () {
        var filterKey = btn.getAttribute("data-filter") || "all";
        nav.querySelectorAll(".portfolio__item").forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("active-portfolio", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
          b.setAttribute("tabindex", on ? "0" : "-1");
        });
        applyProjectFilter(filterKey, gridSelector, emptyId);
      });
      btn.dataset.filterBound = "1";
    });
  }

  function renderModalGrid(projects) {
    var modalGrid = document.getElementById("projects-modal-grid");
    if (!modalGrid || !projects || !projects.length) return;

    modalGrid.innerHTML = projects
      .map(function (p, idx) {
        return buildProjectCardHtml(p, idx, { lazyIframe: true });
      })
      .join("");

    wireIframeLifecycle(modalGrid);
    renderProjectFilters(projects, "projects-modal-filters", "projects-modal-filters-wrap");
    wireProjectFilters(
      "projects-modal-filters",
      "#projects-modal-grid",
      "projects-modal-filter-empty"
    );
  }

  function setupProjectsModal(totalCount, previewCount) {
    var wrap = document.getElementById("portfolio-more-wrap");
    var countEl = document.getElementById("projects-more-count");
    var modal = document.getElementById("projects-modal");
    var openBtn = document.getElementById("projects-modal-open");
    var closeBtn = document.getElementById("projects-modal-close");
    var modalBody = document.getElementById("projects-modal-body");
    var modalGrid = document.getElementById("projects-modal-grid");
    var scrollLockY = 0;
    var modalIframeLoader = createViewportIframeLoader({
      root: modalBody,
      container: modalGrid,
      maxLoaded: 2,
      rootMargin: "160px 0px 200px 0px",
      loadDelayMs: 150,
      minVisibleRatio: 0.08,
    });

    if (wrap) {
      if (totalCount > previewCount) {
        wrap.removeAttribute("hidden");
        if (countEl) countEl.textContent = "(" + totalCount + ")";
      } else {
        wrap.setAttribute("hidden", "");
      }
    }

    if (!modal || setupProjectsModal._wired) return;
    setupProjectsModal._wired = true;

    function lockPageScroll() {
      scrollLockY = window.scrollY || window.pageYOffset || 0;
      document.documentElement.classList.add("projects-modal-open");
      document.body.classList.add("projects-modal-open");
      document.body.style.top = "-" + scrollLockY + "px";
    }

    function unlockPageScroll() {
      document.documentElement.classList.remove("projects-modal-open");
      document.body.classList.remove("projects-modal-open");
      document.body.style.top = "";
      window.scrollTo(0, scrollLockY);
    }

    function openModal() {
      if (modalBody) modalBody.scrollTop = 0;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      lockPageScroll();
      modalIframeLoader.start();
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      modalIframeLoader.stop();
      var reviewsModal = document.getElementById("reviews-modal");
      var reviewDetail = document.getElementById("review-detail-modal");
      var reviewsOpen =
        (reviewsModal && reviewsModal.classList.contains("is-open")) ||
        (reviewDetail && reviewDetail.classList.contains("is-open"));
      if (!reviewsOpen) unlockPageScroll();
      if (openBtn) openBtn.focus();
    }

    if (openBtn) openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    var backdrop = modal.querySelector(".projects-modal__backdrop");
    if (backdrop) backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") {
        closeModal();
        e.preventDefault();
      }
    });

    document.addEventListener("projects-modal-filtered", function () {
      if (!modal.classList.contains("is-open")) return;
      modalIframeLoader.refresh();
    });
  }

  var portfolioIframeLoader = null;
  var portfolioSectionObserver = null;

  function startLoaderWhenSectionVisible(sectionId, loader, rootMargin) {
    if (!loader) return;
    if (!sectionId || !("IntersectionObserver" in window)) {
      loader.start();
      return;
    }

    var section = document.getElementById(sectionId);
    if (!section) {
      loader.start();
      return;
    }

    if (portfolioSectionObserver) {
      portfolioSectionObserver.disconnect();
      portfolioSectionObserver = null;
    }

    portfolioSectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          loader.start();
          if (portfolioSectionObserver) {
            portfolioSectionObserver.disconnect();
            portfolioSectionObserver = null;
          }
        });
      },
      { rootMargin: rootMargin || "120px 0px 120px 0px", threshold: 0.01 }
    );
    portfolioSectionObserver.observe(section);
  }

  function renderProjects(projects, previewCount) {
    var container = document.getElementById("portfolio-grid");
    if (!container || !projects || !projects.length) return;

    if (portfolioIframeLoader) portfolioIframeLoader.stop();
    if (portfolioSectionObserver) {
      portfolioSectionObserver.disconnect();
      portfolioSectionObserver = null;
    }

    var limit =
      previewCount == null || previewCount < 0
        ? projects.length
        : Math.min(previewCount, projects.length);
    var previewProjects = projects.slice(0, limit);

    container.innerHTML = previewProjects
      .map(function (p, idx) {
        return buildProjectCardHtml(p, idx, { lazyIframe: true });
      })
      .join("");

    wireIframeLifecycle(container);

    portfolioIframeLoader = createViewportIframeLoader({
      root: null,
      container: container,
      maxLoaded: 2,
      rootMargin: "180px 0px 180px 0px",
      loadDelayMs: 120,
      minVisibleRatio: 0.08,
    });
    startLoaderWhenSectionVisible("portfolio", portfolioIframeLoader, "160px 0px 160px 0px");

    document.addEventListener("portfolio-filtered", function onPortfolioFiltered() {
      if (portfolioIframeLoader) portfolioIframeLoader.refresh();
    });

    renderProjectFilters(projects, "portfolio-filters", "portfolio-filters-wrap");
    wireProjectFilters("portfolio-filters", "#portfolio-grid", "portfolio-filter-empty");

    renderModalGrid(projects);
    setupProjectsModal(projects.length, limit);
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
    var previewCount = data.projectsPreviewCount;
    if (previewCount == null) previewCount = 6;
    renderProjects(data.projects || [], previewCount);
    renderReviews(data.reviews || []);
    window.SITE_DATA = data;
    document.dispatchEvent(new CustomEvent("site-data-ready", { detail: data }));
  }

  function showPortfolioError() {
    var c = document.getElementById("portfolio-grid");
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
