// ===== INTRO ANIMATION =====
function createParticles() {
    const container = document.getElementById('introParticles');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 5 + 2;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            top: ${80 + Math.random() * 30}%;
            animation-duration: ${3 + Math.random() * 5}s;
            animation-delay: ${Math.random() * 3}s;
        `;
        container.appendChild(p);
    }
}

function runIntroAnimation() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    createParticles();

    // After logo spin-in + text appear (total ~2.6s), hold for 0.8s then fade out
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 850);
    }, 3200);
}

// ===== COUNTDOWN =====
function updateCountdown() {
    // UMTMUN V starts 10th September 2025, 9:00 AM
    const eventDate = new Date('2025-09-10T09:00:00');
    const now = new Date();
    let diff = eventDate - now;
    if (diff < 0) diff = 0;

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const countdown = document.getElementById('countdown');
    if (countdown) {
        countdown.innerHTML = `
            <div class="countdown-item"><span>${String(days).padStart(2,'0')}</span><span class="countdown-label">Days</span></div>
            <div class="countdown-item"><span>${String(hours).padStart(2,'0')}</span><span class="countdown-label">Hours</span></div>
            <div class="countdown-item"><span>${String(minutes).padStart(2,'0')}</span><span class="countdown-label">Minutes</span></div>
            <div class="countdown-item"><span>${String(seconds).padStart(2,'0')}</span><span class="countdown-label">Seconds</span></div>
        `;
    }
}

// ===== REGISTER MODAL (Registration Coming Soon) =====
function initRegisterModal() {
    const registerBtn = document.getElementById('registerBtn');
    const modal       = document.getElementById('modal');
    const closeModal  = document.getElementById('closeModal');

    if (!registerBtn || !modal || !closeModal) return;

    registerBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    function closeHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        modal.style.display = 'none';
    }

    closeModal.addEventListener('click', closeHandler);
    closeModal.addEventListener('touchend', closeHandler);

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    runIntroAnimation();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    initRegisterModal();
});
