const activeAudios = new Set();

function togglePlay(id) {
    const before = document.getElementById(`before-${id}`);
    const after = document.getElementById(`after-${id}`);
    const btn = document.getElementById(`play-btn-${id}`);

    if (before.paused) {
        // остановка других играющих дорожек (опционально, для чистоты звука)
        stopAllPlayback();
        
        after.currentTime = before.currentTime;
        Promise.all([before.play(), after.play()]).then(() => {
            btn.innerText = "PAUSE";
            btn.classList.add('playing');
        });
    } else {
        before.pause();
        after.pause();
        btn.innerText = "PLAY";
        btn.classList.remove('playing');
    }
}

function switchAudio(id, type) {
    const before = document.getElementById(`before-${id}`);
    const after = document.getElementById(`after-${id}`);
    const btnB = document.getElementById(`btn-before-${id}`);
    const btnA = document.getElementById(`btn-after-${id}`);

    if (type === 'before') {
        before.muted = false;
        after.muted = true;
        btnB.classList.add('active');
        btnA.classList.remove('active');
    } else {
        before.muted = true;
        after.muted = false;
        btnA.classList.add('active');
        btnB.classList.remove('active');
    }
}

function stopAllPlayback() {
    document.querySelectorAll('audio').forEach(a => {
        a.pause();
    });
    document.querySelectorAll('.btn-main-play').forEach(b => {
        b.innerText = "PLAY";
        b.classList.remove('playing');
    });
}