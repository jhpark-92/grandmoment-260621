(function initOpeningAndMusic() {
	if ('scrollRestoration' in history) {
	  history.scrollRestoration = 'manual';
	}

	function forceScrollTop() {
	  window.scrollTo(0, 0);
	  document.documentElement.scrollTop = 0;
	  document.body.scrollTop = 0;
	}
	forceScrollTop();

	window.addEventListener('load', () => {
	  forceScrollTop();
	  attemptImmediatePlay();
	});

	window.addEventListener('pageshow', () => {
	  forceScrollTop();
	});
  const audio = document.getElementById('bgm');
  const toggle = document.getElementById('music-toggle');
  const opening = document.getElementById('opening-overlay');
  const openBtn = document.getElementById('opening-enter');

  let autoPlaySucceeded = false;
  let interactionBound = false;

  function syncMusicButton() {
    if (!toggle || !audio) return;
    toggle.textContent = audio.paused ? '🔇 음악 켜기' : '🎵 음악 끄기';
  }

  async function tryPlayMusic() {
    if (!audio) return false;

    try {
      await audio.play();
      autoPlaySucceeded = true;
      syncMusicButton();
      return true;
    } catch (e) {
      syncMusicButton();
      return false;
    }
  }

  function removeFirstInteractionListeners() {
    window.removeEventListener('touchstart', handleFirstInteraction, passiveOnce);
    window.removeEventListener('pointerdown', handleFirstInteraction, passiveOnce);
    window.removeEventListener('keydown', handleFirstInteraction, passiveOnce);
    window.removeEventListener('scroll', handleFirstInteraction, passiveOnce);
    interactionBound = false;
  }

  async function handleFirstInteraction() {
    const played = await tryPlayMusic();
    if (played) {
      removeFirstInteractionListeners();
    }
  }

  const passiveOnce = { passive: true, once: true };

  function bindFirstInteractionAutoPlay() {
    if (interactionBound) return;
    interactionBound = true;

    window.addEventListener('touchstart', handleFirstInteraction, passiveOnce);
    window.addEventListener('pointerdown', handleFirstInteraction, passiveOnce);
    window.addEventListener('keydown', handleFirstInteraction, passiveOnce);
    window.addEventListener('scroll', handleFirstInteraction, passiveOnce);
  }

  function closeOpening() {
    if (opening) {
      opening.classList.add('hidden');
    }
    document.body.style.overflow = 'auto';
  }

  function preloadAudio() {
    if (!audio) return;
    audio.preload = 'auto';
    audio.load();
  }

  async function attemptImmediatePlay() {
    preloadAudio();
    const played = await tryPlayMusic();
    if (!played) {
      bindFirstInteractionAutoPlay();
    }
  }

    if ('scrollRestoration' in history) {
	  history.scrollRestoration = 'manual';
	}

	function forceScrollTop() {
	  window.scrollTo(0, 0);
	  document.documentElement.scrollTop = 0;
	  document.body.scrollTop = 0;
	}

	document.body.style.overflow = 'hidden';
	forceScrollTop();

	window.addEventListener('load', () => {
	  forceScrollTop();
	  attemptImmediatePlay();
	});

	window.addEventListener('pageshow', () => {
	  forceScrollTop();
	});

  if (openBtn) {
    openBtn.addEventListener('click', async () => {
      closeOpening();

      if (audio.paused) {
        const played = await tryPlayMusic();
        if (!played) {
          bindFirstInteractionAutoPlay();
          showToast('브라우저 설정에 따라 첫 터치 후 음악이 시작될 수 있어요');
        }
      }
    });
  }

  if (toggle) {
    toggle.addEventListener('click', async () => {
      if (!audio) return;

      if (audio.paused) {
        const played = await tryPlayMusic();
        if (!played) {
          showToast('브라우저 설정에 따라 자동 재생이 제한될 수 있어요');
        }
      } else {
        audio.pause();
        syncMusicButton();
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    syncMusicButton();
  });

  syncMusicButton();
})();