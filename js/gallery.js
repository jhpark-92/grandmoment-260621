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

  function updateThumbs() {
    thumbs.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === current);
    });

    const active = thumbs[current];
    active?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth'
    });
  }

  function syncTrack(useTransition = true) {
    track.style.transition = useTransition ? 'transform 0.35s ease' : 'none';
    track.style.transform = `translateX(-${current * 100}%)`;

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

  viewport.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    deltaX = 0;
    deltaY = 0;
    dragging = true;
    horizontalGesture = false;
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

      if (Math.abs(deltaX) > 12) {
        horizontalGesture = true;
      }
    }

    if (!horizontalGesture) return;

    e.preventDefault();

    const atFirst = current === 0;
    const atLast = current === slides.length - 1;

    let effectiveDeltaX = deltaX;

    if (atFirst && deltaX > 0) {
      effectiveDeltaX = 0;
    }

    if (atLast && deltaX < 0) {
      effectiveDeltaX = 0;
    }

    const base = -current * viewport.clientWidth;
    track.style.transform = `translateX(${base + effectiveDeltaX}px)`;
  }, { passive: false });

  viewport.addEventListener('touchend', () => {
    const atFirst = current === 0;
    const atLast = current === slides.length - 1;

    if (Math.abs(deltaX) > 50) {
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
  });

  viewport.addEventListener('touchcancel', () => {
    dragging = false;
    horizontalGesture = false;
    syncTrack(true);
  });

  syncTrack(true);
})();