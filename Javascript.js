// ==========================
// TABS
// ==========================
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ==========================
// SCROLL HANDLER: PROGRESS + PARALLAX + FADE-IN + SIDE BUTTONS
// ==========================
const scrollIndicator = document.getElementById('scrollIndicator');
const parallaxElements = document.querySelectorAll('.parallax');
const faders = document.querySelectorAll('.fade-in');
const sideButtons = document.querySelectorAll('.side-button');
let isScrolling;

// IntersectionObserver for fade-in
const appearOptions = { threshold: 0.1, rootMargin: "0px 0px -100px 0px" };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => appearOnScroll.observe(fader));

// Side button helpers
function showButtons() { sideButtons.forEach(btn => btn.classList.add('show')); }
function hideButtons() { sideButtons.forEach(btn => btn.classList.remove('show')); }
hideButtons();

// Smooth parallax variables
let scrollY = window.scrollY;
let targetScrollY = scrollY;

// Unified scroll listener
window.addEventListener('scroll', () => {
  targetScrollY = window.scrollY;

  // Scroll progress
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (targetScrollY / docHeight) * 100;
  if (scrollIndicator) scrollIndicator.style.width = `${scrollPercent}%`;

  // Side buttons show/hide
  hideButtons();
  clearTimeout(isScrolling);
  isScrolling = setTimeout(() => showButtons(), 300);
});

// Smooth parallax loop
function animateParallax() {
  scrollY += (targetScrollY - scrollY) * 0.1; // easing
  parallaxElements.forEach(el => el.style.setProperty('--scroll-y', `${scrollY * 0.1}px`));
  requestAnimationFrame(animateParallax);
}
animateParallax();

// ==========================
// FINAL UI MODAL VIEWER
// ==========================
const images = document.querySelectorAll('.popup-img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.querySelector('.nav.prev');
const nextBtn = document.querySelector('.nav.next');
let currentIndex = 0;

function openModal(index) {
  currentIndex = index;
  modalImg.src = images[currentIndex].src;
  modal.classList.remove('hidden');
}
function closeModal() { modal.classList.add('hidden'); }
function showNext() { 
  currentIndex = (currentIndex + 1) % images.length; 
  modalImg.src = images[currentIndex].src; 
}
function showPrev() { 
  currentIndex = (currentIndex - 1 + images.length) % images.length; 
  modalImg.src = images[currentIndex].src; 
}

images.forEach((img, index) => img.addEventListener('click', () => openModal(index)));
closeBtn.addEventListener('click', closeModal);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);
document.addEventListener('keydown', e => {
  if (modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

// ==========================
// CAROUSEL
// ==========================
document.querySelectorAll(".carousel-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const slideIndex = parseInt(btn.getAttribute("data-slide"));
    const track = document.querySelector(".carousel-track");
    const slideWidth = document.querySelector(".carousel-slide").offsetWidth;

    track.style.transform = `translateX(-${slideWidth * slideIndex}px)`;

    // Update active button
    document.querySelectorAll(".carousel-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ==========================
// PARTICLE CURSOR (NO DOT/RING)
// ==========================
const cursorParticles = [];
const particleContainer = document.createElement('div');
document.body.appendChild(particleContainer);

document.addEventListener('mousemove', e => {
  // Create a new particle at mouse position
  const particle = document.createElement('div');
  particle.classList.add('particle-cursor');
  particle.style.left = `${e.clientX}px`;
  particle.style.top = `${e.clientY}px`;

  // Random velocity
  const vx = (Math.random() - 0.5) * 2;
  const vy = (Math.random() - 0.5) * 2;

  // Particle object
  cursorParticles.push({ el: particle, x: e.clientX, y: e.clientY, vx, vy, life: 1 });
  particleContainer.appendChild(particle);

  // Limit particles to avoid overload
  if (cursorParticles.length > 100) {
    const old = cursorParticles.shift();
    old.el.remove();
  }
});

function animateCursorParticles() {
  for (let i = cursorParticles.length - 1; i >= 0; i--) {
    const p = cursorParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.02;

    p.el.style.left = `${p.x}px`;
    p.el.style.top = `${p.y}px`;
    p.el.style.opacity = p.life;
    p.el.style.transform = `translate(-50%, -50%) scale(${p.life})`;

    if (p.life <= 0) {
      p.el.remove();
      cursorParticles.splice(i, 1);
    }
  }
  requestAnimationFrame(animateCursorParticles);
}
animateCursorParticles();

// ==========================
// SCROLLREVEAL
// ==========================
ScrollReveal().reveal('#header', { delay: 200, distance: '50px', origin: 'top', duration: 800 });
ScrollReveal().reveal('#about', { delay: 300, distance: '50px', origin: 'left', duration: 800 });
ScrollReveal().reveal('#projects', { delay: 400, distance: '50px', origin: 'right', duration: 800 });
ScrollReveal().reveal('#testimonials', { delay: 500, distance: '50px', origin: 'bottom', duration: 800 });
ScrollReveal().reveal('#contact', { delay: 600, distance: '50px', origin: 'top', duration: 800 });

// ==========================
// LUCIDE ICONS
// ==========================
lucide.createIcons();

