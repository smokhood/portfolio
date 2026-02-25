// ===== LOADER =====
window.addEventListener('load', () => {
  const fill = document.getElementById('loaderFill');
  fill.style.width = '100%';
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

// ===== BACKGROUND CANVAS (Grid + Particles) =====
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(124,58,237,0.05)';
  ctx.lineWidth = 1;
  const spacing = 60;
  for (let x = 0; x < canvas.width; x += spacing) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += spacing) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5,
    color: ['#7c3aed','#3b82f6','#06b6d4','#a78bfa'][Math.floor(Math.random() * 4)],
    opacity: Math.random() * 0.6 + 0.1
  };
}
for (let i = 0; i < 60; i++) particles.push(createParticle());

function animateBg() {
  drawGrid();
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
  });
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 1;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateBg);
}
animateBg();

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-cat, .project-card, .project-featured, .contact-method').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovered');
    follower.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovered');
    follower.classList.remove('hovered');
  });
});

// ===== TYPED TEXT =====
const roles = [
  'AI Mobile Apps 🤖',
  'Flutter Developer 📱',
  'Computer Vision 👁️',
  'Cross-Platform Dev ⚡',
  'Accessibility Tech ♿'
];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const cur = roles[roleIdx];
  typedEl.textContent = deleting ? cur.substring(0, charIdx--) : cur.substring(0, charIdx++);
  if (!deleting && charIdx > cur.length) { deleting = true; setTimeout(type, 2000); return; }
  if (deleting && charIdx < 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(type, 400); return; }
  setTimeout(type, deleting ? 40 : 70);
}
type();

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('active');
});
document.getElementById('mobileClose').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.remove('active');
});
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('active');
}

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== COUNTER ANIMATION =====
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-n').forEach(el => {
        const target = parseInt(el.dataset.target);
        let count = 0;
        const inc = target / 40;
        const timer = setInterval(() => {
          count += inc;
          if (count >= target) { el.textContent = target; clearInterval(timer); }
          else el.textContent = Math.floor(count);
        }, 30);
      });
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.about-stats').forEach(el => counterObs.observe(el));

// ===== 3D TILT CARDS =====
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    card.style.transition = 'transform 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

// ===== CONTACT FORM WITH EMAILJS ✅ =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const btn    = document.getElementById('submitBtn');
  const text   = document.getElementById('btnText');
  const icon   = document.getElementById('btnIcon');
  const status = document.getElementById('formStatus');

  // Loading state
  btn.disabled = true;
  text.textContent = 'Sending...';
  icon.className = 'fas fa-spinner fa-spin';
  status.className = '';
  status.textContent = '';

  // ✅ Send via EmailJS with your real keys
  emailjs.sendForm('service_iki44rs', 'template_llk72lt', this)
    .then(() => {
      // SUCCESS ✅
      btn.classList.add('success');
      text.textContent = 'Message Sent! ✓';
      icon.className = 'fas fa-check';
      status.className = 'form-status success';
      status.textContent = '✅ Your message was delivered to Ahtisham!';
      this.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove('success');
        text.textContent = 'Send Message';
        icon.className = 'fas fa-paper-plane';
        status.className = '';
        status.textContent = '';
      }, 4000);
    })
    .catch((err) => {
      // ERROR ❌
      console.error('EmailJS error:', err);
      text.textContent = 'Failed to Send';
      icon.className = 'fas fa-times';
      btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      status.className = 'form-status error';
      status.textContent = '❌ Something went wrong. Please email: ahtishamravian206@gmail.com';
      setTimeout(() => {
        btn.disabled = false;
        text.textContent = 'Send Message';
        icon.className = 'fas fa-paper-plane';
        btn.style.background = '';
        status.className = '';
        status.textContent = '';
      }, 4000);
    });
});
