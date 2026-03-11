/* ===== CURSOR ===== */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mx = -100, my = -100, tx = -100, ty = -100;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top = ty + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ===== YEAR ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== SCROLL PROGRESS ===== */
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = height > 0 ? (window.scrollY / height) * 100 : 0;
  scrollProgress.style.width = scrolled + '%';
}, { passive: true });

/* ===== SHOW ALL SECTIONS IMMEDIATELY ===== */
document.querySelectorAll('.reveal-section, .reveal-fade').forEach(el => {
  el.style.opacity = '1';
  el.style.transform = 'none';
  el.style.animation = 'none';
  el.classList.add('visible');
});

/* ===== COUNTERS ===== */
function animateCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ===== SKILL FILTER ===== */
const chips = document.querySelectorAll('.skill-chip');
const skillCards = document.querySelectorAll('#skillsGrid .skill-card');

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter;
    skillCards.forEach(card => {
      const show = filter === 'all' || card.dataset.group === filter;
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.display = show ? 'block' : 'none';
        if (show) {
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        }
      }, 150);
    });
  });
});

skillCards.forEach(card => {
  card.style.transition = 'opacity 0.25s ease, transform 0.25s ease, border-color 0.25s, box-shadow 0.25s';
});

/* ===== MOBILE MENU ===== */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active-link'));
      const matching = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
      if (matching) matching.classList.add('active-link');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ===== CANVAS GRID ===== */
const canvas = document.getElementById('gridCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  const COLS = 30, ROWS = 20;
  let frame = 0;
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const colW = W / COLS, rowH = H / ROWS;
    ctx.strokeStyle = 'rgba(124,106,247,0.15)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath(); ctx.moveTo(i * colW, 0); ctx.lineTo(i * colW, H); ctx.stroke();
    }
    for (let j = 0; j <= ROWS; j++) {
      ctx.beginPath(); ctx.moveTo(0, j * rowH); ctx.lineTo(W, j * rowH); ctx.stroke();
    }
    frame++;
    for (let i = 0; i <= COLS; i++) {
      for (let j = 0; j <= ROWS; j++) {
        const wave = Math.sin(frame * 0.02 + i * 0.4 + j * 0.3);
        const alpha = (wave + 1) / 2 * 0.45;
        ctx.beginPath();
        ctx.arc(i * colW, j * rowH, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(45,232,200,' + alpha + ')';
        ctx.fill();
      }
    }
    requestAnimationFrame(draw);
  };
  draw();
}

/* ===== TILT ===== */
document.querySelectorAll('.project-card, .skill-card, .contact-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = 'perspective(800px) rotateX(' + (-y * 6).toFixed(1) + 'deg) rotateY(' + (x * 6).toFixed(1) + 'deg) translateY(-4px)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== ACTIVE NAV STYLE ===== */
const style = document.createElement('style');
style.textContent = '.active-link { color: var(--text) !important; }';
document.head.appendChild(style);