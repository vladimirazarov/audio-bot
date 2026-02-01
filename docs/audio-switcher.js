function togglePlay(id) {
    const aBefore = document.getElementById('before-' + id);
    const aAfter = document.getElementById('after-' + id);
    const btn = document.getElementById('play-btn-' + id);

    if (aBefore.paused) {
        // синхронизируем время перед запуском
        aAfter.currentTime = aBefore.currentTime;
        
        // запускаем оба
        Promise.all([aBefore.play(), aAfter.play()]).then(() => {
            btn.innerText = 'STOP';
            btn.classList.add('playing');
        }).catch(e => console.error("ошибка воспроизведения:", e));
    } else {
        aBefore.pause();
        aAfter.pause();
        btn.innerText = 'PLAY';
        btn.classList.remove('playing');
    }
}

function switchAudio(id, mode) {
    const aBefore = document.getElementById('before-' + id);
    const aAfter = document.getElementById('after-' + id);
    const bBefore = document.getElementById('btn-before-' + id);
    const bAfter = document.getElementById('btn-after-' + id);

    if (mode === 'before') {
        aBefore.muted = false;
        aAfter.muted = true;
        bBefore.classList.add('active');
        bAfter.classList.remove('active');
    } else {
        aBefore.muted = true;
        aAfter.muted = false;
        bAfter.classList.add('active');
        bBefore.classList.remove('active');
    }
}