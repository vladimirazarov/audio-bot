let currentActiveId = null;

function togglePlay(id) {
  const before = document.getElementById(`before-${id}`);
  const after = document.getElementById(`after-${id}`);
  const btn = document.getElementById(`play-btn-${id}`);

  if (currentActiveId !== null && currentActiveId !== id) {
    stopAudio(currentActiveId);
  }

  if (before.paused) {
    // синхронизируем на всякий случай перед стартом
    after.currentTime = before.currentTime;

    before.play();
    after.play();
    btn.innerText = "PAUSE";
    currentActiveId = id;
  } else {
    before.pause();
    after.pause();
    btn.innerText = "PLAY";
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
  if (b) { b.pause(); b.currentTime = 0; }
  if (a) { a.pause(); a.currentTime = 0; }
  if (btn) btn.innerText = "PLAY";
}

function stopAllAndGoBack(event) {
  // предотвращаем стандартный переход, чтобы сначала выполнить стоп
  if (event) event.preventDefault();

  // останавливаем всё
  stopAllPlayback();

  // принудительно переходим на главную
  window.location.href = 'index.html';
}