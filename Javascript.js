// Dark mode toggle
const toggle = document.getElementById('darkToggle');
toggle.addEventListener('click', () => {
  const html = document.documentElement;
  const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', theme);
});

// Tab switching
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

// Scroll progress
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
});


// Final UI Modal Viewer
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

function closeModal() {
  modal.classList.add('hidden');
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  modalImg.src = images[currentIndex].src;
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  modalImg.src = images[currentIndex].src;
}

images.forEach((img, index) => {
  img.addEventListener('click', () => openModal(index));
});

closeBtn.addEventListener('click', closeModal);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

document.addEventListener('keydown', (e) => {
  if (modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

// Scroll Animations
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    appearOnScroll.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

window.addEventListener('scroll', () => {
    const scrollIndicator = document.getElementById('scrollIndicator');
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / maxScroll) * 100;
    scrollIndicator.style.width = `${scrollPercent}%`;

    // parallax effect
    document.querySelectorAll('.parallax').forEach(el => {
      el.style.setProperty('--scroll-y', `${window.scrollY * 0.1}px`);
    });
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    document.body.style.background = html.getAttribute('data-theme') === 'dark'
      ? 'linear-gradient(135deg, #1e1e2f, #23232f)'
      : 'linear-gradient(135deg, #fff0f5, #f0f8ff)';
  });

      // Theme toggle
      const toggleCheckbox = document.getElementById('themeToggle');

  // Load theme preference on page load
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    toggleCheckbox.checked = true;
  }

  toggleCheckbox.addEventListener('change', () => {
    document.body.classList.toggle('light-theme');
    // Save preference
    localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
  });
  
      // ScrollReveal animations
      ScrollReveal().reveal('#header', { delay: 200, distance: '50px', origin: 'top', duration: 800 });
      ScrollReveal().reveal('#about', { delay: 300, distance: '50px', origin: 'left', duration: 800 });
      ScrollReveal().reveal('#projects', { delay: 400, distance: '50px', origin: 'right', duration: 800 });
      ScrollReveal().reveal('#testimonials', { delay: 500, distance: '50px', origin: 'bottom', duration: 800 });
      ScrollReveal().reveal('#contact', { delay: 600, distance: '50px', origin: 'top', duration: 800 });

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

      // Scroll button //

      lucide.createIcons();

      const buttons = document.querySelectorAll('.side-button');
      let isScrolling;
  
      function showButtons() {
        buttons.forEach(btn => btn.classList.add('show'));
      }
  
      function hideButtons() {
        buttons.forEach(btn => btn.classList.remove('show'));
      }
  
      function scrollToSection(id) {
        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
      }
  
      function hideButtons() {
        if (!isTouchDevice) {
          sideButtons.forEach(btn => btn.classList.remove('show'));
        }
      }
      
      function showButtons() {
        if (!isTouchDevice) {
          sideButtons.forEach(btn => btn.classList.add('show'));
        }
      }
      
      // Run on load
      window.addEventListener("load", () => {
        // ✅ Desktop gets the show animation
        if (!isTouchDevice) {
          sideButtons.forEach(btn => btn.classList.add('show'));
        }
      
        // ✅ Safe lucide init
        if (window.lucide) {
          window.lucide.createIcons();
        } else {
          console.warn("Lucide not loaded");
        }
      });
      
      // ✅ Hide buttons while scrolling (desktop only)
      window.addEventListener('scroll', () => {
        hideButtons();
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
          showButtons();
        }, 300);
      });
      

      