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

    // ── Projects ────────────────────────────────────────────────────────
    const projectsGrid = document.getElementById('projects-grid');
    const tabBtns = document.querySelectorAll('.tab-btn');
    let projectsData = { live: [], archive: [] };

    const loadProjects = async () => {
        try {
            const [projectsResponse, archiveResponse] = await Promise.all([
                fetch('projects.json'),
                fetch('archive.json')
            ]);
            const liveProjectsData = await projectsResponse.json();
            const archiveProjectsData = await archiveResponse.json();
            projectsData = {
                live: liveProjectsData.live || [],
                archive: archiveProjectsData.archive || []
            };
            renderProjects('live');
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    };

    const renderProjects = (category) => {
        projectsGrid.innerHTML = '';
        const projects = projectsData[category] || [];
        projects.forEach((project, index) => {
            const card = document.createElement('a');
            card.href = project.url || '#';
            card.target = "_blank";
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="project-image-wrapper">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/600x400/111/fff?text=Project+Image'">
                </div>
                <div class="project-info">
                    <div class="project-header">
                        <h3>${project.title}</h3>
                        <span class="project-date">${project.date}</span>
                    </div>
                    <p class="project-description">${project.description}</p>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    };

    const indicator = document.querySelector('.tab-indicator');

    const updateIndicator = (activeBtn) => {
        if (indicator && activeBtn) {
            indicator.style.width = `${activeBtn.offsetWidth}px`;
            indicator.style.left = `${activeBtn.offsetLeft}px`;
        }
    };

    window.addEventListener('resize', () => {
        const activeTab = document.querySelector('.tab-btn.active');
        updateIndicator(activeTab);
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateIndicator(btn);
            renderProjects(btn.dataset.tab);
        });
    });

    setTimeout(() => {
        const activeTab = document.querySelector('.tab-btn.active');
        updateIndicator(activeTab);
    }, 100);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    const portfolioContainer = document.querySelector('.portfolio-container');
    if (portfolioContainer) observer.observe(portfolioContainer);

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

    loadProjects();
});
