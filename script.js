const registrationOptions = [
    {
        title: 'Private Delegate/Observer',
        desc: 'Register as an individual delegate or observer and represent your country at UMT MUN 4.0.',
        url: 'https://tally.so/r/nppWy1',
        action: 'Register',
        backgroundImage: 'Private observer.jpg',
    },
    {
        title: 'Institutional Delegation',
        desc: 'Register your institution\'s delegation and participate as a team in UMT MUN 4.0.',
        url: 'https://tally.so/r/nppB41',
        action: 'Register',
        backgroundImage: 'intitutional delegation.jpg',
    },
    {
        title: 'Secretariat Application',
        desc: 'Be a part of the UMT MUN 4.0 Secretariat and help us make this event a success',
        url: 'https://tally.so/r/meWv8l',
        action: 'Apply',
        backgroundImage: 'secretariat.jpg',
    },
];

const committeeData = [
    {

        image: 'unsc.jpg',
        description: 'The United Nations Security Council is the premier body responsible for maintaining international peace and security. Delegates will address critical global security challenges, including conflict resolution, peacekeeping operations, and threats to international peace.',
        topics: 'AGENDA :TBA'
    },
    {

        image: 'unhrc.jpg',
        description: 'The UN Human Rights Council is dedicated to promoting and protecting human rights worldwide. Delegates will engage in discussions on human rights violations, discrimination, and the protection of vulnerable populations.',
        topics: 'AGENDA :TBA'
    },
    {

        image: 'unw.jpg',
        description: 'UN Women focuses on gender equality and the empowerment of women and girls globally. Delegates will work on advancing women\'s rights, eliminating gender-based violence, and promoting women\'s participation in decision-making.',
        topics: 'AGENDA :TBA'
    },
    {

        image: 'pna.jpg',
        description: 'The Pakistan National Assembly Committee in MUN simulates the legislative chamber of Pakistan’s parliament, offering delegates the opportunity to debate, draft, and pass resolutions on pressing national issues. Rooted in real parliamentary procedure, this committee encourages in-depth discussion on domestic policy, governance, and socio-political challenges facing the country',
        topics: 'AGENDA :TBA.'
    },
    {

        image: 'crisis.jpg',
        description: 'The Crisis Committee simulates emergency situations requiring immediate diplomatic response. Delegates must think on their feet, make quick decisions, and adapt to rapidly evolving scenarios.',
        topics: 'AGENDA : TBA'
    },
    {

        image: 'specpol.jpg',
        description: 'SPECPOL addresses political questions and decolonization issues. Delegates will discuss self-determination, territorial disputes, and the political aspects of various global challenges.',
        topics: 'AGENDA :TBA '
    }
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
            card.style.backgroundImage = `url('${option.backgroundImage}')`;
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

    // Committee grid generation
    const committeesGrid = document.getElementById('committeesGrid');
    if (committeesGrid) {
        committeesGrid.innerHTML = '';
        committeeData.forEach(committee => {
            const committeeCard = document.createElement('div');
            committeeCard.className = 'committee-card';
            committeeCard.innerHTML = `
                <img src="${committee.image}" alt="${committee.name}" class="committee-img" />
                <div class="committee-overlay">
                
                </div>
            `;
            committeeCard.addEventListener('click', () => {
                showCommitteeDetails(committee);
            });
            committeesGrid.appendChild(committeeCard);
        });
    }

    // Committee modal functionality
    const committeeModal = document.getElementById('committeeModal');
    const closeCommitteeModal = document.getElementById('closeCommitteeModal');
    const committeeModalContent = document.getElementById('committeeModalContent');

    function showCommitteeDetails(committee) {
        committeeModalContent.innerHTML = `
            <div class="committee-detail-header">
                <img src="${committee.image}" alt="${committee.name}" class="committee-detail-img" />
                <div class="committee-detail-title">
                </div>
            </div>
            <div class="committee-detail-content">
                <p class="committee-description">${committee.description}</p>
                <p class="committee-topics">${committee.topics}</p>
            </div>
        `;
        committeeModal.style.display = 'flex';
    }

    // Enhanced close functionality for mobile compatibility
    function closeCommitteeModalHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        committeeModal.style.display = 'none';
    }

    closeCommitteeModal.addEventListener('click', closeCommitteeModalHandler);
    closeCommitteeModal.addEventListener('touchend', closeCommitteeModalHandler);

    window.addEventListener('click', function (event) {
        if (event.target === committeeModal) {
            committeeModal.style.display = 'none';
        }
    });

    // Registration modal logic
    const registerBtn = document.getElementById('registerBtn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');

    registerBtn.addEventListener('click', function () {
        modal.style.display = 'flex';
    });

    // Enhanced close functionality for mobile compatibility
    function closeModalHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        modal.style.display = 'none';
    }

    closeModal.addEventListener('click', closeModalHandler);
    closeModal.addEventListener('touchend', closeModalHandler);

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});  
