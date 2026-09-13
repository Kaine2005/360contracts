/* 360 Contracts — shared behaviour */
(function () {
  'use strict';

  /* sticky top bar */
  var bar = document.getElementById('topbar');
  if (bar) {
    var solid = bar.classList.contains('solid');
    var onScroll = function () {
      if (!solid) bar.classList.toggle('scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* mobile menu */
  var burger = document.getElementById('hamburger');
  if (burger) {
    var toggle = function () { document.body.classList.toggle('menu-open'); };
    burger.addEventListener('click', toggle);
    var menu = document.getElementById('mobileMenu');
    if (menu) {
      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) document.body.classList.remove('menu-open');
      });
    }
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.body.classList.remove('menu-open');
    });
  }

  /* scroll reveal */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = Math.min(i * 40, 180) + 'ms';
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  /* before / after slider */
  (function () {
    var slider = document.getElementById('baSlider');
    if (!slider) return;
    var range = document.getElementById('baRange');
    var wrap = document.getElementById('baBeforeWrap');
    var img = document.getElementById('baBeforeImg');
    var handle = document.getElementById('baHandle');
    function sizeImg() { img.style.width = slider.clientWidth + 'px'; }
    function move(v) { wrap.style.width = v + '%'; handle.style.left = v + '%'; }
    range.addEventListener('input', function (e) { move(e.target.value); });
    window.addEventListener('resize', sizeImg, { passive: true });
    sizeImg();
    move(range.value);
    var setFromX = function (clientX) {
      var r = slider.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      range.value = pct; move(pct);
    };
    var dragging = false;
    slider.addEventListener('pointerdown', function (e) { dragging = true; setFromX(e.clientX); });
    window.addEventListener('pointermove', function (e) { if (dragging) setFromX(e.clientX); });
    window.addEventListener('pointerup', function () { dragging = false; });
  })();

  /* reviews carousel arrows */
  (function () {
    var track = document.getElementById('revTrack');
    if (!track) return;
    var prev = document.getElementById('revPrev');
    var next = document.getElementById('revNext');
    var step = function () {
      var card = track.querySelector('.rev');
      return card ? card.getBoundingClientRect().width + 22 : 340;
    };
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
  })();

  /* current year in footer */
  var yr = document.querySelectorAll('[data-year]');
  yr.forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
