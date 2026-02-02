let currentActiveId = null;
let syncInterval = null;

function togglePlay(id) {
  const before = document.getElementById(`before-${id}`);
  const after = document.getElementById(`after-${id}`);
  const btn = document.getElementById(`play-btn-${id}`);

  // остановка другого трека, если он играет
  if (currentActiveId !== null && currentActiveId !== id) {
    stopAudio(currentActiveId);
  }

  if (before.paused) {
    // 1. синхронизируем время перед запуском
    after.currentTime = before.currentTime;

    // 2. запускаем оба потока
    before.play();
    after.play();
    btn.innerText = "PAUSE";
    currentActiveId = id;

    // 3. запуск принудительной синхронизации (исправление эхо)
    if (syncInterval) clearInterval(syncInterval);
    syncInterval = setInterval(() => {
      if (!before.paused) {
        // если разбег более 15 миллисекунд — выравниваем
        if (Math.abs(before.currentTime - after.currentTime) > 0.015) {
          after.currentTime = before.currentTime;
        }
      }
    }, 40); // частота проверки 40мс для плавности

  } else {
    // постановка на паузу
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

  // очистка интервала при полной остановке
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }

  if (b) {
    b.pause();
    b.currentTime = 0;
  }
  if (a) {
    a.pause();
    a.currentTime = 0;
  }
  if (btn) btn.innerText = "PLAY";
}

function stopAllPlayback() {
  if (currentActiveId !== null) {
    stopAudio(currentActiveId);
    currentActiveId = null;
  }
}