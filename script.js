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


    const indicator = document.querySelector('.tab-indicator');
    
    const updateIndicator = (activeBtn) => {
        if (indicator && activeBtn) {
            indicator.style.width = `${activeBtn.offsetWidth}px`;
            indicator.style.left = `${activeBtn.offsetLeft}px`;
        }
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateIndicator(btn);
            renderProjects(btn.dataset.tab);
        });
    });

    // Initial position
    setTimeout(() => {
        const activeTab = document.querySelector('.tab-btn.active');
        updateIndicator(activeTab);
    }, 100);

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

    // Command Bar Ripple Effect
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
        ripple.style.width = `${rect.width * 2}px`;
        ripple.style.height = `${rect.width * 2}px`;
        ripple.style.marginLeft = `-${rect.width}px`;
        ripple.style.marginTop = `-${rect.width}px`;

        // Trigger reflow
        ripple.offsetWidth;

        ripple.classList.add('expanding');
        commandInput.classList.add('active');
    });

    commandInput.addEventListener('blur', () => {
        if (ripple) {
            ripple.classList.remove('expanding');
        }
        commandInput.classList.remove('active');
    });

    loadProjects();
});
