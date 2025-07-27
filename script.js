const registrationOptions = [
    {
        title: 'Private Delegate/Observer',
        desc: 'Register as an individual delegate or observer and represent your country at UMT MUN 4.0.',
        url: 'https://tally.so/r/nppWy1',
        action: 'Register',
    },
    {
        title: 'Institutional Delegation',
        desc: 'Register your institution’s delegation and participate as a team in UMT MUN 4.0.',
        url: 'https://tally.so/r/nppB41',
        action: 'Register',
    },
];

function updateCountdown() {
    // Set event start date (25th September 2025, 9:00 AM)
    const eventDate = new Date('2025-09-25T09:00:00');
    const now = new Date();
    let diff = eventDate - now;

    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const countdown = document.getElementById('countdown');
    if (countdown) {
        countdown.innerHTML = `
      <div class="countdown-item"><span>${days}</span><span class="countdown-label">Days</span></div>
      <div class="countdown-item"><span>${hours}</span><span class="countdown-label">Hours</span></div>
      <div class="countdown-item"><span>${minutes}</span><span class="countdown-label">Minutes</span></div>
      <div class="countdown-item"><span>${seconds}</span><span class="countdown-label">Seconds</span></div>
    `;
    }
}

function runCurtainPreloader() {
    const preloader = document.getElementById('curtain-preloader');
    if (!preloader) return;
    // Step 1: Open curtains
    setTimeout(() => {
        preloader.classList.add('open');
        // Step 2: Show logo
        setTimeout(() => {
            // Step 3: Pause, then hide preloader
            setTimeout(() => {
                preloader.classList.add('hide');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 700);
            }, 1200);
        }, 900); // logo fade/scale in
    }, 400); // initial delay
}

document.addEventListener('DOMContentLoaded', function () {
    runCurtainPreloader();

    // Countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Registration cards in modal
    const cardsContainer = document.getElementById('registration-cards');
    if (cardsContainer) {
        cardsContainer.innerHTML = '';
        registrationOptions.forEach(option => {
            const card = document.createElement('div');
            card.className = 'registration-card';
            card.tabIndex = 0;
            card.innerHTML = `
        <div class="card-title">${option.title}</div>
        <div class="card-desc">${option.desc}</div>
        <button class="card-action">${option.action} &rarr;</button>
      `;
            card.addEventListener('click', () => {
                window.open(option.url, '_blank');
            });
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    window.open(option.url, '_blank');
                }
            });
            card.querySelector('.card-action').addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(option.url, '_blank');
            });
            cardsContainer.appendChild(card);
        });
    }

    // Modal logic
    const registerBtn = document.getElementById('registerBtn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');

    registerBtn.addEventListener('click', function () {
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}); 