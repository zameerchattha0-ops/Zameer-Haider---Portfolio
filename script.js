// ===== Year =====
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Theme toggle with persistence =====
const root = document.documentElement;
const toggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') root.classList.remove('light');
if (savedTheme === 'light') root.classList.add('light');

toggle?.addEventListener('click', () => {
  root.classList.toggle('light');
  localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
});

// ===== Reveal on scroll =====
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  // Simple reveal for reduced motion users
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
} else {
  // JS-based staggering
  // Move .reveal class from container to children for select containers
  document.querySelectorAll('.chips.reveal, .kv.reveal, .bullets.reveal').forEach(container => {
    container.classList.remove('reveal');
    Array.from(container.children).forEach(child => child.classList.add('reveal'));
  });

  // Apply staggered delay to reveal elements in groups
  const staggerGroups = ['.timeline', '.cards', '.skillwrap', '.chips', '.hero-intro', '.cols', '.bullets', '.kv'];
  staggerGroups.forEach(groupSelector => {
    document.querySelectorAll(groupSelector).forEach(container => {
      const elements = container.querySelectorAll('.reveal');
      elements.forEach((el, i) => {
        el.style.transitionDelay = `${i * 80}ms`;
      });
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ===== Smooth scroll for internal links =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id && id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Typing effect (hero) =====
(function typingEffect() {
  const el = document.getElementById('typing');
  if (!el) return;
  const lines = [
    'Audit • Taxation • ERP • Financial Reporting',
    'Analytical • Detail‑oriented • Quick learner',
    'EF SET C1 • Advanced Excel • MS Office'
  ];
  let li = 0, ci = 0, erasing = false;

  function loop() {
    const text = lines[li];
    if (!erasing) {
      el.textContent = text.slice(0, ++ci);
      if (ci === text.length) { erasing = true; return setTimeout(loop, 1400); }
      return setTimeout(loop, prefersReduced ? 0 : 28);
    } else {
      el.textContent = text.slice(0, --ci);
      if (ci === 0) { erasing = false; li = (li + 1) % lines.length; return setTimeout(loop, 220); }
      return setTimeout(loop, prefersReduced ? 0 : 12);
    }
  }
  loop();
})();

// ===== Contact form mailto fallback =====
const form = document.getElementById('contact-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  try {
    const data = new FormData(form);
    const name = encodeURIComponent(data.get('name') || '');
    const email = encodeURIComponent(data.get('email') || '');
    const message = encodeURIComponent(data.get('message') || '');
    window.location.href =
      `mailto:zameerchattha0@gmail.com?subject=Portfolio inquiry from ${name}` +
      `&body=Email: ${email}%0D%0A%0D%0A${message}`;
  } catch {
    alert('Could not open your email app. Please email me at: zameerchattha0@gmail.com');
  }
});

// ===== Canvas particles background =====
(function particles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w, h, dpr, mouseX = -9999, mouseY = -9999;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth = canvas.parentElement.clientWidth;
    h = canvas.clientHeight = canvas.parentElement.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) / (rect.right - rect.left) * w;
    mouseY = (e.clientY - rect.top) / (rect.bottom - rect.top) * h;
  });
  canvas.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });

  const N = prefersReduced ? 0 : 40;
  const pts = Array.from({ length: N }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    ox: Math.random() * w, // original x
    oy: Math.random() * h, // original y
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: 1.2 + Math.random() * 1.8
  }));

  function tick() {
    ctx.clearRect(0, 0, w, h);

    // draw connections
    ctx.lineWidth = 0.5;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 180 * 180) {
          const a = 0.04 * (1 - Math.sqrt(dist2) / 180);
          ctx.strokeStyle = `rgba(142, 113, 255, ${a})`;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    // draw particles and react to mouse
    for (const p of pts) {
      // mouse repulsion
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 120) {
        const force = (120 - mDist) / 120;
        p.vx += (mdx / mDist) * force * 0.25;
        p.vy += (mdy / mDist) * force * 0.25;
      }

      // return to origin
      p.vx += (p.ox - p.x) * 0.0002;
      p.vy += (p.oy - p.y) * 0.0002;

      // dampening
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx; p.y += p.vy;

      // boundary checks
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      else if (p.x > w) { p.x = w; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      else if (p.y > h) { p.y = h; p.vy *= -1; }

      ctx.fillStyle = 'rgba(212,160,23,0.65)'; // gold tone
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }
  tick();
})();

// ===== Glitch hover effect =====
document.querySelectorAll('.premium-name').forEach(el => {
  el.setAttribute('data-text', el.textContent);
  el.addEventListener('mouseover', () => {
    if (prefersReduced) return;
    el.classList.add('glitch-text');
  });
  el.addEventListener('mouseout', () => {
    el.classList.remove('glitch-text');
  });
});

// ===== Custom Cursor =====
(function customCursor() {
  if (prefersReduced) return;
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorCircle = document.querySelector('.cursor-circle');
  if (!cursor || !cursorDot || !cursorCircle) return;

  let posX = 0, posY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    posX += (mouseX - posX) / 8;
    posY += (mouseY - posY) / 8;
    cursor.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
    requestAnimationFrame(animate);
  }
  animate();

  document.querySelectorAll('a, button, .theme-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorCircle.style.transform = 'scale(1.5)';
      cursorCircle.style.opacity = '0.7';
      cursorDot.style.transform = 'scale(1.3)';
    });
    el.addEventListener('mouseleave', () => {
      cursorCircle.style.transform = 'scale(1)';
      cursorCircle.style.opacity = '1';
      cursorDot.style.transform = 'scale(1)';
    });
  });
})();