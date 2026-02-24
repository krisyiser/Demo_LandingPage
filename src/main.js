import './style.css'

// --- Loader ---
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const loaderLine = document.querySelector('.loader-line');

  loaderLine.style.width = '100%';

  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.cursor = 'none'; // Ensure cursor is hidden
  }, 1000);
});

// --- Custom Cursor ---
const cursor = document.getElementById('custom-cursor');
const cursorBlur = document.getElementById('cursor-blur');

document.addEventListener('mousemove', (e) => {
  cursor.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
  cursorBlur.style.left = `${e.clientX}px`;
  cursorBlur.style.top = `${e.clientY}px`;
});

document.addEventListener('mousedown', () => cursor.style.scale = '0.8');
document.addEventListener('mouseup', () => cursor.style.scale = '1');

// --- Magnetic Elements & Form Card Spotlight ---
const magneticElements = document.querySelectorAll('.magnetic');
const formCard = document.querySelector('.form-card');

magneticElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    cursor.style.scale = '3';
    cursor.style.background = 'transparent';
    cursor.style.border = '1px solid white';
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = `translate(0px, 0px)`;
    cursor.style.scale = '1';
    cursor.style.background = 'white';
    cursor.style.border = 'none';
  });
});

if (formCard) {
  formCard.addEventListener('mousemove', (e) => {
    const rect = formCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    formCard.style.setProperty('--mouse-x', `${x}px`);
    formCard.style.setProperty('--mouse-y', `${y}px`);
  });
}

// --- Navbar Scroll Effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// --- Scroll Reveal Logic ---
const observerOptions = {
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger counter if it's a count element
      if (entry.target.classList.contains('count')) {
        animateCounter(entry.target);
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.title-reveal, .count').forEach(el => observer.observe(el));

// --- Counter Animation ---
function animateCounter(el) {
  const target = +el.getAttribute('data-target');
  const count = +el.innerText;
  const speed = 200;
  const inc = target / speed;

  if (count < target) {
    el.innerText = Math.ceil(count + inc);
    setTimeout(() => animateCounter(el), 1);
  } else {
    el.innerText = target;
  }
}

// --- Carousel Logic ---
const track = document.getElementById('carousel-track');
const dots = document.querySelectorAll('.dot');
const nextBtn = document.getElementById('next-slide');
const prevBtn = document.getElementById('prev-slide');
let currentSlide = 0;

function updateCarousel(index) {
  if (index >= dots.length) index = 0;
  if (index < 0) index = dots.length - 1;

  track.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[index].classList.add('active');
  currentSlide = index;
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.getAttribute('data-index'));
    updateCarousel(index);
  });
});

nextBtn?.addEventListener('click', () => updateCarousel(currentSlide + 1));
prevBtn?.addEventListener('click', () => updateCarousel(currentSlide - 1));

// Auto-advance carousel
let carouselInterval = setInterval(() => {
  updateCarousel(currentSlide + 1);
}, 6000);

track.addEventListener('mouseenter', () => clearInterval(carouselInterval));
track.addEventListener('mouseleave', () => {
  carouselInterval = setInterval(() => {
    updateCarousel(currentSlide + 1);
  }, 6000);
});

// --- FAQ Accordion ---
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// --- Background Flow Animation ---
const canvas = document.getElementById('flow-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 80;

function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
      color: Math.random() > 0.5 ? '#6366f1' : '#a855f7'
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 0.3;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 180) {
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 180)})`;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });

  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initCanvas);
initCanvas();
animateParticles();

// --- Form Handling ---
const form = document.getElementById('contact-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button');
  const originalText = btn.innerHTML;

  btn.innerHTML = 'Transmisión Enviada...';
  btn.style.background = '#10b981';

  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.style.background = '';
    form.reset();
  }, 3000);
});

// --- Smooth Scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
