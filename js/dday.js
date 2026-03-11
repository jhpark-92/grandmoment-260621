(function initDday() {
  const wedding = new Date(window.APP_CONFIG.weddingDate);
  const today = new Date();

  const diff = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24));
  const countEl = document.getElementById('dday-count');
  const barEl = document.getElementById('dday-bar');

  if (!countEl || !barEl) return;

  if (diff > 0) {
    countEl.textContent = diff;

    const pct = Math.max(0, Math.min(100, ((365 - diff) / 365) * 100));
    setTimeout(() => {
      barEl.style.width = pct + '%';
    }, 300);
  } else if (diff === 0) {
    countEl.textContent = 'DAY';
    barEl.style.width = '100%';
  } else {
    countEl.parentElement.innerHTML =
      '<div class="dday-number" style="font-size:48px;">결혼했습니다!</div>';
  }
})();