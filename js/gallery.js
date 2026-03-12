(function initGallery() {
  const slider = document.querySelector('.gallery-slider');
  const viewport = slider?.querySelector('.gallery-scroll');
  const track = slider?.querySelector('.gallery-track');
  const thumbsRoot = document.getElementById('gallery-thumbs');
  const indicator = document.getElementById('gallery-indicator');

  if (!slider || !viewport || !track || !thumbsRoot) return;

  const slides = Array.from(track.querySelectorAll('.gallery-item'));
  if (!slides.length) return;

  let current = 0;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let dragging = false;
  let horizontalGesture = false;
  let rafId = null;
  let pendingX = null;

  const thumbs = slides.map((slide, index) => {
    const img = slide.querySelector('img');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-thumb';
    btn.setAttribute('aria-label', `${index + 1}번 사진 보기`);
    btn.innerHTML = `<img src="${img.getAttribute('src')}" alt="${img.getAttribute('alt') || `웨딩 사진 ${index + 1}`}">`;

    btn.addEventListener('click', () => {
      goTo(index);
    });

    thumbsRoot.appendChild(btn);
    return btn;
  });

  function setTranslate(x, useTransition) {
    track.style.transition = useTransition ? 'transform 0.28s ease-out' : 'none';
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  function updateThumbs() {
    thumbs.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === current);
    });

    const active = thumbs[current];
    active?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'auto'
    });
  }

  function syncTrack(useTransition = true) {
    const x = -(current * viewport.clientWidth);
    setTranslate(x, useTransition);

    if (indicator) {
      indicator.textContent = `${current + 1} / ${slides.length}`;
    }

    updateThumbs();
  }

  function goTo(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    syncTrack(true);
  }

  function goToNext() {
    if (current >= slides.length - 1) return;
    current += 1;
    syncTrack(true);
  }

  function goToPrev() {
    if (current <= 0) return;
    current -= 1;
    syncTrack(true);
  }

  function renderDrag() {
    rafId = null;
    if (pendingX === null) return;
    setTranslate(pendingX, false);
  }

  viewport.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    deltaX = 0;
    deltaY = 0;
    dragging = true;
    horizontalGesture = false;
    pendingX = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    syncTrack(false);
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!dragging) return;

    const t = e.touches[0];
    deltaX = t.clientX - startX;
    deltaY = t.clientY - startY;

    if (!horizontalGesture) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        dragging = false;
        syncTrack(true);
        return;
      }

      if (Math.abs(deltaX) > 10) {
        horizontalGesture = true;
      }
    }

    if (!horizontalGesture) return;

    e.preventDefault();

    const atFirst = current === 0;
    const atLast = current === slides.length - 1;

    let effectiveDeltaX = deltaX;

    if (atFirst && deltaX > 0) effectiveDeltaX = deltaX * 0.18;
    if (atLast && deltaX < 0) effectiveDeltaX = deltaX * 0.18;

    const base = -(current * viewport.clientWidth);
    pendingX = base + effectiveDeltaX;

    if (!rafId) {
      rafId = requestAnimationFrame(renderDrag);
    }
  }, { passive: false });

  viewport.addEventListener('touchend', () => {
    const atFirst = current === 0;
    const atLast = current === slides.length - 1;
    const threshold = Math.min(90, viewport.clientWidth * 0.18);

    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0 && !atLast) {
        goToNext();
      } else if (deltaX > 0 && !atFirst) {
        goToPrev();
      } else {
        syncTrack(true);
      }
    } else {
      syncTrack(true);
    }

    dragging = false;
    horizontalGesture = false;
    pendingX = null;
  });

  viewport.addEventListener('touchcancel', () => {
    dragging = false;
    horizontalGesture = false;
    pendingX = null;
    syncTrack(true);
  });

  window.addEventListener('resize', () => {
    syncTrack(false);
  });

  syncTrack(false);
})();