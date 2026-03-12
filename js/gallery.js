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
  let ticking = false;

  thumbsRoot.innerHTML = '';

  const thumbs = slides.map((slide, index) => {
    const img = slide.querySelector('img');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-thumb';
    btn.setAttribute('aria-label', `${index + 1}번 사진 보기`);
    btn.innerHTML = `<img src="${img.getAttribute('src')}" alt="${img.getAttribute('alt') || `웨딩 사진 ${index + 1}`}">`;

    btn.addEventListener('click', () => {
      goTo(index, true);
    });

    thumbsRoot.appendChild(btn);
    return btn;
  });

  function getSlideWidth() {
    return viewport.clientWidth || 1;
  }

  function updateIndicator() {
    if (indicator) {
      indicator.textContent = `${current + 1} / ${slides.length}`;
    }
  }

  function updateThumbs() {
    thumbs.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === current);
    });

    const active = thumbs[current];
    if (active) {
      const left = active.offsetLeft - (thumbsRoot.clientWidth / 2) + (active.clientWidth / 2);
      thumbsRoot.scrollTo({
        left,
        behavior: 'smooth'
      });
    }
  }

  function syncFromScroll() {
    ticking = false;
    const width = getSlideWidth();
    const next = Math.round(viewport.scrollLeft / width);

    if (next !== current) {
      current = Math.max(0, Math.min(slides.length - 1, next));
      updateIndicator();
      updateThumbs();
    }
  }

  function requestSync() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(syncFromScroll);
  }

  function goTo(index, smooth = true) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    const left = current * getSlideWidth();

    viewport.scrollTo({
      left,
      behavior: smooth ? 'smooth' : 'auto'
    });

    updateIndicator();
    updateThumbs();
  }

  viewport.addEventListener('scroll', requestSync, { passive: true });

  window.addEventListener('resize', () => {
    goTo(current, false);
  });

  updateIndicator();
  updateThumbs();
  goTo(0, false);
})();