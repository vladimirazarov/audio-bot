let currentActiveId = null;

function togglePlay(id) {
    const before = document.getElementById(`before-${id}`);
    const after = document.getElementById(`after-${id}`);
    const btn = document.getElementById(`play-btn-${id}`);

    // 1. убиваем другие треки
    if (currentActiveId !== null && currentActiveId !== id) {
        stopAudio(currentActiveId);
    }

    // 2. вешаем "умный" лупер через timeupdate
    // мы проверяем время каждый тик воспроизведения
    if (!before.ontimeupdate) {
        before.ontimeupdate = function() {
            checkLoop(before, after);
        };
    }

    // 3. логика кнопки
    if (before.paused || before.ended) {
        // РЕАНИМАЦИЯ: если трек все-таки умер (ended) или стоит в конце
        if (before.ended || before.currentTime >= before.duration - 0.5) {
             // .load() принудительно перезагружает манифест файла, выводя из состояния "зомби"
             before.load(); 
             after.load();
             before.currentTime = 0;
             after.currentTime = 0;
        }

        // синхронизация перед пуском
        if (Math.abs(before.currentTime - after.currentTime) > 0.1) {
            after.currentTime = before.currentTime;
        }

        // промисы для отлова ошибок (например, если юзер не взаимодействовал)
        const p = before.play();
        if (p !== undefined) {
            p.then(_ => {
                after.play();
            }).catch(error => {
                console.log("Auto-play prevented", error);
            });
        } else {
             after.play();
        }

        btn.innerText = "PAUSE";
        currentActiveId = id;
    } else {
        before.pause();
        after.pause();
        btn.innerText = "PLAY";
    }
}

// функция "бесшовной" петли
function checkLoop(master, slave) {
    const buffer = 0.25; // 250мс до конца
    
    // если длительность известна и мы подошли к концу
    if (master.duration > 0 && master.currentTime > (master.duration - buffer)) {
        master.currentTime = 0;
        slave.currentTime = 0;
        // мы НЕ вызываем play(), потому что он и так играет.
        // мы просто перенесли головку назад. браузер думает, что песня продолжается.
    }
}

function stopAudio(id) {
    const before = document.getElementById(`before-${id}`);
    const after = document.getElementById(`after-${id}`);
    const btn = document.getElementById(`play-btn-${id}`);

    if (before) {
        before.pause();
        before.ontimeupdate = null; // снимаем слушатель для экономии CPU
        before.currentTime = 0;
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

function stopAllPlayback() {
    if (currentActiveId !== null) {
        stopAudio(currentActiveId);
        currentActiveId = null;
    }
}