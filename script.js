/**
 * ================================================
 * MUHIRWA HERTIER — Portfolio Script
 * Features:
 *  - Page loader
 *  - Custom cursor
 *  - Navbar scroll + active state
 *  - Mobile menu
 *  - Dark/Light mode toggle (persisted)
 *  - Scroll reveal (intersection observer)
 *  - Animated stat counters
 *  - Skill bar animation
 *  - Project card dynamic glow colour
 *  - Magnetic button effect
 *  - Smooth scrolling
 *  - Contact form validation + feedback
 * ================================================
 */

'use strict';

/* ================================================
   UTILITY HELPERS
   ================================================ */

/**
 * Shorthand querySelector
 * @param {string} sel - CSS selector
 * @param {Element} [ctx=document] - Context element
 * @returns {Element|null}
 */
const $ = (sel, ctx = document) => ctx.querySelector(sel);

/**
 * Shorthand querySelectorAll → Array
 * @param {string} sel
 * @param {Element} [ctx=document]
 * @returns {Element[]}
 */
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/**
 * Throttle a function call
 * @param {Function} fn
 * @param {number} ms
 * @returns {Function}
 */
function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
}

/**
 * Clamp a value between min and max
 */
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);


/* ================================================
   PAGE LOADER
   ================================================ */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  document.body.classList.add('loading');

  // Remove loader after animation completes
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');

      // Trigger hero animations after load
      triggerHeroAnimations();
    }, 1400); // matches CSS animation duration
  });
}


/* ================================================
   HERO ENTRY ANIMATIONS
   ================================================ */
function triggerHeroAnimations() {
  // Animate all [data-aos] elements that are in viewport
  const heroEls = $$('[data-aos]', document.querySelector('#hero'));
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('aos-animate');
    }, i * 80);
  });
}


/* ================================================
   CUSTOM CURSOR
   ================================================ */
function initCursor() {
  // Only on pointer-fine devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor   = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Cursor dot follows instantly
    cursor.style.left = `${mouseX}px`;
    cursor.style.top  = `${mouseY}px`;
  });

  // Follower uses lerp for smooth trailing
  function lerpFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;

    follower.style.left = `${followerX}px`;
    follower.style.top  = `${followerY}px`;

    requestAnimationFrame(lerpFollower);
  }
  lerpFollower();

  // Hover state: links, buttons, cards
  const hoverSelectors = 'a, button, .project-card, .skill-card, .ach-card, .channel-link, .trait, input, textarea';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      cursor.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      cursor.classList.remove('hovering');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });
}


/* ================================================
   NAVBAR — Scroll behaviour + active section
   ================================================ */
function initNavbar() {
  const header    = $('#navHeader');
  const navLinks  = $$('.nav-link');
  const sections  = $$('section[id]');

  if (!header) return;

  // Scrolled style
  const handleScroll = throttle(() => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active nav link based on current section
    let current = '';
    sections.forEach(sec => {
      const offset = sec.getBoundingClientRect().top;
      if (offset <= 100) {
        current = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, 80);

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on init
}


/* ================================================
   MOBILE MENU
   ================================================ */
function initMobileMenu() {
  const hamburger  = $('#hamburger');
  const mobileNav  = $('#mobileNav');
  const mobileLinks = $$('.mobile-link');

  if (!hamburger || !mobileNav) return;

  function openMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      closeMenu();
    }
  });
}


/* ================================================
   DARK / LIGHT MODE TOGGLE
   ================================================ */
function initTheme() {
  const themeBtn = $('#themeBtn');
  if (!themeBtn) return;

  // Load saved preference, default to dark
  const saved = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });
}


/* ================================================
   SMOOTH SCROLLING (anchor links)
   ================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href   = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72'
      );

      const offsetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top:      offsetTop,
        behavior: 'smooth',
      });
    });
  });
}


/* ================================================
   SCROLL REVEAL (Intersection Observer)
   ================================================ */
function initScrollReveal() {
  const els = $$('[data-aos]');
  if (!els.length) return;

  // Don't animate if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach(el => el.classList.add('aos-animate'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  // Skip hero elements (handled by loader callback)
  els.forEach(el => {
    if (!el.closest('#hero')) {
      observer.observe(el);
    }
  });
}


/* ================================================
   ANIMATED STAT COUNTERS
   ================================================ */
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/**
 * Animate a counter from 0 to its data-count value
 * @param {Element} el
 */
function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = clamp(elapsed / duration, 0, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);

    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}


/* ================================================
   SKILL BARS ANIMATION
   ================================================ */
function initSkillBars() {
  const bars = $$('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  bars.forEach(bar => observer.observe(bar));
}


/* ================================================
   PROJECT CARD DYNAMIC GLOW
   Reads data-accent attr and applies CSS var for glow
   ================================================ */
function initProjectGlow() {
  const cards = $$('.project-card[data-accent]');

  cards.forEach(card => {
    const accent = card.dataset.accent;
    if (!accent) return;

    // Convert hex to rgba for glow
    const rgb  = hexToRgb(accent);
    if (rgb) {
      const glowEl = card.querySelector('.project-glow');
      if (glowEl) {
        glowEl.style.background = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
      }
      card.style.setProperty('--p-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
    }
  });
}

/**
 * Convert hex colour to RGB object
 * @param {string} hex
 * @returns {{r:number, g:number, b:number}|null}
 */
function hexToRgb(hex) {
  const clean  = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  if (isNaN(bigint)) return null;
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8)  & 255,
    b: bigint & 255,
  };
}


/* ================================================
   MAGNETIC BUTTONS
   ================================================ */
function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const magnetics = $$('.magnetic-btn');

  magnetics.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect    = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;

      const dx = (e.clientX - centerX) * 0.35;
      const dy = (e.clientY - centerY) * 0.35;

      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}


/* ================================================
   CONTACT FORM
   ================================================ */
function initContactForm() {
  const form     = $('#contactForm');
  const feedback = $('#formFeedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    $$('.form-error', form).forEach(el => { el.textContent = ''; });
    $$('input, textarea', form).forEach(el => el.classList.remove('error'));

    // Validate
    const name    = $('#f-name',    form);
    const email   = $('#f-email',   form);
    const subject = $('#f-subject', form);
    const message = $('#f-message', form);

    let valid = true;

    const setError = (field, msg) => {
      const errorEl = field.closest('.form-group').querySelector('.form-error');
      if (errorEl) errorEl.textContent = msg;
      field.classList.add('error');
      valid = false;
    };

    if (!name.value.trim()) {
      setError(name, 'Please enter your name.');
    }

    if (!email.value.trim()) {
      setError(email, 'Please enter your email.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, 'Please enter a valid email address.');
    }

    if (!subject.value.trim()) {
      setError(subject, 'Please enter a subject.');
    }

    if (!message.value.trim()) {
      setError(message, 'Please write a message.');
    } else if (message.value.trim().length < 20) {
      setError(message, 'Message must be at least 20 characters.');
    }

    if (!valid) return;

    // Simulate send (replace with actual fetch/backend)
    const submitBtn  = form.querySelector('.form-btn');
    const btnLabel   = submitBtn.querySelector('.btn-label') || submitBtn;
    const origLabel  = btnLabel.textContent;

    submitBtn.disabled    = true;
    btnLabel.textContent  = 'Sending…';
    feedback.textContent  = '';
    feedback.className    = 'form-feedback';

    // Simulate async send (1.5 seconds)
    setTimeout(() => {
      submitBtn.disabled   = false;
      btnLabel.textContent = origLabel;
      form.reset();

      feedback.textContent = '✅ Message sent! I\'ll get back to you soon.';
      feedback.classList.add('success');

      // Auto clear feedback after 6s
      setTimeout(() => {
        feedback.textContent = '';
        feedback.className   = 'form-feedback';
      }, 6000);

    }, 1500);
  });

  // Real-time input validation (clear error on typing)
  $$('input, textarea', form).forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errorEl = field.closest('.form-group').querySelector('.form-error');
      if (errorEl) errorEl.textContent = '';
    });
  });
}


/* ================================================
   HERO FLOATING CODE FLICKER (extra detail)
   ================================================ */
function initCodeFlicker() {
  const lines = $$('.code-line');

  lines.forEach((line, i) => {
    setInterval(() => {
      const chars   = line.textContent;
      const idx     = Math.floor(Math.random() * chars.length);
      const glitch  = chars.slice(0, idx) + '_' + chars.slice(idx + 1);
      line.textContent = glitch;

      setTimeout(() => {
        line.textContent = chars;
      }, 60);
    }, 4000 + i * 1200);
  });
}


/* ================================================
   PARALLAX — subtle section backgrounds
   ================================================ */
function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const orbs = $$('.mesh-orb, .contact-orb');

  const handleScroll = throttle(() => {
    const scrolled = window.scrollY;

    orbs.forEach((orb, i) => {
      const speed  = (i % 2 === 0) ? 0.04 : -0.03;
      const offset = scrolled * speed;
      orb.style.transform = `translateY(${offset}px)`;
    });
  }, 16);

  window.addEventListener('scroll', handleScroll, { passive: true });
}


/* ================================================
   ACTIVE LINK HIGHLIGHT ON CLICK (immediate)
   ================================================ */
function initNavHighlight() {
  const navLinks = $$('.nav-link, .mobile-link');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}


/* ================================================
   SECTION ENTRANCE — stagger children
   ================================================ */
function initSectionStagger() {
  const staggerSections = ['#skills', '#projects', '#achievements'];

  staggerSections.forEach(sel => {
    const section = $(sel);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const children = section.querySelectorAll('.skill-card, .project-card, .ach-card');
          children.forEach((child, i) => {
            setTimeout(() => {
              child.style.opacity   = '1';
              child.style.transform = 'translateY(0)';
            }, i * 80);
          });
          observer.unobserve(section);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(section);
  });
}


/* ================================================
   FOOTER — Back to top smooth
   ================================================ */
function initBackToTop() {
  const logo = $('.footer-logo');
  if (!logo) return;

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ================================================
   INIT — Run everything on DOM ready
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {

  initLoader();          // Page loader animation
  initCursor();          // Custom cursor
  initTheme();           // Dark/light mode persistence
  initNavbar();          // Scrolled nav + active sections
  initMobileMenu();      // Hamburger menu
  initSmoothScroll();    // Anchor smooth scrolling
  initScrollReveal();    // Intersection-based reveals
  initCounters();        // Animated stat numbers
  initSkillBars();       // Animated skill progress bars
  initProjectGlow();     // Dynamic project card glow
  initMagneticButtons(); // Magnetic hover on CTA buttons
  initContactForm();     // Form validation + feedback
  initCodeFlicker();     // Hero code line glitch effect
  initParallax();        // Subtle orb parallax on scroll
  initNavHighlight();    // Immediate active state on click
  initSectionStagger();  // Staggered section children entrance
  initBackToTop();       // Footer logo back to top

  console.log(
    '%c Muhirwa Hertier · Portfolio · Kigali, Rwanda 🇷🇼 ',
    'background: #00FF7F; color: #0a0a0a; font-weight: 700; padding: 4px 8px; border-radius: 4px;'
  );
});


/* ================================================
   WINDOW RESIZE — Re-init responsive features
   ================================================ */
window.addEventListener('resize', throttle(() => {
  // Close mobile menu on resize to desktop
  const mobileNav = $('#mobileNav');
  const hamburger = $('#hamburger');

  if (window.innerWidth > 768 && mobileNav?.classList.contains('open')) {
    mobileNav.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}, 200));
