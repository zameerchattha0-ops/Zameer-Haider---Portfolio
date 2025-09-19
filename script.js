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
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

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

  let w, h, dpr;
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

  const N = prefersReduced ? 0 : 36;
  const pts = Array.from({ length: N }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: 1.2 + Math.random() * 1.6
  }));

  function tick() {
    ctx.clearRect(0, 0, w, h);

    // draw connections
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 160 * 160) {
          const a = 0.05 * (1 - Math.sqrt(dist2) / 160);
          ctx.strokeStyle = `rgba(142, 113, 255, ${a})`;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    // draw particles
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = 'rgba(212,160,23,0.55)'; // gold tone
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }
  tick();
})();