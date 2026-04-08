/* Load assets/data/site.json and render portfolio + review source; then notify other scripts. */
(function () {
  var DATA_URL = "assets/data/site.json";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function renderPortfolio(projects) {
    var container = document.querySelector(".portfolio__container");
    if (!container || !projects || !projects.length) return;
    container.innerHTML = projects
      .map(function (p) {
        var cats = p.categories || [];
        var mixClass = ["mix"].concat(cats).join(" ");
        var slugSafe = esc(p.slug);
        var gid = "portfolio-" + p.slug.replace(/[^a-zA-Z0-9_-]/g, "-");
        var slides = (p.gallery || [])
          .map(function (im) {
            var src = typeof im === "string" ? im : im && im.src;
            if (!src) return "";
            var href =
              typeof im === "object" && im.href ? im.href : src;
            var alt = typeof im === "object" && im.alt ? im.alt : "";
            return (
              '<div class="swiper-slide"><a href="' +
              esc(href) +
              '" class="glightbox" data-gallery="' +
              esc(gid) +
              '"><img src="' +
              esc(src) +
              '" class="portfolio__img" alt="' +
              esc(alt) +
              '" loading="lazy"/></a></div>'
            );
          })
          .join("");
        var card = p.card || {};
        var links = card.links || [];
        var linkHtml = links
          .map(function (lnk) {
            var ext =
              lnk.external !== false
                ? ' target="_blank" rel="noopener noreferrer"'
                : "";
            return (
              '<a href="' +
              esc(lnk.href) +
              '" class="button button-link"' +
              ext +
              ">" +
              esc(lnk.text) +
              "</a>"
            );
          })
          .join("");
        return (
          '<div class="portfolio__content ' +
          mixClass +
          '" data-project-slug="' +
          slugSafe +
          '">' +
          '<div class="swiper"><div class="swiper-wrapper">' +
          slides +
          '</div><div class="swiper-pagination"></div></div>' +
          '<div class="portfolio__data">' +
          '<span class="portfolio__subtitle">' +
          esc(card.subtitle || "") +
          "</span>" +
          '<h2 class="portfolio__title">' +
          esc(card.title || "") +
          "</h2>" +
          "<p>" +
          esc(card.summary || "") +
          "</p>" +
          linkHtml +
          "</div></div>"
        );
      })
      .join("");
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

  function initPortfolioWidgets() {
    if (typeof Swiper === "undefined") return;
    document.querySelectorAll(".portfolio .swiper").forEach(function (el) {
      if (el.getAttribute("data-swiper-inited") === "1") return;
      el.setAttribute("data-swiper-inited", "1");
      var pagination = el.querySelector(".swiper-pagination");
      var swiper = new Swiper(el, {
        loop: true,
        speed: 650,
        autoplay: {
          delay: 2600,
          disableOnInteraction: false,
        },
        pagination: pagination
          ? { el: pagination, clickable: true }
          : undefined,
      });
      swiper.autoplay.stop();
      el.addEventListener("mouseenter", function () {
        swiper.autoplay.start();
      });
      el.addEventListener("mouseleave", function () {
        swiper.autoplay.stop();
      });
    });

    if (typeof GLightbox !== "undefined") {
      if (
        window.__portfolioLightbox &&
        typeof window.__portfolioLightbox.reload === "function"
      ) {
        window.__portfolioLightbox.reload();
      } else {
        window.__portfolioLightbox = GLightbox({
          selector: ".glightbox",
          touchNavigation: true,
          loop: true,
        });
      }
    }
  }

  function onDataReady(data) {
    renderPortfolio(data.projects || []);
    renderReviews(data.reviews || []);
    window.SITE_DATA = data;
    document.dispatchEvent(
      new CustomEvent("site-data-ready", { detail: data })
    );
    initPortfolioWidgets();
  }

  function showPortfolioError() {
    var c = document.querySelector(".portfolio__container");
    if (c)
      c.innerHTML =
        '<p class="portfolio__load-error" role="alert">Could not load project data. Ensure assets/js/site-data.js exists and is loaded before site-bootstrap.js (run: node scripts/sync-site-data.js after editing site.json), or serve the site over http(s). Then refresh.</p>';
  }

  function startFromPayload(data) {
    if (!data || !Array.isArray(data.projects)) {
      showPortfolioError();
      return;
    }
    onDataReady(data);
  }

  // file:// cannot load JSON via fetch(); site-data.js is included first in index.html.
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
