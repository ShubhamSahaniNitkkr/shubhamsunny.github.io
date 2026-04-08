/*===== SHOW MENU =====*/
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show-menu')
            var open = nav.classList.contains('show-menu')
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*===== NAV: MOBILE CLOSE + IN-PAGE SCROLL (sticky stack–safe) =====*/
const navAnchors = document.querySelectorAll('.nav__menu .nav__link[href^="#"]')

function closeNavMenu(){
    const navMenu = document.getElementById('nav-menu')
    const t = document.querySelector('.nav__toggle')
    if (navMenu) navMenu.classList.remove('show-menu')
    if (t) t.setAttribute('aria-expanded', 'false')
}

navAnchors.forEach(function (link) {
    link.addEventListener('click', function (e) {
        const href = link.getAttribute('href')
        if (href && href.length > 1) {
            const id = href.slice(1)
            const target = document.getElementById(id)
            if (target) {
                e.preventDefault()
                target.scrollIntoView({ behavior: 'auto', block: 'start' })
                history.replaceState(null, '', href)
                requestAnimationFrame(updateActiveNav)
            }
        }
        closeNavMenu()
    })
})

/* Stacked sections: offsetTop ranges overlap; use last section whose top crossed the header line. */
function updateActiveNav() {
    var header = document.getElementById('header')
    var trigger = (header ? header.offsetHeight : 64) + 24
    var sections = document.querySelectorAll('main section[id]')
    var currentId = sections.length ? sections[0].getAttribute('id') : 'home'

    sections.forEach(function (sec) {
        if (sec.getBoundingClientRect().top <= trigger) {
            currentId = sec.getAttribute('id')
        }
    })

    document.querySelectorAll('.nav__menu .nav__link[href^="#"]').forEach(function (link) {
        var on = link.getAttribute('href') === '#' + currentId
        link.classList.toggle('active-link', on)
    })
}

window.addEventListener('scroll', updateActiveNav, { passive: true })
window.addEventListener('resize', updateActiveNav)
window.addEventListener('load', updateActiveNav)
window.addEventListener('hashchange', updateActiveNav)
document.addEventListener('site-data-ready', function () {
    requestAnimationFrame(updateActiveNav)
})

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateActiveNav)
} else {
    updateActiveNav()
}

var navLogo = document.querySelector('.nav__logo[href^="#"]')
if (navLogo) {
    navLogo.addEventListener('click', function (e) {
        var href = navLogo.getAttribute('href')
        if (href && href.length > 1) {
            var target = document.getElementById(href.slice(1))
            if (target) {
                e.preventDefault()
                target.scrollIntoView({ behavior: 'auto', block: 'start' })
                history.replaceState(null, '', href)
                requestAnimationFrame(updateActiveNav)
            }
        }
    })
}

/*===== CHANGE BACKGROUND HEADER =====*/ 
function scrollHeader(){
    const nav = document.getElementById('header');
    if(this.scrollY >= 200) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header');
}
window.addEventListener('scroll', scrollHeader)

/*===== SHOW SCROLL TOP=====*/ 
function scrollTop(){
    const scrollTop = document.getElementById('scroll-top');
    if(this.scrollY >= 560) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollTop)

/*===== MIXITUP FILTER PORTFOLIO (after site data loads) =====*/
function initPortfolioMixer() {
    var container = document.querySelector(".portfolio__container");
    if (!container || !container.querySelector(".portfolio__content")) return;
    if (window.portfolioMixer && typeof window.portfolioMixer.destroy === "function") {
        window.portfolioMixer.destroy();
    }
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.portfolioMixer = mixitup(".portfolio__container", {
        selectors: {
            target: ".portfolio__content",
        },
        controls: {
            enable: true,
            scope: "global",
        },
        animation: {
            enable: !reduceMotion,
            duration: 220,
            effects: "fade",
            easing: "ease-out",
            animateResizeContainer: false,
            animateResizeTargets: false,
            nudge: false,
        },
    });
}
document.addEventListener("site-data-ready", initPortfolioMixer);

/* Link active portfolio + tab semantics */
const linkPortfolio = document.querySelectorAll(".portfolio__item");

function activePortfolio() {
    if (!linkPortfolio) return;
    linkPortfolio.forEach(function (l) {
        l.classList.remove("active-portfolio");
        l.setAttribute("aria-selected", "false");
        l.setAttribute("tabindex", "-1");
    });
    this.classList.add("active-portfolio");
    this.setAttribute("aria-selected", "true");
    this.setAttribute("tabindex", "0");
}
linkPortfolio.forEach(function (l) {
    l.addEventListener("click", activePortfolio);
});

/* Testimonial swiper is initialized in index.html (single instance). */

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.from('.home__img', { opacity: 0, duration: 1.1, delay: 0.35, y: 28, ease: 'power3.out' })

  gsap.from('.home__data', { opacity: 0, duration: 1, delay: 0.45, y: 20, ease: 'power3.out' })
  gsap.from(
    '.home__greeting, .home__name, .home__focus-chips, .home__tagline, .home__actions .button, .home__connect',
    {
      opacity: 0,
      duration: 0.85,
      delay: 0.55,
      y: 18,
      ease: 'power3.out',
      stagger: 0.09,
    }
  )

  gsap.from('.nav__logo, .nav__toggle', {
    opacity: 0,
    duration: 0.7,
    delay: 0.2,
    y: 12,
    ease: 'power3.out',
    stagger: 0.05,
  })
  gsap.from('.nav__item', {
    opacity: 0,
    duration: 0.65,
    delay: 0.35,
    y: 10,
    ease: 'power3.out',
    stagger: 0.05,
  })
  gsap.from('.home__social-icon', {
    opacity: 0,
    duration: 0.75,
    delay: 0.95,
    y: 12,
    ease: 'power3.out',
    stagger: 0.06,
  })
}

/*===== SCROLL REVEAL (premium section entrance) =====*/
document.querySelectorAll('section[id]:not(#home)').forEach(function (sec) {
    if (sec.classList.contains('testimonial--bleed')) {
        sec.classList.add('js-reveal')
        return
    }
    var inner = sec.querySelector('.section__inner')
    if (inner) {
        inner.classList.add('js-reveal')
        return
    }
    inner = sec.querySelector('.bd-container')
    if (!inner && sec.classList.contains('bd-container')) inner = sec
    if (inner) inner.classList.add('js-reveal')
})

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealIo = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add('js-reveal--visible')
                    revealIo.unobserve(e.target)
                }
            })
        },
        { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    document.querySelectorAll('.js-reveal').forEach(function (el) {
        revealIo.observe(el)
    })
} else {
    document.querySelectorAll('.js-reveal').forEach(function (el) {
        el.classList.add('js-reveal--visible')
    })
}


