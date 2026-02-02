let currentActiveId = null;
let syncInterval = null;

function togglePlay(id) {
  const before = document.getElementById(`before-${id}`);
  const after = document.getElementById(`after-${id}`);
  const btn = document.getElementById(`play-btn-${id}`);

  if (currentActiveId !== null && currentActiveId !== id) {
    stopAudio(currentActiveId);
  }

  if (before.paused) {
    // сначала запускаем — это "прогревает" аудио-контекст
    before.play();
    after.play();

    btn.innerText = "PAUSE";
    currentActiveId = id;

    // запуск синхронизации с небольшой задержкой, чтобы не вешать поток при старте
    if (syncInterval) clearInterval(syncInterval);
    syncInterval = setInterval(() => {
      if (!before.paused && before.readyState >= 2 && after.readyState >= 2) {
        // если разбег критичен — подтягиваем
        if (Math.abs(before.currentTime - after.currentTime) > 0.02) {
          after.currentTime = before.currentTime;
        }
      }
    }, 50);

  } else {
    before.pause();
    after.pause();
    btn.innerText = "PLAY";

    if (syncInterval) {
      clearInterval(syncInterval);
      syncInterval = null;
    }
  }
}

function switchAudio(id, type) {
  const before = document.getElementById(`before-${id}`);
  const after = document.getElementById(`after-${id}`);
  const btnBefore = document.getElementById(`btn-before-${id}`);
  const btnAfter = document.getElementById(`btn-after-${id}`);

  if (type === 'before') {
    before.muted = false;
    after.muted = true;
    btnBefore.classList.add('active');
    btnAfter.classList.remove('active');
  } else {
    before.muted = true;
    after.muted = false;
    btnBefore.classList.remove('active');
    btnAfter.classList.add('active');
  }
}

function stopAudio(id) {
  const b = document.getElementById(`before-${id}`);
  const a = document.getElementById(`after-${id}`);
  const btn = document.getElementById(`play-btn-${id}`);

  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }

  if (b) { b.pause(); b.currentTime = 0; }
  if (a) { a.pause(); a.currentTime = 0; }
  if (btn) btn.innerText = "PLAY";
}

function stopAllPlayback() {
  if (currentActiveId !== null) {
    stopAudio(currentActiveId);
    currentActiveId = null;
  }
}