/* Full-screen project detail: client outcomes and plain-language timelines */
(function () {
  function findRawProject(slug) {
    var data = window.SITE_DATA;
    if (!data || !data.projects) return null;
    for (var i = 0; i < data.projects.length; i++) {
      if (data.projects[i].slug === slug) return data.projects[i];
    }
    return null;
  }

  function normalizeProject(p) {
    if (!p) return null;
    var d = p.detail || {};
    var gallery = (p.gallery || [])
      .map(function (g) {
        return typeof g === "string" ? g : g && g.src;
      })
      .filter(Boolean);
    return {
      subtitle: d.subtitle || "",
      title: d.title || (p.card && p.card.title) || "",
      overview: d.overview || [],
      timeline: d.timeline || [],
      links: d.links || [],
      gallery: gallery,
      banner: gallery[0] || "",
    };
  }

  function mergeProjectLinks(raw) {
    var seen = {};
    var out = [];
    function pushList(list) {
      (list || []).forEach(function (lnk) {
        if (!lnk || !lnk.href) return;
        var h = String(lnk.href);
        if (seen[h]) return;
        seen[h] = true;
        out.push(lnk);
      });
    }
    if (raw && raw.detail) pushList(raw.detail.links);
    if (raw && raw.card) pushList(raw.card.links);
    return out;
  }

  function isVideoOrDemoLink(lnk) {
    if (!lnk || !lnk.href) return false;
    if (lnk.kind === "video" || lnk.kind === "demo") return true;
    var href = String(lnk.href).toLowerCase();
    var text = String(lnk.text || "").toLowerCase();
    if (/watch|demo|clip|video/.test(text)) return true;
    if (
      /drive\.google\.com\/file|youtube\.com|youtu\.be|vimeo\.com/.test(href)
    )
      return true;
    return false;
  }

  function isGitHubLink(lnk) {
    if (!lnk || !lnk.href) return false;
    if (lnk.kind === "github") return true;
    return /github\.com/i.test(lnk.href) || /github/i.test(lnk.text || "");
  }

  function isStickyQuickLink(lnk) {
    return isVideoOrDemoLink(lnk) || isGitHubLink(lnk);
  }

  var modal = document.getElementById("project-detail-modal");
  if (!modal) return;

  var backdrop = modal.querySelector(".project-detail-modal__backdrop");
  var closeBtn = document.getElementById("project-detail-close");
  var mainImg = document.getElementById("project-detail-main-img");
  var thumbsEl = document.getElementById("project-detail-thumbs");
  var bannerSubtitle = document.getElementById("project-detail-banner-subtitle");
  var titleEl = document.getElementById("project-detail-title");
  var overviewEl = document.getElementById("project-detail-overview");
  var timelineEl = document.getElementById("project-detail-timeline");
  var actionsEl = document.getElementById("project-detail-actions");
  var stickyRailEl = document.getElementById("project-detail-sticky-rail");
  var stickyActionsEl = document.getElementById("project-detail-sticky-actions");
  var lastFocus = null;
  var thumbButtons = [];

  function esc(s) {
    if (!s) return "";
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function setMainImage(src, alt, activeIndex) {
    if (mainImg) {
      mainImg.src = src;
      mainImg.alt = alt || "";
    }
    thumbButtons.forEach(function (btn, i) {
      btn.setAttribute("aria-pressed", i === activeIndex ? "true" : "false");
      btn.classList.toggle("is-active", i === activeIndex);
    });
  }

  function buildGallery(slug, data) {
    thumbButtons = [];
    if (!thumbsEl || !mainImg) return;
    thumbsEl.innerHTML = "";
    var imgs =
      (data.gallery && data.gallery.length && data.gallery) ||
      (data.banner ? [data.banner] : []);
    var title = data.title;
    imgs.forEach(function (src, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "project-detail__thumb";
      btn.setAttribute("aria-label", "Show image " + (i + 1) + " of " + imgs.length);
      btn.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      if (i === 0) btn.classList.add("is-active");
      var im = document.createElement("img");
      im.src = src;
      im.alt = "";
      im.loading = "lazy";
      btn.appendChild(im);
      btn.addEventListener("click", function () {
        setMainImage(src, title + ", screenshot " + (i + 1), i);
      });
      thumbButtons.push(btn);
      thumbsEl.appendChild(btn);
    });
    if (imgs.length) {
      setMainImage(imgs[0], title + ", screenshot 1", 0);
    }
    thumbsEl.style.display = imgs.length > 1 ? "" : "none";
  }

  function openModal(slug) {
    var raw = findRawProject(slug);
    var data = normalizeProject(raw);
    if (!data) return;

    lastFocus = document.activeElement;
    buildGallery(slug, data);
    bannerSubtitle.textContent = data.subtitle;
    titleEl.textContent = data.title;

    overviewEl.innerHTML = data.overview
      .map(function (p) {
        return "<p>" + esc(p) + "</p>";
      })
      .join("");

    timelineEl.innerHTML = "";
    data.timeline.forEach(function (step) {
      var li = document.createElement("li");
      li.className = "project-detail__timeline-item";
      li.innerHTML =
        '<span class="project-detail__timeline-dot" aria-hidden="true"></span>' +
        '<div class="project-detail__timeline-card">' +
        '<span class="project-detail__timeline-phase">' +
        esc(step.phase) +
        "</span>" +
        '<span class="project-detail__timeline-label">' +
        esc(step.label) +
        "</span>" +
        '<p class="project-detail__timeline-text">' +
        esc(step.text) +
        "</p>" +
        "</div>";
      timelineEl.appendChild(li);
    });

    var allLinks = mergeProjectLinks(raw);
    var stickyLinks = allLinks.filter(isStickyQuickLink);
    var otherLinks = allLinks.filter(function (lnk) {
      return !isStickyQuickLink(lnk);
    });

    if (stickyActionsEl && stickyRailEl) {
      stickyActionsEl.innerHTML = "";
      if (stickyLinks.length) {
        stickyRailEl.hidden = false;
        stickyLinks.sort(function (a, b) {
          return (isGitHubLink(a) ? 1 : 0) - (isGitHubLink(b) ? 1 : 0);
        });
        stickyLinks.forEach(function (lnk) {
          var a = document.createElement("a");
          a.href = lnk.href;
          var gh = isGitHubLink(lnk);
          a.className =
            "project-detail__sticky-btn" +
            (gh
              ? " project-detail__sticky-btn--github"
              : " project-detail__sticky-btn--video");
          if (lnk.external !== false) {
            a.target = "_blank";
            a.rel = "noopener noreferrer";
          }
          var icon = document.createElement("i");
          icon.setAttribute("aria-hidden", "true");
          icon.className = gh ? "bx bxl-github" : "bx bx-play-circle";
          var label = document.createElement("span");
          label.textContent = lnk.text || (gh ? "GitHub" : "Demo");
          a.appendChild(icon);
          a.appendChild(label);
          stickyActionsEl.appendChild(a);
        });
      } else {
        stickyRailEl.hidden = true;
      }
    }

    actionsEl.innerHTML = "";
    otherLinks.forEach(function (lnk) {
      var a = document.createElement("a");
      a.href = lnk.href;
      a.className = "button button--primary project-detail__action";
      if (lnk.external !== false) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.textContent = lnk.text;
      actionsEl.appendChild(a);
    });

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("project-detail-open");

    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("project-detail-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      try {
        lastFocus.focus();
      } catch (e) {}
    }
  }

  function shouldIgnoreClick(target) {
    if (!target || !target.closest) return true;
    if (target.closest("a.button-link")) return true;
    if (target.closest(".swiper-pagination")) return true;
    if (target.closest(".swiper-pagination-bullet")) return true;
    return false;
  }

  var container = document.querySelector(".portfolio__container");
  if (container) {
    container.addEventListener(
      "click",
      function (e) {
        var card = e.target.closest(".portfolio__content");
        if (!card) return;
        if (shouldIgnoreClick(e.target)) return;
        var slug = card.getAttribute("data-project-slug");
        if (!slug || !findRawProject(slug)) return;
        e.preventDefault();
        e.stopPropagation();
        openModal(slug);
      },
      true
    );
  }

  function wirePortfolioCards() {
    document.querySelectorAll(".portfolio__content").forEach(function (card) {
      if (card.getAttribute("data-wired-project-card") === "1") return;
      card.setAttribute("data-wired-project-card", "1");
      card.setAttribute("tabindex", "0");
      var t = card.querySelector(".portfolio__title");
      if (t) {
        card.setAttribute(
          "aria-label",
          "Open project details: " + t.textContent.trim()
        );
      }
      card.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" && e.key !== " ") return;
        var slug = card.getAttribute("data-project-slug");
        if (!slug || !findRawProject(slug)) return;
        e.preventDefault();
        openModal(slug);
      });
    });
  }

  document.addEventListener("site-data-ready", wirePortfolioCards);

  function onBackdropClick(e) {
    if (e.target === backdrop) closeModal();
  }

  if (backdrop) backdrop.addEventListener("click", onBackdropClick);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();
