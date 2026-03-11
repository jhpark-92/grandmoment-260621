(function initOpeningAndMusic() {
  const audio = document.getElementById('bgm');
  const toggle = document.getElementById('music-toggle');
  const opening = document.getElementById('opening-overlay');
  const openBtn = document.getElementById('opening-enter');

  let audioReady = false;

  function syncMusicButton() {
    if (!toggle || !audio) return;
    const playing = !audio.paused;
    toggle.textContent = playing ? '🎵 음악 끄기' : '🔇 음악 켜기';
  }

  async function playMusic() {
    if (!audio) return;

    try {
      await audio.play();
      audioReady = true;
    } catch (e) {
      audioReady = false;
    }

    syncMusicButton();
  }

  function closeOpening() {
    if (opening) {
      opening.classList.add('hidden');
    }
    document.body.style.overflow = 'auto';
  }

  document.body.style.overflow = 'hidden';

  if (openBtn) {
    openBtn.addEventListener('click', async () => {
      closeOpening();
      await playMusic();

      if (!audioReady) {
        showToast('음악 재생은 화면을 한 번 더 터치하면 시작될 수 있어요');
      }
    });
  }

  if (toggle) {
    toggle.addEventListener('click', async () => {
      if (!audio) return;

      if (audio.paused) {
        await playMusic();

        if (!audioReady) {
          showToast('브라우저 설정에 따라 자동 재생이 제한될 수 있어요');
        }
      } else {
        audio.pause();
        syncMusicButton();
      }
    });
  }

  document.addEventListener('visibilitychange', syncMusicButton);
  syncMusicButton();
})();