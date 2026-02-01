let currentActiveId = null;

function togglePlay(id) {
    const before = document.getElementById(`before-${id}`);
    const after = document.getElementById(`after-${id}`);
    const btn = document.getElementById(`play-btn-${id}`);

    // 1. если играет другой трек — останавливаем его
    if (currentActiveId !== null && currentActiveId !== id) {
        stopAudio(currentActiveId);
    }

    if (before.paused) {
        // 2. критический фикс: если трек доиграл до конца или был на паузе,
        // сбрасываем время в начало, если мы не "посередине" трека.
        // для надежности лупинга проверяем ended.
        if (before.ended || after.ended || before.currentTime >= before.duration) {
            before.currentTime = 0;
            after.currentTime = 0;
        }

        // синхронизируем каналы перед запуском (убираем эхо при рассинхроне)
        if (Math.abs(before.currentTime - after.currentTime) > 0.1) {
            after.currentTime = before.currentTime;
        }

        // промисы play() нужны для обработки политик автоплея,
        // но здесь мы просто запускаем.
        before.play();
        after.play();
        
        btn.innerText = "PAUSE";
        currentActiveId = id;
    } else {
        // пауза
        before.pause();
        after.pause();
        btn.innerText = "PLAY";
        // не сбрасываем currentActiveId в null здесь, 
        // чтобы при повторном нажатии мы знали, что это тот же трек
    }
}

// отдельная функция для полной остановки (нужна для кнопки назад и смены треков)
function stopAudio(id) {
    const before = document.getElementById(`before-${id}`);
    const after = document.getElementById(`after-${id}`);
    const btn = document.getElementById(`play-btn-${id}`);

    if (before) {
        before.pause();
        before.currentTime = 0; // отмотка в начало
    }
    if (after) {
        after.pause();
        after.currentTime = 0;
    }
    if (btn) btn.innerText = "PLAY";
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

// глобальная функция для остановки всего (для кнопки назад)
function stopAllPlayback() {
    if (currentActiveId !== null) {
        stopAudio(currentActiveId);
        currentActiveId = null;
    }
}