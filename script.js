// ========================================================
//  ASTROLABE DIAL  —  scroll-driven canvas background
// ========================================================
(function () {
    const canvas = document.getElementById('dialCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, cx, cy, baseR;
    let scrollY = 0;
    let targetRot = 0;
    let currentRot = 0;
    let raf;

    // Colour palette — matches theme image
    const C = {
        ring:    'rgba(80,140,210,0.18)',
        ringBrt: 'rgba(100,170,240,0.32)',
        tick:    'rgba(90,150,220,0.35)',
        tickBrt: 'rgba(140,200,255,0.55)',
        text:    'rgba(110,165,230,0.38)',
        gear:    'rgba(70,130,200,0.22)',
        glow:    'rgba(40,90,180,0.12)',
    };

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cx = W / 2;
        cy = H / 2;
        baseR = Math.min(W, H) * 0.42;
    }

    // ---- drawing helpers ----
    function ring(x, y, r, color, lw) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.stroke();
    }

    function tickMarks(x, y, r, count, innerFrac, color, lw) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        for (let i = 0; i < count; i++) {
            const a = (i / count) * Math.PI * 2 - Math.PI / 2;
            const r1 = r * innerFrac;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
            ctx.lineTo(x + Math.cos(a) * r,  y + Math.sin(a) * r);
            ctx.stroke();
        }
    }

    function romanLabel(x, y, r, rot) {
        const numerals = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];
        ctx.fillStyle = C.text;
        ctx.font = `${Math.max(10, baseR * 0.045)}px "Cinzel", serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2 + rot;
            const tx = x + Math.cos(a) * r;
            const ty = y + Math.sin(a) * r;
            ctx.save();
            ctx.translate(tx, ty);
            ctx.rotate(a + Math.PI / 2);
            ctx.fillText(numerals[i], 0, 0);
            ctx.restore();
        }
    }

    function zodiacSymbols(x, y, r, rot) {
        const symbols = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
        ctx.fillStyle = C.text;
        ctx.font = `${Math.max(11, baseR * 0.048)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2 + rot;
            ctx.fillText(symbols[i],
                x + Math.cos(a) * r,
                y + Math.sin(a) * r);
        }
    }

    function gearTeeth(x, y, r, teeth, rot, color) {
        const toothH = r * 0.055;
        const toothW = (Math.PI * 2 / teeth) * 0.35;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < teeth; i++) {
            const a  = (i / teeth) * Math.PI * 2 + rot;
            const a1 = a - toothW / 2;
            const a2 = a + toothW / 2;
            ctx.moveTo(x + Math.cos(a1) * r,          y + Math.sin(a1) * r);
            ctx.lineTo(x + Math.cos(a1) * (r+toothH), y + Math.sin(a1) * (r+toothH));
            ctx.lineTo(x + Math.cos(a2) * (r+toothH), y + Math.sin(a2) * (r+toothH));
            ctx.lineTo(x + Math.cos(a2) * r,          y + Math.sin(a2) * r);
        }
        ctx.stroke();
    }

    function spoke(x, y, r, count, rot, color, lw) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        for (let i = 0; i < count; i++) {
            const a = (i / count) * Math.PI * 2 + rot;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
            ctx.stroke();
        }
    }

    function radialGlow(x, y, r, color) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // ---- draw one complete dial at (x,y), scaled by `scale` ----
    function drawDial(x, y, scale, rot, clockwise, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        const r = baseR * scale;
        const dir = clockwise ? 1 : -1;

        // Ambient glow
        radialGlow(x, y, r * 1.15, C.glow);

        // Outer gear ring (rotates with scroll)
        gearTeeth(x, y, r * 1.02, Math.round(60 * scale), rot * dir, C.gear);
        ring(x, y, r * 1.02, C.ring, 0.8);

        // Outer ring with major & minor ticks
        ring(x, y, r, C.ringBrt, 1.2);
        tickMarks(x, y, r, 60, 0.94, C.tick, 0.8);       // minute ticks
        tickMarks(x, y, r, 12, 0.88, C.tickBrt, 1.5);    // hour ticks

        // Roman numeral ring (counter-rotates slightly)
        romanLabel(x, y, r * 0.83, rot * dir * -0.4);

        // Zodiac band (rotates opposite to main)
        ring(x, y, r * 0.73, C.ring, 0.8);
        ring(x, y, r * 0.68, C.ring, 0.5);
        zodiacSymbols(x, y, r * 0.705, rot * dir * 0.6);

        // Inner tick band
        tickMarks(x, y, r * 0.68, 36, 0.94, C.tick, 0.7);

        // Mid-ring decorative
        ring(x, y, r * 0.58, C.ring, 0.8);
        tickMarks(x, y, r * 0.58, 24, 0.90, C.tick, 0.8);

        // Spokes (like the astrolabe rete)
        spoke(x, y, r * 0.55, 8, rot * dir * 0.5, C.ring, 0.7);

        // Inner gear ring (counter-rotates)
        gearTeeth(x, y, r * 0.44, Math.round(36 * scale), rot * dir * -1.3, C.gear);
        ring(x, y, r * 0.44, C.ring, 0.8);
        tickMarks(x, y, r * 0.44, 48, 0.90, C.tick, 0.6);

        // Innermost bright ring
        ring(x, y, r * 0.30, C.ringBrt, 1);
        tickMarks(x, y, r * 0.30, 12, 0.86, C.tickBrt, 1);

        // Hub dot
        ctx.beginPath();
        ctx.arc(x, y, r * 0.035, 0, Math.PI * 2);
        ctx.fillStyle = C.ringBrt;
        ctx.fill();

        ctx.restore();
    }

    // ---- main render ----
    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Lerp rotation toward target for smooth feel
        currentRot += (targetRot - currentRot) * 0.06;

        // --- DIAL 1: large, bottom-left (matches theme image astrolabe) ---
        drawDial(
            W * 0.12,   // x — left edge, partially off-screen
            H * 0.82,   // y — low
            0.85,       // scale
            currentRot,
            true,       // clockwise
            0.9
        );

        // --- DIAL 2: medium, top-left (clock face from theme) ---
        drawDial(
            W * 0.06,
            H * 0.15,
            0.55,
            currentRot * 1.2,
            false,   // counter-clockwise
            0.75
        );

        // --- DIAL 3: small, right (clock face right-side in theme) ---
        drawDial(
            W * 0.94,
            H * 0.28,
            0.45,
            currentRot * 0.8,
            true,
            0.65
        );

        raf = requestAnimationFrame(draw);
    }

    // ---- scroll listener — drives rotation ----
    function onScroll() {
        scrollY = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress  = maxScroll > 0 ? scrollY / maxScroll : 0;
        // Full page scroll = 1.5 full rotations
        targetRot = progress * Math.PI * 3;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => { resize(); }, { passive: true });

    resize();
    onScroll();
    draw();
})();


// ========================================================
//  INTRO ANIMATION
// ========================================================
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
    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => { overlay.style.display = 'none'; }, 850);
    }, 3200);
}


// ========================================================
//  COUNTDOWN
// ========================================================
function updateCountdown() {
    const eventDate = new Date('2025-09-10T09:00:00');
    const now  = new Date();
    let diff = eventDate - now;
    if (diff < 0) diff = 0;

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const el = document.getElementById('countdown');
    if (el) {
        el.innerHTML = `
            <div class="countdown-item"><span>${String(days).padStart(2,'0')}</span><span class="countdown-label">Days</span></div>
            <div class="countdown-item"><span>${String(hours).padStart(2,'0')}</span><span class="countdown-label">Hours</span></div>
            <div class="countdown-item"><span>${String(minutes).padStart(2,'0')}</span><span class="countdown-label">Minutes</span></div>
            <div class="countdown-item"><span>${String(seconds).padStart(2,'0')}</span><span class="countdown-label">Seconds</span></div>
        `;
    }
}


// ========================================================
//  REGISTER MODAL
// ========================================================
function initRegisterModal() {
    const registerBtn = document.getElementById('registerBtn');
    const modal       = document.getElementById('modal');
    const closeModal  = document.getElementById('closeModal');
    if (!registerBtn || !modal || !closeModal) return;

    registerBtn.addEventListener('click', () => { modal.style.display = 'flex'; });

    function closeHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        modal.style.display = 'none';
    }
    closeModal.addEventListener('click', closeHandler);
    closeModal.addEventListener('touchend', closeHandler);
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}


// ========================================================
//  INIT
// ========================================================
document.addEventListener('DOMContentLoaded', () => {
    runIntroAnimation();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    initRegisterModal();
});
