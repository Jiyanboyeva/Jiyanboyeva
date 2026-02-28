/* ========================================================
   GLASS AMBER — Portfolio JS
   Sanjana Jiyanboyeva
   ======================================================== */

/* ================================================================
   0. THEME TOGGLE (global — called via onclick)
   ================================================================ */
function toggleTheme() {
  var html = document.documentElement;
  var currentTheme = html.getAttribute('data-theme') || 'dark';
  var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  var btn = document.getElementById('themeToggle');
  if (btn) {
    btn.textContent = newTheme === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }
}

/* Apply saved theme on page load (before IIFE) */
(function () {
  var saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  /* Update icon once DOM is ready */
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = saved === 'dark' ? '\u2600\uFE0F' : '\uD83C\uDF19';
    }
  });
})();

(function () {
  'use strict';

  /* ── STATE ── */
  let currentLang = 'uz'; // default language

  /* ── DOM REFS ── */
  const navbar      = document.getElementById('navbar');
  const navLinks    = document.getElementById('navLinks');
  const navBurger   = document.getElementById('navBurger');
  const langToggle  = document.getElementById('langToggle');
  const langLabel   = document.getElementById('langLabel');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* ================================================================
     1. LANGUAGE TOGGLE  (data-uz / data-en)
     ================================================================ */
  function setLanguage(lang) {
    currentLang = lang;
    const els = document.querySelectorAll('[data-uz][data-en]');
    els.forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });
    // Update toggle button label to show the OTHER language
    langLabel.textContent = lang === 'uz' ? 'EN' : "O'Z";
    document.documentElement.lang = lang === 'uz' ? 'uz' : 'en';
  }

  langToggle.addEventListener('click', function () {
    var nextLang = currentLang === 'uz' ? 'en' : 'uz';
    setLanguage(nextLang);
  });

  /* ================================================================
     2. NAVBAR — scroll effect & active link
     ================================================================ */
  var sections = document.querySelectorAll('section[id]');

  function onScroll() {
    var scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    sections.forEach(function (sec) {
      var top    = sec.offsetTop - 120;
      var bottom = top + sec.offsetHeight;
      var id     = sec.getAttribute('id');
      var link   = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollY >= top && scrollY < bottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init

  /* ================================================================
     3. MOBILE MENU
     ================================================================ */
  navBurger.addEventListener('click', function () {
    navBurger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navBurger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ================================================================
     4. SMOOTH SCROLL (for browsers that don't support CSS scroll-behavior)
     ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 80; // navbar height
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ================================================================
     5. INTERSECTION OBSERVER — reveal on scroll
     ================================================================ */
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ================================================================
     6. SKILL BARS — animate on scroll
     ================================================================ */
  var skillFills = document.querySelectorAll('.skill-fill');

  if ('IntersectionObserver' in window) {
    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fill = entry.target;
          var targetWidth = fill.getAttribute('data-width');
          fill.style.width = targetWidth + '%';
          fill.classList.add('animated');
          skillObserver.unobserve(fill);
        }
      });
    }, {
      threshold: 0.3
    });

    skillFills.forEach(function (fill) {
      skillObserver.observe(fill);
    });
  } else {
    skillFills.forEach(function (fill) {
      fill.style.width = fill.getAttribute('data-width') + '%';
    });
  }

  /* ================================================================
     7. CONTACT FORM
     ================================================================ */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple demo — show success message
    contactForm.classList.add('hidden');
    formSuccess.classList.remove('hidden');

    // Reset after 4 seconds
    setTimeout(function () {
      formSuccess.classList.add('hidden');
      contactForm.classList.remove('hidden');
      contactForm.reset();
    }, 4000);
  });

  /* ================================================================
     8. CURSOR GLOW — subtle amber glow following cursor (desktop only)
     ================================================================ */
  if (window.matchMedia('(pointer: fine)').matches) {
    var glow = document.createElement('div');
    glow.style.cssText =
      'position:fixed;top:0;left:0;width:280px;height:280px;' +
      'border-radius:50%;pointer-events:none;z-index:9999;' +
      'background:radial-gradient(circle,rgba(245,158,11,0.06) 0%,transparent 70%);' +
      'transform:translate(-50%,-50%);transition:opacity 0.3s;opacity:0;';
    document.body.appendChild(glow);

    var glowVisible = false;
    document.addEventListener('mousemove', function (e) {
      if (!glowVisible) {
        glow.style.opacity = '1';
        glowVisible = true;
      }
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      glow.style.opacity = '0';
      glowVisible = false;
    });
  }

  /* ================================================================
     9. KEYBOARD ACCESSIBILITY — close menu on Escape
     ================================================================ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navBurger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

})();
