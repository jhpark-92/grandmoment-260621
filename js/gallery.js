(function initGallery() {
  const slider = document.querySelector('.gallery-slider');
  const viewport = slider?.querySelector('.gallery-scroll');
  const track = slider?.querySelector('.gallery-track');

  if (!slider || !viewport || !track) return;

  const slides = Array.from(track.querySelectorAll('.gallery-item'));
  const prevBtn = slider.querySelector('.gallery-arrow.prev');
  const nextBtn = slider.querySelector('.gallery-arrow.next');
  const indicator = document.getElementById('gallery-indicator');

  if (!slides.length) return;

  let current = 0;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let dragging = false;
  let horizontalGesture = false;

  function syncTrack() {
    track.style.transition = 'transform 0.35s ease';
    track.style.transform = `translateX(-${current * 100}%)`;

    if (indicator) {
      indicator.textContent = `${current + 1} / ${slides.length}`;
    }

    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;
  }

  function goToNext() {
    if (current >= slides.length - 1) return;
    current += 1;
    syncTrack();
  }

  function goToPrev() {
    if (current <= 0) return;
    current -= 1;
    syncTrack();
  }

  prevBtn?.addEventListener('click', goToPrev);
  nextBtn?.addEventListener('click', goToNext);

  viewport.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    deltaX = 0;
    deltaY = 0;
    dragging = true;
    horizontalGesture = false;
    track.style.transition = 'none';
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!dragging) return;

    const t = e.touches[0];
    deltaX = t.clientX - startX;
    deltaY = t.clientY - startY;

    if (!horizontalGesture) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        dragging = false;
        track.style.transition = 'transform 0.35s ease';
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

    // 첫 사진에서 오른쪽으로 더 못 당기게
    if (atFirst && deltaX > 0) {
      effectiveDeltaX = 0;
    }

    // 마지막 사진에서 왼쪽으로 더 못 밀게
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
        syncTrack();
      }
    } else {
      syncTrack();
    }

    dragging = false;
    horizontalGesture = false;
  });

  viewport.addEventListener('touchcancel', () => {
    dragging = false;
    horizontalGesture = false;
    syncTrack();
  });

  syncTrack();
})();