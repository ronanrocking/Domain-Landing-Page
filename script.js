document.addEventListener('DOMContentLoaded', () => {
    const dataVersion = '20260708-1';

    // ── Hero canvas background ──────────────────────────────────────────
    const canvas = document.getElementById('hero-canvas');
    const disabledHeroLinks = document.querySelectorAll('[data-disabled-link="true"]');
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
                fetch(`projects.json?v=${dataVersion}`),
                fetch(`archive.json?v=${dataVersion}`)
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
            projectsGrid.innerHTML = '<p class="project-load-error">Projects unavailable right now.</p>';
        }
    };

    const escapeHTML = (value = '') => String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');

    const renderProjects = (category) => {
        projectsGrid.innerHTML = '';
        const projects = projectsData[category] || [];
        projects.forEach((project, index) => {
            const card = document.createElement('article');
            card.className = 'project-card';
            card.style.animationDelay = `${index * 0.1}s`;
            const tags = Array.isArray(project.tags) ? project.tags : [];
            const tagsMarkup = tags.map(tag => `<span class="project-tag">${escapeHTML(tag)}</span>`).join('');
            const linkMarkup = project.url ? `
                <a class="project-link" href="${escapeHTML(project.url)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHTML(project.title)}">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z"/>
                    </svg>
                </a>
            ` : '';
            card.innerHTML = `
                <div class="project-info">
                    <div class="project-header">
                        <div class="project-title-block">
                            <h3>${escapeHTML(project.title)}</h3>
                            <span class="project-date">${escapeHTML(project.date)}</span>
                        </div>
                        ${linkMarkup}
                    </div>
                    <p class="project-description">${escapeHTML(project.description)}</p>
                </div>
                ${tagsMarkup ? `<div class="project-tags">${tagsMarkup}</div>` : ''}
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

    disabledHeroLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
        });
    });

    loadProjects();
});
