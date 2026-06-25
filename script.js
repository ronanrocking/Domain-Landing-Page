document.addEventListener('DOMContentLoaded', () => {

    // ── Hero canvas background ──────────────────────────────────────────
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    const colors = ['#003566','#00517c','#6012cd','#03055e','#4877e4','#0007c7','#023d8a','#7209b7'];
    const blobs = Array.from({length: 5}, (_, i) => ({
        x: 0.1 + Math.random() * 0.8,
        y: 0.1 + Math.random() * 0.8,
        r: 0.28 + Math.random() * 0.2,
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2,
        speed: 0.00006 + Math.random() * 0.002
    }));

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let t = 0;
    function drawHero() {
        const W = canvas.getBoundingClientRect().width;
        const H = canvas.getBoundingClientRect().height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);
        blobs.forEach(b => {
            const cx = (b.x + Math.sin(t * b.speed + b.phase) * 0.25) * W;
            const cy = (b.y + Math.cos(t * b.speed * 0.8 + b.phase + 1) * 0.18) * H;
            const r = b.r * Math.max(W, H);
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, b.color + 'bb');
            grad.addColorStop(0.45, b.color + '55');
            grad.addColorStop(1, b.color + '00');
            ctx.globalCompositeOperation = 'screen';
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        });
        t++;
        requestAnimationFrame(drawHero);
    }
    drawHero();

    // ── Command bar ripple ───────────────────────────────────────────────
    const commandInput = document.getElementById('command-input');
    const commandWrapper = document.querySelector('.command-bar-wrapper');
    let ripple = null;

    commandInput.addEventListener('mousedown', (e) => {
        if (commandInput.classList.contains('active')) return;
        const rect = commandWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (!ripple) {
            ripple = document.createElement('div');
            ripple.className = 'command-ripple';
            commandWrapper.appendChild(ripple);
        }
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = `${rect.width * 2.5}px`;
        ripple.style.height = `${rect.width * 2.5}px`;
        ripple.style.marginLeft = `-${rect.width * 1.25}px`;
        ripple.style.marginTop = `-${rect.width * 1.25}px`;
        ripple.offsetWidth;
        ripple.classList.add('expanding');
        commandInput.classList.add('active');
        commandInput.placeholder = 'RUN';
    });

    commandInput.addEventListener('blur', () => {
        if (ripple) ripple.classList.remove('expanding');
        commandInput.classList.remove('active');
        commandInput.placeholder = 'RUN';
    });
});
