document.addEventListener('DOMContentLoaded', () => {
    const projectsGrid = document.getElementById('projects-grid');
    const tabBtns = document.querySelectorAll('.tab-btn');
    let projectsData = { live: [], archive: [] };

    const loadProjects = async () => {
        try {
            const response = await fetch('projects.json');
            projectsData = await response.json();
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


    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.tab);
        });
    });

    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const portfolioContainer = document.querySelector('.portfolio-container');
    if (portfolioContainer) {
        observer.observe(portfolioContainer);
    }

    loadProjects();
});
