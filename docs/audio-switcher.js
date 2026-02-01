function togglePlay(id) {
    const before = document.getElementById(`before-${id}`);
    const after = document.getElementById(`after-${id}`);
    const btn = document.getElementById(`play-btn-${id}`);

    // принудительно устанавливаем зацикливание при первом взаимодействии
    before.loop = true;
    after.loop = true;

    if (before.paused && after.paused) {
        before.play();
        after.play();
        btn.innerText = "PAUSE";
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