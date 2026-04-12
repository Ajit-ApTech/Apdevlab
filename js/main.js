/**
 * main.js — GSAP Animations, Scroll Reveals, Logo Sequence,
 *           3D Tilt, Nav Active States, CountUp
 * Apdevlab — Premium Agency Website
 */

/* ==========================================================
   1. GSAP PLUGIN REGISTRATION
   ========================================================== */
gsap.registerPlugin(ScrollTrigger);

/* ==========================================================
   2. REDUCED MOTION CHECK
   ========================================================== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================
   3. CUSTOM CURSOR
   ========================================================== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function tick() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  }
  tick();

  // Expand on interactive elements
  document.querySelectorAll('[data-cursor="pointer"], a, button, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });
}

/* ==========================================================
   4. LOGO ANIMATION
   ========================================================== */
function initLogoAnimation() {
  const bracketOpen  = document.getElementById('logo-bracket-open');
  const logoTextEl   = document.getElementById('logo-text');
  const bracketClose = document.getElementById('logo-bracket-close');
  const logoCursor   = document.getElementById('logo-cursor');
  const logoLink     = document.getElementById('logo-link');
  const WORD         = 'Apdevlab';

  if (!bracketOpen || !logoTextEl || !bracketClose) return;

  if (prefersReducedMotion) {
    bracketOpen.style.opacity  = '1';
    bracketClose.style.opacity = '1';
    logoTextEl.textContent     = WORD;
    logoTextEl.style.opacity   = '1';
    logoCursor.style.opacity   = '0';
    logoLink?.classList.add('logo-done');
    return;
  }

  // Start all invisible
  bracketOpen.style.opacity  = '0';
  bracketClose.style.opacity = '0';
  logoTextEl.style.opacity   = '0';
  logoTextEl.textContent     = '';
  logoCursor.style.opacity   = '0';

  const tl = gsap.timeline({ delay: 0.25 });

  // 1. Fade in opening bracket
  tl.to(bracketOpen, { opacity: 1, duration: 0.2, ease: 'power2.out' });

  // 2. Show cursor, then type letters one by one
  tl.to(logoCursor, { opacity: 1, duration: 0.1 }, '+=0.05');
  tl.to(logoTextEl, { opacity: 1, duration: 0.01 }, '<');

  // Type each character using a callback stagger
  const charDelay = 0.08;
  WORD.split('').forEach((char, i) => {
    tl.call(() => {
      logoTextEl.textContent = WORD.slice(0, i + 1);
    }, null, `<${i === 0 ? '' : '+=' + charDelay}`);
  });

  // 3. Blink cursor out after typing
  tl.to(logoCursor, { opacity: 0, duration: 0.15 }, `+=${charDelay + 0.15}`);

  // 4. Fade in closing bracket
  tl.to(bracketClose, { opacity: 1, duration: 0.2, ease: 'power2.out' }, '+=0.05');

  // 5. Brief glow flash on the whole logo
  tl.to(logoLink, {
    filter: 'drop-shadow(0 0 14px rgba(6,182,212,0.75))',
    duration: 0.2,
    ease: 'power2.out'
  }, '+=0.1')
  .to(logoLink, {
    filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.25))',
    duration: 0.4,
    ease: 'power2.in'
  });

  // 6. Add shimmer class
  tl.call(() => {
    logoLink?.classList.add('logo-shimmer');
  });
}

/* ==========================================================
   5. HERO ANIMATIONS
   ========================================================== */
const TAGLINES = ['Mobile First', 'Web Excellence', 'AI-Powered Builds'];
let taglineIndex = 0;
let isTyping = false;
let typerafHandle = null;

function typeText(el, text, speed, cb) {
  let i = 0;
  el.textContent = '';
  isTyping = true;
  function step() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      typerafHandle = setTimeout(step, speed);
    } else {
      isTyping = false;
      if (cb) cb();
    }
  }
  step();
}

function deleteText(el, speed, cb) {
  let text = el.textContent;
  isTyping = true;
  function step() {
    if (text.length > 0) {
      text = text.slice(0, -1);
      el.textContent = text;
      typerafHandle = setTimeout(step, speed / 2);
    } else {
      isTyping = false;
      if (cb) cb();
    }
  }
  step();
}

function startTypewriterCycle() {
  const twEl = document.getElementById('typewriter-text');
  if (!twEl) return;

  function cycle() {
    const phrase = TAGLINES[taglineIndex];
    typeText(twEl, phrase, 70, () => {
      setTimeout(() => {
        deleteText(twEl, 70, () => {
          taglineIndex = (taglineIndex + 1) % TAGLINES.length;
          setTimeout(cycle, 300);
        });
      }, 2500);
    });
  }
  cycle();
}

function initHeroAnimations() {
  // Headline stagger
  const headline = document.querySelector('.hero-headline');
  if (headline && !prefersReducedMotion) {
    gsap.from(headline, {
      opacity: 0,
      clipPath: 'inset(100% 0 0 0)',
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.5,
    });
  }

  const heroEyebrow = document.querySelector('.hero-eyebrow');
  if (heroEyebrow && !prefersReducedMotion) {
    gsap.from(heroEyebrow, { opacity: 0, y: -12, duration: 0.5, delay: 0.3, ease: 'power2.out' });
  }

  const ctaRow = document.querySelector('.cta-row');
  if (ctaRow && !prefersReducedMotion) {
    gsap.from(ctaRow, { opacity: 0, y: 20, duration: 0.6, delay: 1.0, ease: 'power2.out' });
  }

  const trustStats = document.querySelector('.trust-stats');
  if (trustStats && !prefersReducedMotion) {
    gsap.from(trustStats, { opacity: 0, y: 12, duration: 0.5, delay: 1.2, ease: 'power2.out' });
  }

  // Typewriter cycle
  if (!prefersReducedMotion) {
    setTimeout(startTypewriterCycle, 400);
  } else {
    const twEl = document.getElementById('typewriter-text');
    if (twEl) twEl.textContent = TAGLINES[0];
  }

  // CountUp — expo.out: fast start, dramatic slowdown as it nears target
  document.querySelectorAll('[data-countup]').forEach(el => {
    const target = parseInt(el.dataset.countup, 10);
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.6,          // longer total run
      delay: 1.3,
      ease: 'expo.out',       // rockets off, brakes sharply near the end
      onUpdate: () => {
        el.textContent = Math.round(obj.val);
      },
    });
  });
}

/* ==========================================================
   6. SCROLL REVEAL SETUP
   ========================================================== */
function initScrollReveals() {
  if (prefersReducedMotion) {
    document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach(el => {
      el.style.opacity = '1';
      el.style.clipPath = 'none';
    });
    return;
  }

  // Single element reveals
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, clipPath: 'inset(20% 0 0 0)' },
      {
        opacity: 1,
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });

  // Stagger groups
  const staggerParents = new Set();
  document.querySelectorAll('[data-reveal-stagger]').forEach(el => {
    staggerParents.add(el.parentElement);
  });

  staggerParents.forEach(parent => {
    const children = parent.querySelectorAll('[data-reveal-stagger]');
    gsap.fromTo(children,
      { opacity: 0, clipPath: 'inset(20% 0 0 0)' },
      {
        opacity: 1,
        clipPath: 'inset(0% 0 0 0)',
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: parent,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });
}

/* ==========================================================
   7. 3D CARD TILT — Services + Portfolio
   ========================================================== */
function initCardTilt() {
  const isTouch = window.matchMedia('(hover: none)').matches;
  if (isTouch || prefersReducedMotion) return;

  document.querySelectorAll('.card-3d').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect    = card.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const tiltX   = (e.clientX - centerX) / (rect.width  / 2);
      const tiltY   = (e.clientY - centerY) / (rect.height / 2);

      card.style.transform = `perspective(800px)
        rotateX(${-tiltY * 8}deg)
        rotateY(${tiltX  * 8}deg)
        translateZ(8px) scale(1.02)`;
      card.style.transition = 'none';

      // Spotlight gradient
      const cursorX = ((e.clientX - rect.left) / rect.width)  * 100;
      const cursorY = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--cursor-x', `${cursorX}%`);
      card.style.setProperty('--cursor-y', `${cursorY}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)';
      card.style.transform  = '';
    });
  });
}

/* ==========================================================
   8. ACTIVE NAV INDICATOR (IntersectionObserver)
   ========================================================== */
function initNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));

  // Header scroll class
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ==========================================================
   9. MOBILE NAV
   ========================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger-btn');
  const overlay   = document.getElementById('mobile-overlay');
  const closeBtn  = document.getElementById('close-nav-btn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!hamburger || !overlay) return;

  function openNav() {
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openNav);
  closeBtn?.addEventListener('click', closeNav);

  mobileLinks.forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeNav();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeNav();
  });
}

/* ==========================================================
   10. GRADIENT BORDER (about code card — CSS handles rotation,
       JS handles hover pause)
   ========================================================== */
function initGradientBorder() {
  document.querySelectorAll('.gradient-border').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.animationPlayState = 'paused';
    });
    card.addEventListener('mouseleave', () => {
      card.style.animationPlayState = 'running';
    });
  });
}

/* ==========================================================
   11. MARQUEE PAUSE ON HOVER
   ========================================================== */
function initMarqueePause() {
  document.querySelectorAll('.marquee-inner').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.animationPlayState = 'paused');
    el.addEventListener('mouseleave', () => el.style.animationPlayState = 'running');
  });
}

/* ==========================================================
   12. TECH CHIP INTERSECTION OBSERVER (pulse-active)
   ========================================================== */
function initTechChipPulse() {
  const chips = document.querySelectorAll('.tech-chip');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pulse-active');
        setTimeout(() => entry.target.classList.remove('pulse-active'), 300);
      }
    });
  }, { threshold: 0.5 });

  chips.forEach(chip => observer.observe(chip));
}

/* ==========================================================
   13. SERVICE CARD ICON PULSE
   ========================================================== */
function initIconPulse() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.card-icon');
      if (!icon) return;
      icon.classList.add('pulse-active');
      setTimeout(() => icon.classList.remove('pulse-active'), 1000);
    });
  });
}

/* ==========================================================
   14. INIT ALL
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Lucide icons must be initialised before we try to find them
  if (typeof lucide !== 'undefined') lucide.createIcons();

  if (!prefersReducedMotion) {
    initCursor();
    initLogoAnimation();
    initHeroAnimations();
    initScrollReveals();
    initCardTilt();
    initGradientBorder();
  } else {
    // Ensure all reveal elements are visible
    document.querySelectorAll('[data-reveal],[data-reveal-stagger]').forEach(el => {
      el.style.opacity   = '1';
      el.style.clipPath  = 'none';
    });

    // Show logo immediately (reduced motion)
    const bracketOpen  = document.getElementById('logo-bracket-open');
    const logoTextEl   = document.getElementById('logo-text');
    const bracketClose = document.getElementById('logo-bracket-close');
    const logoCursor   = document.getElementById('logo-cursor');
    if (bracketOpen)  bracketOpen.style.opacity  = '1';
    if (logoTextEl)  { logoTextEl.textContent     = 'Apdevlab';
                       logoTextEl.style.opacity   = '1'; }
    if (bracketClose) bracketClose.style.opacity  = '1';
    if (logoCursor)   logoCursor.style.opacity    = '0';
    document.getElementById('logo-link')?.classList.add('logo-done');

    // Static typewriter
    const twEl = document.getElementById('typewriter-text');
    if (twEl) twEl.textContent = TAGLINES[0];

    // Static countup
    document.querySelectorAll('[data-countup]').forEach(el => {
      el.textContent = el.dataset.countup;
    });
  }

  initNavObserver();
  initMobileNav();
  initMarqueePause();
  initTechChipPulse();
  initIconPulse();
});
