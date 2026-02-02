let currentActiveId = null;
const syncIntervals = {};

function togglePlay(id) {
  const before = document.getElementById(`before-${id}`);
  const after = document.getElementById(`after-${id}`);
  const btn = document.getElementById(`play-btn-${id}`);

  if (!before || !after || !btn) return;

  // остановить другой трек
  if (currentActiveId !== null && currentActiveId !== id) {
    stopAudio(currentActiveId);
  }

  const isPlaying = !before.paused || !after.paused;

  if (!isPlaying) {
    // определить активный (НЕ muted)
    const primary = before.muted ? after : before;
    const secondary = before.muted ? before : after;

    secondary.currentTime = primary.currentTime;

    // ВАЖНО: первым запускаем НЕ muted
    primary.play().then(() => {
      secondary.play().catch(() => { });
    }).catch(() => { });

    btn.textContent = "PAUSE";
    currentActiveId = id;

    clearInterval(syncIntervals[id]);
    syncIntervals[id] = setInterval(() => {
      if (!primary.paused) {
        if (Math.abs(before.currentTime - after.currentTime) > 0.02) {
          after.currentTime = before.currentTime;
        }
      }
    }, 40);

  } else {
    stopAudio(id);
  }
}

function switchAudio(id, type) {
  const before = document.getElementById(`before-${id}`);
  const after = document.getElementById(`after-${id}`);
  const btnBefore = document.getElementById(`btn-before-${id}`);
  const btnAfter = document.getElementById(`btn-after-${id}`);

  if (!before || !after) return;

  if (type === 'before') {
    before.muted = false;
    after.muted = true;
    btnBefore.classList.add('active');
    btnAfter.classList.remove('active');
  } else {
    before.muted = true;
    after.muted = false;
    btnAfter.classList.add('active');
    btnBefore.classList.remove('active');
  }
}

function stopAudio(id) {
  const before = document.getElementById(`before-${id}`);
  const after = document.getElementById(`after-${id}`);
  const btn = document.getElementById(`play-btn-${id}`);

  clearInterval(syncIntervals[id]);
  delete syncIntervals[id];

  if (before) {
    before.pause();
    before.currentTime = 0;
  }

  if (after) {
    after.pause();
    after.currentTime = 0;
  }

  if (btn) btn.textContent = "PLAY";
  if (currentActiveId === id) currentActiveId = null;
}

function stopAllPlayback() {
  if (currentActiveId !== null) {
    stopAudio(currentActiveId);
  }
}
