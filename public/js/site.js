/* Shared behaviour for every page: header colour, stretch-in headings, and case study interactions. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header switches to its light style when no dark area sits under it
  var hdr = document.getElementById('hdr'), dark = new Set();
  if (hdr && 'IntersectionObserver' in window) {
    var hio = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) dark.add(e.target); else dark.delete(e.target); });
      hdr.classList.toggle('light', dark.size === 0);
    }, { rootMargin: '-20px 0px -92% 0px' });
    document.querySelectorAll('[data-dark]').forEach(function (el) { hio.observe(el); });
  }

  // Section headings stretch into place as they scroll in
  var heads = document.querySelectorAll('.sh h2, .contact h2, .csec h2');
  if ('IntersectionObserver' in window && !reduce) {
    var sio = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); sio.unobserve(e.target); } });
    }, { threshold: .5, rootMargin: '0px 0px -10% 0px' });
    heads.forEach(function (h) { sio.observe(h); });
  } else heads.forEach(function (h) { h.classList.add('in'); });

  // ---------- Case study pages ----------
  var caseEl = document.getElementById('case');
  if (!caseEl) return;

  var cover = document.getElementById('ccover');
  if (cover && !reduce) caseEl.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var r = cover.getBoundingClientRect(); if (r.top > innerHeight || r.bottom < 0) return;
    cover.style.setProperty('--rx', ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
    cover.style.setProperty('--ry', ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
  });

  var links = caseEl.querySelectorAll('.toc a');
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var t = document.getElementById(a.dataset.to);
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      var h = t.querySelector('h2'); if (h) h.focus({ preventScroll: true });
      history.replaceState(null, '', '#' + a.dataset.to);
    });
  });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.dataset.to === e.target.id); }); });
    }, { rootMargin: '-35% 0px -60% 0px' });
    caseEl.querySelectorAll('.csec[id]').forEach(function (s) { spy.observe(s); });
  }

  var prog = document.getElementById('progress');
  function onScroll() { var h = document.documentElement.scrollHeight - innerHeight; prog.style.setProperty('--p', h > 0 ? Math.min(scrollY / h, 1) : 0); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Lightbox
  var lb = document.getElementById('lb');
  if (lb) {
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('p'), from = null;
    caseEl.querySelectorAll('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        lbImg.src = b.dataset.zoom; lbImg.alt = b.dataset.cap; lbCap.textContent = b.dataset.cap; from = b;
        lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
        lb.showModal();
      });
    });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('.x')) lb.close(); });
    lb.addEventListener('close', function () { if (from) from.focus(); });
  }
})();
