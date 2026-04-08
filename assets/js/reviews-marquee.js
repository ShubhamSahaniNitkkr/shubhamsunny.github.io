/* Reviews: marquee, star styling, avatar fallbacks, grid modal + detail modal */
(function () {
  var PLACEHOLDER_EMOJIS = ["✨", "🌟", "💫", "🎯", "🚀", "👋", "💼", "🔧", "🙂", "⭐"];

  function hashPick(str, arr) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (h + str.charCodeAt(i) * (i + 1)) >>> 0;
    }
    return arr[h % arr.length];
  }

  function parseRatingFromText(text) {
    if (!text) return { full: 5, empty: 0 };
    var full = 0;
    var empty = 0;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (c === "⭐" || c === "★" || c === "✪") full++;
      else if (c === "☆") empty++;
    }
    var total = full + empty;
    if (total === 0) {
      full = 5;
      empty = 0;
    } else if (total > 5) {
      empty = Math.max(0, 5 - full);
    } else if (total < 5) {
      empty = 5 - full;
    }
    return { full: full, empty: empty };
  }

  function renderStarRating(full, empty) {
    var max = full + empty;
    var label = full + " out of " + max + " stars";
    var h =
      '<span class="star-rating" role="img" aria-label="' +
      label.replace(/"/g, "&quot;") +
      '">';
    for (var i = 0; i < full; i++) {
      h += '<span class="star-rating__star star-rating__star--full" aria-hidden="true">★</span>';
    }
    for (var j = 0; j < empty; j++) {
      h += '<span class="star-rating__star star-rating__star--empty" aria-hidden="true">☆</span>';
    }
    h += "</span>";
    return h;
  }

  function normalizeStars(el) {
    if (!el || el.querySelector(".star-rating")) return;
    var raw = el.textContent || "";
    var r = parseRatingFromText(raw);
    el.innerHTML = renderStarRating(r.full, r.empty);
  }

  function shouldPlaceholderAvatar(src) {
    if (!src) return true;
    var s = String(src).toLowerCase();
    return (
      s.indexOf("no_image") !== -1 ||
      s.indexOf("testimonial-placeholder") !== -1 ||
      s.indexOf("/original/no_image") !== -1 ||
      s.indexOf("no-image") !== -1
    );
  }

  function enhanceAvatar(img, displayName) {
    if (!img || img.closest(".review-card__avatar-wrap")) return;
    var name = displayName || "Client";
    var wrap = document.createElement("div");
    wrap.className = "review-card__avatar-wrap";
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    var ph = document.createElement("div");
    ph.className = "review-card__avatar-fallback";
    ph.setAttribute("aria-hidden", "true");
    ph.textContent = hashPick(name, PLACEHOLDER_EMOJIS);
    wrap.appendChild(ph);

    function showFallback() {
      img.classList.add("review-card__avatar--hidden");
      ph.classList.add("is-visible");
    }

    if (shouldPlaceholderAvatar(img.getAttribute("src"))) {
      showFallback();
    }
    img.addEventListener("error", showFallback);
  }

  function prepareReviewCard(card) {
    if (!card || card.dataset.reviewPrepared === "1") return;
    var nameEl = card.querySelector(".review-card__name");
    var name = nameEl ? nameEl.textContent.trim() : "Client";
    var starsEl = card.querySelector(".review-card__stars");
    normalizeStars(starsEl);
    var img = card.querySelector(".review-card__avatar");
    if (img) enhanceAvatar(img, name);
    card.dataset.reviewPrepared = "1";
  }

  var modal = document.getElementById("reviews-modal");
  var modalGrid = document.getElementById("reviews-modal-grid");
  var openBtn = document.getElementById("reviews-modal-open");
  var closeBtn = document.getElementById("reviews-modal-close");
  var detailModal = document.getElementById("review-detail-modal");
  var detailBody = document.getElementById("review-detail-body");
  var detailClose = document.getElementById("review-detail-close");

  function bindGridItem(item) {
    if (!item || item.dataset.detailBound === "1") return;
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    var open = function (e) {
      if (e && e.type === "click" && e.target.closest && e.target.closest("a")) return;
      openDetailModal(item);
    };
    item.addEventListener("click", open);
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!e.target.closest || !e.target.closest("a")) openDetailModal(item);
      }
    });
    item.dataset.detailBound = "1";
  }

  function buildModalGrid(source) {
    if (!modalGrid || !source || modalGrid.dataset.built) return;
    source.querySelectorAll(".review-card").forEach(function (card) {
      var item = document.createElement("article");
      item.className = "reviews-modal__item";
      item.innerHTML = card.innerHTML;
      prepareReviewCard(item);
      modalGrid.appendChild(item);
      bindGridItem(item);
    });
    modalGrid.dataset.built = "1";
  }

  function openModal() {
    if (!modal) return;
    var source = document.getElementById("reviews-source");
    buildModalGrid(source);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (!detailModal || !detailModal.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
    if (openBtn) openBtn.focus();
  }

  function openDetailModal(sourceItem) {
    if (!detailModal || !detailBody || !sourceItem) return;
    detailBody.innerHTML = sourceItem.innerHTML;
    delete detailBody.dataset.reviewPrepared;
    prepareReviewCard(detailBody);
    detailModal.classList.add("is-open");
    detailModal.setAttribute("aria-hidden", "false");
    if (detailClose) detailClose.focus();
  }

  function closeDetailModal() {
    if (!detailModal) return;
    detailModal.classList.remove("is-open");
    detailModal.setAttribute("aria-hidden", "true");
    detailBody.innerHTML = "";
    if (!modal || !modal.classList.contains("is-open")) {
      document.body.style.overflow = "";
    }
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (modal) {
    var backdrop = modal.querySelector(".reviews-modal__backdrop");
    if (backdrop) backdrop.addEventListener("click", closeModal);
  }

  if (detailModal) {
    var dBack = detailModal.querySelector(".review-detail-modal__backdrop");
    if (dBack) dBack.addEventListener("click", closeDetailModal);
  }
  if (detailClose) detailClose.addEventListener("click", closeDetailModal);

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (detailModal && detailModal.classList.contains("is-open")) {
      closeDetailModal();
      e.preventDefault();
      return;
    }
    if (modal && modal.classList.contains("is-open")) {
      closeModal();
      e.preventDefault();
    }
  });

  function initReviewsMarquee() {
    var source = document.getElementById("reviews-source");
    var track = document.getElementById("reviews-marquee-track");
    var marqueeRoot = document.getElementById("reviews-marquee");

    if (modalGrid) {
      modalGrid.innerHTML = "";
      delete modalGrid.dataset.built;
    }

    if (track) track.innerHTML = "";

    if (source) {
      source.querySelectorAll(".review-card").forEach(prepareReviewCard);
    }

    if (source && track) {
      source.querySelectorAll(".review-card").forEach(function (card) {
        track.appendChild(card.cloneNode(true));
      });
      source.querySelectorAll(".review-card").forEach(function (card) {
        track.appendChild(card.cloneNode(true));
      });
      track.querySelectorAll(".review-card").forEach(prepareReviewCard);
    }

    if (marqueeRoot && track && !marqueeRoot.dataset.marqueeHoverBound) {
      marqueeRoot.dataset.marqueeHoverBound = "1";
      marqueeRoot.addEventListener("mouseenter", function () {
        track.classList.add("is-paused");
      });
      marqueeRoot.addEventListener("mouseleave", function () {
        track.classList.remove("is-paused");
      });
      marqueeRoot.addEventListener("focusin", function () {
        track.classList.add("is-paused");
      });
      marqueeRoot.addEventListener("focusout", function () {
        track.classList.remove("is-paused");
      });
    }
  }

  document.addEventListener("site-data-ready", initReviewsMarquee);
})();
