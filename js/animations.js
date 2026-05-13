/**
 * SVK Portfolio — Animations & Interactions JS
 */
(function () {
  'use strict';

  /* ── 1. SCROLL REVEAL ──────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Add visible with stagger delay based on sibling index
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(el => el.hasAttribute('data-fade') || el.hasAttribute('data-stagger'))
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Observe all fade targets
  document.querySelectorAll('[data-fade], [data-stagger]').forEach(el => {
    revealObserver.observe(el);
  });

  // Also reveal section titles when visible
  const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.sec-title').forEach(el => titleObserver.observe(el));

  /* ── 2. ACTIVE NAV LINK ON SCROLL ─────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ── 3. FLOATING NAV ON SCROLL ─────────────────────────── */
  const nav = document.querySelector('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 80) {
      nav.style.boxShadow = '0 4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.08)';
    } else {
      nav.style.boxShadow = '';
    }

    // Scroll-to-top button
    const scrollBtn = document.getElementById('scroll-top');
    if (scrollBtn) {
      if (currentScroll > 500) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    }

    lastScroll = currentScroll;
  }, { passive: true });

  /* ── 4. SMOOTH SCROLL FOR NAV LINKS ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 5. MAGNETIC HOVER ON BUTTONS ──────────────────────── */
  document.querySelectorAll('.btn-gold, .hire-btn').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = `translateY(-3px) translate(${x * 0.08}px, ${y * 0.08}px)`;
    });
    btn.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  /* ── 6. CARD TILT EFFECT ───────────────────────────────── */
  document.querySelectorAll('.proj-card, .sk-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = y * -6;
      const rotateY = x * 6;
      this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      this.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, box-shadow 0.4s ease';
    });
  });

  /* ── 7. STAT NUMBER COUNT-UP ───────────────────────────── */
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent.trim();
      const num = parseFloat(text.replace(/[^0-9.]/g, ''));

      if (!isNaN(num) && num > 0 && num <= 100) {
        const suffix = text.replace(/[0-9.]/g, '');
        let start = 0;
        const duration = 1200;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = (num <= 1 ? (eased * num).toFixed(0) : Math.round(eased * num)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = text;
        };
        requestAnimationFrame(step);
      }
      statsObserver.unobserve(el);
    });
  }, { threshold: 0.7 });

  document.querySelectorAll('.stat-num').forEach(el => statsObserver.observe(el));

  /* ── 8. SCROLL PROGRESS INDICATOR ──────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id = 'progress-bar';
  progressBar.style.cssText = `
    position:fixed; top:0; left:0; z-index:9999;
    height:2px; width:0%;
    background:linear-gradient(90deg, var(--gold), var(--gold-light));
    transition: width 0.1s linear;
    pointer-events:none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / winH) * 100;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* ── 9. CURSOR GLOW (desktop only) ─────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998;
      width:300px; height:300px; border-radius:50%;
      background:radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
      transform:translate(-50%, -50%);
      transition:left 0.15s ease, top 0.15s ease;
      will-change: left, top;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

})();
