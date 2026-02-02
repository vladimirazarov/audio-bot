/**
 * аудио-свитчер для сравнения "до" и "после"
 * логика базируется на параллельном воспроизведении и мьютировании одного из каналов
 */

const audioStates = {};

function togglePlay(id) {
  const before = document.getElementById(`before-${id}`);
  const after = document.getElementById(`after-${id}`);
  const playBtn = document.getElementById(`play-btn-${id}`);

  if (!before || !after) return;

  if (before.paused) {
    // синхронизация перед запуском
    after.currentTime = before.currentTime;

    // запуск обеих дорожек
    Promise.all([before.play(), after.play()])
      .then(() => {
        playBtn.innerText = "PAUSE";
        playBtn.classList.add('playing');
      })
      .catch(err => console.error("ошибка воспроизведения:", err));
  } else {
    before.pause();
    after.pause();
    playBtn.innerText = "PLAY";
    playBtn.classList.remove('playing');
  }
}

function switchAudio(id, type) {
  const before = document.getElementById(`before-${id}`);
  const after = document.getElementById(`after-${id}`);
  const btnBefore = document.getElementById(`btn-before-${id}`);
  const btnAfter = document.getElementById(`btn-after-${id}`);

  if (type === 'before') {
    // включаем "до", выключаем "после"
    before.muted = false;
    after.muted = true;

    btnBefore.classList.add('active');
    btnAfter.classList.remove('active');
  } else {
    // включаем "после", выключаем "до"
    before.muted = true;
    after.muted = false;

    btnAfter.classList.add('active');
    btnBefore.classList.remove('active');
  }

  // форсированная синхронизация фазы при переключении
  if (!before.paused) {
    after.currentTime = before.currentTime;
  }
}

function stopAllPlayback() {
  const allAudio = document.querySelectorAll('audio');
  allAudio.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

// обработка прерываний (например, закрытие webapp или звонок)
window.addEventListener('blur', () => {
  // опционально: ставить на паузу при сворачивании
});