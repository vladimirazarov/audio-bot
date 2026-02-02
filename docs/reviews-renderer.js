async function initReviews() {
  const container = document.getElementById('reviews-container');

  try {
    const response = await fetch('reviews.json');
    const reviews = await response.json();

    reviews.forEach(review => {
      const reviewElement = document.createElement('div');
      reviewElement.className = 'terms-block';

      reviewElement.innerHTML = `
                <div class="term-title">ЖАНР: ${review.genre || 'НЕ УКАЗАН'}</div>
                <div class="setup-info">${review.setup || 'запись: информация отсутствует'}</div>

                <audio id="before-${review.id}" src="${review.audio_before}" preload="auto" loop muted playsinline></audio>
                <audio id="after-${review.id}" src="${review.audio_after}" preload="auto" loop playsinline></audio>

                <div class="ab-controls">
                    <button onclick="togglePlay(${review.id})" id="play-btn-${review.id}" class="btn-main-play">
                        PLAY
                    </button>

                    <div class="switch-group">
                        <button onclick="switchAudio(${review.id}, 'after')" id="btn-after-${review.id}" class="btn-ab active">
                            ПОСЛЕ
                        </button>
                        <button onclick="switchAudio(${review.id}, 'before')" id="btn-before-${review.id}" class="btn-ab">
                            ДО
                        </button>
                    </div>
                </div>

                <div class="review-quote">
                    <a href="https://t.me/${review.author.replace('@', '')}" target="_blank" class="user-link">
                        ${review.author}
                    </a>:
                    ${review.text}
                </div>
            `;
      container.appendChild(reviewElement);
    });
  } catch (error) {
    console.error('ошибка загрузки отзывов:', error);
    container.innerHTML = '<div class="disclaimer">ошибка загрузки данных</div>';
  }
}

// запускаем при загрузке документа
document.addEventListener('DOMContentLoaded', initReviews);